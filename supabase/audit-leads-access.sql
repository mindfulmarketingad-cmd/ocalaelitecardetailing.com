-- What can an anonymous visitor ACTUALLY do to public.leads?
--
-- Grants alone do not answer this: with RLS enabled, a grant is only half the
-- picture and a policy decides the rest. This runs the real operations as the
-- anon role inside a transaction and rolls the whole thing back, so it reports
-- observed behaviour rather than inference. Nothing is left behind.
--
-- Run it in the Supabase SQL editor. Two result sets: the policies, then what
-- anon can do. Read the second one first.

-- ---------------------------------------------------------------------------
-- 1. Every policy on leads, in full. `qual` is the USING clause (governs which
--    existing rows are visible to SELECT/UPDATE/DELETE); `with_check` governs
--    what INSERT/UPDATE may write. A qual of `true` on a permissive SELECT or
--    ALL policy for anon means every lead from every site is world-readable.
-- ---------------------------------------------------------------------------
select policyname,
       cmd,
       permissive,
       roles::text        as applies_to_roles,
       coalesce(qual, '(none)')       as using_clause,
       coalesce(with_check, '(none)') as with_check_clause
from pg_policies
where schemaname = 'public' and tablename = 'leads'
order by cmd, policyname;

-- ---------------------------------------------------------------------------
-- 2. The observed answer. Everything below is rolled back.
-- ---------------------------------------------------------------------------
begin;

create temp table audit_result (seq int, capability text, observed text) on commit drop;

-- How many leads exist in total, as the owner.
insert into audit_result
select 1, 'total leads in table (as owner)', count(*)::text from public.leads;

do $$
declare
  n_read   text;
  n_update text;
  n_delete text;
  visible  bigint;
  changed  bigint;
begin
  -- Results are collected into variables while acting as anon, then written
  -- after the role is reset: anon has no rights on the results table itself.
  set local role anon;

  begin
    select count(*) into visible from public.leads;
    n_read := case when visible = 0 then '0  - good'
                   else visible::text || '  ** every one of these is public **' end;
  exception when insufficient_privilege then
    n_read := 'denied outright - good';
  end;

  begin
    update public.leads set site = site;
    get diagnostics changed = row_count;
    n_update := case when changed = 0 then '0  - good'
                     else changed::text || '  ** anon can rewrite these **' end;
  exception when insufficient_privilege then
    n_update := 'denied outright - good';
  end;

  begin
    delete from public.leads;
    get diagnostics changed = row_count;
    n_delete := case when changed = 0 then '0  - good'
                     else changed::text || '  ** anon can destroy these **' end;
  exception when insufficient_privilege then
    n_delete := 'denied outright - good';
  end;

  reset role;

  insert into audit_result values (2, 'rows anon can READ', n_read);
  insert into audit_result values (3, 'rows anon can UPDATE', n_update);
  insert into audit_result values (4, 'rows anon can DELETE', n_delete);
end $$;

-- TRUNCATE is NOT governed by row level security. It is decided solely by the
-- grant, so a policy cannot restrain it. Reported from the privilege rather
-- than executed, because a truncate cannot be meaningfully tested here.
insert into audit_result
select 5, 'anon holds TRUNCATE (RLS cannot restrain this)',
       case when has_table_privilege('anon', 'public.leads', 'TRUNCATE')
            then '** YES - revoke it **' else 'no - good' end;

insert into audit_result
select 6, 'anon table grants', string_agg(privilege_type, ', ' order by privilege_type)
from information_schema.role_table_grants
where table_schema = 'public' and table_name = 'leads' and grantee = 'anon';

select capability, observed from audit_result order by seq;

rollback;
