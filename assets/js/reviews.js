/* Reviews page: read approved reviews and submit new ones. */
(function () {
  'use strict';

  var api = window.OECD;
  var list = document.querySelector('[data-reviews-list]');
  var form = document.querySelector('[data-review-form]');

  function stars(n) {
    var full = Math.max(0, Math.min(5, parseInt(n, 10) || 0));
    return new Array(full + 1).join('★') + new Array(5 - full + 1).join('☆');
  }

  function fmtDate(value) {
    if (!value) return '';
    var d = new Date(value);
    if (isNaN(d.getTime())) return '';
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  }

  function emptyState(message) {
    return '<div class="empty-state" style="grid-column:1/-1">' + message + '</div>';
  }

  function loadReviews() {
    if (!list) return;

    api
      .select('reviews', 'select=display_name,rating,body,service,created_at&status=eq.approved&order=created_at.desc&limit=24')
      .then(function (rows) {
        if (!rows || !rows.length) {
          list.innerHTML = emptyState(
            'No reviews have been published yet. If we have detailed your vehicle, the form below is where yours goes.'
          );
          return;
        }
        list.innerHTML = rows
          .map(function (r) {
            return (
              '<article class="review">' +
              '<div class="review-stars" aria-label="' + (parseInt(r.rating, 10) || 0) + ' out of 5">' + stars(r.rating) + '</div>' +
              '<p class="review-body">' + api.escapeHtml(r.body) + '</p>' +
              '<p class="review-meta">' +
              api.escapeHtml(r.display_name || 'Customer') +
              (r.service ? ' &middot; ' + api.escapeHtml(r.service) : '') +
              (fmtDate(r.created_at) ? ' &middot; ' + fmtDate(r.created_at) : '') +
              '</p>' +
              '</article>'
            );
          })
          .join('');
      })
      .catch(function () {
        list.innerHTML = emptyState(
          'Reviews could not be loaded right now. Please try again shortly, or call us if you need to reach someone.'
        );
      });
  }

  function wireForm() {
    if (!form) return;
    var status = form.querySelector('[data-status]');
    var button = form.querySelector('button[type="submit"]');

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var data = {
        display_name: form.name.value.trim(),
        email: form.email.value.trim(),
        rating: parseInt(form.rating.value, 10),
        service: form.service.value || null,
        body: form.body.value.trim()
      };

      if (!data.display_name) return api.setStatus(status, 'Enter the name you want published with the review.', 'error');
      if (!api.isEmail(data.email)) return api.setStatus(status, 'Enter a valid email address.', 'error');
      if (!data.rating) return api.setStatus(status, 'Select a rating.', 'error');
      if (data.body.length < 20) return api.setStatus(status, 'Please write at least a sentence or two.', 'error');

      button.disabled = true;
      button.textContent = 'Sending';
      api.clearStatus(status);

      api
        .insert('reviews', data)
        .then(function () {
          form.reset();
          button.textContent = 'Submit Review';
          api.setStatus(
            status,
            'Thank you. Your review has been received and will appear on this page once we have confirmed it against an appointment.',
            'success'
          );
        })
        .catch(function (err) {
          button.disabled = false;
          button.textContent = 'Submit Review';
          api.setStatus(status, api.friendlyError(err), 'error');
        });
    });
  }

  loadReviews();
  wireForm();
})();
