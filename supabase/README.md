# Supabase setup

This site writes leads into the **shared `leads` table** used by the owner's
other lead-gen sites, and keeps its own `reviews` table.

## ⚠️ Do not run DDL against `leads`

`leads` is shared and already live. Nothing in this repo creates, alters, or
re-grants it, and nothing should. [`schema.sql`](./schema.sql) only creates the
`reviews` table plus two read-only views.

## One-time setup

1. Open the project's SQL editor.
2. Paste and run [`schema.sql`](./schema.sql). It is idempotent and safe to
   re-run.
3. Confirm the anon role can insert into `leads` (see **Verifying** below).

## Keys

| Key | Role |
| --- | --- |
| Publishable key (`sb_publishable_…`) | Tried first. Sent in the `apikey` header only. |
| Anon JWT (`eyJ…role":"anon"…`) | Fallback. Sent in `apikey` **and** `Authorization: Bearer`. |
| Service role key | **Never** in this repository, in client code, or in any deployed asset. Dashboard and trusted server use only. |

Both public keys are listed in `assets/js/supabase.js`. A request rejected with
401 is retried once with the other key, and whichever one works is reused for
the rest of the page's life, so the site works under either of Supabase's key
systems without needing to know which is active.

> **The header matters.** Supabase parses `Authorization: Bearer` as a JWT. A
> publishable key is not a JWT, so sending it in that header makes the request
> fail with 401 even when the `apikey` header is perfectly valid. This code
> sends `Authorization` only for JWT-shaped keys. That bug was the cause of the
> original 401 on the publishable key.

## How this site tags its leads

Every row inserted from this site carries:

| Column | Value |
| --- | --- |
| `site` | `ocalaelitecardetailing.com` |
| `source` | `website` |
| `lead_type` | `booking` or `contact` |

So this site's leads are always retrievable with:

```sql
select * from public.leads
where site = 'ocalaelitecardetailing.com'
order by created_at desc;
```

The `oecd_leads` view created by `schema.sql` wraps exactly that query.

### Columns written

`name`, `email`, `phone`, `address`, `city`, `zip`, `service`,
`best_time_to_call`, `message`, `status`, `page_url`, `referrer`, `utm_source`,
`utm_medium`, `utm_campaign`, `utm_term`, `utm_content`, `gclid`, and
`cart_items` (jsonb).

`message` holds a readable summary so a lead can be understood straight from
the inbox; `cart_items` holds the same detail structured for querying.

### Columns deliberately never written

| Column | Why |
| --- | --- |
| `project_type`, `job_category` | Postgres ENUMs belonging to another site. Their allowed values are unknown here, and an unrecognised value fails the whole insert with `22P02`. |
| `id`, `created_at` | Rely on their database defaults. |

`status` **is** written, as `new`. It is `NOT NULL` and uses the `lead_status`
enum (`new`, `active`, `closed`). Writing it explicitly rather than relying on
a database default means the insert cannot fail with `23502` if that default is
ever missing or removed.

Every other column (`event_*`, `chair_*`, `tier`, `provider_slug`,
`size_estimate`, …) belongs to other sites and is left null.

## Verifying

Check the key is accepted and the table is reachable. `200` or `403` means the
key works; `401` means it is rejected; `404` means the table name is wrong:

```bash
curl -s -o /dev/null -w "%{http_code}\n" \
  -H "apikey: YOUR_ANON_KEY" \
  "https://tbqigevoksabizjogvtm.supabase.co/rest/v1/leads?select=id&limit=1"
```

### Reading the error without DevTools

Append `?debug=1` to any page URL. Form errors then print the raw HTTP status,
the Postgres error code, and the response body on screen instead of the
customer-facing wording:

```
https://ocalaelitecardetailing.com/?debug=1#book
```

Leave the parameter off and customers only ever see the friendly message.

### Is it just this table, or the whole Data API?

The `/reviews/` page reads from Supabase on every load, through the same Data
API and the same key. That makes it a free discriminator:

| `/reviews/` loads reviews | `leads` insert 404s | Meaning |
| --- | --- | --- |
| yes | yes | The Data API and key are fine. The problem is specific to `leads` - schema, grant, or stale cache. |
| no | yes | The Data API itself is not serving `public`, or the project is paused. |

If a real submission fails, open the browser console — failed inserts log the
exact HTTP status and Postgres message.

Common results:

| Status | Meaning | Fix |
| --- | --- | --- |
| 401 | API key rejected | Wrong/rotated key in `assets/js/supabase.js` |
| 403 | RLS or column grant blocks the insert | anon needs `INSERT` on `leads` for the columns listed above |
| 404 | PostgREST cannot find the table **in its schema cache** - not a permissions error | Run [`diagnose-404.sql`](./diagnose-404.sql). Usually a stale cache (`notify pgrst, 'reload schema';`), a table outside the exposed schemas, or no `anon` grant at all |
| 400 + `22P02` | An ENUM column got an unrecognised value | Something is writing `status`/`project_type`/`job_category` |
| 400 + `PGRST204` | A column in the payload does not exist | Column name drift — compare against the list above |
| 403 + `42501` | `anon` has `INSERT` on the table but not `USAGE` on its id sequence | Only affects `bigserial` ids: `grant usage on sequence leads_id_seq to anon;` |

## The booking 404: root cause

**A policy on `leads` calls `public.is_admin()`, and that function queries
`public.contractors`, which does not exist in this project.**

