/* Service-intent popup.
 *
 * Appears once, five seconds in, asking which service the visitor needs. It is
 * a lightweight front door to the booking wizard: choosing an option sends
 * them to /?service=<slug>#book, which opens the wizard with that question
 * already answered.
 *
 * It deliberately does NOT appear when:
 *   - the visitor already answered it (dismissed or chose), for 30 days
 *   - they arrived from a "Book <service>" link, so the question is answered
 *   - the booking wizard is already on screen, which would be absurd
 *   - the visitor prefers reduced motion and is mid-scroll (still shows, but
 *     without the animation)
 */
(function () {
  'use strict';

  var STORAGE_KEY = 'oecd_intent_popup';
  var DELAY_MS = 5000;
  var REMEMBER_DAYS = 30;

  /* Already answered? Storage can throw in private windows, so every access
   * is guarded and a failure simply means the popup behaves as if unseen. */
  function seenRecently() {
    try {
      var raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return false;
      return Date.now() - parseInt(raw, 10) < REMEMBER_DAYS * 864e5;
    } catch (e) {
      return false;
    }
  }

  function remember() {
    try {
      window.localStorage.setItem(STORAGE_KEY, String(Date.now()));
    } catch (e) {
      /* Nothing to do; the popup simply may appear again next visit. */
    }
  }

  if (seenRecently()) return;

  // Arrived from a Book Now link: the question is already answered.
  try {
    if (new URLSearchParams(window.location.search).get('service')) return;
  } catch (e) {
    /* Older browser; continue. */
  }

  /* Option list, embedded on every page by src/templates/layout.js. */
  var services = (function () {
    var el = document.querySelector('[data-popup-services]');
    if (!el) return [];
    try {
      var parsed = JSON.parse(el.textContent);
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      return [];
    }
  })();

  if (!services.length) return;

  var lastFocused = null;
  var root = null;

  function close(answered) {
    if (!root) return;
    remember();
    root.classList.remove('is-open');
    document.body.style.overflow = '';
    document.body.style.paddingRight = '';
    document.removeEventListener('keydown', onKeydown);
    var el = root;
    window.setTimeout(function () {
      if (el && el.parentNode) el.parentNode.removeChild(el);
    }, 200);
    root = null;
    if (!answered && lastFocused && lastFocused.focus) lastFocused.focus();
  }

  function onKeydown(e) {
    if (e.key === 'Escape') {
      close(false);
      return;
    }
    // Keep focus inside the dialog while it is open.
    if (e.key === 'Tab' && root) {
      var f = root.querySelectorAll('a[href], button');
      if (!f.length) return;
      var first = f[0];
      var last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  }

  function build() {
    // Do not interrupt someone already looking at the wizard.
    var wizard = document.querySelector('[data-booking-wizard]');
    if (wizard) {
      var r = wizard.getBoundingClientRect();
      if (r.top < window.innerHeight && r.bottom > 0) return;
    }

    lastFocused = document.activeElement;

    root = document.createElement('div');
    root.className = 'intent-popup';
    root.innerHTML =
      '<div class="intent-backdrop" data-close></div>' +
      '<div class="intent-dialog" role="dialog" aria-modal="true" aria-labelledby="intent-heading">' +
      '<button class="intent-close" type="button" data-close aria-label="Close">&times;</button>' +
      '<p class="eyebrow">Mobile Detailing In Ocala</p>' +
      '<h2 id="intent-heading">What mobile detailing services do you need?</h2>' +
      '<p class="intent-sub">Pick one and we will take you straight to the booking form with it already selected. Takes about two minutes.</p>' +
      '<div class="intent-grid">' +
      services
        .map(function (s) {
          return (
            '<a class="intent-option" href="/?service=' + s.value + '#book" data-answer>' +
            '<span class="intent-option-title">' + s.title + '</span>' +
            '<span class="intent-option-price">' + s.price + '</span>' +
            '</a>'
          );
        })
        .join('') +
      '</div>' +
      '<button class="intent-dismiss" type="button" data-close>I am just browsing</button>' +
      '</div>';

    document.body.appendChild(root);
    /* Lock the page behind the dialog. Removing the scrollbar would shift the
     * layout sideways, so pad the body by exactly its width. */
    var barWidth = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = 'hidden';
    if (barWidth > 0) document.body.style.paddingRight = barWidth + 'px';

    root.addEventListener('click', function (e) {
      if (e.target.closest('[data-answer]')) {
        remember();
        return; // let the link navigate
      }
      if (e.target.closest('[data-close]')) {
        e.preventDefault();
        close(false);
      }
    });

    document.addEventListener('keydown', onKeydown);

    // Next frame, so the opening transition actually runs.
    window.requestAnimationFrame(function () {
      root.classList.add('is-open');
      var first = root.querySelector('.intent-option');
      if (first) first.focus();
    });
  }

  window.setTimeout(build, DELAY_MS);
})();
