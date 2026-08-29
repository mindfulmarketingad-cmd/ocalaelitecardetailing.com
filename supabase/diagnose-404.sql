-- Why is POST /rest/v1/leads returning 404?
--
-- A 404 from PostgREST does NOT mean "no permission" - that would be 403.
-- It means PostgREST could not find the table in its schema cache at all.
-- Run this whole block in the Supabase SQL editor. Output is small, nothing
-- is written, nothing is changed.

-- ---------------------------------------------------------------------------
-- A. Does the table exist, and WHICH SCHEMA is it in?
--    The Data API only serves schemas it has been told to expose (public by
--    default). A `leads` table sitting in any other schema is invisible to it
--    and every request for it returns exactly this 404.
-- ---------------------------------------------------------------------------
select table_schema, table_name
from information_schema.tables
where table_name = 'leads';

-- ---------------------------------------------------------------------------
-- B. Which schemas is the Data API actually exposing?
--    `public` must appear in this list. If it does not, that is the answer:
--    Dashboard -> Settings -> API -> Exposed schemas.
-- ---------------------------------------------------------------------------
select setting
from pg_settings
where name = 'pgrst.db_schemas';

-- ---------------------------------------------------------------------------
-- C. Can the anon role see the table at all?
--    PostgREST builds its cache as the authenticator role and only exposes
--    relations the requesting role holds some privilege on. Zero rows here
--    means anon has no grant, which also produces a 404 rather than a 403.
-- ---------------------------------------------------------------------------
select table_schema, privilege_type
from information_schema.role_table_grants
where table_name = 'leads' and grantee = 'anon';

-- ---------------------------------------------------------------------------
-- D. Is the project's API gateway serving this table right now?
--    This is the same view PostgREST reads. If `leads` is missing here but
--    present in A, the cache is stale.
-- ---------------------------------------------------------------------------
select c.relname
from pg_class c
join pg_namespace n on n.oid = c.relnamespace
where n.nspname = 'public'
  and c.relkind in ('r', 'v', 'm', 'f', 'p')
  and c.relname in ('leads', 'reviews')
order by c.relname;

-- ---------------------------------------------------------------------------
-- E. THE MOST COMMON FIX. Grants and policies changed since PostgREST last
--    built its cache, so it is still serving the old picture. This tells it
--    to rebuild. It is instant, safe, and affects no data.
-- ---------------------------------------------------------------------------
notify pgrst, 'reload schema';
