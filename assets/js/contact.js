/* Contact page message form. */
(function () {
  'use strict';

  var api = window.OECD;
  var form = document.querySelector('[data-contact-form]');
  if (!form) return;

  var status = form.querySelector('[data-status]');
  var button = form.querySelector('button[type="submit"]');

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    var data = {
      name: form.name.value.trim(),
      email: form.email.value.trim(),
      phone: form.phone.value.trim() || null,
      subject: form.subject.value,
      message: form.message.value.trim(),
      source_page: window.location.pathname
    };

    if (!data.name) return api.setStatus(status, 'Enter your name.', 'error');
    if (!api.isEmail(data.email)) return api.setStatus(status, 'Enter a valid email address.', 'error');
    if (!data.subject) return api.setStatus(status, 'Choose a subject.', 'error');
    if (data.message.length < 10) return api.setStatus(status, 'Please add a little more detail to your message.', 'error');

    button.disabled = true;
    button.textContent = 'Sending';
    api.clearStatus(status);

    api
      .insert('contact_messages', data)
      .then(function () {
        form.reset();
        button.textContent = 'Send Message';
        api.setStatus(status, 'Message sent. We answer during business hours, usually the same business day.', 'success');
      })
      .catch(function (err) {
        button.disabled = false;
        button.textContent = 'Send Message';
        api.setStatus(status, api.friendlyError(err), 'error');
      });
  });
})();
