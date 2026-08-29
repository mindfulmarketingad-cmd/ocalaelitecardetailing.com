-- Why is POST /rest/v1/leads returning 404?
--
-- A 404 from PostgREST is NOT a permissions failure - that would be 403. It
-- means PostgREST could not find the table in its schema cache at all.
--
-- This is deliberately ONE query returning one row per check, because the
-- Supabase SQL editor only displays the last result set that returns rows.
-- A block of separate SELECTs silently loses all but the final one.
--
-- Nothing here writes or changes anything. Run it, read the RESULT column.

select 'A. schema holding "leads"' as check,
       coalesce(
         (select string_agg(table_schema, ', ' order by table_schema)
          from information_schema.tables where table_name = 'leads'),
         '** NOT FOUND - no table named leads anywhere **'
       ) as result,
       'Must be a schema the Data API exposes, normally public.' as note

union all
select 'B. schemas exposed to Data API',
       coalesce((select setting from pg_settings where name = 'pgrst.db_schemas'),
                'not readable from SQL - check Settings > API > Exposed schemas'),
       'public must be in this list.'

union all
select 'C. anon privileges on "leads"',
       coalesce(
         (select string_agg(distinct privilege_type, ', ')
          from information_schema.role_table_grants
          where table_name = 'leads' and grantee = 'anon'),
         '** NONE - this alone produces a 404 **'
       ),
       'INSERT is required. A role with no grant at all sees the table as missing.'

union all
-- to_regclass rather than a ::regclass cast: the cast raises and aborts the
-- whole query when the table is not in public, which is precisely the case
-- this diagnostic exists to report.
select 'D. RLS enabled on "leads"',
       coalesce(
         (select case when c.relrowsecurity then 'yes' else 'no' end
          from pg_class c
          join pg_namespace n on n.oid = c.relnamespace
          where c.relname = 'leads' and c.relkind in ('r', 'p')
          limit 1),
         'n/a - table not found'
       ),
       'Fine either way, as long as C and E line up.'

union all
select 'E. anon INSERT policies on "leads"',
       coalesce(
         (select string_agg(schemaname || '.' || policyname, ', ')
          from pg_policies
          where tablename = 'leads' and cmd in ('INSERT', 'ALL')),
         '** NONE **'
       ),
       'Only matters if D says yes.'

union all
select 'F. "reviews" table present',
       case when to_regclass('public.reviews') is null
            then '** MISSING - run supabase/schema.sql **' else 'yes' end,
       'Needed by /reviews/ and the review form, not by booking.'

union all
-- A bigserial id needs USAGE on its sequence as well as INSERT on the table.
-- Without it every insert fails with 42501, which surfaces as a 403 rather
-- than this 404 - but it is the next thing to trip over, so check it now.
select 'H. anon USAGE on the leads id sequence',
       coalesce(
         (select case when has_sequence_privilege('anon', c.oid, 'USAGE')
                      then 'yes'
                      else '** NO - inserts would fail with 42501 **' end
          from pg_class c
          where c.relkind = 'S' and c.relname like 'leads%id%seq'
          limit 1),
         'n/a - id is an identity or uuid column, no grant needed'
       ),
       'Only applies if id is bigserial.'

union all
select 'I. schema cache reload',
       'see the statement below',
       'Run it separately if any of A-C changed since the last reload.';

-- The most common fix. Grants or policies changed and PostgREST is still
-- serving the picture it cached beforehand. Instant, safe, touches no data.
-- Run this on its own after the query above.
notify pgrst, 'reload schema';
