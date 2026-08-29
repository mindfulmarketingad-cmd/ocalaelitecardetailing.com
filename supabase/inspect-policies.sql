-- PRE-FLIGHT. Run this BEFORE repairing is_admin().
--
-- Repairing the function does not just stop the errors - it activates every
-- policy that calls it. All three of those policies apply to the `public`
-- role, and `public` includes `anon`, whose key is published in the
-- JavaScript on every page. So the question that matters is: once these
-- policies actually evaluate, what does an anonymous visitor get?
--
-- This reads policy definitions and column names only. It changes nothing and
-- returns one result set.

select 'POLICY' as kind,
       tablename || ' :: ' || policyname as name,
       permissive || ' / ' || cmd || ' / roles ' || roles::text as applies,
       'USING ' || coalesce(qual, '(none)') ||
         '   WITH CHECK ' || coalesce(with_check, '(none)') as expression
from pg_policies
where schemaname = 'public' and tablename in ('leads', 'analytics_events')

union all

-- Every permissive policy on a table is OR-ed together, so one careless
-- policy is enough regardless of how careful the others are. This lists them
-- all, not only the ones calling is_admin().
select 'SUBSCRIBERS COLUMN',
       column_name,
       data_type,
       'nullable: ' || is_nullable
from information_schema.columns
where table_schema = 'public' and table_name = 'subscribers'

union all

select 'RLS',
       c.relname,
       case when c.relrowsecurity then 'enabled' else '** DISABLED **' end,
       case when c.relforcerowsecurity then 'forced' else 'not forced' end
from pg_class c
join pg_namespace n on n.oid = c.relnamespace
where n.nspname = 'public' and c.relname in ('leads', 'analytics_events', 'subscribers')

order by 1, 2;
