-- =============================================================================
-- Ocala Elite Car Detailing - Supabase schema
--
-- Run this once in the Supabase SQL editor for project tbqigevoksabizjogvtm.
--
-- Security model
--   The website ships a publishable (anon) key in client JavaScript. That key
--   is public by design. Everything that actually protects the data is here:
--     * Row Level Security is enabled on every table.
--     * Anonymous visitors may INSERT into the three intake tables and nothing
--       else. They cannot read, update, or delete a booking or a message.
--     * Column-level GRANTs stop a visitor writing to internal columns
--       (status, assigned_operator, internal_notes) or reading reviewer emails.
--     * Only reviews explicitly approved by staff are publicly readable, and
--       only their non-identifying columns.
--
--   The service_role key must never appear in this repository, in client
--   JavaScript, or in any deployed asset. Use it from a trusted server or the
--   Supabase dashboard only.
-- =============================================================================

create extension if not exists "pgcrypto";

-- -----------------------------------------------------------------------------
-- bookings: submissions from the homepage booking wizard
-- -----------------------------------------------------------------------------
create table if not exists public.bookings (
  id                uuid primary key default gen_random_uuid(),
  created_at        timestamptz not null default now(),

  -- Step 1: service (the wizard's first question)
  service           text not null check (service in ('exterior', 'interior', 'full_package', 'ceramic_coating')),

  -- Step 2: vehicle
  vehicle_type      text not null check (vehicle_type in ('sedan', 'suv', 'truck', 'oversized')),
  vehicle_details   text,
  vehicle_condition text check (vehicle_condition in ('maintained', 'average', 'neglected', 'heavy')),

  -- Step 3: location and timing
  address           text,
  city              text,
  postal_code       text,
  preferred_date    date,
  time_window       text check (time_window in ('morning', 'midday', 'afternoon', 'flexible')),

  -- Step 4: contact
  name              text not null check (length(btrim(name)) between 1 and 80),
  email             text not null check (email ~ '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$'),
  phone             text not null check (length(btrim(phone)) between 7 and 32),
  notes             text check (length(notes) <= 1500),

  source_page       text,

  -- Internal only. Not writable or readable by anonymous visitors.
  status            text not null default 'new'
                      check (status in ('new', 'contacted', 'quoted', 'scheduled', 'completed', 'cancelled')),
  assigned_operator text,
  internal_notes    text
);

create index if not exists bookings_created_at_idx on public.bookings (created_at desc);
create index if not exists bookings_status_idx     on public.bookings (status);
create index if not exists bookings_service_idx    on public.bookings (service);

-- -----------------------------------------------------------------------------
-- contact_messages: submissions from the contact page
-- -----------------------------------------------------------------------------
create table if not exists public.contact_messages (
  id             uuid primary key default gen_random_uuid(),
  created_at     timestamptz not null default now(),

  name           text not null check (length(btrim(name)) between 1 and 80),
  email          text not null check (email ~ '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$'),
  phone          text,
  subject        text not null check (length(btrim(subject)) between 1 and 120),
  message        text not null check (length(btrim(message)) between 10 and 3000),
  source_page    text,

  status         text not null default 'new' check (status in ('new', 'read', 'answered', 'spam')),
  internal_notes text
);

create index if not exists contact_messages_created_at_idx on public.contact_messages (created_at desc);
create index if not exists contact_messages_status_idx     on public.contact_messages (status);

-- -----------------------------------------------------------------------------
-- reviews: customer submissions, published only after staff approval
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

-- =============================================================================
-- Privileges
--
-- Supabase grants broad default privileges to anon/authenticated. Revoke them
-- and hand back only what the website needs, column by column.
-- =============================================================================

revoke all on public.bookings         from anon, authenticated;
revoke all on public.contact_messages from anon, authenticated;
revoke all on public.reviews          from anon, authenticated;

-- Anonymous visitors may write intake columns only.
grant insert (
  service, vehicle_type, vehicle_details, vehicle_condition,
  address, city, postal_code, preferred_date, time_window,
  name, email, phone, notes, source_page
) on public.bookings to anon, authenticated;

grant insert (
  name, email, phone, subject, message, source_page
) on public.contact_messages to anon, authenticated;

grant insert (
  display_name, email, rating, service, body
) on public.reviews to anon, authenticated;

-- Anonymous visitors may read approved reviews, minus the reviewer's email.
grant select (
  display_name, rating, service, body, created_at
) on public.reviews to anon, authenticated;

-- =============================================================================
-- Row Level Security
-- =============================================================================

alter table public.bookings         enable row level security;
alter table public.contact_messages enable row level security;
alter table public.reviews          enable row level security;

alter table public.bookings         force row level security;
alter table public.contact_messages force row level security;
alter table public.reviews          force row level security;

drop policy if exists "anon can submit bookings" on public.bookings;
create policy "anon can submit bookings"
  on public.bookings
  for insert
  to anon, authenticated
  with check (true);

drop policy if exists "anon can submit contact messages" on public.contact_messages;
create policy "anon can submit contact messages"
  on public.contact_messages
  for insert
  to anon, authenticated
  with check (true);

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

-- No SELECT, UPDATE, or DELETE policy exists for anon on bookings or
-- contact_messages, so those operations are denied. The service_role key
-- bypasses RLS entirely and is what the dashboard and any trusted backend use.

-- =============================================================================
-- Staff convenience views (service_role / dashboard use)
-- =============================================================================

create or replace view public.bookings_inbox as
  select id, created_at, status, service, vehicle_type, vehicle_details,
         vehicle_condition, city, postal_code, preferred_date, time_window,
         name, email, phone, notes, assigned_operator
  from public.bookings
  order by created_at desc;

revoke all on public.bookings_inbox from anon, authenticated;

create or replace view public.reviews_queue as
  select id, created_at, status, rating, display_name, email, service, body
  from public.reviews
  where status = 'pending'
  order by created_at desc;

revoke all on public.reviews_queue from anon, authenticated;
