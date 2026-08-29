/* Booking wizard.
 *
 * Five steps: service, vehicle, location, contact, review. On submit the
 * request is written to the shared `leads` table in Supabase, tagged to this
 * site. Arriving from a "Book <service>" link answers the first question and
 * opens the wizard on the vehicle step.
 */
(function () {
  'use strict';

  var host = document.querySelector('[data-booking-wizard]');
  if (!host) return;

  var api = window.OECD;

  // Contact details come from the markup (rendered from src/data/site.js) so
  // this file never carries its own copy of the phone number.
  var PHONE = host.getAttribute('data-phone') || '';
  var PHONE_HREF = host.getAttribute('data-phone-href') || '';

  /* The service list is generated from src/data/services.js at build time and
   * embedded as JSON, so adding a service to the site adds it here too. This
   * file previously carried its own hardcoded copy, which silently went stale
   * every time a new service page was created. */
  var ALL_SERVICES = (function () {
    var el = document.querySelector('[data-booking-services]');
    if (!el) return [];
    try {
      var parsed = JSON.parse(el.textContent);
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      if (window.console && console.error) {
        console.error('[OECD] Could not parse the booking service list.', e);
      }
      return [];
    }
  })();

  // Without a service list the first step would render empty and the customer
  // could never advance, so fail visibly with a way to reach us instead.
  if (!ALL_SERVICES.length) {
    host.innerHTML =
      '<div class="callout" style="margin-top:0">' +
      '<h3>Online Booking Is Temporarily Unavailable</h3>' +
      '<p>Please call us on <a href="tel:' + PHONE_HREF + '">' + PHONE + '</a> and we will take your details directly.</p>' +
      '</div>';
    return;
  }

  var VEHICLE_TYPES = [
    { value: 'sedan', title: 'Sedan or Coupe', desc: 'Standard two or four door passenger car.' },
    { value: 'suv', title: 'SUV or Crossover', desc: 'Two-row SUV, crossover, or small wagon.' },
    { value: 'truck', title: 'Truck', desc: 'Pickup, single or crew cab.' },
    { value: 'oversized', title: 'Three-Row or Van', desc: 'Large SUV, minivan, or oversized vehicle.' }
  ];

  var CONDITIONS = [
    { value: 'maintained', title: 'Well Maintained', desc: 'Detailed within the last six months.' },
    { value: 'average', title: 'Average', desc: 'Normal daily use, nothing extreme.' },
    { value: 'neglected', title: 'Needs A Reset', desc: 'A year or more without a real detail.' },
    { value: 'heavy', title: 'Heavy Soiling', desc: 'Pet hair, spills, job site dust, or odor.' }
  ];

  var WINDOWS = [
    { value: 'morning', title: 'Morning', desc: 'Arrival between 7:00 and 10:00 AM.' },
    { value: 'midday', title: 'Midday', desc: 'Arrival between 10:00 AM and 1:00 PM.' },
    { value: 'afternoon', title: 'Afternoon', desc: 'Arrival between 1:00 and 4:00 PM.' },
    { value: 'flexible', title: 'Flexible', desc: 'Whatever slot opens first.' }
  ];

  var STEPS = ['Service', 'Vehicle', 'Location', 'Contact', 'Review'];

  /* A "Book Now" link elsewhere on the site names its service, e.g.
   * /?service=ceramic-coating#book. That answers the first question, so the
   * wizard opens on the vehicle step with the service already chosen; the
   * progress bar marks Service complete and Back returns to it. Any service
   * on the site is accepted here, not just the four primary ones. An
   * unrecognised value is ignored and the wizard starts normally. */
  var preselected = (function () {
    try {
      var want = new URLSearchParams(window.location.search).get('service');
      if (!want) return '';
      for (var i = 0; i < ALL_SERVICES.length; i++) {
        if (ALL_SERVICES[i].value === want) return want;
      }
    } catch (e) {
      /* URLSearchParams unavailable; fall through to no preselection. */
    }
    return '';
  })();

  /* The first question offers the four primary services. A service deep-linked
   * from its own page is added to that list so the customer can see what they
   * picked and change it, rather than it being silently held off-screen. */
  var SERVICES = ALL_SERVICES.filter(function (s) {
    return s.primary || s.value === preselected;
  });

  var state = {
    // Arriving from a "Book <service>" button means the first question is
    // already answered, so the wizard opens on the vehicle step. The progress
    // bar shows Service as complete and Back returns to it.
    step: preselected ? 1 : 0,
    service: preselected,
    vehicle_type: '',
    vehicle_details: '',
    condition: '',
    address: '',
    city: '',
    postal_code: '',
    preferred_date: '',
    time_window: '',
    name: '',
    email: '',
    phone: '',
    notes: ''
  };

  function choices(name, options, selected) {
    return (
      '<div class="choice-grid">' +
      options
        .map(function (o) {
          return (
            '<label class="choice">' +
            '<input type="radio" name="' + name + '" value="' + o.value + '"' +
            (selected === o.value ? ' checked' : '') + '>' +
            '<span class="choice-title">' + o.title + '</span>' +
            '<span class="choice-desc">' + o.desc + '</span>' +
            (o.price ? '<span class="choice-price">' + o.price + '</span>' : '') +
            '</label>'
          );
        })
        .join('') +
      '</div>'
    );
  }

  function labelFor(list, value) {
    for (var i = 0; i < list.length; i++) if (list[i].value === value) return list[i].title;
    return '';
  }

  function minDate() {
    var d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().slice(0, 10);
  }

  function stepMarkup(i) {
    switch (i) {
      case 0:
        return (
          '<h3>What service do you need?</h3>' +
          '<p class="step-hint">Not sure which one fits? Every option links to a full description on its own page.</p>' +
          choices('service', SERVICES, state.service) +
          '<p class="small muted" style="margin-top:16px">All services are performed at your address. Read more about ' +
          '<a href="/services/mobile-detailing/">how mobile detailing works</a>.</p>'
        );
      case 1:
        return (
          '<h3>Tell us about the vehicle</h3>' +
          '<p class="step-hint">Size and condition drive the labor, so this is what a firm price depends on.</p>' +
          '<p class="field-label">Vehicle type</p>' +
          choices('vehicle_type', VEHICLE_TYPES, state.vehicle_type) +
          '<div class="field" style="margin-top:24px">' +
          '<label for="bk-vehicle">Year, make, and model</label>' +
          '<input type="text" id="bk-vehicle" name="vehicle_details" maxlength="120" placeholder="2021 Honda Civic" value="' +
          api.escapeHtml(state.vehicle_details) + '">' +
          '</div>' +
          '<p class="field-label" style="margin-top:8px">Current condition</p>' +
          choices('condition', CONDITIONS, state.condition)
        );
      case 2:
        return (
          '<h3>Where is the vehicle?</h3>' +
          '<p class="step-hint">We cover Ocala and Marion County. If you are just outside it, send it anyway and we will tell you honestly.</p>' +
          '<div class="field"><label for="bk-address">Street address</label>' +
          '<input type="text" id="bk-address" name="address" maxlength="160" autocomplete="street-address" placeholder="Where the vehicle will be parked" value="' +
          api.escapeHtml(state.address) + '"></div>' +
          '<div class="grid grid-2">' +
          '<div class="field"><label for="bk-city">City</label>' +
          '<input type="text" id="bk-city" name="city" maxlength="80" autocomplete="address-level2" placeholder="Ocala" value="' +
          api.escapeHtml(state.city) + '"></div>' +
          '<div class="field"><label for="bk-zip">ZIP code</label>' +
          '<input type="text" id="bk-zip" name="postal_code" maxlength="10" inputmode="numeric" autocomplete="postal-code" placeholder="34470" value="' +
          api.escapeHtml(state.postal_code) + '"></div>' +
          '</div>' +
          '<div class="field"><label for="bk-date">Preferred date</label>' +
          '<input type="date" id="bk-date" name="preferred_date" min="' + minDate() + '" value="' +
          api.escapeHtml(state.preferred_date) + '">' +
          '<p class="hint">A preference, not a confirmation. We come back with the first realistic slot.</p></div>' +
          '<p class="field-label" style="margin-top:8px">Preferred arrival window</p>' +
          choices('time_window', WINDOWS, state.time_window)
        );
      case 3:
        return (
          '<h3>How do we reach you?</h3>' +
          '<p class="step-hint">We use this to confirm scope, pricing, and an arrival window. Nothing else.</p>' +
          '<div class="field"><label for="bk-name">Full name</label>' +
          '<input type="text" id="bk-name" name="name" maxlength="80" autocomplete="name" value="' +
          api.escapeHtml(state.name) + '"></div>' +
          '<div class="grid grid-2">' +
          '<div class="field"><label for="bk-email">Email</label>' +
          '<input type="email" id="bk-email" name="email" maxlength="140" autocomplete="email" placeholder="you@example.com" value="' +
          api.escapeHtml(state.email) + '"></div>' +
          '<div class="field"><label for="bk-phone">Phone</label>' +
          '<input type="tel" id="bk-phone" name="phone" maxlength="32" autocomplete="tel" placeholder="Best number to reach you" value="' +
          api.escapeHtml(state.phone) + '"></div>' +
          '</div>' +
          '<div class="field"><label for="bk-notes">Anything we should know</label>' +
          '<textarea id="bk-notes" name="notes" maxlength="1500" placeholder="Gate codes, problem areas, pet hair, prior damage, parking restrictions.">' +
          api.escapeHtml(state.notes) + '</textarea></div>'
        );
      default:
        return (
          '<h3>Review and send</h3>' +
          '<p class="step-hint">Check the details below. Submitting sends a request, not a confirmed appointment: we come back to you with firm pricing and an arrival window.</p>' +
          '<ul class="summary-list">' +
          row('Service', labelFor(SERVICES, state.service)) +
          row('Vehicle type', labelFor(VEHICLE_TYPES, state.vehicle_type)) +
          row('Vehicle', state.vehicle_details) +
          row('Condition', labelFor(CONDITIONS, state.condition)) +
          row('Location', [state.address, state.city, state.postal_code].filter(Boolean).join(', ')) +
          row('Preferred date', state.preferred_date) +
          row('Arrival window', labelFor(WINDOWS, state.time_window)) +
          row('Name', state.name) +
          row('Email', state.email) +
          row('Phone', state.phone) +
          row('Notes', state.notes) +
          '</ul>' +
          '<p class="small muted" style="margin-top:16px">By sending you agree to our <a href="/terms/">terms</a> and ' +
          '<a href="/privacy/">privacy policy</a>. Prices shown on this site are estimates, not quotes.</p>'
        );
    }
  }

  function row(key, value) {
    if (!value) return '';
    return '<li><span class="k">' + key + '</span><span class="v">' + api.escapeHtml(value) + '</span></li>';
  }

  var firstRender = true;

  // Keep the top of the wizard visible when a step changes, allowing for the
  // sticky header.
  function scrollToWizard() {
    var header = document.querySelector('.site-header');
    var offset = (header ? header.offsetHeight : 0) + 16;
    var top = host.getBoundingClientRect().top + window.pageYOffset - offset;
    if (window.pageYOffset > top) window.scrollTo({ top: top, behavior: 'smooth' });
  }

  function render() {
    var isLast = state.step === STEPS.length - 1;

    host.innerHTML =
      '<div class="wizard">' +
      '<div class="wizard-head">' +
      '<h2>Book Online</h2>' +
      '<p>Step ' + (state.step + 1) + ' of ' + STEPS.length + '. Takes about two minutes.</p>' +
      '</div>' +
      '<ol class="wizard-progress">' +
      STEPS.map(function (label, i) {
        var cls = i === state.step ? ' class="is-active"' : i < state.step ? ' class="is-done"' : '';
        return '<li' + cls + '>' + (i + 1) + '. ' + label + '</li>';
      }).join('') +
      '</ol>' +
      '<div class="wizard-body">' +
      '<div class="wizard-step is-active">' + stepMarkup(state.step) + '</div>' +
      '<p class="form-status" data-status role="status" aria-live="polite"></p>' +
      '<div class="wizard-nav">' +
      (state.step > 0
        ? '<button type="button" class="btn btn-ghost" data-back>Back</button>'
        : '<span></span>') +
      '<button type="button" class="btn" data-next>' + (isLast ? 'Send Request' : 'Continue') + '</button>' +
      '</div>' +
      '</div>' +
      '</div>';

    wire();

    if (firstRender) {
      firstRender = false;
    } else {
      scrollToWizard();
    }
  }

  function collect() {
    var scope = host;
    var radios = scope.querySelectorAll('input[type="radio"]:checked');
    for (var i = 0; i < radios.length; i++) state[radios[i].name] = radios[i].value;

    var fields = scope.querySelectorAll('input[type="text"], input[type="email"], input[type="tel"], input[type="date"], textarea');
    for (var j = 0; j < fields.length; j++) state[fields[j].name] = fields[j].value.trim();
  }

  function validate() {
    switch (state.step) {
      case 0:
        return state.service ? null : 'Choose the service you need to continue.';
      case 1:
        if (!state.vehicle_type) return 'Select the vehicle type.';
        if (!state.condition) return 'Select the current condition of the vehicle.';
        return null;
      case 2:
        if (!state.city && !state.postal_code) return 'Enter at least a city or a ZIP code so we know where to send a crew.';
        if (!state.time_window) return 'Choose a preferred arrival window.';
        return null;
      case 3:
        if (!state.name) return 'Enter your name.';
        if (!api.isEmail(state.email)) return 'Enter a valid email address.';
        if (!state.phone || state.phone.replace(/\D/g, '').length < 10) return 'Enter a phone number we can reach you on.';
        return null;
      default:
        return null;
    }
  }

  function submit(button, status) {
    button.disabled = true;
    button.textContent = 'Sending';
    api.clearStatus(status);

    var serviceLabel = labelFor(SERVICES, state.service);
    var vehicleLabel = labelFor(VEHICLE_TYPES, state.vehicle_type);
    var conditionLabel = labelFor(CONDITIONS, state.condition);
    var windowLabel = labelFor(WINDOWS, state.time_window);

    // The leads table is shared with other sites, so the human-readable
    // summary goes in `message` (scannable straight from the inbox) while the
    // detail-specific fields go in the cart_items jsonb catch-all.
    var summary = [
      'Booking request: ' + serviceLabel,
      'Vehicle: ' + [vehicleLabel, state.vehicle_details].filter(Boolean).join(' - ') +
        (conditionLabel ? ' (' + conditionLabel + ' condition)' : ''),
      'Preferred: ' + [state.preferred_date, windowLabel].filter(Boolean).join(', '),
      state.notes ? 'Notes: ' + state.notes : ''
    ]
      .filter(Boolean)
      .join('\n');

    api
      .insertLead('booking', {
        name: state.name,
        email: state.email,
        phone: state.phone,
        address: state.address || null,
        city: state.city || null,
        zip: state.postal_code || null,
        service: serviceLabel,
        best_time_to_call: windowLabel || null,
        message: summary,
        cart_items: {
          form: 'booking_wizard',
          service_value: state.service,
          service_label: serviceLabel,
          vehicle_type: state.vehicle_type,
          vehicle_type_label: vehicleLabel,
          vehicle_details: state.vehicle_details || null,
          condition: state.condition,
          condition_label: conditionLabel,
          preferred_date: state.preferred_date || null,
          time_window: state.time_window,
          time_window_label: windowLabel,
          notes: state.notes || null
        }
      })
      .then(function () {
        host.innerHTML =
          '<div class="wizard"><div class="wizard-body">' +
          '<div class="slash-rule"></div>' +
          '<h3>Request Received</h3>' +
          '<p>Thank you, ' + api.escapeHtml(state.name.split(' ')[0]) + '. Your request for ' +
          api.escapeHtml(labelFor(SERVICES, state.service)) +
          ' is in. We review every request by hand and will come back to you with firm pricing and an arrival window, usually the same business day.</p>' +
          '<p>Nothing is confirmed until we have spoken. If you need it sooner, call us on ' +
          '<a href="tel:' + PHONE_HREF + '">' + api.escapeHtml(PHONE) + '</a>.</p>' +
          '<div class="btn-row" style="margin-top:22px">' +
          '<a class="btn btn-ghost" href="/services/">Browse Services</a>' +
          '<a class="btn btn-ghost" href="/blog/">Read The Blog</a>' +
          '</div>' +
          '</div></div>';
        scrollToWizard();
      })
      .catch(function (err) {
        button.disabled = false;
        button.textContent = 'Send Request';
        api.setStatus(status, api.friendlyError(err), 'error');
      });
  }

  function wire() {
    var next = host.querySelector('[data-next]');
    var back = host.querySelector('[data-back]');
    var status = host.querySelector('[data-status]');

    if (back) {
      back.addEventListener('click', function () {
        collect();
        state.step = Math.max(0, state.step - 1);
        render();
      });
    }

    next.addEventListener('click', function () {
      collect();
      var error = validate();
      if (error) {
        api.setStatus(status, error, 'error');
        return;
      }
      api.clearStatus(status);

      if (state.step === STEPS.length - 1) {
        submit(next, status);
        return;
      }
      state.step += 1;
      render();
    });

    // Picking a service on the first step advances immediately.
    if (state.step === 0) {
      var radios = host.querySelectorAll('input[name="service"]');
      for (var i = 0; i < radios.length; i++) {
        radios[i].addEventListener('change', function () {
          api.clearStatus(status);
        });
      }
    }
  }

  render();
})();
