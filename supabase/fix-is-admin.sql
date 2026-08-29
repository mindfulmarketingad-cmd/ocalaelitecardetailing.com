-- public.is_admin() is broken, and it takes every policy that calls it down.
--
-- The function queries public.contractors, which does not exist in this
-- project, so it raises 42P01 whenever a policy evaluates it. Known callers:
--
--   public.leads            "admins manage leads"           (ALL)
--   public.leads            "active subscribers read leads" (SELECT)
--   public.analytics_events "admins read analytics events"  (SELECT)
--
-- While this holds, every READ of leads fails - not only from this website but
-- from anything that queries the table through PostgREST, including whatever
-- delivers leads to subscribers.
--
-- The booking form is already fixed and does not depend on this: it no longer
-- asks PostgREST to return the inserted row, so it never evaluates a read
-- policy. This script is about everything else.
--
-- STEP 1 is one query on purpose. The Supabase SQL editor shows only the last
-- result set that returns rows, so a block of separate SELECTs loses all but
-- one of them.

-- ===========================================================================
-- STEP 1. Find out what you are working with. Read every row before choosing.
-- ===========================================================================
select 'table matching contractor/admin/subscriber' as finding,
       coalesce(
         (select string_agg(table_schema || '.' || table_name, ', ' order by table_schema, table_name)
          from information_schema.tables
          -- Exclude the catalogs, or the answer drowns in information_schema noise.
          where table_schema not in ('information_schema', 'pg_catalog')
            and table_schema not like 'pg_%'
            and (table_name ilike '%contractor%'
              or table_name ilike '%subscriber%'
              or table_name ilike '%admin%'
              or table_name ilike '%profile%'
              or table_name ilike '%member%')),
         '** none - the admin table is genuinely gone **'
       ) as detail

union all
select 'does public.contractors exist',
       case when to_regclass('public.contractors') is null then 'no' else 'yes' end

union all
select 'policies that call is_admin()',
       coalesce(
         (select string_agg(schemaname || '.' || tablename || ' -> "' || policyname || '" (' || cmd || ', roles ' || roles::text || ')', '  |  ')
          from pg_policies
          where qual like '%is_admin%' or with_check like '%is_admin%'),
         'none'
       )

union all
-- Roles matter: a policy applying to `public` includes anon, so once the
-- function works again it would expose leads to anyone holding the public key.
select 'any is_admin policy applying to public/anon',
       coalesce(
         (select string_agg(schemaname || '.' || tablename || ' -> "' || policyname || '"', ', ')
          from pg_policies
          where (qual like '%is_admin%' or with_check like '%is_admin%')
            and (roles::text like '%public%' or roles::text like '%anon%')),
         'none - good'
       )

union all
select 'current definition of is_admin()',
       coalesce((select pg_get_functiondef(oid) from pg_proc
                 where proname = 'is_admin' and pronamespace = 'public'::regnamespace limit 1),
                '** function not found **');

-- ===========================================================================
-- STEP 2. Choose ONE repair, uncomment it, run it.
-- ===========================================================================

-- OPTION A - the admin/subscriber table is genuinely gone.
-- Fails closed: nobody is an admin, which is already true in practice, but
-- policies evaluate cleanly instead of raising. The guard returns before the
-- query is planned, so the missing table is never looked up.
--
-- NOTE: this also means "active subscribers read leads" grants nothing, so
-- lead delivery stays dark until the subscriber table is restored. That is
-- honest rather than silently broken, but it is not a substitute for
-- restoring it.
--
-- create or replace function public.is_admin()
-- returns boolean language plpgsql stable security definer set search_path = public
-- as $$
-- begin
--   if to_regclass('public.contractors') is null then
--     return false;
--   end if;
--   return exists (
--     select 1 from public.contractors
--     where id = auth.uid() and is_admin = true
--   );
-- end;
-- $$;

-- OPTION B - admins live in a table under a different name now.
-- Replace the table and column names with what STEP 1 turned up.
--
-- create or replace function public.is_admin()
-- returns boolean language sql stable security definer set search_path = public
-- as $$
--   select exists (
--     select 1 from public.YOUR_ADMIN_TABLE
--     where id = auth.uid() and is_admin = true
--   );
-- $$;

-- ===========================================================================
-- STEP 3. Verify. Must return a boolean and must not raise.
-- ===========================================================================
-- select public.is_admin() as is_admin_works;
