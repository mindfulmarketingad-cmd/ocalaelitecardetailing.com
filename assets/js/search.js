/* Client-side site search over /search-index.json. */
(function () {
  'use strict';

  var api = window.OECD;
  var input = document.querySelector('[data-search-input]');
  var results = document.querySelector('[data-search-results]');
  var count = document.querySelector('[data-search-count]');
  var form = document.querySelector('[data-search-form]');
  if (!input || !results) return;

  var index = [];

  function tokenize(q) {
    return q
      .toLowerCase()
      .split(/[^a-z0-9]+/)
      .filter(function (t) {
        return t.length > 1;
      });
  }

  function score(entry, tokens) {
    var title = (entry.title + ' ' + entry.heading).toLowerCase();
    var haystack = (entry.title + ' ' + entry.heading + ' ' + entry.description + ' ' + entry.keywords).toLowerCase();
    var total = 0;

    for (var i = 0; i < tokens.length; i++) {
      var t = tokens[i];
      if (title.indexOf(t) !== -1) total += 6;
      if (haystack.indexOf(t) !== -1) total += 2;
      else if (tokens.length > 1) total -= 1;
    }
    return total;
  }

  function highlight(text, tokens) {
    var out = api.escapeHtml(text);
    tokens.forEach(function (t) {
      var re = new RegExp('(' + t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'ig');
      out = out.replace(re, '<mark>$1</mark>');
    });
    return out;
  }

  function render(query) {
    var tokens = tokenize(query);

    if (!tokens.length) {
      count.textContent = index.length + ' pages on this site';
      results.innerHTML = index
        .map(function (e) {
          return item(e, []);
        })
        .join('');
      return;
    }

    var matches = index
      .map(function (e) {
        return { entry: e, s: score(e, tokens) };
      })
      .filter(function (m) {
        return m.s > 0;
      })
      .sort(function (a, b) {
        return b.s - a.s;
      });

    count.textContent = matches.length
      ? matches.length + ' result' + (matches.length === 1 ? '' : 's') + ' for "' + query + '"'
      : 'No results for "' + query + '"';

    results.innerHTML = matches.length
      ? matches
          .map(function (m) {
            return item(m.entry, tokens);
          })
          .join('')
      : '<div class="empty-state">Nothing matched that. Try a broader term such as ceramic, interior, or pricing, or ' +
        '<a href="/contact/">ask us directly</a>.</div>';
  }

  function item(e, tokens) {
    return (
      '<article class="result">' +
      '<p class="result-url">' + e.group + ' &middot; ' + api.escapeHtml(e.url) + '</p>' +
      '<h3><a href="' + e.url + '">' + highlight(e.title, tokens) + '</a></h3>' +
      '<p>' + highlight(e.description, tokens) + '</p>' +
      '</article>'
    );
  }

  function debounce(fn, ms) {
    var t;
    return function () {
      var args = arguments;
      clearTimeout(t);
      t = setTimeout(function () {
        fn.apply(null, args);
      }, ms);
    };
  }

  fetch('/search-index.json')
    .then(function (r) {
      return r.json();
    })
    .then(function (data) {
      index = data;

      var initial = new URLSearchParams(window.location.search).get('q') || '';
      if (initial) input.value = initial;
      render(input.value.trim());

      input.addEventListener(
        'input',
        debounce(function () {
          render(input.value.trim());
        }, 120)
      );

      if (form) {
        form.addEventListener('submit', function (e) {
          e.preventDefault();
          render(input.value.trim());
        });
      }
    })
    .catch(function () {
      count.textContent = '';
      results.innerHTML =
        '<div class="empty-state">The search index could not be loaded. Use the <a href="/sitemap/">site map</a> to browse every page instead.</div>';
    });
})();
