/* Minimal Supabase REST helper.
 *
 * The site only ever inserts rows and reads approved reviews, so it talks to
 * PostgREST directly with fetch instead of pulling in the full supabase-js
 * bundle. The key below is public by design; what protects the data is Row
 * Level Security, defined in supabase/schema.sql.
 *
 * KEY HANDLING: both of this project's public keys are listed, and a request
 * rejected with 401 is retried once with the next one, so the site works
 * whichever key system the project has active. See KEYS below.
 */
window.OECD = window.OECD || {};

(function (ns) {
  'use strict';

  var URL = 'https://tbqigevoksabizjogvtm.supabase.co';

  /* Two public keys exist for this project, from Supabase's two key systems.
   * Which one a project accepts depends on whether it has migrated to the
   * newer publishable/secret keys and whether legacy JWT keys are still
   * enabled. Rather than guess, both are listed and tried in order: a request
   * that comes back 401 is retried once with the next key, and whichever key
   * works is remembered for the rest of the page's life.
   *
   * Both are public by design. Row Level Security is the actual protection.
   * The service_role key must never appear here. */
  var KEYS = [
    // Newer publishable key.
    'sb_publishable_aHlx0Tdu2rhOTBUp3lhkQw_Lv6Awz7a',
    // Legacy anon JWT.
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRicWlnZXZva3NhYml6am9ndnRtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAwNjQ3NTUsImV4cCI6MjA5NTY0MDc1NX0.2jK6OVrl3Mdw_xj-Z6G9QsfvZxxv28z8nriLYsJYvFw'
  ];

  var activeKey = 0;

  /** Three dot-separated base64url segments. */
  function isJwt(key) {
    return /^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/.test(key);
  }

  /* The Authorization header is only sent for JWT-shaped keys. Supabase parses
   * that header as a JWT, so putting a non-JWT publishable key in it makes the
   * whole request fail with 401 even though the apikey header is valid. That
   * was a real bug here: it broke the publishable key on every request. */
  function buildHeaders(key, extra) {
    var h = { apikey: key, 'Content-Type': 'application/json' };
    if (isJwt(key)) h.Authorization = 'Bearer ' + key;
    for (var k in extra) if (Object.prototype.hasOwnProperty.call(extra, k)) h[k] = extra[k];
    return h;
  }

  /** fetch with automatic failover to the next key on 401. */
  function request(path, options, keyIndex) {
    if (keyIndex === undefined) keyIndex = activeKey;
    var opts = {
      method: options.method,
      headers: buildHeaders(KEYS[keyIndex], options.headers)
    };
    if (options.body) opts.body = options.body;

    return fetch(URL + path, opts).then(function (res) {
      if (res.status === 401 && keyIndex + 1 < KEYS.length) {
        if (window.console && console.warn) {
          console.warn('[OECD] Supabase rejected key ' + (keyIndex + 1) + ', retrying with the next one.');
        }
        activeKey = keyIndex + 1;
        return request(path, options, keyIndex + 1);
      }
      if (res.ok) activeKey = keyIndex;
      return res;
    });
  }

  /** Insert one row into a table. Resolves with the inserted row. */
  function insert(table, row) {
    return request('/rest/v1/' + table, {
      method: 'POST',
      headers: { Prefer: 'return=representation' },
      body: JSON.stringify(row)
    }).then(function (res) {
      return res.text().then(function (text) {
        var data = null;
        try {
          data = text ? JSON.parse(text) : null;
        } catch (e) {
          data = null;
        }
        if (!res.ok) {
          var message = (data && (data.message || data.hint || data.details)) || 'Request failed (' + res.status + ')';
          var err = new Error(message);
          err.status = res.status;
          err.pgCode = (data && data.code) || '';
          err.pgBody = data || text || '';
          // Customers see a friendly string; whoever is debugging needs the
          // real status and Postgres message, so surface it in the console.
          if (window.console && console.error) {
            var code = data && data.code ? ' [' + data.code + ']' : '';
            console.error(
              '[OECD] Supabase insert into "' + table + '" failed: HTTP ' + res.status + code + ' - ' + message
            );
            // 42501 = RLS or grant denial, 23502 = a NOT NULL column has no
            // default, PGRST204 = unknown column, 22P02 = bad enum value,
            // 401 = every key was rejected.
            if (res.status === 404) {
              console.error(
                '[OECD] A 404 here means PostgREST could not find "' + table + '" in its schema cache. ' +
                  'Usual causes: the table is not in a schema exposed to the Data API, or the cache is ' +
                  'stale after a grant change (fix with: NOTIFY pgrst, \'reload schema\';). ' +
                  'See supabase/diagnose-404.sql in the repository.'
              );
            }
            console.error('[OECD] full response:', data || text);
            console.error('[OECD] payload sent:', row);
          }
          throw err;
        }
        return Array.isArray(data) ? data[0] : data;
      });
    });
  }

  /** Select rows. `query` is a PostgREST query string, e.g. "select=*&order=id". */
  function select(table, query) {
    return request('/rest/v1/' + table + '?' + query, { method: 'GET' }).then(function (res) {
      if (!res.ok) {
        var err = new Error('Request failed (' + res.status + ')');
        err.status = res.status;
        throw err;
      }
      return res.json();
    });
  }

  /* --- shared leads-table helpers ----------------------------------------- */

  /* The `leads` table is shared across several of the owner's lead-gen sites,
   * so every row this site writes must be tagged with SITE to stay findable.
   * LEAD_TABLE is the single place the table name is defined. */
  var LEAD_TABLE = 'leads';
  var SITE = 'ocalaelitecardetailing.com';

  /* status is NOT NULL on the shared table and is the lead_status enum,
   * whose allowed values are 'new', 'active' and 'closed'. It is now written
   * explicitly as 'new' rather than left to a database default: anon holds
   * the INSERT grant on the column, the value is known-valid, and sending it
   * means the insert no longer depends on whether a default exists.
   *
   * Columns still deliberately never written from the browser:
   *   project_type, job_category - Postgres ENUMs owned by the other sites
   *     sharing this table. Their allowed values are unknown here, and an
   *     unrecognised value fails the entire insert with 22P02.
   *   id, created_at - rely on their database defaults.
   */
  var LEAD_STATUS = 'new';

  /** Marketing attribution from the URL and referrer, if present. */
  function attribution() {
    var out = {};
    try {
      var params = new URLSearchParams(window.location.search);
      ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'gclid'].forEach(function (k) {
        var v = params.get(k);
        if (v) out[k] = v.slice(0, 200);
      });
      if (document.referrer && document.referrer.indexOf(window.location.host) === -1) {
        out.referrer = document.referrer.slice(0, 300);
      }
    } catch (e) {
      /* URLSearchParams unavailable or blocked - attribution is optional. */
    }
    return out;
  }

  /**
   * Insert a lead into the shared table, tagged for this site.
   * `fields` must only contain columns listed as safe in supabase/README.md.
   */
  function insertLead(leadType, fields) {
    var row = {
      site: SITE,
      source: 'website',
      lead_type: leadType,
      status: LEAD_STATUS,
      page_url: String(window.location.href).slice(0, 500)
    };
    var extra = attribution();
    for (var a in extra) if (Object.prototype.hasOwnProperty.call(extra, a)) row[a] = extra[a];
    for (var k in fields) {
      if (Object.prototype.hasOwnProperty.call(fields, k) && fields[k] !== undefined) row[k] = fields[k];
    }
    return insert(LEAD_TABLE, row);
  }

  /* --- shared form helpers ------------------------------------------------ */

  function setStatus(el, message, kind) {
    if (!el) return;
    el.textContent = message;
    el.className = 'form-status is-visible' + (kind ? ' is-' + kind : '');
  }

  function clearStatus(el) {
    if (!el) return;
    el.textContent = '';
    el.className = 'form-status';
  }

  function isEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(value || '').trim());
  }

  function escapeHtml(value) {
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  /* Owner diagnostics. Append ?debug=1 to any URL and form errors show the
   * raw HTTP status and Postgres code on screen as well as in the console.
   * Off by default, so customers only ever see the friendly wording. */
  function debugMode() {
    try {
      return new URLSearchParams(window.location.search).get('debug') === '1';
    } catch (e) {
      return false;
    }
  }

  /** Friendly message for the failures users can actually act on. */
  function friendlyError(err) {
    if (debugMode() && err) {
      var body = err.pgBody;
      if (body && typeof body === 'object') {
        try {
          body = JSON.stringify(body);
        } catch (e) {
          body = String(body);
        }
      }
      return (
        'DEBUG - HTTP ' + (err.status || '?') +
        (err.pgCode ? ' [' + err.pgCode + ']' : '') +
        ' - ' + (err.message || 'no message') +
        (body ? ' | ' + String(body).slice(0, 400) : '')
      );
    }
    if (err && err.status === 401) return 'We could not reach the booking system. Please call us instead.';
    if (err && err.status === 404) return 'The booking system is not set up yet. Please call or email us and we will take your details.';
    if (err && err.status === 429) return 'Too many submissions from this connection. Please wait a moment and try again.';
    return 'Something went wrong sending that. Please try again, or call us and we will take the details by phone.';
  }

  ns.insert = insert;
  ns.insertLead = insertLead;
  ns.select = select;
  ns.SITE = SITE;
  ns.setStatus = setStatus;
  ns.clearStatus = clearStatus;
  ns.isEmail = isEmail;
  ns.escapeHtml = escapeHtml;
  ns.friendlyError = friendlyError;
})(window.OECD);
