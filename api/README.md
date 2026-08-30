# Booking emails

The booking wizard no longer writes to Supabase. It POSTs to
[`/api/send-booking`](./send-booking.js), a Vercel serverless function that
emails the request straight to the owner's inbox over Gmail SMTP. No
database, no shared table, no RLS policy that can silently break a booking.

This runs automatically once deployed to Vercel — `/api` is detected and
deployed as a serverless function alongside the static site with no extra
configuration. It does nothing until the two environment variables below are
set.

## One-time setup

1. **Turn on 2-Step Verification** on the Google account that should send
   these emails (normally `mindfulmarketingad@gmail.com`), if it is not on
   already: [myaccount.google.com/security](https://myaccount.google.com/security).
2. **Create an App Password**: Google Account → Security → 2-Step
   Verification → App passwords. Name it anything (e.g. "Ocala Elite
   booking form"). Google shows a 16-character password once — copy it.
3. In the **Vercel project** → Settings → Environment Variables, add:

   | Name | Value |
   | --- | --- |
   | `GMAIL_USER` | the Gmail address, e.g. `mindfulmarketingad@gmail.com` |
   | `GMAIL_APP_PASSWORD` | the 16-character App Password from step 2 (no spaces) |

   `LEAD_TO_EMAIL` is optional — set it only if bookings should land somewhere
   other than `GMAIL_USER`. Leave it unset and it defaults to `GMAIL_USER`.

4. Redeploy (or just push a commit — Vercel redeploys on every push to this
   branch). That's it; no code change is needed to activate it.

**Never commit these values.** They are read from `process.env` only, at
request time, on Vercel's server — never shipped to the browser. `.env.local`
is in `.gitignore` if you want to test locally with `vercel dev`.

## What happens on submit

The wizard sends the full booking as JSON. The function validates it
server-side (name, a real-looking email, a 10-digit phone, a service — the
same checks the wizard already does client-side, re-checked here because this
endpoint is reachable directly, not only from the wizard), rejects it if a
hidden honeypot field is filled in or if it arrives in under 3 seconds (both
signs of a bot rather than a person), then emails a plain-text summary to
`LEAD_TO_EMAIL` with **Reply-To set to the customer** — replying in Gmail
goes straight back to them.

Every field is stripped of control characters and length-capped before it
touches the email, so nothing in the submission can inject extra headers or
forge a `Bcc:` line — verified directly against exactly that attempt.

## What still uses Supabase

`assets/js/supabase.js` is unchanged and still loaded on the homepage, purely
for shared helpers (`escapeHtml`, `setStatus`, `isEmail`) the wizard also
uses. The **contact form** (`assets/js/contact.js`) and **reviews**
(`assets/js/reviews.js`) still write to Supabase — this change only touches
the booking wizard, per what was asked. See `supabase/README.md` for the
open issues there (the dead `is_admin()` policies, the `analytics_events`
exposure, and the missing `reviews` table).
