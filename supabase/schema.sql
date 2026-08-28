-- =============================================================================
-- Ocala Elite Car Detailing - Supabase setup
--
-- ⚠️  READ THIS FIRST
--
-- The `leads` table is SHARED with the owner's other lead-gen sites and is
-- already live. This file deliberately does NOT create, alter, drop, or
-- re-grant anything on `leads`. Running DDL against a shared table would risk
-- breaking the other sites that write to it.
--
-- This file only creates the `reviews` table, which is specific to this site,
-- plus a read-only convenience view. It is safe to run as-is, and safe to
-- re-run.
-- =============================================================================

create extension if not exists "pgcrypto";

-- -----------------------------------------------------------------------------
-- How this site writes to the shared `leads` table (reference only - no DDL)
-- -----------------------------------------------------------------------------
--
-- Every row this site inserts is tagged:
--     site      = 'ocalaelitecardetailing.com'
--     source    = 'website'
--     lead_type = 'booking' | 'contact'
--
-- Columns written (all plain text unless noted):
--     name, email, phone, address, city, zip,
--     service, best_time_to_call, message,
--     page_url, referrer, utm_source, utm_medium, utm_campaign,
--     utm_term, utm_content, gclid,
--     cart_items (jsonb - the form-specific detail)
--
-- Columns deliberately NEVER written from the browser:
--     status, project_type, job_category
--         These are Postgres ENUMs. status is also NOT NULL, so it must keep
--         its database default. Sending an unrecognised value fails the whole
--         insert with SQLSTATE 22P02 (invalid input value for enum).
--     id, created_at
--         Rely on their database defaults.
--
-- The other sites' columns (event_*, chair_*, project_type, size_estimate,
-- tier, provider_slug, and so on) are left null by this site.

-- -----------------------------------------------------------------------------
-- reviews: customer submissions, published only after staff approval
--
-- Reviews are NOT leads. They carry a rating, a public display name, and an
-- approval workflow, none of which exist on `leads`, so they keep their own
-- table.
-- -----------------------------------------------------------------------------
create table if not exists public.reviews (
  id             uuid primary key default gen_random_uuid(),
  created_at     timestamptz not null default now(),

  display_name   text not null check (length(btrim(display_name)) between 1 and 80),
  email          text not null check (email ~ '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$'),
  rating         int  not null check (rating between 1 and 5),
  service        text,
  body           text not null check (length(btrim(body)) between 20 and 2000),

  -- Staff controlled. Rows are invisible to the public until set to 'approved'.
  status         text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  internal_notes text
);

create index if not exists reviews_status_created_idx on public.reviews (status, created_at desc);

-- --- privileges --------------------------------------------------------------
-- Supabase grants broad defaults to anon/authenticated. Revoke and hand back
-- only what the website needs, column by column.

revoke all on public.reviews from anon, authenticated;

grant insert (display_name, email, rating, service, body) on public.reviews to anon, authenticated;

-- Public may read approved reviews, minus the reviewer's email address.
grant select (display_name, rating, service, body, created_at) on public.reviews to anon, authenticated;

-- --- row level security ------------------------------------------------------

alter table public.reviews enable row level security;
alter table public.reviews force row level security;

drop policy if exists "anon can submit reviews" on public.reviews;
create policy "anon can submit reviews"
  on public.reviews
  for insert
  to anon, authenticated
  with check (status = 'pending');

drop policy if exists "approved reviews are public" on public.reviews;
create policy "approved reviews are public"
  on public.reviews
  for select
  to anon, authenticated
  using (status = 'approved');

-- -----------------------------------------------------------------------------
-- Staff convenience views (service_role / dashboard use only)
-- -----------------------------------------------------------------------------

-- This site's leads only, newest first. Read-only; creating a view does not
-- modify the underlying shared table.
create or replace view public.oecd_leads as
  select id, created_at, lead_type, status, name, email, phone,
         service, best_time_to_call, address, city, zip,
         message, cart_items, page_url, utm_source, utm_medium, utm_campaign
  from public.leads
  where site = 'ocalaelitecardetailing.com'
  order by created_at desc;

revoke all on public.oecd_leads from anon, authenticated;

create or replace view public.reviews_queue as
  select id, created_at, status, rating, display_name, email, service, body
  from public.reviews
  where status = 'pending'
  order by created_at desc;

revoke all on public.reviews_queue from anon, authenticated;
