-- Repair public.is_admin(), which is currently broken and takes every policy
-- that calls it down with it.
--
-- WHAT IS WRONG
--
-- is_admin() queries public.contractors. That table does not exist in this
-- project, so the function raises 42P01 whenever it is evaluated. A policy on
-- public.leads ("admins manage leads", FOR ALL) calls it, which means any
-- statement that reads leads - including the RETURNING clause of an insert -
-- fails outright. PostgREST reports 42P01 as HTTP 404, which is why the
-- booking form said the booking system was not set up.
--
-- The website side is already fixed: it no longer asks PostgREST to return the
-- inserted row, so bookings work without touching the database. This script
-- repairs the function itself, which matters for anything else that calls it.
--
-- PICK ONE OF THE TWO OPTIONS BELOW. Read both first.

-- ===========================================================================
-- Where did contractors go? Run this first - it may exist under another name
-- or in another schema, in which case option B is the right fix, not option A.
-- ===========================================================================
select table_schema, table_name
from information_schema.tables
where table_name ilike '%contractor%' or table_name ilike '%admin%'
order by table_schema, table_name;

-- Which policies across the whole database depend on this function? Every one
-- of these is currently broken in the same way.
select schemaname, tablename, policyname, cmd
from pg_policies
where qual like '%is_admin%' or with_check like '%is_admin%'
order by schemaname, tablename;

-- ===========================================================================
-- OPTION A - the table is genuinely gone.
--
-- Make the function fail closed instead of raising. Nobody is an admin, which
-- is already true in practice, but policies evaluate cleanly instead of
-- erroring. The guard runs before the query is planned, so the missing table
-- never gets looked up.
-- ===========================================================================
-- create or replace function public.is_admin()
-- returns boolean
-- language plpgsql
-- stable
-- security definer
-- set search_path = public
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

-- ===========================================================================
-- OPTION B - admins now live in a different table.
--
-- Point the function at the real one. Replace both the table name and the
-- column names with whatever the first query above turned up.
-- ===========================================================================
-- create or replace function public.is_admin()
-- returns boolean
-- language sql
-- stable
-- security definer
-- set search_path = public
-- as $$
--   select exists (
--     select 1 from public.YOUR_ADMIN_TABLE
--     where id = auth.uid() and is_admin = true
--   );
-- $$;

-- ===========================================================================
-- Verify. Should return false (or true if you are signed in as an admin) and
-- must not raise.
-- ===========================================================================
-- select public.is_admin();