The chain, reproduced end to end on PostgreSQL 16:

1. The booking wizard `POST`s to `/rest/v1/leads`.
2. The client used to send `Prefer: return=representation`, which makes
   PostgREST run `INSERT ... RETURNING`.
3. `RETURNING` reads the row back, which evaluates the table's SELECT-side
   policies — including `admins manage leads` (`FOR ALL`), which calls
   `is_admin()`.
4. `is_admin()` queries the missing `contractors` table, so Postgres raises
   **`42P01` undefined_table**.
5. PostgREST reports `42P01` as **HTTP 404**.
6. The site mapped 404 to "The booking system is not set up yet."

Every database check passed because the grants and policies really are fine
for a plain insert. Only the `RETURNING` path was broken.

Observed directly, same table, same session:

| Statement as `anon` | Result |
| --- | --- |
| `insert into leads (...) values (...)` | `INSERT 0 1` |
| `insert into leads (...) values (...) returning *` | `ERROR: 42P01 relation "public.contractors" does not exist` |

### The fix that shipped

`assets/js/supabase.js` no longer asks for the row back. Nothing on the site
ever used it — every caller's `.then` takes no argument — and not asking means
the `anon` role needs no `SELECT` privilege at all, which is what makes the
lockdown in the section below safe to apply.

### Why repairing `is_admin()` alone would not have fixed it

With `RETURNING`, the new row must also be **visible** under the SELECT
policies, and `anon` has no SELECT policy on `leads`. Repairing the function
turns the 404 into `new row violates row-level security policy` — a different
error, still a failed booking. Verified. The client change is the fix; the
function repair matters for everything else that calls it, and is in
[`fix-is-admin.sql`](./fix-is-admin.sql).

### `is_admin()` is broken for every caller

The same function is presumably referenced by policies on other tables in this
shared project. `fix-is-admin.sql` lists them, then offers two repairs: fail
closed if `contractors` is genuinely gone, or repoint the function if admins
now live in a different table.

## ⚠️ anon privileges on `leads`

A diagnostic run on the live project returned this for the `anon` role:

```
DELETE, INSERT, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE
```

The websites use **`INSERT` and nothing else**. The anon key is public by
design — it ships in the JavaScript on every page — so every other privilege
there is surface area with no purpose.

`TRUNCATE` is the one to understand properly. Row Level Security governs
SELECT, INSERT, UPDATE and DELETE. It does **not** govern TRUNCATE, which is
decided by the grant alone, so no policy can restrain it. Verified directly:
with RLS enabled and only an INSERT policy present, `anon` read 0 rows and
deleted 0 rows, then truncated the table and removed every row, including rows
belonging to the other sites sharing it.

The mitigating factor today is that PostgREST exposes no HTTP verb that maps
to TRUNCATE, so it is not reachable through the Data API as things stand. It
becomes reachable the moment any RPC function touches the table.

`SELECT`, `UPDATE` and `DELETE` **are** reachable over HTTP. Whether they are
actually exposed depends on the policies: a `PERMISSIVE` policy that is
`FOR ALL` with `USING (true)` applying to `public` or `anon` opens all three.

Two scripts:

| Script | Does |
| --- | --- |
| [`audit-leads-access.sql`](./audit-leads-access.sql) | Runs the real operations as `anon` inside a transaction and rolls back, reporting observed behaviour rather than inference |
| [`harden-leads.sql`](./harden-leads.sql) | Dry run first, then revokes everything except `INSERT` |

Confirmed after hardening: booking inserts still succeed, TRUNCATE is denied,
and read/update/delete are denied outright **even with a permissive
`FOR ALL USING (true)` policy still present** — the grant revoke alone closes
it.

Before running the revoke, confirm no other site reads `leads` with the anon
key. All the sites share this one project and therefore this one `anon` role.

## Verified against a real database

`schema.sql` and `diagnose-404.sql` are not written from memory — both were
executed against PostgreSQL 16 with a `leads` fixture matching the live column
list, in healthy and broken states. What that run established:

- `schema.sql` applies cleanly and is idempotent; a second run changes nothing.
- Acting as `anon`: submitting a review succeeds and lands as `pending`;
  reading pending reviews returns **0 rows**; approving one is denied;
  reading `leads` is denied. The table in the Reviews section below is
  therefore tested behaviour, not intent.
- Inserting the exact payload the booking wizard sends succeeds, and the row
  appears in the `oecd_leads` view with every field populated.
- `diagnose-404.sql` reports correctly when `leads` sits outside `public`,
  when `anon` holds no grant, and when the id sequence grant is missing.

The one thing that run cannot cover is PostgREST itself, which is not part of
a stock PostgreSQL install. Anything about the schema *cache* is reasoning
from PostgREST's documented behaviour, not observation.

## Reviews

Reviews are **not** leads — they carry a rating, a public display name, and an
approval workflow, none of which exist on `leads`. They live in their own
table.

A review appears on `/reviews/` only once its `status` is set to `approved`.
Set it to `rejected` to keep the record without publishing it. The
`reviews_queue` view lists submissions awaiting a decision.

| Table | Anonymous visitor can | Anonymous visitor cannot |
| --- | --- | --- |
| `leads` | insert a tagged lead | read, update, or delete any lead |
| `reviews` | insert a pending review | read reviewer emails, read pending reviews, approve their own review |
