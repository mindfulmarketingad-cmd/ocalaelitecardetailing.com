/* Vercel serverless function: /api/send-booking
 *
 * Replaces the Supabase insert for the booking wizard. The wizard now POSTs
 * its answers here as JSON, and this function emails them straight to the
 * owner's inbox via Gmail SMTP - no database, no shared table, no RLS policy
 * that can silently break a booking again.
 *
 * Requires two environment variables, set in the Vercel project (Settings ->
 * Environment Variables), never committed to the repository:
 *
 *   GMAIL_USER          the sending Gmail address, e.g. mindfulmarketingad@gmail.com
 *   GMAIL_APP_PASSWORD  a 16-character Google App Password for that account
 *                        (Google Account -> Security -> 2-Step Verification ->
 *                        App passwords - requires 2-Step Verification to be on)
 *
 * LEAD_TO_EMAIL is optional and defaults to GMAIL_USER, in case the send
 * account and the inbox that should receive leads are ever different.
 */

const nodemailer = require('nodemailer');

/* Every field the booking wizard can send. Anything else in the body is
 * ignored rather than trusted - this runs server-side precisely so the
 * payload cannot be taken on faith. */
const FIELDS = [
  'name', 'email', 'phone',
  'service_label', 'vehicle_type_label', 'vehicle_details', 'condition_label',
  'address', 'city', 'zip', 'preferred_date', 'time_window_label', 'notes'
];

const LABELS = {
  name: 'Name',
  email: 'Email',
  phone: 'Phone',
  service_label: 'Service',
  vehicle_type_label: 'Vehicle type',
  vehicle_details: 'Vehicle',
  condition_label: 'Condition',
  address: 'Address',
  city: 'City',
  zip: 'ZIP',
  preferred_date: 'Preferred date',
  time_window_label: 'Arrival window',
  notes: 'Notes'
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Strips control characters and caps length. Applied to every field before
 * it ever reaches a header or the email body, so nothing in the request can
 * inject extra headers or blow up the message. */
function clean(value, maxLength) {
  if (value === undefined || value === null) return '';
  return String(value)
    .replace(/[\r\n\t\x00-\x1f\x7f]/g, ' ')
    .trim()
    .slice(0, maxLength || 300);
}

/** Builds the plain-text body and the mail options from a validated payload.
 * Kept separate from sending so it can be tested without SMTP credentials. */
function composeMessage(body, toAddress, fromAddress) {
  const fields = {};
  FIELDS.forEach((key) => {
    fields[key] = clean(body[key], key === 'notes' ? 1500 : 200);
  });

  const lines = FIELDS.filter((key) => fields[key]).map((key) => LABELS[key] + ': ' + fields[key]);

  const text =
    'New booking request from ocalaelitecardetailing.com\n\n' +
    lines.join('\n') +
    '\n\n---\nSubmitted ' + new Date().toISOString() + '\nPage: ' + clean(body.page_url, 300);

  return {
    from: fromAddress,
    to: toAddress,
    replyTo: fields.email ? fields.name + ' <' + fields.email + '>' : undefined,
    subject: 'New booking request: ' + (fields.service_label || 'Service not specified'),
    text: text
  };
}

/** Required fields and shape. Mirrors the wizard's own client-side validation
 * (assets/js/booking.js validate()), because that validation is not trusted
 * here - this endpoint is reachable directly, not only from the wizard. */
function validate(body) {
  if (!body || typeof body !== 'object') return 'Missing form data.';
  if (!clean(body.name)) return 'Name is required.';
  if (!EMAIL_RE.test(clean(body.email))) return 'A valid email is required.';
  if (clean(body.phone).replace(/\D/g, '').length < 10) return 'A valid phone number is required.';
  if (!clean(body.service_label)) return 'A service is required.';
  return null;
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const body = req.body || {};

  /* Honeypot: a field named "website" that stays empty and hidden for a human
   * filling in the real form, but that simple bots tend to fill in because it
   * looks like a normal field. A non-empty value is treated as spam and gets
   * a fake success so the bot does not learn to look elsewhere. */
  if (clean(body.website)) {
    return res.status(200).json({ ok: true });
  }

  /* started_at is a client timestamp set when the wizard first rendered.
   * Anything submitted in under 3 seconds is far faster than a person can
   * fill in four form steps, so it is rejected outright rather than faked. */
  const startedAt = Number(body.started_at);
  if (startedAt && Date.now() - startedAt < 3000) {
    return res.status(400).json({ error: 'Please try again.' });
  }

  const problem = validate(body);
  if (problem) {
    return res.status(400).json({ error: problem });
  }

  const gmailUser = process.env.GMAIL_USER;
  const gmailPass = process.env.GMAIL_APP_PASSWORD;
  if (!gmailUser || !gmailPass) {
    console.error('[send-booking] GMAIL_USER / GMAIL_APP_PASSWORD not configured.');
    return res.status(500).json({ error: 'Email is not configured yet.' });
  }
  const toAddress = process.env.LEAD_TO_EMAIL || gmailUser;

  const mailOptions = composeMessage(body, toAddress, gmailUser);

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user: gmailUser, pass: gmailPass }
  });

  try {
    await transporter.sendMail(mailOptions);
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('[send-booking] sendMail failed:', err && err.message);
    return res.status(502).json({ error: 'Could not send the request. Please call or email us instead.' });
  }
};

/* Exported for testing only - not part of the HTTP contract. */
module.exports.composeMessage = composeMessage;
module.exports.validate = validate;
