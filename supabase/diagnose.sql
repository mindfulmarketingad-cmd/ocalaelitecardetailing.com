-- =============================================================================
-- RULED OUT so far (confirmed 2026-08-29):
--
--   [x] Column grants. anon holds INSERT on every column the site writes,
--       including cart_items, best_time_to_call, service, site and zip.
--
--   [x] Row Level Security. Two permissive INSERT policies exist for anon
--       ("Public can submit leads" and "anon can insert leads"), both with
--       WITH CHECK (true). RLS is not blocking anything.
--
--   [x] status NOT NULL with no default. Addressed rather than diagnosed:
--       the lead_status enum accepts 'new', 'active', 'closed', and anon holds
--       the INSERT grant on the column, so the site now writes status='new'
--       explicitly. The insert no longer depends on a default existing.
--
--   [x] Stale deployment. Ruled out: Vercel production is READY on commit
--       7473098, which is the build containing the anon JWT and the status
--       fix. The live site is running current code.
--
-- CAUSE FOUND (2026-08-29): a client bug, not a stale key.
--
-- The helper sent `Authorization: Bearer <key>` on every request. Supabase
-- parses that header as a JWT. The publishable key is not a JWT, so the
-- request failed with 401 even though the apikey header was valid. Switching
-- to the anon JWT then hit a separate 401, which made the keys look stale when
-- the header was the real problem all along.
--
-- Fixed in assets/js/supabase.js: Authorization is sent only for JWT-shaped
-- keys, and both public keys are tried in order with automatic failover on
-- 401. If submissions still fail after this deploys, the console will log the
-- status and Postgres code for each attempt.
--
-- =============================================================================
-- Why is the booking form not saving leads?
--
-- Run this whole file in the Supabase SQL editor and send back the output.
-- It is read-only: the one test insert runs inside a transaction that is
-- rolled back, so no row is ever kept and the shared leads table is untouched.
--
-- It answers, definitively, which of the four possible causes is the real one.
-- =============================================================================


-- 1. DEFAULTS ON REQUIRED COLUMNS ---------------------------------------------
-- The website never writes id, created_at or status. id and created_at are
-- NOT NULL, and status is NOT NULL as well, so every one of them must have a
-- database default. If any row below shows a NULL default, that is the bug:
-- the insert fails with SQLSTATE 23502, a not-null violation.

select column_name,
       is_nullable,
       column_default,
       case
         when is_nullable = 'NO' and column_default is null
           then '<<< PROBLEM: required but has no default'
         else 'ok'
       end as verdict
from information_schema.columns
where table_schema = 'public'
  and table_name   = 'leads'
  and column_name in ('id', 'created_at', 'status')
order by column_name;


-- 2. ROW LEVEL SECURITY --------------------------------------------------------
-- Is RLS switched on, and is there a policy that lets the anon role insert?
-- If RLS is enabled with no INSERT policy for anon, every submission is
-- rejected with HTTP 403.

select relrowsecurity  as rls_enabled,
       relforcerowsecurity as rls_forced
from pg_class
where oid = 'public.leads'::regclass;

select policyname,
       cmd            as applies_to,
       roles,
       qual           as using_expression,
       with_check     as with_check_expression
from pg_policies
where schemaname = 'public'
  and tablename  = 'leads'
order by cmd, policyname;


-- 3. GRANTS --------------------------------------------------------------------
-- Even with a policy, anon needs the INSERT privilege. If this returns no rows,
-- or is missing columns the site writes, that is the problem.

select grantee,
       privilege_type,
       string_agg(column_name, ', ' order by column_name) as columns
from information_schema.column_privileges
where table_schema = 'public'
  and table_name   = 'leads'
  and grantee      in ('anon', 'authenticated')
group by grantee, privilege_type
order by grantee, privilege_type;


-- 4. LIVE TEST -----------------------------------------------------------------
-- Runs the exact insert the website performs, as the anon role, then rolls it
-- back. Whatever error this raises IS the error the browser is getting.

begin;

set local role anon;

insert into public.leads (
  site, source, lead_type, page_url,
  name, email, phone,
  address, city, zip,
  service, best_time_to_call, message, cart_items
) values (
  'ocalaelitecardetailing.com', 'website', 'booking', 'https://ocalaelitecardetailing.com/',
  'Diagnostic Test', 'diagnostic@example.com', '3525550000',
  '1 Test Street', 'Ocala', '34470',
  'Ceramic Coating', 'Morning', 'Diagnostic row - rolled back, never saved.',
  '{"form":"diagnostic"}'::jsonb
);

reset role;

-- Nothing is kept. Change this to COMMIT only if you want to confirm a real
-- row appears in the table.
rollback;


-- 5. IF THE TEST ABOVE PASSED --------------------------------------------------
-- Then the database accepts the insert and the problem is on the browser side:
-- either the deployed site is an older build, or the API key is being rejected
-- before the request ever reaches Postgres.
--
-- Check the key from a terminal. 200 or 403 means the key is accepted;
-- 401 means it is not:
--
--   curl -s -o /dev/null -w "%{http_code}\n" \
--     -H "apikey: <YOUR_ANON_KEY>" \
--     "https://tbqigevoksabizjogvtm.supabase.co/rest/v1/leads?select=id&limit=1"
--
-- And check what any recent real submissions look like:
--
--   select created_at, lead_type, name, service, site
--   from public.leads
--   where site = 'ocalaelitecardetailing.com'
--   order by created_at desc
--   limit 10;
