-- Last piece. Two small queries, tiny output.

-- 1. Do the columns the website never writes have defaults?
--    A "** NO DEFAULT **" on status is the bug.
select column_name,
       is_nullable,
       coalesce(column_default, '** NO DEFAULT **') as default_value
from information_schema.columns
where table_schema = 'public'
  and table_name   = 'leads'
  and column_name in ('id', 'created_at', 'status');

-- 2. What values is the status enum allowed to take?
--    Needed so the site can send a valid one instead of guessing; an
--    unrecognised value fails the whole insert with 22P02.
select t.typname as enum_type,
       string_agg(e.enumlabel, ', ' order by e.enumsortorder) as allowed_values
from pg_type t
join pg_enum e on e.enumtypid = t.oid
join information_schema.columns c on c.udt_name = t.typname
where c.table_schema = 'public'
  and c.table_name   = 'leads'
  and c.column_name  = 'status'
group by t.typname;
