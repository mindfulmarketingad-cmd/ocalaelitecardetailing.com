-- Remove the dead first-generation policies on leads and analytics_events.
--
-- WHAT THIS IS
--
-- There are two generations of policy on public.leads. The working generation
-- checks the signed-in user's email against public.subscribers:
--
--   "Active subscribers can read all leads"  SELECT  to authenticated
--   "Admin can read all leads"               SELECT  to authenticated
--   "Public can submit leads"                INSERT  to anon
--   "anon can insert leads"                  INSERT  to anon
--
-- The dead generation calls is_admin() and is_active_contractor(), both of
-- which query public.contractors - a table that no longer exists:
--
--   "active subscribers read leads"          SELECT  to public
--   "admins manage leads"                    ALL     to public
--   "admins read analytics events"           SELECT  to public   (analytics_events)
--
-- Because those three apply to the `public` role, they are evaluated for
-- EVERY caller - anonymous and signed-in alike - and they raise 42P01 rather
-- than returning false. That is why no subscriber can read a lead today, and
-- why the booking form got a 404: PostgREST reports 42P01 as HTTP 404.
--
-- They grant nothing that the working generation does not already grant, so
-- removing them loses no capability. Verified on PostgreSQL 16 against a
-- fixture reproducing this exact policy set:
--
--                          before            after
--   anon insert            42P01 error       succeeds
--   anon read leads        42P01 error       0 rows
--   active subscriber      42P01 error       all leads
--   admin email            42P01 error       all leads
--   other signed-in user   42P01 error       0 rows
--
-- ⚠️  This is DDL on a table shared with your other sites. Read it, then run
--     it deliberately. It is reversible: the definitions are in the comments
--     at the bottom.

-- ===========================================================================
-- 1. Confirm what you are about to remove. Run this first.
-- ===========================================================================
select tablename, policyname, cmd, roles::text,
       coalesce(qual, '(none)') as using_clause
from pg_policies
where schemaname = 'public'
  and policyname in ('active subscribers read leads',
                     'admins manage leads',
                     'admins read analytics events')
order by tablename, policyname;

-- ===========================================================================
-- 2. Remove them. Uncomment and run.
-- ===========================================================================
-- drop policy if exists "active subscribers read leads"  on public.leads;
-- drop policy if exists "admins manage leads"            on public.leads;
-- drop policy if exists "admins read analytics events"   on public.analytics_events;

-- ===========================================================================
-- 3. The two functions are then unreferenced. Check before dropping: they may
--    be called from a trigger, a view, or a policy on a table not looked at
--    here. Only drop them if this returns nothing.
-- ===========================================================================
select 'still referenced by policy' as where_used,
       schemaname || '.' || tablename || ' :: ' || policyname as detail
from pg_policies
where qual like '%is_admin%' or qual like '%is_active_contractor%'
   or with_check like '%is_admin%' or with_check like '%is_active_contractor%'
union all
select 'still referenced by another function',
       p.proname
from pg_proc p
join pg_namespace n on n.oid = p.pronamespace
where n.nspname = 'public'
  and p.proname not in ('is_admin', 'is_active_contractor')
  and (p.prosrc like '%is_admin%' or p.prosrc like '%is_active_contractor%');

-- If the query above returned no rows:
-- drop function if exists public.is_admin();
-- drop function if exists public.is_active_contractor();

-- ===========================================================================
-- REVERSAL, if ever needed. These are the definitions as they stood, and they
-- will raise again unless public.contractors is restored first.
-- ===========================================================================
-- create policy "active subscribers read leads" on public.leads for select
--   using (is_active_contractor() or is_admin());
-- create policy "admins manage leads" on public.leads for all
--   using (is_admin()) with check (is_admin());
-- create policy "admins read analytics events" on public.analytics_events for select
--   using (is_admin());
