-- public.analytics_events is readable by anyone holding the public key.
--
-- The policy:
--
--   "Public can read analytics events"  SELECT  to {anon, authenticated}
--   USING true
--
-- `USING true` with anon in the role list means every row is world-readable.
-- Unlike the is_admin() policies this one is not broken - it works, and it has
-- been working. Verified against a fixture reproducing it: an anonymous
-- session read every analytics row, including the page URLs.
--
-- Whether that matters depends entirely on what the table holds. Aggregate
-- page counts are one thing; referrers, IP addresses, session identifiers, or
-- anything joinable back to a lead is another. Section 1 tells you which.
--
-- Note this is separate from the leads problem and is not fixed by
-- cleanup-dead-policies.sql. Writing analytics from the browser needs INSERT
-- only; it never needed read access.

-- ===========================================================================
-- 1. What is actually in there? Columns first, then a small sample.
-- ===========================================================================
select column_name, data_type, is_nullable
from information_schema.columns
where table_schema = 'public' and table_name = 'analytics_events'
order by ordinal_position;

-- Look at the newest rows and judge for yourself. Run separately.
-- select * from public.analytics_events order by 1 desc limit 20;

-- ===========================================================================
-- 2. If the contents are not meant to be public, close it.
--    Writing stays open; only reading is withdrawn.
-- ===========================================================================
-- drop policy if exists "Public can read analytics events" on public.analytics_events;

-- Then give reading back to the people who need it. Matches the pattern the
-- leads table already uses, so there is one admin model rather than two:
--
-- create policy "Admin can read analytics events" on public.analytics_events
--   for select to authenticated
--   using ((auth.jwt() ->> 'email') = 'mindfulmarketingad@gmail.com');

-- And revoke the underlying grant, so the table is not one careless policy
-- away from being public again:
-- revoke select on public.analytics_events from anon;

-- ===========================================================================
-- 3. Confirm. Should list only the policies you intend.
-- ===========================================================================
-- select policyname, cmd, roles::text, coalesce(qual,'(none)') as using_clause
-- from pg_policies
-- where schemaname='public' and tablename='analytics_events';
