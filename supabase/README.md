# Supabase setup

The site writes booking requests, contact messages, and review submissions to
the Supabase project `tbqigevoksabizjogvtm`.

## One-time setup

1. Open the project's SQL editor.
2. Paste and run [`schema.sql`](./schema.sql). It is idempotent, so re-running
   it after an edit is safe.
3. Confirm under **Authentication → Policies** that RLS shows as enabled on
   `bookings`, `contact_messages`, and `reviews`.

## Keys

| Key | Where it belongs |
| --- | --- |
| Anon JWT (`eyJ…role":"anon"…`) | **Currently in use.** Client JavaScript, in `assets/js/supabase.js`. Public by design. |
| Publishable key (`sb_publishable_…`) | Returned HTTP 401 on this project, meaning the new API key system is not enabled for it. Swap back in `assets/js/supabase.js` only if you enable new API keys in the dashboard. |
| Service role key | **Never** in this repository, in client code, or in any deployed asset. Dashboard and trusted server use only. |

## Working the inbox

Two views exist for staff use through the dashboard or a service-role client:

- `bookings_inbox` — every request, newest first.
- `reviews_queue` — review submissions awaiting a decision.

A review appears on `/reviews/` only once its `status` is set to `approved`.
Set it to `rejected` to keep the record without publishing it.

## Table summary

| Table | Anonymous visitor can | Anonymous visitor cannot |
| --- | --- | --- |
| `bookings` | insert intake columns | read, update, delete, or set `status` / `assigned_operator` / `internal_notes` |
| `contact_messages` | insert intake columns | read, update, delete, or set `status` / `internal_notes` |
| `reviews` | insert a pending review | read reviewer emails, read pending reviews, approve their own review |
