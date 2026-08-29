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

If a real submission fails, open the browser console — failed inserts log the
exact HTTP status and Postgres message.

Common results:

| Status | Meaning | Fix |
| --- | --- | --- |
| 401 | API key rejected | Wrong/rotated key in `assets/js/supabase.js` |
| 403 | RLS or column grant blocks the insert | anon needs `INSERT` on `leads` for the columns listed above |
| 404 | Table not found | Table name in `LEAD_TABLE` is wrong |
| 400 + `22P02` | An ENUM column got an unrecognised value | Something is writing `status`/`project_type`/`job_category` |
| 400 + `PGRST204` | A column in the payload does not exist | Column name drift — compare against the list above |

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
