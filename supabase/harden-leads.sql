-- Reduce anon to what the websites actually need on public.leads.
--
-- ⚠️  READ THIS FIRST. `leads` is shared with your other lead-gen sites, and
--     they all use the same Supabase project, so they all share this one anon
--     role. Changing it changes every site at once.
--
--     Before running section 2, satisfy yourself that no other site READS
--     leads with the anon key. A site that only submits forms does not - it
--     inserts, which this script preserves. If one of your sites displays
--     leads back to the browser using the anon key, that data is already
--     public to anyone who views source, and it needs its own fix rather than
--     this one.
--
-- Run section 1 first and read it. Run section 2 only when you are satisfied.

-- ===========================================================================
-- 1. DRY RUN. Changes nothing. Shows what section 2 would remove.
-- ===========================================================================
select privilege_type as would_be_revoked,
       case privilege_type
         when 'SELECT'   then 'lets anon read leads if any policy permits it'
         when 'UPDATE'   then 'lets anon rewrite leads if any policy permits it'
         when 'DELETE'   then 'lets anon destroy leads if any policy permits it'
         when 'TRUNCATE' then 'empties the whole table, and NO policy can stop it'
         when 'TRIGGER'  then 'lets anon attach triggers to the table'
         when 'REFERENCES' then 'lets anon create foreign keys against it'
       end as why_it_matters
from information_schema.role_table_grants
where table_schema = 'public' and table_name = 'leads' and grantee = 'anon'
  and privilege_type <> 'INSERT'
order by privilege_type;

-- ===========================================================================
-- 2. THE FIX. Leaves INSERT, which is all the websites use, and removes the
--    rest. Run this only after reading section 1 and the warning above.
-- ===========================================================================
-- revoke select, update, delete, truncate, references, trigger
--   on public.leads from anon;

-- Confirm afterwards - this should return INSERT and nothing else:
-- select string_agg(privilege_type, ', ' order by privilege_type)
-- from information_schema.role_table_grants
-- where table_schema = 'public' and table_name = 'leads' and grantee = 'anon';

-- ===========================================================================
-- 3. Policies are the other half. Any PERMISSIVE policy that is FOR ALL with
--    USING (true) and applies to `public` or `anon` re-opens read, update and
--    delete regardless of section 2 - because `public` includes anon.
--    audit-leads-access.sql shows you which. Scope such a policy to the role
--    that actually needs it, e.g.:
--
--      alter policy "admins manage leads" on public.leads to authenticated;
--
--    Left commented because the right target depends on how you sign in to
--    your admin tooling, and getting it wrong locks you out of your own data.
-- ===========================================================================
