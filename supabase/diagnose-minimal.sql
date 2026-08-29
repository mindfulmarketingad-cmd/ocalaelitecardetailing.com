-- Paste this whole block. Output is small. Nothing is saved.

-- A. Do the columns the site never writes have defaults?
select column_name, is_nullable, coalesce(column_default,'** NO DEFAULT **') as default_value
from information_schema.columns
where table_schema='public' and table_name='leads'
  and column_name in ('id','created_at','status');

-- B. Is RLS on, and is there an INSERT policy for anon?
select relrowsecurity as rls_enabled from pg_class where oid='public.leads'::regclass;
select policyname, cmd, roles, with_check from pg_policies
where schemaname='public' and tablename='leads';

-- C. The real test: run the site's exact insert as anon, then roll back.
begin;
set local role anon;
insert into public.leads (site, source, lead_type, page_url, name, email, phone, service, message, cart_items)
values ('ocalaelitecardetailing.com','website','booking','https://ocalaelitecardetailing.com/',
        'Diagnostic','diagnostic@example.com','3525550000','Ceramic Coating','test','{}'::jsonb);
reset role;
rollback;
