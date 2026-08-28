/* Minimal Supabase REST helper.
 *
 * The site only ever inserts rows and reads approved reviews, so it talks to
 * PostgREST directly with fetch instead of pulling in the full supabase-js
 * bundle. The key below is public by design; what protects the data is Row
 * Level Security, defined in supabase/schema.sql.
 *
 * KEY CHOICE: the newer `sb_publishable_...` key returned HTTP 401 from this
 * project, which means the project does not have the new API key system
 * enabled (or that key was rotated). The legacy anon JWT below is the
 * equivalent public key and is what this project accepts. Both are equally
 * safe to ship; RLS is the actual protection. If you later enable new API
 * keys in the dashboard, swap PUBLISHABLE_KEY back in.
 */
window.OECD = window.OECD || {};

(function (ns) {
  'use strict';

  var URL = 'https://tbqigevoksabizjogvtm.supabase.co';

  // Kept for reference — returned 401 on this project as of Aug 2026.
  // var PUBLISHABLE_KEY = 'sb_publishable_aHlx0Tdu2rhOTBUp3lhkQw_Lv6Awz7a';

  var KEY =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRicWlnZXZva3NhYml6am9ndnRtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAwNjQ3NTUsImV4cCI6MjA5NTY0MDc1NX0.2jK6OVrl3Mdw_xj-Z6G9QsfvZxxv28z8nriLYsJYvFw';

  function headers(extra) {
    var h = {
      apikey: KEY,
      Authorization: 'Bearer ' + KEY,
      'Content-Type': 'application/json'
    };
    for (var k in extra) if (Object.prototype.hasOwnProperty.call(extra, k)) h[k] = extra[k];
    return h;
  }

  /** Insert one row into a table. Resolves with the inserted row. */
  function insert(table, row) {
    return fetch(URL + '/rest/v1/' + table, {
      method: 'POST',
      headers: headers({ Prefer: 'return=representation' }),
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
          // Customers see a friendly string; whoever is debugging needs the
          // real status and Postgres message, so surface it in the console.
          if (window.console && console.error) {
            console.error(
              '[OECD] Supabase insert into "' + table + '" failed: HTTP ' + res.status + ' - ' + message,
              data || text
            );
          }
          throw err;
        }
        return Array.isArray(data) ? data[0] : data;
      });
    });
  }

  /** Select rows. `query` is a PostgREST query string, e.g. "select=*&order=id". */
  function select(table, query) {
    return fetch(URL + '/rest/v1/' + table + '?' + query, {
      method: 'GET',
      headers: headers()
    }).then(function (res) {
      if (!res.ok) {
        var err = new Error('Request failed (' + res.status + ')');
        err.status = res.status;
        throw err;
      }
      return res.json();
    });
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

  /** Friendly message for the failures users can actually act on. */
  function friendlyError(err) {
    if (err && err.status === 401) return 'We could not reach the booking system. Please call us instead.';
    if (err && err.status === 404) return 'The booking system is not set up yet. Please call or email us and we will take your details.';
    if (err && err.status === 429) return 'Too many submissions from this connection. Please wait a moment and try again.';
    return 'Something went wrong sending that. Please try again, or call us and we will take the details by phone.';
  }

  ns.insert = insert;
  ns.select = select;
  ns.setStatus = setStatus;
  ns.clearStatus = clearStatus;
  ns.isEmail = isEmail;
  ns.escapeHtml = escapeHtml;
  ns.friendlyError = friendlyError;
})(window.OECD);
