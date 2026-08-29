#!/usr/bin/env node
/**
 * Static site generator for ocalaelitecardetailing.com
 *
 * Reads content from src/data, renders every page through src/templates,
 * and writes plain HTML to the repository root so the site can be served
 * from any static host with no runtime.
 *
 *   node build.js
 */

const fs = require('fs');
const path = require('path');

const { page, esc, site } = require('./src/templates/layout');
const { renderBlocks, tocFromBlocks, breadcrumbSchema, pageHead, mediaFrame, faqBlock, faqSchema } = require('./src/templates/blocks');
const { services } = require('./src/data/services');
const { posts } = require('./src/data/blog');
const { photos } = require('./src/data/photos');
const { featuredReviews } = require('./src/data/reviews');
const { areas } = require('./src/data/areas');
const { serviceAreaContent } = require('./src/data/service-areas');
const { costs } = require('./src/data/costs');
const { authors } = require('./src/data/authors');
const legal = require('./src/data/legal');

const ROOT = __dirname;
const written = [];
// Every page that should appear in sitemap.xml, the /sitemap/ page, and search.
const registry = [];

function write(routePath, html, meta) {
  const dir = routePath === '/' ? ROOT : path.join(ROOT, routePath);
  fs.mkdirSync(dir, { recursive: true });
  const file = path.join(dir, 'index.html');
  fs.writeFileSync(file, html);
  written.push(path.relative(ROOT, file));
  if (meta) registry.push({ path: routePath, ...meta });
}

function writeRaw(rel, content) {
  const file = path.join(ROOT, rel);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
  written.push(rel);
}

function fmtDate(iso) {
  return new Date(iso + 'T12:00:00Z').toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC'
  });
}

/* ---------------------------------------------------------------- schema -- */

const businessSchema = {
  '@context': 'https://schema.org',
  '@type': 'AutoDetailing',
  '@id': site.origin + '/#business',
  name: site.name,
  url: site.origin + '/',
  telephone: site.phone,
  email: site.email,
  image: site.origin + '/assets/img/og-image.png',
  logo: site.origin + '/assets/img/logo-mark.svg',
  description:
    'Ocala Elite Car Detailing arranges mobile car detailing across Ocala and Marion County, Florida, including exterior detailing, interior detailing, full packages, and ceramic coating.',
  priceRange: '$$',
  address: {
    '@type': 'PostalAddress',
    addressLocality: site.addressLocality,
    addressRegion: site.addressRegion,
    postalCode: site.postalCode,
    addressCountry: 'US'
  },
  geo: { '@type': 'GeoCoordinates', latitude: site.geo.lat, longitude: site.geo.lng },
  areaServed: site.areaServed.map((a) => ({ '@type': 'City', name: a + ', FL' })),
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: '07:00',
      closes: '19:00'
    },
    { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Saturday'], opens: '08:00', closes: '17:00' }
  ],
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Detailing Services',
    itemListElement: services.map((s) => ({
      '@type': 'Offer',
      itemOffered: { '@type': 'Service', name: s.name, url: `${site.origin}/services/${s.slug}/` }
    }))
  }
};

const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': site.origin + '/#website',
  url: site.origin + '/',
  name: site.name,
  publisher: { '@id': site.origin + '/#business' },
  potentialAction: {
    '@type': 'SearchAction',
    target: { '@type': 'EntryPoint', urlTemplate: `${site.origin}/search/?q={search_term_string}` },
    'query-input': 'required name=search_term_string'
  }
};

/* ------------------------------------------------------------ components -- */

const ctaBand = (heading, copy) => `    <section class="cta-band">
      <div class="wrap">
        <div class="slash-rule" style="margin-left:auto;margin-right:auto"></div>
        <h2>${esc(heading)}</h2>
        <p>${copy}</p>
        <div class="btn-row">
          <a class="btn" href="/#book">Book Online</a>
          <a class="btn btn-ghost" href="tel:${site.phoneHref}">Call ${site.phone}</a>
        </div>
      </div>
    </section>`;

const areaSection = () => `    <section class="section section-alt">
      <div class="wrap">
        <p class="eyebrow">Coverage</p>
        <h2>Where We Work</h2>
        <p style="max-width:720px">We dispatch mobile detailing throughout Ocala and the surrounding Marion County communities. If your address is outside the list below, send it through anyway and we will tell you honestly whether we can cover it.</p>
        <div class="area-list" style="margin-top:24px">
          ${site.areaServed.map((a) => `<span class="tag">${esc(a)}, FL</span>`).join('\n          ')}
        </div>
      </div>
    </section>`;

// Cross-links from every page back into the four hubs and the homepage.
const hubLinks = (exclude = '') => {
  const hubs = [
    { href: '/services/', label: 'Services', copy: 'Every detailing package we dispatch, with what each one includes and where it fits.' },
    { href: '/blog/', label: 'Blog', copy: 'Field notes on protecting paint and interiors through a Central Florida year.' },
    { href: '/reviews/', label: 'Reviews', copy: 'Feedback from customers, published unedited, and the form to leave your own.' },
    { href: '/search/', label: 'Search', copy: 'Search every page on this site by service, question, or keyword.' },
    { href: '/service-areas/', label: 'Service Areas', copy: 'The towns we cover, what each one does to a vehicle, and every service available there.' },
    { href: '/costs/', label: 'Costs', copy: 'What every service starts at, what pushes the price up, and what is not included.' }
  ].filter((h) => h.href !== exclude);

  return `    <section class="section">
      <div class="wrap">
        <p class="eyebrow">Keep Reading</p>
        <h2>Explore The Site</h2>
        <div class="grid grid-${hubs.length % 4 === 0 ? '4' : '3'}" style="margin-top:30px">
          ${hubs
            .map(
              (h) => `<a class="card" href="${h.href}">
            <h3>${h.label}</h3>
            <p>${h.copy}</p>
            <span class="card-link">Open ${h.label}</span>
          </a>`
            )
            .join('\n          ')}
        </div>
      </div>
    </section>`;
};

/**
 * Service options for the booking wizard, generated from src/data/services.js.
 * The wizard used to carry its own hardcoded copy of this list, which silently
 * fell out of date every time a service was added.
 */
function bookingServicesJson() {
  const payload = services.map((s) => ({
    value: s.slug,
    title: s.name,
    desc: s.summary.split('. ')[0] + '.',
    price: 'From ' + s.priceFrom,
    href: `/services/${s.slug}/`
  }));
  // Escaped so the JSON can never terminate the surrounding script element.
  return JSON.stringify(payload).replace(/</g, '\\u003c');
}

/* ------------------------------------------------------------------ home -- */

// H1 stays a readable headline; the title tag is the keyword-heavy string set
// separately below, since the two no longer need to match word for word.
const HOME_H1 = 'Best Ocala Elite Car Detailing - Find Top-Rated Mobile Detailing Near You';
const HOME_TITLE =
  'Mobile Detailing Ocala | Mobile Car Detailing & Ceramic Coating | OECD Ocala Car Details Mobile Detailing';
const HOME_DESC =
  'Mobile car detailing in Ocala, FL. Exterior, interior, full packages, ceramic coating and more, performed at your home or office. Licensed and insured.';

function buildHome() {
  const serviceCards = services
    .map(
      (s, i) => `<article class="card">
            <span class="card-index">${String(i + 1).padStart(2, '0')}</span>
            <h3>${esc(s.name)}</h3>
            <p>${esc(s.summary)}</p>
            <div class="card-meta"><span>From ${esc(s.priceFrom)}</span><span>${esc(s.duration)}</span></div>
            <a class="card-link" href="/services/${s.slug}/">${esc(s.name)} Details</a>
          </article>`
    )
    .join('\n          ');

  const latestPosts = posts
    .slice()
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 3)
    .map(
      (p) => `<a class="card" href="/blog/${p.slug}/">
            <span class="card-index">${esc(p.category)}</span>
            <h3>${esc(p.title)}</h3>
            <p>${esc(p.excerpt)}</p>
            <div class="card-meta"><span>${fmtDate(p.date)}</span><span>${esc(p.readTime)}</span></div>
          </a>`
    )
    .join('\n          ');

  const homeFaqs = [
    {
      q: 'What areas does Ocala Elite Car Detailing cover?',
      a: 'We dispatch across Ocala and Marion County, including Belleview, Silver Springs, Dunnellon, Summerfield, Marion Oaks, Ocklawaha, Anthony, Citra, Reddick, and The Villages. Addresses outside that ring are quoted case by case.'
    },
    {
      q: 'Do I need to be home during the appointment?',
      a: 'No. Most customers hand over the keys and carry on with the day. We do ask that you are reachable by phone in case a question comes up about scope or access.'
    },
    {
      q: 'How much does mobile detailing cost in Ocala?',
      a: 'Interior and exterior detailing both start at $199, the full package starts at $299, and ceramic coating starts at $999. Final pricing depends on vehicle size and condition and is confirmed before work begins.'
    },
    {
      q: 'How long does an appointment take?',
      a: 'A single-service detail runs two to five hours. A full package is usually a five to eight hour job. Ceramic coating with paint correction is scheduled across one to three days.'
    },
    {
      q: 'Do you bring your own water and power?',
      a: 'Yes. Every mobile unit is self-contained with a water tank and generator, so no hookup at your property is required.'
    }
  ];

  const body = `    <section class="hero">
      <div class="wrap">
        <div class="hero-grid">
          <div class="hero-copy">
            <p class="eyebrow">Ocala &amp; Marion County, Florida</p>
            <h1>${esc(HOME_H1)}</h1>
            <p class="hero-lead">We are Ocala Elite Car Detailing. We offer mobile car detailing services for the Ocala, Florida area, bringing water, power, and professional-grade product to your driveway so your vehicle is restored where it already sits.</p>
            <div class="btn-row">
              <a class="btn" href="#book">Book Online</a>
              <a class="btn btn-ghost" href="/services/">View Services</a>
            </div>
            <div class="hero-stats">
              <div class="hero-stat"><strong>Fully Mobile</strong><span>We come to you</span></div>
              <div class="hero-stat"><strong>24/7</strong><span>Online booking</span></div>
              <div class="hero-stat"><strong>Licensed &amp; Insured</strong><span>Fully covered</span></div>
            </div>
          </div>
          <div class="hero-media">
            ${mediaFrame('banner', { loading: 'eager', sizes: '(max-width: 900px) 90vw, 420px', parallax: 0.1 })}
            <div class="hero-badge">
              <strong>Finished On Site</strong>
              <span>Decontaminated, corrected where needed, and protected in your own driveway.</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="section section-alt" id="book">
      <div class="wrap wrap-narrow">
        <p class="eyebrow">Book Online</p>
        <h2>Start Your Booking</h2>
        <p>Four short steps. Tell us the service, the vehicle, where it is, and how to reach you. We confirm availability and firm pricing before anything is scheduled.</p>
        <div style="margin-top:30px">
          <div id="booking-wizard" data-booking-wizard data-phone="${site.phone}" data-phone-href="${site.phoneHref}"></div>
          <script type="application/json" data-booking-services>${bookingServicesJson()}</script>
          <noscript>
            <div class="callout" style="margin-top:0">
              <h3>Booking Needs JavaScript</h3>
              <p>The booking wizard runs in your browser. With JavaScript turned off, call us on <a href="tel:${site.phoneHref}">${site.phone}</a> or email <a href="mailto:${site.email}">${site.email}</a> and we will take your details directly.</p>
            </div>
          </noscript>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="wrap">
        <div class="split">
          <div class="split-copy">
            <p class="eyebrow">Who We Are</p>
            <h2>Detailing Without The Drop-Off</h2>
            <p>Ocala Elite Car Detailing exists to solve a specific problem: getting professional detailing done without surrendering half a weekend to it. You tell us what the vehicle needs, we confirm scope and price, and a vetted mobile operator handles the work at your home, your office, or wherever the vehicle happens to sit.</p>
            <p>Florida is hard on vehicles. Ultraviolet load here is among the highest in the country, summer storms leave mineral-heavy water standing on horizontal panels, sprinkler overspray etches paint, and love bug season arrives twice a year with acidic residue that starts working into clear coat within days. A vehicle maintained on a northern schedule falls behind fast in Marion County.</p>
            <p>Everything we dispatch is built around that reality: decontamination before protection, safe wash technique that does not introduce new marring, and products chosen for heat and humidity rather than for a showroom in a mild climate.</p>
            <div class="btn-row" style="margin-top:26px">
              <a class="btn btn-ghost btn-sm" href="/about/">About Ocala Elite</a>
              <a class="btn btn-ghost btn-sm" href="/contact/">Contact Us</a>
            </div>
          </div>
          <div class="split-media">
            ${mediaFrame('foam', { className: 'is-tall' })}
            <p class="media-caption">Foam cannon pre-soak, on site</p>
          </div>
        </div>
      </div>
    </section>

    <section class="section section-alt">
      <div class="wrap">
        <p class="eyebrow">The Difference</p>
        <h2>Why You Should Choose Ocala Elite Car Detailing</h2>
        <div class="grid grid-4" style="margin-top:30px">
          <div class="card">
            <h3>24/7 Online Booking</h3>
            <p>Request a service any hour of the day through the booking wizard. We confirm scope and pricing and get back to you promptly during business hours.</p>
          </div>
          <div class="card">
            <h3>Fully Mobile</h3>
            <p>Water, power, and every product travel with the crew. Your vehicle is detailed in your driveway or office lot, not dropped off and picked up later.</p>
          </div>
          <div class="card">
            <h3>Licensed And Insured</h3>
            <p>We are licensed and insured, and every operator we dispatch is too. Ask us for details before booking and we will provide them rather than deflect.</p>
          </div>
          <div class="card">
            <h3>Built For Florida</h3>
            <p>Products and intervals chosen for ultraviolet load, humidity, and love bug season, not for a mild climate a product label was written for.</p>
          </div>
        </div>
      </div>
    </section>

    <section class="section" id="services">
      <div class="wrap">
        <p class="eyebrow">What We Do</p>
        <h2>Ocala Elite Car Detailing Services:</h2>
        <p style="max-width:760px">Five services cover almost every request we receive. Each one links through to a full breakdown of what is included, how long it takes, and what it will not do.</p>
        <div class="grid grid-3" style="margin-top:34px">
          ${serviceCards}
        </div>
        <div class="btn-row" style="margin-top:32px">
          <a class="btn btn-ghost" href="/services/">See All Services</a>
        </div>
      </div>
    </section>

    <section class="photo-band">
      <img src="${photos.ferrari.src}" alt="" aria-hidden="true" loading="lazy" width="${photos.ferrari.width}" height="${photos.ferrari.height}" data-parallax="0.18" data-parallax-scale="1.18">
      <div class="wrap">
        <div class="band-copy">
          <p class="eyebrow">The Standard</p>
          <h2>Process, Not Product Claims</h2>
          <p>Any operation can buy a good sealant. What separates a detail that lasts from one that looks good for a week is the order of operations and the discipline to follow it every time.</p>
          <ul class="checklist">
            <li>Wheels and tires first, with dedicated tools that never touch paint</li>
            <li>Pre-soak and foam before anything makes contact with the finish</li>
            <li>Two-bucket wash with grit guards and clean media on every vehicle</li>
            <li>Chemical decontamination for iron and tar, then clay where needed</li>
            <li>Protection applied only to a fully decontaminated surface</li>
            <li>Final inspection under dedicated lighting before handover</li>
          </ul>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="wrap">
        <p class="eyebrow">How It Works</p>
        <h2>From Request To Finished Vehicle</h2>
        <ol class="numbered grid grid-2" style="margin-top:34px">
          <li>
            <h3>Submit Your Request</h3>
            <p>Use the booking wizard above or call us. Tell us the service, the vehicle, and where it is parked.</p>
          </li>
          <li>
            <h3>Scope And Price Confirmed</h3>
            <p>We review the request, ask anything we need to, and confirm a firm price and an arrival window. Nothing is scheduled until you agree to it.</p>
          </li>
          <li>
            <h3>Operator Dispatched</h3>
            <p>A vetted, insured detailing operator arrives in the confirmed window with water, power, and everything the job requires.</p>
          </li>
          <li>
            <h3>Walkaround And Aftercare</h3>
            <p>You inspect the finished vehicle in daylight, we cover aftercare for anything applied, and you tell us if something is not right.</p>
          </li>
        </ol>
      </div>
    </section>

    <section class="section section-alt">
      <div class="wrap">
        <p class="eyebrow">Latest From The Blog</p>
        <h2>Detailing Notes For Florida Drivers</h2>
        <div class="grid grid-3" style="margin-top:30px">
          ${latestPosts}
        </div>
        <div class="btn-row" style="margin-top:30px">
          <a class="btn btn-ghost" href="/blog/">Read The Blog</a>
        </div>
      </div>
    </section>

${areaSection()}

    <section class="section">
      <div class="wrap wrap-narrow">
        <p class="eyebrow">Common Questions</p>
        <h2>Frequently Asked</h2>
        <div style="margin-top:30px">
          ${faqBlock(homeFaqs)}
        </div>
      </div>
    </section>

${hubLinks()}

${ctaBand('Get Your Vehicle Back To Standard', 'Book online in under two minutes, or call and talk it through with a person.')}`;

  write(
    '/',
    page({
      title: HOME_TITLE,
      description: HOME_DESC,
      path: '/',
      body,
      schema: [businessSchema, websiteSchema, faqSchema(homeFaqs)],
      scripts: ['/assets/js/supabase.js', '/assets/js/booking.js', '/assets/js/parallax.js']
    }),
    {
      title: HOME_TITLE,
      description: HOME_DESC,
      label: 'Home',
      group: 'Main',
      priority: '1.0',
      changefreq: 'weekly',
      keywords: 'ocala elite car detailing mobile detailing ocala florida car detailing near me'
    }
  );
}

/* -------------------------------------------------------------- services -- */

function buildServices() {
  const cards = services
    .map(
      (s) => `<a class="card" href="/services/${s.slug}/">
            <div class="card-media"><img src="${photos[s.photo].src}" alt="${esc(photos[s.photo].alt)}" loading="lazy" width="${photos[s.photo].width}" height="${photos[s.photo].height}"></div>
            <h3>${esc(s.name)}</h3>
            <p>${esc(s.summary)}</p>
            <div class="card-meta"><span>From ${esc(s.priceFrom)}</span><span>${esc(s.duration)}</span></div>
            <span class="card-link">View ${esc(s.name)}</span>
          </a>`
    )
    .join('\n          ');

  const rows = services
    .map(
      (s) => `<tr>
              <td><a href="/services/${s.slug}/">${esc(s.name)}</a></td>
              <td>${esc(s.priceFrom)}</td>
              <td>${esc(s.duration)}</td>
            </tr>`
    )
    .join('\n            ');

  const trail = [
    { label: 'Home', href: '/' },
    { label: 'Services', href: '/services/' }
  ];

  const title = 'Car Detailing Services in Ocala FL | Ocala Elite';
  const description =
    'Every detailing service we dispatch across Ocala and Marion County, with what each includes, how long it takes, and what it starts at.';

  const body = `${pageHead({
    trail,
    h1: 'Ocala Elite Car Detailing Services',
    lead:
      'Five services, each with a defined scope and an honest description of what it does and does not do. Pick the one that matches the vehicle, or send us the details and we will tell you which one you actually need.',
    ctas: '<a class="btn" href="/#book">Book Online</a><a class="btn btn-ghost" href="/contact/">Ask A Question</a>'
  })}

    <section class="section">
      <div class="wrap">
        <p class="eyebrow">The Full Menu</p>
        <h2>All Car Detailing Services</h2>
        <div class="grid grid-3" style="margin-top:30px">
          ${cards}
        </div>
      </div>
    </section>

    <section class="section section-alt">
      <div class="wrap">
        <p class="eyebrow">At A Glance</p>
        <h2>Pricing And Time</h2>
        <p style="max-width:720px">Starting prices below are for standard sedans in average condition. Larger vehicles, heavy soiling, pet hair, and paint that needs correction all add labor. A firm number is confirmed after assessment and before work begins.</p>
        <div class="table-scroll" style="margin-top:24px">
          <table>
            <thead><tr><th scope="col">Service</th><th scope="col">Starting At</th><th scope="col">Typical Duration</th></tr></thead>
            <tbody>
            ${rows}
            </tbody>
          </table>
        </div>
        <p class="small muted">Prices shown are estimates for planning, not quotes. See our <a href="/disclaimer/">disclaimer</a> for details.</p>
      </div>
    </section>

    <section class="section">
      <div class="wrap">
        <div class="split is-reverse">
          <div class="split-copy">
            <p class="eyebrow">Choosing</p>
            <h2>Which Service Do You Need?</h2>
            <p>If the paint feels rough after a wash and the cabin is fine, you want <a href="/services/exterior-detailing/">exterior detailing</a>. If the outside is holding up but the interior has taken a year of use, you want <a href="/services/interior-detailing/">interior detailing</a>.</p>
            <p>If the vehicle has gone a long time without attention, is going up for sale, or was just purchased used, take the <a href="/services/full-package/">full package</a> and reset both sides at once.</p>
            <p>If you plan to keep the vehicle for years and want to stop re-applying protection every few months, <a href="/services/ceramic-coating/">ceramic coating</a> is the answer. And whichever you choose, <a href="/services/mobile-detailing/">mobile detailing</a> is how it gets delivered: at your address, on your schedule.</p>
          </div>
          <div class="split-media">
            ${mediaFrame('finished', { className: 'is-tall' })}
            <p class="media-caption">Finished front end after a full package</p>
          </div>
        </div>
      </div>
    </section>

${areaSection()}

${hubLinks('/services/')}

${ctaBand('Ready To Book?', 'Choose your service in the booking wizard and we will confirm the details.')}`;

  write(
    '/services',
    page({
      title,
      description,
      path: '/services/',
      body,
      schema: [
        breadcrumbSchema(site.origin, trail),
        {
          '@context': 'https://schema.org',
          '@type': 'ItemList',
          name: 'Ocala Elite Car Detailing Services',
          itemListElement: services.map((s, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            name: s.name,
            url: `${site.origin}/services/${s.slug}/`
          }))
        }
      ]
    }),
    {
      title,
      description,
      label: 'Services',
      group: 'Services',
      priority: '0.9',
      changefreq: 'monthly',
      keywords: 'services detailing packages pricing ocala'
    }
  );

  services.forEach((s) => buildServicePage(s));
}

function buildServicePage(s) {
  const trail = [
    { label: 'Home', href: '/' },
    { label: 'Services', href: '/services/' },
    { label: s.name, href: `/services/${s.slug}/` }
  ];

  const others = services.filter((o) => o.slug !== s.slug);

  const sections = s.sections
    .map((sec) => {
      const paras = (sec.body || []).map((p) => `<p>${p}</p>`).join('\n        ');
      const list = sec.list ? `<ul class="checklist">${sec.list.map((li) => `<li>${esc(li)}</li>`).join('')}</ul>` : '';
      return `<h2>${esc(sec.h2)}</h2>\n        ${paras}\n        ${list}`;
    })
    .join('\n\n        ');

  const body = `${pageHead({
    trail,
    h1: s.h1,
    lead: esc(s.lead),
    ctas: `<a class="btn" href="/?service=${s.slug}#book">Book ${esc(s.name)}</a><a class="btn btn-ghost" href="tel:${site.phoneHref}">Call ${site.phone}</a>`
  })}

    <section class="section">
      <div class="wrap">
        <div class="split">
          <div class="split-copy prose">
            ${sections}
          </div>
          <div class="split-media">
            ${mediaFrame(s.photo, { className: 'is-tall' })}
            <p class="media-caption">Real ${esc(s.name)} results</p>
            <div class="callout" style="margin-top:26px">
              <h3>Quick Facts</h3>
              <ul class="summary-list" style="margin-top:16px">
                <li><span class="k">Starting At</span><span class="v">${esc(s.priceFrom)}</span></li>
                <li><span class="k">Duration</span><span class="v">${esc(s.duration)}</span></li>
                <li><span class="k">Location</span><span class="v">At your address</span></li>
                <li><span class="k">Coverage</span><span class="v">Ocala &amp; Marion County</span></li>
                <li><span class="k">Credentials</span><span class="v">Licensed &amp; insured</span></li>
              </ul>
              <p class="small muted" style="margin-top:14px;margin-bottom:0">Estimate only. Final price confirmed after assessment.</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    ${
      s.overview
        ? `<section class="section">
      <div class="wrap">
        <p class="eyebrow">Step By Step</p>
        <h2>What To Expect: ${esc(s.name)}</h2>
        <ol class="numbered grid grid-2" style="margin-top:34px">
          ${s.overview
            .map(
              (step) => `<li>
            <h3>${esc(step.title)}</h3>
            <p>${step.body}</p>
            ${step.list ? `<ul class="checklist">${step.list.map((li) => `<li>${esc(li)}</li>`).join('')}</ul>` : ''}
          </li>`
            )
            .join('\n          ')}
        </ol>
      </div>
    </section>`
        : ''
    }

    ${
      s.slug === 'mobile-detailing'
        ? `<section class="section section-alt">
      <div class="wrap">
        <p class="eyebrow">One Delivery Method, Every Service</p>
        <h2>Every Service We Offer Is A Mobile Detailing Service</h2>
        <p style="max-width:760px">Mobile detailing is not one line item alongside the others on this site, it is how all of them are delivered. Ceramic coating, paint correction, interior extraction, and the full package are each performed at your address with the same self-contained setup described above, not just a basic wash-and-vacuum.</p>
        <div class="grid grid-3" style="margin-top:30px">
          ${others
            .map(
              (o) => `<a class="card" href="/services/${o.slug}/">
            <h3>${esc(o.name)}</h3>
            <p>${esc(o.summary)}</p>
            <div class="card-meta"><span>From ${esc(o.priceFrom)}</span><span>${esc(o.duration)}</span></div>
            <span class="card-link">${esc(o.name)} Details</span>
          </a>`
            )
            .join('\n          ')}
        </div>
      </div>
    </section>`
        : ''
    }

    ${
      s.gallery
        ? `<section class="section section-alt">
      <div class="wrap">
        <p class="eyebrow">Before &amp; After</p>
        <h2>More ${esc(s.name)} Results</h2>
        <div class="gallery" style="margin-top:26px">
          ${s.gallery.map((key) => mediaFrame(key, {})).join('\n          ')}
        </div>
      </div>
    </section>`
        : ''
    }

    <section class="section section-alt">
      <div class="wrap wrap-narrow">
        <p class="eyebrow">Questions</p>
        <h2>${esc(s.name)} FAQ</h2>
        <div style="margin-top:28px">
          ${faqBlock(s.faqs)}
        </div>
      </div>
    </section>

    <section class="section">
      <div class="wrap">
        <p class="eyebrow">Related</p>
        <h2>Other Services</h2>
        <div class="grid grid-4" style="margin-top:28px">
          ${others
            .map(
              (o) => `<a class="card" href="/services/${o.slug}/">
            <h3>${esc(o.name)}</h3>
            <p class="small">${esc(o.summary.split('. ')[0])}.</p>
            <span class="card-link">Details</span>
          </a>`
            )
            .join('\n          ')}
        </div>
        <p style="margin-top:28px"><a href="/services/">Back to all services</a> or return to the <a href="/">Ocala Elite Car Detailing homepage</a>.</p>
      </div>
    </section>

${hubLinks('/services/')}

${ctaBand(`Book ${s.name}`, 'Select this service in the booking wizard and we will confirm availability and firm pricing.')}`;

  write(
    `/services/${s.slug}`,
    page({
      title: s.metaTitle,
      description: s.metaDescription,
      path: `/services/${s.slug}/`,
      current: '/services/',
      body,
      schema: [
        breadcrumbSchema(site.origin, trail),
        {
          '@context': 'https://schema.org',
          '@type': 'Service',
          name: s.name,
          serviceType: s.name,
          url: `${site.origin}/services/${s.slug}/`,
          description: s.metaDescription,
          provider: { '@id': site.origin + '/#business' },
          areaServed: site.areaServed.map((a) => ({ '@type': 'City', name: a + ', FL' })),
          offers: {
            '@type': 'Offer',
            priceCurrency: 'USD',
            price: s.priceFrom.replace(/[^0-9.]/g, ''),
            priceSpecification: {
              '@type': 'PriceSpecification',
              minPrice: s.priceFrom.replace(/[^0-9.]/g, ''),
              priceCurrency: 'USD',
              valueAddedTaxIncluded: false
            },
            availability: 'https://schema.org/InStock'
          }
        },
        faqSchema(s.faqs)
      ]
    }),
    {
      title: s.metaTitle,
      description: s.metaDescription,
      label: s.name,
      group: 'Services',
      priority: '0.8',
      changefreq: 'monthly',
      keywords: `${s.name} ${s.slug.replace(/-/g, ' ')} ocala detailing`
    }
  );
}

/* ------------------------------------------------------------------ blog -- */

function buildBlog() {
  const sorted = posts.slice().sort((a, b) => b.date.localeCompare(a.date));

  const cards = sorted
    .map(
      (p) => `<a class="card" href="/blog/${p.slug}/">
            <div class="card-media"><img src="${photos[p.photo].src}" alt="${esc(photos[p.photo].alt)}" loading="lazy" width="${photos[p.photo].width}" height="${photos[p.photo].height}"></div>
            <span class="card-index">${esc(p.category)}</span>
            <h3>${esc(p.title)}</h3>
            <p>${esc(p.excerpt)}</p>
            <div class="card-meta"><span>${esc(authorBySlug(p.author).name)}</span><span>${fmtDate(p.date)}</span><span>${esc(p.readTime)}</span></div>
            <span class="card-link">Read Article</span>
          </a>`
    )
    .join('\n          ');

  const trail = [
    { label: 'Home', href: '/' },
    { label: 'Blog', href: '/blog/' }
  ];

  const title = 'Car Detailing Blog | Ocala Elite Car Detailing';
  const description =
    'Practical detailing guidance for Ocala drivers: maintenance intervals, coating versus wax, love bug damage, and what to expect from an appointment.';

  const body = `${pageHead({
    trail,
    h1: 'The Ocala Elite Detailing Blog',
    lead:
      'Field notes on keeping paint and interiors alive through a Central Florida year. No filler, no product hype, and no advice we would not give a customer standing in their own driveway.'
  })}

    <section class="section">
      <div class="wrap">
        <p class="eyebrow">Articles</p>
        <h2>Detailing Guides For Florida Drivers</h2>
        <div class="grid grid-3" style="margin-top:30px">
          ${cards}
        </div>
      </div>
    </section>

    <section class="section section-alt">
      <div class="wrap">
        <div class="split">
          <div class="split-copy">
            <p class="eyebrow">Why We Write These</p>
            <h2>Informed Customers Get Better Results</h2>
            <p>Most of the damage we see on Ocala vehicles was preventable, and most of it comes from advice that works fine somewhere else. Northern detailing intervals, dryer sheets for bug removal, weekly trips through a brush tunnel, dish soap on a coated car: each one costs a finish years of life.</p>
            <p>These articles cover what we actually tell customers. If a topic here answers your question well enough that you decide not to book, that is a fine outcome.</p>
            <div class="btn-row" style="margin-top:24px">
              <a class="btn btn-ghost btn-sm" href="/services/">Browse Services</a>
              <a class="btn btn-ghost btn-sm" href="/search/">Search The Site</a>
            </div>
          </div>
          <div class="split-media">
            ${mediaFrame('wheel', { className: 'is-tall' })}
            <p class="media-caption">Dedicated wheel tools, every vehicle</p>
          </div>
        </div>
      </div>
    </section>

${hubLinks('/blog/')}

${ctaBand('Stop Reading, Start Booking', 'Four questions in the booking wizard and we will take it from there.')}`;

  write(
    '/blog',
    page({
      title,
      description,
      path: '/blog/',
      body,
      schema: [
        breadcrumbSchema(site.origin, trail),
        {
          '@context': 'https://schema.org',
          '@type': 'Blog',
          name: 'Ocala Elite Car Detailing Blog',
          url: site.origin + '/blog/',
          publisher: { '@id': site.origin + '/#business' },
          blogPost: sorted.map((p) => ({
            '@type': 'BlogPosting',
            headline: p.title,
            url: `${site.origin}/blog/${p.slug}/`,
            datePublished: p.date
          }))
        }
      ]
    }),
    {
      title,
      description,
      label: 'Blog',
      group: 'Blog',
      priority: '0.9',
      changefreq: 'weekly',
      keywords: 'blog articles detailing advice florida'
    }
  );

  sorted.forEach((p, i) => buildPostPage(p, sorted[i + 1], sorted[i - 1]));
}

function buildPostPage(p, older, newer) {
  const trail = [
    { label: 'Home', href: '/' },
    { label: 'Blog', href: '/blog/' },
    { label: p.title, href: `/blog/${p.slug}/` }
  ];

  const related = posts.filter((o) => o.slug !== p.slug).slice(0, 3);
  const toc = tocFromBlocks(p.body);
  const author = authorBySlug(p.author);

  const nav = [];
  if (older) nav.push(`<a class="btn btn-ghost btn-sm" href="/blog/${older.slug}/">Previous: ${esc(older.title)}</a>`);
  if (newer) nav.push(`<a class="btn btn-ghost btn-sm" href="/blog/${newer.slug}/">Next: ${esc(newer.title)}</a>`);

  const body = `${pageHead({
    trail,
    h1: p.title,
    lead: `<span class="muted">By <a href="/author/${author.slug}/">${esc(author.name)}</a> &middot; ${fmtDate(p.date)} &middot; ${esc(p.readTime)} &middot; ${esc(p.category)}</span>`,
    ctas: `<a class="btn" href="/#book">Book Online</a><a class="btn btn-ghost" href="tel:${site.phoneHref}">Call ${site.phone}</a>`
  })}

    <section class="section">
      <div class="wrap wrap-narrow">
        ${mediaFrame(p.photo, { className: 'is-wide', loading: 'eager' })}

        <nav class="toc" aria-label="Table of contents">
          <p class="toc-label">In This Article</p>
          <ol>
            ${toc.map((item) => `<li><a href="#${item.id}">${esc(item.text)}</a></li>`).join('\n            ')}
          </ol>
        </nav>

        <article class="prose">
          ${renderBlocks(p.body)}
        </article>

        <div class="callout" style="margin-bottom:0">
          <h3>About The Author</h3>
          <p><strong>${esc(author.name)}</strong> &mdash; ${esc(author.role)}. ${esc(author.summary)}</p>
          <div class="btn-row">
            <a class="btn btn-ghost btn-sm" href="/author/${author.slug}/">More From ${esc(author.name)}</a>
          </div>
        </div>

        <div class="callout">
          <h3>Want This Handled For You?</h3>
          <p>${esc(p.cta.blurb)}</p>
          <div class="btn-row">
            <a class="btn" href="/#book">Book Online</a>
            <a class="btn btn-ghost" href="${p.cta.href}">${esc(p.cta.label)}</a>
          </div>
        </div>

        ${nav.length ? `<div class="btn-row" style="margin-top:32px">${nav.join('')}</div>` : ''}
      </div>
    </section>

    <section class="section section-alt">
      <div class="wrap">
        <p class="eyebrow">Keep Reading</p>
        <h2>Related Articles</h2>
        <div class="grid grid-3" style="margin-top:28px">
          ${related
            .map(
              (r) => `<a class="card" href="/blog/${r.slug}/">
            <div class="card-media"><img src="${photos[r.photo].src}" alt="${esc(photos[r.photo].alt)}" loading="lazy" width="${photos[r.photo].width}" height="${photos[r.photo].height}"></div>
            <span class="card-index">${esc(r.category)}</span>
            <h3>${esc(r.title)}</h3>
            <p class="small">${esc(r.excerpt)}</p>
          </a>`
            )
            .join('\n          ')}
        </div>
        <p style="margin-top:28px"><a href="/blog/">All articles</a> or back to the <a href="/">homepage</a>.</p>
      </div>
    </section>

${hubLinks('/blog/')}

${ctaBand('Book Your Detail', 'Pick your service in the booking wizard and we will confirm pricing and an arrival window before anything is scheduled.')}`;

  write(
    `/blog/${p.slug}`,
    page({
      title: p.metaTitle,
      description: p.metaDescription,
      path: `/blog/${p.slug}/`,
      current: '/blog/',
      ogType: 'article',
      body,
      schema: [
        breadcrumbSchema(site.origin, trail),
        {
          '@context': 'https://schema.org',
          '@type': 'BlogPosting',
          headline: p.title,
          description: p.metaDescription,
          url: `${site.origin}/blog/${p.slug}/`,
          mainEntityOfPage: { '@type': 'WebPage', '@id': `${site.origin}/blog/${p.slug}/` },
          datePublished: p.date,
          dateModified: p.date,
          articleSection: p.category,
          image: site.origin + '/assets/img/og-image.png',
          author: {
            '@type': 'Person',
            name: author.name,
            url: `${site.origin}/author/${author.slug}/`
          },
          publisher: { '@id': site.origin + '/#business' }
        }
      ]
    }),
    {
      title: p.metaTitle,
      description: p.metaDescription,
      label: p.title,
      group: 'Blog',
      priority: '0.7',
      changefreq: 'yearly',
      keywords: `${p.title} ${p.category} ${p.excerpt}`
    }
  );
}

/* --------------------------------------------------------------- reviews -- */

function buildReviews() {
  const trail = [
    { label: 'Home', href: '/' },
    { label: 'Reviews', href: '/reviews/' }
  ];

  const title = 'Customer Reviews | Ocala Elite Car Detailing';
  const description =
    'Real customer reviews of Ocala Elite Car Detailing, plus a form to submit your own. Published as written, with no editing and no invented testimonials.';

  const featuredCards = featuredReviews
    .map(
      (r) => `<article class="review">
            <div class="card-media"><img src="${photos[r.photo].src}" alt="${esc(photos[r.photo].alt)}" loading="lazy" width="${photos[r.photo].width}" height="${photos[r.photo].height}"></div>
            <div class="review-stars" aria-label="${r.rating} out of 5">${'★'.repeat(r.rating)}${'☆'.repeat(5 - r.rating)}</div>
            <p class="review-body">${esc(r.body)}</p>
            <p class="review-meta">${esc(r.name)} &middot; ${esc(r.service)}</p>
          </article>`
    )
    .join('\n          ');

  const body = `${pageHead({
    trail,
    h1: 'Ocala Elite Car Detailing Reviews',
    lead:
      'Real feedback from real appointments. The reviews below were shared with us on other platforms and reproduced here as written; the form further down collects new ones directly. We do not write our own reviews, and we do not remove one because it is unflattering.'
  })}

    <section class="section">
      <div class="wrap">
        <p class="eyebrow">What Customers Say</p>
        <h2>Featured Reviews</h2>
        <div class="grid grid-3" style="margin-top:30px">
          ${featuredCards}
        </div>
        <p class="small muted" style="margin-top:22px">No reviewer name was included with these when they were shared with us, so each is credited as Verified Customer. Photos shown illustrate the kind of work performed and are not necessarily the reviewer's own vehicle.</p>
      </div>
    </section>

    <section class="section section-alt">
      <div class="wrap">
        <p class="eyebrow">Submitted Directly</p>
        <h2>More From Our Customers</h2>
        <div class="grid grid-2" style="margin-top:30px" id="reviews-list" data-reviews-list>
          <div class="empty-state" style="grid-column:1/-1">Loading reviews.</div>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="wrap wrap-narrow">
        <p class="eyebrow">Your Turn</p>
        <h2>Leave A Review</h2>
        <p>If we detailed your vehicle, tell us how it went. Submissions are checked to confirm they relate to a real appointment before they appear on this page, which usually takes a day or two.</p>
        <form class="stack" style="margin-top:28px" data-review-form novalidate>
          <div class="field">
            <label for="rv-name">Display name</label>
            <input type="text" id="rv-name" name="name" required maxlength="80" autocomplete="name" placeholder="How you want to be credited">
            <p class="hint">A first name and last initial is fine. This is published with your review.</p>
          </div>
          <div class="field">
            <label for="rv-email">Email</label>
            <input type="email" id="rv-email" name="email" required maxlength="140" autocomplete="email" placeholder="you@example.com">
            <p class="hint">Not published. Used only to match your review to an appointment.</p>
          </div>
          <div class="field">
            <label for="rv-rating">Rating</label>
            <select id="rv-rating" name="rating" required>
              <option value="">Select a rating</option>
              <option value="5">5 - Excellent</option>
              <option value="4">4 - Good</option>
              <option value="3">3 - Average</option>
              <option value="2">2 - Poor</option>
              <option value="1">1 - Unacceptable</option>
            </select>
          </div>
          <div class="field">
            <label for="rv-service">Service received</label>
            <select id="rv-service" name="service">
              <option value="">Select a service</option>
              ${services.map((s) => `<option value="${esc(s.name)}">${esc(s.name)}</option>`).join('\n              ')}
            </select>
          </div>
          <div class="field">
            <label for="rv-body">Your review</label>
            <textarea id="rv-body" name="body" required maxlength="2000" placeholder="What was done, how it went, and whether you would book again."></textarea>
          </div>
          <button class="btn" type="submit">Submit Review</button>
          <p class="form-status" data-status role="status" aria-live="polite"></p>
          <p class="small muted">By submitting you agree to our <a href="/terms/">terms</a> and <a href="/privacy/">privacy policy</a>.</p>
        </form>
      </div>
    </section>

    <section class="section section-alt">
      <div class="wrap">
        <div class="split is-reverse">
          <div class="split-copy">
            <p class="eyebrow">Our Position</p>
            <h2>Why There Are No Invented Testimonials Here</h2>
            <p>It is trivial to fill a page with made-up five-star quotes and stock photography, and a large share of local service sites do exactly that. We do not. Every review on this page, featured or submitted directly, came from an actual customer.</p>
            <p>Fabricated reviews are deceptive, and a customer who books on the strength of one has been misled. A review page built on real feedback is worth more over time than one that started full of invented praise and never changed.</p>
            <p>If a job went badly, tell us before you post. We would rather fix it than argue about it in public, and we stop referring work to operators who do not deal with customers fairly.</p>
            <div class="btn-row" style="margin-top:24px">
              <a class="btn btn-ghost btn-sm" href="/contact/">Contact Us Directly</a>
            </div>
          </div>
          <div class="split-media">
            ${mediaFrame('finished', { className: 'is-tall' })}
          </div>
        </div>
      </div>
    </section>

${hubLinks('/reviews/')}

${ctaBand('Book Your Detail', 'Start with the service you need and we will handle the rest.')}`;

  write(
    '/reviews',
    page({
      title,
      description,
      path: '/reviews/',
      body,
      schema: [
        breadcrumbSchema(site.origin, trail),
        {
          '@context': 'https://schema.org',
          '@type': 'LocalBusiness',
          '@id': site.origin + '/#business',
          name: site.name,
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: (
              featuredReviews.reduce((sum, r) => sum + r.rating, 0) / featuredReviews.length
            ).toFixed(1),
            reviewCount: featuredReviews.length,
            bestRating: '5',
            worstRating: '1'
          },
          review: featuredReviews.map((r) => ({
            '@type': 'Review',
            author: { '@type': 'Person', name: r.name },
            reviewRating: { '@type': 'Rating', ratingValue: r.rating, bestRating: '5' },
            reviewBody: r.body
          }))
        }
      ],
      scripts: ['/assets/js/supabase.js', '/assets/js/reviews.js']
    }),
    {
      title,
      description,
      label: 'Reviews',
      group: 'Main',
      priority: '0.8',
      changefreq: 'weekly',
      keywords: 'reviews testimonials customer feedback ratings'
    }
  );
}

/* ---------------------------------------------------------------- search -- */

function buildSearch() {
  const trail = [
    { label: 'Home', href: '/' },
    { label: 'Search', href: '/search/' }
  ];

  const title = 'Search | Ocala Elite Car Detailing';
  const description =
    'Search every page on the Ocala Elite Car Detailing site by service, question, or keyword to find what you need quickly.';

  const body = `${pageHead({
    trail,
    h1: 'Search This Site',
    lead: 'Search across every service page, article, and policy on this site. Results update as you type.'
  })}

    <section class="section">
      <div class="wrap wrap-narrow">
        <form class="search-bar" role="search" data-search-form onsubmit="return false">
          <label class="visually-hidden" for="site-search">Search the site</label>
          <input type="search" id="site-search" name="q" placeholder="Try ceramic coating, love bugs, pricing, pet hair" autocomplete="off" data-search-input>
          <button class="btn" type="submit">Search</button>
        </form>
        <p class="small muted">Popular:
          <a href="/search/?q=ceramic+coating">ceramic coating</a>,
          <a href="/search/?q=interior">interior</a>,
          <a href="/search/?q=pricing">pricing</a>,
          <a href="/search/?q=love+bugs">love bugs</a>,
          <a href="/search/?q=mobile">mobile</a>
        </p>

        <p class="search-count" data-search-count></p>
        <div data-search-results>
          <div class="empty-state">Loading the search index.</div>
        </div>
      </div>
    </section>

${hubLinks('/search/')}

${ctaBand('Cannot Find It?', 'Send us the question directly and we will answer it.')}`;

  write(
    '/search',
    page({
      title,
      description,
      path: '/search/',
      body,
      schema: [breadcrumbSchema(site.origin, trail)],
      scripts: ['/assets/js/supabase.js', '/assets/js/search.js']
    }),
    {
      title,
      description,
      label: 'Search',
      group: 'Main',
      priority: '0.6',
      changefreq: 'monthly',
      keywords: 'search find pages site index'
    }
  );
}

/* ----------------------------------------------------------------- about -- */

function buildAbout() {
  const trail = [
    { label: 'Home', href: '/' },
    { label: 'About', href: '/about/' }
  ];

  const title = 'About Ocala Elite Car Detailing | Who We Are';
  const description =
    'Ocala Elite Car Detailing connects Marion County drivers with vetted mobile detailing operators. How the dispatch model works, and why.';

  const body = `${pageHead({
    trail,
    h1: 'About Ocala Elite Car Detailing',
    lead:
      'We are a booking and dispatch operation for mobile vehicle detailing in Ocala and Marion County. You deal with us; a vetted independent operator does the work at your address.'
  })}

    <section class="section">
      <div class="wrap">
        <div class="split">
          <div class="split-copy prose">
            <h2>How This Actually Works</h2>
            <p>Most detailing websites imply a single shop with a single crew. Ours does not, because that is not how we operate and you deserve to know before you book.</p>
            <p>Ocala Elite Car Detailing handles the front end: intake, scoping, quoting, scheduling, and follow-up. The detailing itself is performed by independent operators working in the Ocala area who meet our standard for equipment, insurance, and process. When you submit a request, we match it to an operator with the right capability and availability for that job.</p>
            <p>The reason this model exists is coverage. A single crew can serve one part of Marion County reliably. A dispatch model can serve Belleview at eight in the morning and Dunnellon at two in the afternoon without either customer waiting a week for an opening.</p>

            <h2>What We Are Responsible For</h2>
            <p>We own the standard, the scoping, and the accountability. If the scope was wrong, we got it wrong. If an operator does not meet the standard described on this site, we want to hear about it and we stop referring work to operators who do not correct it.</p>
            <p>What we do not do is pretend to be something we are not. The operator performing your detail carries their own insurance and is responsible for their own workmanship, and our <a href="/terms/">terms</a> and <a href="/disclaimer/">disclaimer</a> spell out exactly where those lines sit.</p>

            <h2>The Standard We Hold</h2>
            <p>Every operator we dispatch works to the same non-negotiables: wheels first with dedicated tools, pre-soak before contact, two-bucket washing with clean media, decontamination before any protection goes down, and a final inspection under proper lighting rather than a glance in the shade.</p>
            <p>Those rules exist because the alternatives cause damage. A single bucket and a dirty mitt put swirl marks into clear coat. Sealant over contaminated paint fails in weeks. Silicone dressing on a dashboard creates glare that is a genuine safety problem in Florida sun.</p>
          </div>
          <div class="split-media">
            ${mediaFrame('wash', { className: 'is-wide' })}
            <p class="media-caption">Work performed at the customer address</p>
            <div class="callout" style="margin-top:26px">
              <h3>At A Glance</h3>
              <ul class="summary-list" style="margin-top:16px">
                <li><span class="k">Based In</span><span class="v">Ocala, Florida</span></li>
                <li><span class="k">Model</span><span class="v">Booking &amp; dispatch</span></li>
                <li><span class="k">Coverage</span><span class="v">Marion County</span></li>
                <li><span class="k">Service Type</span><span class="v">Fully mobile</span></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="photo-band">
      <img src="${photos.tesla.src}" alt="" aria-hidden="true" loading="lazy" width="${photos.tesla.width}" height="${photos.tesla.height}">
      <div class="wrap">
        <div class="band-copy">
          <p class="eyebrow">Why Ocala</p>
          <h2>Built For This Climate, Not A Catalogue</h2>
          <p>Detailing advice written for a temperate climate does not survive here. Marion County vehicles deal with an extreme ultraviolet load, summer storms that leave mineral-heavy water standing on horizontal panels, sprinkler overspray on anything parked near a lawn, pollen from pine and oak, and two love bug hatches a year that put acidic residue on every leading edge.</p>
          <p>That is the environment every recommendation on this site is written against. When we say a sealant holds four to six months, we mean here, on a vehicle parked outside, in August.</p>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="wrap">
        <p class="eyebrow">What We Will Not Do</p>
        <h2>Straight Answers, Including The Unprofitable Ones</h2>
        <div class="grid grid-3" style="margin-top:30px">
          <div class="card">
            <h3>No Invented Reviews</h3>
            <p>Our <a href="/reviews/">reviews page</a> fills up from real submissions or it stays empty. We do not write testimonials and we do not buy them.</p>
          </div>
          <div class="card">
            <h3>No Surprise Upsells</h3>
            <p>If the vehicle needs more than you booked, you hear about it before work starts, with a price, and you decide.</p>
          </div>
          <div class="card">
            <h3>No Overselling Coatings</h3>
            <p>If a sealant is the better value for how you use the vehicle, we say so, even though the coating pays us more.</p>
          </div>
        </div>
      </div>
    </section>

${areaSection()}

${hubLinks('/about/')}

${ctaBand('Work With Us', 'Book online, or send a question first if you would rather talk it through.')}`;

  write(
    '/about',
    page({
      title,
      description,
      path: '/about/',
      body,
      schema: [
        breadcrumbSchema(site.origin, trail),
        {
          '@context': 'https://schema.org',
          '@type': 'AboutPage',
          name: title,
          url: site.origin + '/about/',
          about: { '@id': site.origin + '/#business' }
        }
      ]
    }),
    {
      title,
      description,
      label: 'About',
      group: 'Main',
      priority: '0.7',
      changefreq: 'yearly',
      keywords: 'about company who we are dispatch model standard'
    }
  );
}

/* --------------------------------------------------------------- contact -- */

function buildContact() {
  const trail = [
    { label: 'Home', href: '/' },
    { label: 'Contact', href: '/contact/' }
  ];

  const title = 'Contact Ocala Elite Car Detailing | Ocala FL';
  const description =
    'Contact Ocala Elite Car Detailing by phone, email, or message form for mobile detailing in Ocala and Marion County, Florida. We respond during business hours.';

  const body = `${pageHead({
    trail,
    h1: 'Contact Ocala Elite Car Detailing',
    lead:
      'Questions about scope, pricing, coverage, or an appointment already on the books. Call during business hours for the fastest answer, or send a message and we will come back to you.'
  })}

    <section class="section">
      <div class="wrap">
        <div class="split">
          <div class="split-copy">
            <p class="eyebrow">Send A Message</p>
            <h2>Message Us</h2>
            <p>This form is for questions. To schedule work, the <a href="/#book">booking wizard</a> collects everything we need in one pass and gets you a firm answer faster.</p>
            <form class="stack" style="margin-top:26px" data-contact-form novalidate>
              <div class="field">
                <label for="ct-name">Name</label>
                <input type="text" id="ct-name" name="name" required maxlength="80" autocomplete="name">
              </div>
              <div class="field">
                <label for="ct-email">Email</label>
                <input type="email" id="ct-email" name="email" required maxlength="140" autocomplete="email">
              </div>
              <div class="field">
                <label for="ct-phone">Phone (optional)</label>
                <input type="tel" id="ct-phone" name="phone" maxlength="32" autocomplete="tel">
              </div>
              <div class="field">
                <label for="ct-subject">Subject</label>
                <select id="ct-subject" name="subject" required>
                  <option value="">Select a subject</option>
                  <option>Service question</option>
                  <option>Pricing question</option>
                  <option>Existing appointment</option>
                  <option>Coverage area</option>
                  <option>Fleet or commercial</option>
                  <option>Operator partnership</option>
                  <option>Something else</option>
                </select>
              </div>
              <div class="field">
                <label for="ct-message">Message</label>
                <textarea id="ct-message" name="message" required maxlength="3000" placeholder="Include the vehicle and your location if the question is about a specific job."></textarea>
              </div>
              <button class="btn" type="submit">Send Message</button>
              <p class="form-status" data-status role="status" aria-live="polite"></p>
              <p class="small muted">By sending you agree to our <a href="/privacy/">privacy policy</a>.</p>
            </form>
          </div>
          <div class="split-media">
            <div class="callout" style="margin-top:0">
              <h3>Direct Contact</h3>
              <ul class="summary-list" style="margin-top:16px">
                <li><span class="k">Phone</span><span class="v"><a href="tel:${site.phoneHref}">${site.phone}</a></span></li>
                <li><span class="k">Email</span><span class="v"><a href="mailto:${site.email}">${site.email}</a></span></li>
                <li><span class="k">Service Area</span><span class="v">Ocala &amp; Marion County, FL</span></li>
              </ul>
            </div>
            <div class="callout">
              <h3>Hours</h3>
              <ul class="summary-list" style="margin-top:16px">
                ${site.hours.map((h) => `<li><span class="k">${esc(h.days)}</span><span class="v">${esc(h.time)}</span></li>`).join('\n                ')}
              </ul>
              <p class="small muted" style="margin-bottom:0">Messages sent outside these hours are answered the next business day.</p>
            </div>
            ${mediaFrame('finished', { className: 'is-wide' })}
          </div>
        </div>
      </div>
    </section>

    <section class="section section-alt">
      <div class="wrap">
        <p class="eyebrow">Before You Write</p>
        <h2>Answers To The Usual Questions</h2>
        <div class="grid grid-2" style="margin-top:28px">
          <div class="card"><h3>Do you cover my address?</h3><p>If you are in Marion County, almost certainly. Send the address and we will confirm rather than guess. See the <a href="/#services">coverage list</a> on the homepage.</p></div>
          <div class="card"><h3>What does it cost?</h3><p>Starting prices are on each <a href="/services/">service page</a>. Firm pricing needs the vehicle and its condition, which the booking wizard collects.</p></div>
          <div class="card"><h3>How soon can you come?</h3><p>Availability moves daily. Submit a request with your preferred window and we will tell you the first realistic slot.</p></div>
          <div class="card"><h3>Are you hiring operators?</h3><p>We add detailing operators who meet our standard. Use the form with the partnership subject and tell us about your setup.</p></div>
        </div>
      </div>
    </section>

${hubLinks()}

${ctaBand('Ready When You Are', 'Skip the back and forth and start the booking wizard.')}`;

  write(
    '/contact',
    page({
      title,
      description,
      path: '/contact/',
      body,
      schema: [
        breadcrumbSchema(site.origin, trail),
        {
          '@context': 'https://schema.org',
          '@type': 'ContactPage',
          name: title,
          url: site.origin + '/contact/',
          mainEntity: { '@id': site.origin + '/#business' }
        }
      ],
      scripts: ['/assets/js/supabase.js', '/assets/js/contact.js']
    }),
    {
      title,
      description,
      label: 'Contact',
      group: 'Main',
      priority: '0.7',
      changefreq: 'yearly',
      keywords: 'contact phone email message hours service area'
    }
  );
}

/* ----------------------------------------------------------------- legal -- */

function buildLegal(doc, slug) {
  const trail = [
    { label: 'Home', href: '/' },
    { label: doc.title, href: `/${slug}/` }
  ];

  const body = `${pageHead({ trail, h1: doc.title, lead: esc(doc.lead) })}

    <section class="section">
      <div class="wrap wrap-narrow">
        <p class="small muted">Effective date: ${legal.effective}</p>
        <article class="prose" style="margin-top:26px">
          ${renderBlocks(doc.body)}
        </article>
        <div class="callout">
          <h3>Related Policies</h3>
          <p>Read this alongside our <a href="/terms/">terms of service</a>, <a href="/privacy/">privacy policy</a>, and <a href="/disclaimer/">disclaimer</a>. Questions go through the <a href="/contact/">contact page</a>.</p>
          <div class="btn-row"><a class="btn btn-ghost btn-sm" href="/">Back To Homepage</a><a class="btn btn-ghost btn-sm" href="/sitemap/">Site Map</a></div>
        </div>
      </div>
    </section>`;

  write(
    `/${slug}`,
    page({
      title: doc.metaTitle,
      description: doc.metaDescription,
      path: `/${slug}/`,
      body,
      schema: [breadcrumbSchema(site.origin, trail)]
    }),
    {
      title: doc.metaTitle,
      description: doc.metaDescription,
      label: doc.title,
      group: 'Legal',
      priority: '0.3',
      changefreq: 'yearly',
      keywords: `${doc.title} policy legal terms`
    }
  );
}

/* --------------------------------------------------------------- sitemap -- */

function buildSitemapPage() {
  const trail = [
    { label: 'Home', href: '/' },
    { label: 'Sitemap', href: '/sitemap/' }
  ];

  // Derived from the registry rather than hardcoded: a hardcoded list silently
  // dropped whole sections from this page as new groups were added, while the
  // XML sitemap kept listing them.
  const preferredOrder = ['Main', 'Services', 'Service Areas', 'Costs', 'Blog', 'Authors', 'Legal'];
  const present = [...new Set(registry.map((r) => r.group))];
  const groups = [
    ...preferredOrder.filter((g) => present.includes(g)),
    ...present.filter((g) => !preferredOrder.includes(g))
  ];
  const cols = groups
    .map((g) => {
      const items = registry.filter((r) => r.group === g);
      if (!items.length) return '';
      return `<div class="sitemap-col">
            <h3>${g}</h3>
            <ul>
              ${items.map((r) => `<li><a href="${r.path === '/' ? '/' : r.path + '/'}">${esc(r.label)}</a></li>`).join('\n              ')}
            </ul>
          </div>`;
    })
    .join('\n          ');

  const title = 'Sitemap | Ocala Elite Car Detailing';
  const description =
    'Every page on ocalaelitecardetailing.com in one list: services, blog articles, reviews, search, contact, and policies.';

  const body = `${pageHead({
    trail,
    h1: 'Site Map',
    lead: 'Every page on this site, grouped. The machine-readable version lives at <a href="/sitemap.xml">/sitemap.xml</a>.'
  })}

    <section class="section">
      <div class="wrap">
        <h2>Every Page On This Site</h2>
        <div class="grid grid-4" style="margin-top:30px">
          ${cols}
        </div>
      </div>
    </section>

    <section class="section section-alt">
      <div class="wrap wrap-narrow">
        <p class="eyebrow">Structure</p>
        <h2>How This Site Is Organised</h2>
        <p>The homepage is the top of the structure. Below it sit four hub pages, and every individual page links back up to its hub and to the homepage.</p>
        <ul class="checklist">
          <li>Home links to all four hubs and to every service</li>
          <li>Services hub links to each of the five individual service pages</li>
          <li>Blog hub links to each individual article</li>
          <li>Reviews and Search are single hub pages with no children</li>
          <li>Every individual page links back to its hub and to the homepage</li>
          <li>Policy pages are reachable from the footer on every page</li>
        </ul>
        <p>That keeps the click depth from the homepage to any page on the site at two.</p>
      </div>
    </section>

${ctaBand('Found What You Needed?', 'Start a booking, or search the site if something is still missing.')}`;

  write(
    '/sitemap',
    page({
      title,
      description,
      path: '/sitemap/',
      body,
      schema: [breadcrumbSchema(site.origin, trail)]
    }),
    {
      title,
      description,
      label: 'Sitemap',
      group: 'Main',
      priority: '0.3',
      changefreq: 'monthly',
      keywords: 'sitemap all pages index structure'
    }
  );
}

function buildSitemapXml() {
  const today = new Date().toISOString().slice(0, 10);
  const urls = registry
    .map((r) => {
      const loc = site.origin + (r.path === '/' ? '/' : r.path + '/');
      return `  <url>
    <loc>${loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${r.changefreq}</changefreq>
    <priority>${r.priority}</priority>
  </url>`;
    })
    .join('\n');

  writeRaw(
    'sitemap.xml',
    '<?xml version="1.0" encoding="UTF-8"?>\n' +
      '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
      urls +
      '\n</urlset>\n'
  );
}

function buildRobots() {
  writeRaw(
    'robots.txt',
    `User-agent: *
Allow: /

Sitemap: ${site.origin}/sitemap.xml
`
  );
}

function buildManifest() {
  writeRaw(
    'site.webmanifest',
    JSON.stringify(
      {
        name: site.name,
        short_name: 'Ocala Elite',
        description: 'Mobile car detailing booking for Ocala and Marion County, Florida.',
        start_url: '/',
        display: 'standalone',
        background_color: '#08080a',
        theme_color: '#08080a',
        icons: [
          { src: '/assets/img/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/assets/img/icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: '/assets/img/favicon.svg', sizes: 'any', type: 'image/svg+xml' }
        ]
      },
      null,
      2
    ) + '\n'
  );
}

function buildSearchIndex() {
  const index = registry.map((r) => ({
    url: r.path === '/' ? '/' : r.path + '/',
    title: r.label,
    heading: r.title,
    description: r.description,
    group: r.group,
    keywords: r.keywords || ''
  }));
  writeRaw('search-index.json', JSON.stringify(index) + '\n');
}

/* ---------------------------------------------------------- service areas -- */

function buildServiceAreas() {
  const trail = [
    { label: 'Home', href: '/' },
    { label: 'Service Areas', href: '/service-areas/' }
  ];

  const title = 'Service Areas | Mobile Car Detailing Across Marion County FL';
  const description =
    'The towns Ocala Elite Car Detailing covers: Ocala, Belleview, and The Villages, Florida. What each area does to a vehicle, and every service available there.';

  const cards = areas
    .map(
      (a) => `<a class="card" href="/service-areas/${a.slug}/">
            <span class="card-index">${esc(a.county)}</span>
            <h3>${esc(a.name)}</h3>
            <p>${esc(a.summary)}</p>
            <span class="card-link">${esc(a.name)} Detailing</span>
          </a>`
    )
    .join('\n          ');

  const body = `${pageHead({
    trail,
    h1: 'Mobile Car Detailing Service Areas',
    lead:
      'We are based in Ocala and run fully mobile across Marion County. Each area below has its own page covering what that place specifically does to a vehicle, and every service we offer there.',
    ctas: `<a class="btn" href="/#book">Book Online</a><a class="btn btn-ghost" href="tel:${site.phoneHref}">Call ${site.phone}</a>`
  })}

    <section class="section">
      <div class="wrap">
        <p class="eyebrow">Where We Work</p>
        <h2>Areas We Cover</h2>
        <div class="grid grid-3" style="margin-top:30px">
          ${cards}
        </div>
      </div>
    </section>

    <section class="section section-alt">
      <div class="wrap">
        <div class="split">
          <div class="split-copy">
            <p class="eyebrow">Why It Is Worth Splitting Out</p>
            <h2>Three Towns, Three Different Problems</h2>
            <p>These places are within half an hour of each other and they wreck vehicles in genuinely different ways. Ocala is iron-bearing road dust and Interstate 75 mileage. Belleview is humidity off Lake Weir and mineral-heavy sprinkler overspray. The Villages is almost pure ultraviolet damage on cars that barely get driven.</p>
            <p>That changes what is actually worth booking. A coating is a defensive necessity on an Ocala commuter and a long-term value play on a garaged Villages car. Interior work in Belleview is a moisture job; in Ocala it is a dust job. Each area page goes through that in detail rather than repeating a generic pitch.</p>
            <div class="btn-row" style="margin-top:24px">
              <a class="btn btn-ghost btn-sm" href="/services/">All Services</a>
              <a class="btn btn-ghost btn-sm" href="/contact/">Ask About Your Address</a>
            </div>
          </div>
          <div class="split-media">
            ${mediaFrame('wash', { className: 'is-wide' })}
            <p class="media-caption">Work performed at the customer address</p>
          </div>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="wrap">
        <p class="eyebrow">Outside These Towns</p>
        <h2>Wider Marion County Coverage</h2>
        <p style="max-width:760px">We regularly work beyond the three areas above, including ${esc(
          site.areaServed.filter((a) => !areas.some((ar) => ar.name === a)).join(', ')
        )}. Those do not have their own pages yet, so send us the address and we will confirm coverage and any travel time before anything is scheduled.</p>
        <div class="btn-row" style="margin-top:26px">
          <a class="btn btn-ghost" href="/contact/">Check Your Address</a>
        </div>
      </div>
    </section>

${hubLinks('/service-areas/')}

${ctaBand('Book In Your Area', 'Pick your service and tell us where the vehicle is. We confirm coverage before scheduling.')}`;

  write(
    '/service-areas',
    page({
      title,
      description,
      path: '/service-areas/',
      body,
      schema: [
        breadcrumbSchema(site.origin, trail),
        {
          '@context': 'https://schema.org',
          '@type': 'ItemList',
          name: 'Service Areas',
          itemListElement: areas.map((a, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            name: a.name + ', FL',
            url: `${site.origin}/service-areas/${a.slug}/`
          }))
        }
      ]
    }),
    {
      title,
      description,
      label: 'Service Areas',
      group: 'Service Areas',
      priority: '0.8',
      changefreq: 'monthly',
      keywords: 'service areas coverage ocala belleview the villages marion county'
    }
  );

  areas.forEach((a) => buildAreaPage(a));
  services.forEach((s) => areas.forEach((a) => buildServiceAreaPage(s, a)));
}

function buildAreaPage(a) {
  const trail = [
    { label: 'Home', href: '/' },
    { label: 'Service Areas', href: '/service-areas/' },
    { label: a.name, href: `/service-areas/${a.slug}/` }
  ];

  const title = `Best Mobile Car Detailing Service in ${a.name} Florida`;
  const h1 = `Mobile Car Detailing Service in ${a.name} Florida`;

  const serviceCards = services
    .map(
      (s) => `<a class="card" href="/services/${s.slug}/${a.slug}-fl/">
            <h3>${esc(s.name)}</h3>
            <p class="small">${esc(serviceAreaContent[s.slug][a.slug].lead)}</p>
            <div class="card-meta"><span>From ${esc(s.priceFrom)}</span><span>${esc(s.duration)}</span></div>
            <span class="card-link">${esc(s.name)} in ${esc(a.name)}</span>
          </a>`
    )
    .join('\n          ');

  const others = areas.filter((o) => o.slug !== a.slug);

  const body = `${pageHead({
    trail,
    h1,
    lead: esc(a.lead),
    ctas: `<a class="btn" href="/#book">Book Online</a><a class="btn btn-ghost" href="tel:${site.phoneHref}">Call ${site.phone}</a>`
  })}

    <section class="section">
      <div class="wrap">
        <div class="split">
          <div class="split-copy prose">
            <h2>Detailing in ${esc(a.name)}</h2>
            ${a.intro.map((para) => `<p>${para}</p>`).join('\n            ')}
            <h2>What This Area Does To A Vehicle</h2>
            <ul class="checklist">${a.localNotes.map((n) => `<li>${esc(n)}</li>`).join('')}</ul>
          </div>
          <div class="split-media">
            ${mediaFrame(a.slug === 'the-villages' ? 'banner' : a.slug === 'belleview' ? 'foam' : 'wheel', {
              className: 'is-tall'
            })}
            <div class="callout" style="margin-top:26px">
              <h3>${esc(a.name)} At A Glance</h3>
              <ul class="summary-list" style="margin-top:16px">
                <li><span class="k">County</span><span class="v">${esc(a.county)}</span></li>
                <li><span class="k">Travel</span><span class="v">${esc(a.travel)}</span></li>
                <li><span class="k">Services</span><span class="v">All ${services.length} available</span></li>
                <li><span class="k">Credentials</span><span class="v">Licensed &amp; insured</span></li>
                <li><span class="k">Location</span><span class="v">At your address</span></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="section section-alt">
      <div class="wrap">
        <p class="eyebrow">Coverage</p>
        <h2>Where In ${esc(a.name)} We Work</h2>
        <p style="max-width:820px">${esc(a.coverage)}</p>
      </div>
    </section>

    <section class="section">
      <div class="wrap">
        <p class="eyebrow">Every Service, Locally</p>
        <h2>Services Available in ${esc(a.name)}</h2>
        <p style="max-width:760px">Each links through to what that service specifically involves here, rather than a generic description.</p>
        <div class="grid grid-3" style="margin-top:30px">
          ${serviceCards}
        </div>
      </div>
    </section>

    <section class="section section-alt">
      <div class="wrap">
        <p class="eyebrow">Nearby</p>
        <h2>Other Areas We Cover</h2>
        <div class="grid grid-2" style="margin-top:28px">
          ${others
            .map(
              (o) => `<a class="card" href="/service-areas/${o.slug}/">
            <h3>${esc(o.name)}</h3>
            <p class="small">${esc(o.summary)}</p>
            <span class="card-link">${esc(o.name)} Detailing</span>
          </a>`
            )
            .join('\n          ')}
        </div>
        <p style="margin-top:28px"><a href="/service-areas/">All service areas</a> or back to the <a href="/">homepage</a>.</p>
      </div>
    </section>

${ctaBand(`Book In ${a.name}`, 'Tell us the service and where the vehicle is parked. We confirm pricing before scheduling.')}`;

  write(
    `/service-areas/${a.slug}`,
    page({
      title,
      description: a.metaDescription,
      path: `/service-areas/${a.slug}/`,
      current: '/service-areas/',
      body,
      schema: [
        breadcrumbSchema(site.origin, trail),
        {
          '@context': 'https://schema.org',
          '@type': 'Service',
          name: `Mobile Car Detailing in ${a.name}, FL`,
          serviceType: 'Auto Detailing',
          url: `${site.origin}/service-areas/${a.slug}/`,
          description: a.metaDescription,
          provider: { '@id': site.origin + '/#business' },
          areaServed: { '@type': 'City', name: `${a.name}, FL` }
        }
      ]
    }),
    {
      title,
      description: a.metaDescription,
      label: a.name,
      group: 'Service Areas',
      priority: '0.7',
      changefreq: 'monthly',
      keywords: `${a.name} florida mobile car detailing ${a.county} ${a.slug}`
    }
  );
}

function buildServiceAreaPage(s, a) {
  const content = serviceAreaContent[s.slug] && serviceAreaContent[s.slug][a.slug];
  // Fail loudly rather than emitting a page that is just the service page with
  // a city name swapped in - that is a doorway page, and Google treats it as one.
  if (!content) {
    throw new Error(
      `Missing unique copy for "${s.slug}" in "${a.slug}". Add it to src/data/service-areas.js before building.`
    );
  }

  const trail = [
    { label: 'Home', href: '/' },
    { label: 'Services', href: '/services/' },
    { label: s.name, href: `/services/${s.slug}/` },
    { label: a.name, href: `/services/${s.slug}/${a.slug}-fl/` }
  ];

  const title = `${s.name} in ${a.name}, FL | Ocala Elite`;
  const h1 = `${s.name} in ${a.name}, Florida`;
  const description = `${s.name} in ${a.name}, FL from ${s.priceFrom}. ${content.lead}`;

  const siblingServices = services.filter((o) => o.slug !== s.slug);
  const otherAreas = areas.filter((o) => o.slug !== a.slug);

  const body = `${pageHead({
    trail,
    h1,
    lead: esc(content.lead),
    ctas: `<a class="btn" href="/?service=${s.slug}#book">Book ${esc(s.name)}</a><a class="btn btn-ghost" href="tel:${site.phoneHref}">Call ${site.phone}</a>`
  })}

    <section class="section">
      <div class="wrap">
        <div class="split">
          <div class="split-copy prose">
            <h2>${esc(s.name)} For ${esc(a.name)} Vehicles</h2>
            ${content.body.map((para) => `<p>${para}</p>`).join('\n            ')}
            <h2>Local Conditions That Drive This</h2>
            <ul class="checklist">${a.localNotes.map((n) => `<li>${esc(n)}</li>`).join('')}</ul>
            <p>Full detail on scope, timing, and what this service will and will not do is on the main <a href="/services/${s.slug}/">${esc(s.name.toLowerCase())} page</a>. Everything described there applies here; this page covers what is different about doing it in ${esc(a.name)}.</p>
          </div>
          <div class="split-media">
            ${mediaFrame(s.photo, { className: 'is-tall' })}
            <p class="media-caption">Real ${esc(s.name)} results</p>
            <div class="callout" style="margin-top:26px">
              <h3>${esc(s.name)} in ${esc(a.name)}</h3>
              <ul class="summary-list" style="margin-top:16px">
                <li><span class="k">Starting At</span><span class="v">${esc(s.priceFrom)}</span></li>
                <li><span class="k">Duration</span><span class="v">${esc(s.duration)}</span></li>
                <li><span class="k">Travel</span><span class="v">${esc(a.travel)}</span></li>
                <li><span class="k">Location</span><span class="v">At your address</span></li>
                <li><span class="k">Credentials</span><span class="v">Licensed &amp; insured</span></li>
              </ul>
              <p class="small muted" style="margin-top:14px;margin-bottom:0">Estimate only. Final price confirmed after assessment.</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    ${
      s.overview
        ? `<section class="section section-alt">
      <div class="wrap">
        <p class="eyebrow">Step By Step</p>
        <h2>What To Expect in ${esc(a.name)}</h2>
        <ol class="numbered grid grid-2" style="margin-top:34px">
          ${s.overview
            .map(
              (step) => `<li>
            <h3>${esc(step.title)}</h3>
            <p>${step.body}</p>
            ${step.list ? `<ul class="checklist">${step.list.map((li) => `<li>${esc(li)}</li>`).join('')}</ul>` : ''}
          </li>`
            )
            .join('\n          ')}
        </ol>
      </div>
    </section>`
        : ''
    }

    <section class="section">
      <div class="wrap">
        <p class="eyebrow">Also in ${esc(a.name)}</p>
        <h2>Other Services We Bring To ${esc(a.name)}</h2>
        <div class="grid grid-4" style="margin-top:28px">
          ${siblingServices
            .map(
              (o) => `<a class="card" href="/services/${o.slug}/${a.slug}-fl/">
            <h3>${esc(o.name)}</h3>
            <p class="small">${esc(serviceAreaContent[o.slug][a.slug].lead)}</p>
            <span class="card-link">Details</span>
          </a>`
            )
            .join('\n          ')}
        </div>
      </div>
    </section>

    <section class="section section-alt">
      <div class="wrap">
        <p class="eyebrow">Same Service, Other Towns</p>
        <h2>${esc(s.name)} Elsewhere In Marion County</h2>
        <div class="grid grid-2" style="margin-top:28px">
          ${otherAreas
            .map(
              (o) => `<a class="card" href="/services/${s.slug}/${o.slug}-fl/">
            <h3>${esc(s.name)} in ${esc(o.name)}</h3>
            <p class="small">${esc(serviceAreaContent[s.slug][o.slug].lead)}</p>
            <span class="card-link">Open</span>
          </a>`
            )
            .join('\n          ')}
        </div>
        <p style="margin-top:28px"><a href="/service-areas/${a.slug}/">All services in ${esc(a.name)}</a>, <a href="/services/${s.slug}/">${esc(s.name)} overview</a>, or <a href="/service-areas/">every service area</a>.</p>
      </div>
    </section>

${ctaBand(`Book ${s.name} in ${a.name}`, 'Select the service in the booking wizard and tell us where the vehicle is parked.')}`;

  write(
    `/services/${s.slug}/${a.slug}-fl`,
    page({
      title,
      description,
      path: `/services/${s.slug}/${a.slug}-fl/`,
      current: '/services/',
      body,
      schema: [
        breadcrumbSchema(site.origin, trail),
        {
          '@context': 'https://schema.org',
          '@type': 'Service',
          name: `${s.name} in ${a.name}, FL`,
          serviceType: s.name,
          url: `${site.origin}/services/${s.slug}/${a.slug}-fl/`,
          description: description,
          provider: { '@id': site.origin + '/#business' },
          areaServed: { '@type': 'City', name: `${a.name}, FL` },
          offers: {
            '@type': 'Offer',
            priceCurrency: 'USD',
            price: s.priceFrom.replace(/[^0-9.]/g, ''),
            availability: 'https://schema.org/InStock'
          }
        }
      ]
    }),
    {
      title,
      description,
      label: `${s.name} in ${a.name}`,
      group: 'Service Areas',
      priority: '0.6',
      changefreq: 'monthly',
      keywords: `${s.name} ${a.name} florida ${s.slug} ${a.slug} mobile detailing near me`
    }
  );
}

/* ----------------------------------------------------------------- costs -- */

/**
 * Estimated tier pricing, derived from the service's own starting price so the
 * two can never disagree. Sedan is the published start; larger classes are
 * uplifted. Clearly labelled as estimates on the page itself.
 */
function costTiers(s) {
  const base = parseFloat(s.priceFrom.replace(/[^0-9.]/g, ''));
  const round = (n) => '$' + Math.round(n / 5) * 5;
  return [
    { label: 'Sedan or coupe', price: s.priceFrom },
    { label: 'SUV or crossover', price: round(base * 1.25) + '+' },
    { label: 'Truck', price: round(base * 1.3) + '+' },
    { label: 'Three-row or van', price: round(base * 1.5) + '+' }
  ];
}

function buildCosts() {
  const trail = [
    { label: 'Home', href: '/' },
    { label: 'Costs', href: '/costs/' }
  ];

  const title = 'Car Detailing Costs in Ocala FL | Prices For Every Service';
  const description =
    'What every detailing service costs in Ocala, FL, what drives each price up or down, and what is not included. Starting prices for all nine services.';

  const rows = services
    .map(
      (s) => `<tr>
              <td><a href="/costs/${s.slug}/">${esc(s.name)}</a></td>
              <td>${esc(s.priceFrom)}</td>
              <td>${esc(s.duration)}</td>
              <td><a class="btn btn-table" href="/?service=${s.slug}#book">Book Now</a></td>
            </tr>`
    )
    .join('\n            ');

  const cards = services
    .map(
      (s) => `<a class="card" href="/costs/${s.slug}/">
            <span class="card-index">From ${esc(s.priceFrom)}</span>
            <h3>${esc(s.name)}</h3>
            <p>${esc(costs[s.slug].lead)}</p>
            <span class="card-link">${esc(s.name)} Costs</span>
          </a>`
    )
    .join('\n          ');

  const body = `${pageHead({
    trail,
    h1: 'Car Detailing Costs in Ocala, Florida',
    lead:
      'Every service we offer, what it starts at, and an honest account of what moves that number. No hidden call-for-pricing, and no bait figures we have no intention of honouring.',
    ctas: `<a class="btn" href="/#book">Book Online</a><a class="btn btn-ghost" href="/services/">See Services</a>`
  })}

    <section class="section">
      <div class="wrap">
        <p class="eyebrow">At A Glance</p>
        <h2>Starting Prices, All Services</h2>
        <div class="table-scroll" style="margin-top:24px">
          <table>
            <thead><tr><th scope="col">Service</th><th scope="col">From</th><th scope="col">Duration</th><th scope="col">Book</th></tr></thead>
            <tbody>
            ${rows}
            </tbody>
          </table>
        </div>
        <p class="small muted">Starting prices are for a standard sedan in average condition. Final pricing is confirmed after we assess the vehicle and before any work begins.</p>
      </div>
    </section>

    <section class="section section-alt">
      <div class="wrap">
        <p class="eyebrow">In Detail</p>
        <h2>What Each Service Actually Costs</h2>
        <p style="max-width:760px">Each page below covers what is in the starting price, the specific things that push it up, and what that service does not include.</p>
        <div class="grid grid-3" style="margin-top:30px">
          ${cards}
        </div>
      </div>
    </section>

    <section class="section">
      <div class="wrap">
        <div class="split">
          <div class="split-copy">
            <p class="eyebrow">Why Quotes Vary</p>
            <h2>Comparing Detailing Prices Fairly</h2>
            <p>The single biggest reason detailing quotes differ is not margin, it is scope. One business calls a wash and a vacuum a full detail; another means decontamination, extraction, and sealant by the same phrase. Comparing the headline number without comparing what is in it is how people conclude that detailing is a rip-off.</p>
            <p>Condition is the second reason, and the one customers underestimate most. A garage-kept sedan and a work truck that has never been cleaned are the same vehicle count and completely different jobs. Pet hair alone can add an hour.</p>
            <p>We publish starting prices so you can compare us against anyone before making contact, and we confirm a firm number after seeing the vehicle rather than pretending one figure fits every car.</p>
            <div class="btn-row" style="margin-top:24px">
              <a class="btn btn-ghost btn-sm" href="/blog/is-mobile-car-detailing-expensive/">Is Detailing Expensive?</a>
              <a class="btn btn-ghost btn-sm" href="/contact/">Ask About Your Vehicle</a>
            </div>
          </div>
          <div class="split-media">
            ${mediaFrame('finished', { className: 'is-tall' })}
          </div>
        </div>
      </div>
    </section>

${hubLinks('/costs/')}

${ctaBand('Get A Firm Price', 'Tell us the service and the vehicle and we will confirm exact pricing before anything is scheduled.')}`;

  write(
    '/costs',
    page({
      title,
      description,
      path: '/costs/',
      body,
      schema: [
        breadcrumbSchema(site.origin, trail),
        {
          '@context': 'https://schema.org',
          '@type': 'ItemList',
          name: 'Detailing Service Costs',
          itemListElement: services.map((s, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            name: `${s.name} cost`,
            url: `${site.origin}/costs/${s.slug}/`
          }))
        }
      ]
    }),
    {
      title,
      description,
      label: 'Costs',
      group: 'Costs',
      priority: '0.8',
      changefreq: 'monthly',
      keywords: 'cost price pricing how much detailing ocala'
    }
  );

  services.forEach((s) => buildCostPage(s));
}

function buildCostPage(s) {
  const c = costs[s.slug];
  // Fail loudly rather than shipping a cost page that is generic filler.
  if (!c) {
    throw new Error(`Missing cost copy for "${s.slug}". Add it to src/data/costs.js before building.`);
  }

  const trail = [
    { label: 'Home', href: '/' },
    { label: 'Costs', href: '/costs/' },
    { label: s.name, href: `/costs/${s.slug}/` }
  ];

  const title = `${s.name} Cost in Ocala FL | Ocala Elite`;
  const description = `${s.name} starts at ${s.priceFrom} in Ocala, FL. ${c.lead}`;

  const tierRows = costTiers(s)
    .map((t) => `<tr><td>${esc(t.label)}</td><td>${esc(t.price)}</td></tr>`)
    .join('\n            ');

  const others = services.filter((o) => o.slug !== s.slug);

  const body = `${pageHead({
    trail,
    h1: `How Much Does ${s.name} Cost in Ocala?`,
    lead: esc(c.lead),
    ctas: `<a class="btn" href="/?service=${s.slug}#book">Book ${esc(s.name)}</a><a class="btn btn-ghost" href="/services/${s.slug}/">${esc(s.name)} Details</a>`
  })}

    <section class="section">
      <div class="wrap">
        <div class="split">
          <div class="split-copy prose">
            <h2>What Drives The Price</h2>
            ${c.body.map((para) => `<p>${para}</p>`).join('\n            ')}

            <h2>What Moves The Number</h2>
            <ul class="checklist">${c.factors.map((f) => `<li>${esc(f)}</li>`).join('')}</ul>

            <h2>What Is Not Included</h2>
            <ul class="checklist">${c.notIncluded.map((f) => `<li>${esc(f)}</li>`).join('')}</ul>

            <h2>Is It Worth It?</h2>
            <p>${c.value}</p>
            <p>Full detail on what this service actually involves, step by step, is on the <a href="/services/${s.slug}/">${esc(s.name.toLowerCase())} page</a>.</p>
          </div>
          <div class="split-media">
            <div class="callout" style="margin-top:0">
              <h3>Estimated Pricing</h3>
              <div class="table-scroll" style="margin-top:16px;border:0">
                <table style="min-width:0">
                  <thead><tr><th scope="col">Vehicle</th><th scope="col">Estimate</th></tr></thead>
                  <tbody>
            ${tierRows}
                  </tbody>
                </table>
              </div>
              <p class="small muted" style="margin-top:14px;margin-bottom:0">Estimates for a vehicle in average condition. Condition can move these more than size does. Firm pricing is confirmed after assessment.</p>
            </div>
            ${mediaFrame(s.photo, { className: 'is-tall' })}
            <p class="media-caption">Real ${esc(s.name)} results</p>
          </div>
        </div>
      </div>
    </section>

    <section class="section section-alt">
      <div class="wrap">
        <p class="eyebrow">Compare</p>
        <h2>Costs For Our Other Services</h2>
        <div class="grid grid-4" style="margin-top:28px">
          ${others
            .map(
              (o) => `<a class="card" href="/costs/${o.slug}/">
            <span class="card-index">From ${esc(o.priceFrom)}</span>
            <h3>${esc(o.name)}</h3>
            <p class="small">${esc(costs[o.slug].lead)}</p>
          </a>`
            )
            .join('\n          ')}
        </div>
        <p style="margin-top:28px"><a href="/costs/">All service costs</a>, the <a href="/services/${s.slug}/">${esc(s.name)} service page</a>, or <a href="/">back to the homepage</a>.</p>
      </div>
    </section>

${ctaBand(`Get A Firm Price For ${s.name}`, 'Tell us the vehicle and its condition and we will confirm exact pricing before scheduling.')}`;

  write(
    `/costs/${s.slug}`,
    page({
      title,
      description,
      path: `/costs/${s.slug}/`,
      current: '/costs/',
      body,
      schema: [
        breadcrumbSchema(site.origin, trail),
        {
          '@context': 'https://schema.org',
          '@type': 'Service',
          name: s.name,
          serviceType: s.name,
          url: `${site.origin}/costs/${s.slug}/`,
          description,
          provider: { '@id': site.origin + '/#business' },
          areaServed: site.areaServed.map((a) => ({ '@type': 'City', name: a + ', FL' })),
          offers: {
            '@type': 'Offer',
            priceCurrency: 'USD',
            price: s.priceFrom.replace(/[^0-9.]/g, ''),
            availability: 'https://schema.org/InStock'
          }
        }
      ]
    }),
    {
      title,
      description,
      label: `${s.name} Cost`,
      group: 'Costs',
      priority: '0.7',
      changefreq: 'monthly',
      keywords: `${s.name} cost price how much ocala ${s.slug} pricing`
    }
  );
}

/* --------------------------------------------------------------- authors -- */

function authorBySlug(slug) {
  const a = authors.find((x) => x.slug === slug);
  if (!a) throw new Error(`Unknown author "${slug}". Add them to src/data/authors.js.`);
  return a;
}

function buildAuthors() {
  authors.forEach((a) => {
    const trail = [
      { label: 'Home', href: '/' },
      { label: 'Blog', href: '/blog/' },
      { label: a.name, href: `/author/${a.slug}/` }
    ];

    const written = posts
      .filter((p) => p.author === a.slug)
      .sort((x, y) => y.date.localeCompare(x.date));

    const title = `${a.name} | Author at Ocala Elite Car Detailing`;
    const description = `${a.name}, detailer at Ocala Elite Car Detailing, Ocala FL. ${a.summary}`;

    const cards = written
      .map(
        (p) => `<a class="card" href="/blog/${p.slug}/">
            <div class="card-media"><img src="${photos[p.photo].src}" alt="${esc(photos[p.photo].alt)}" loading="lazy" width="${photos[p.photo].width}" height="${photos[p.photo].height}"></div>
            <span class="card-index">${esc(p.category)}</span>
            <h3>${esc(p.title)}</h3>
            <p class="small">${esc(p.excerpt)}</p>
            <div class="card-meta"><span>${fmtDate(p.date)}</span><span>${esc(p.readTime)}</span></div>
          </a>`
      )
      .join('\n          ');

    const others = authors.filter((o) => o.slug !== a.slug);

    const body = `${pageHead({
      trail,
      h1: a.name,
      lead: esc(a.role),
      ctas: `<a class="btn" href="/#book">Book Online</a><a class="btn btn-ghost" href="/blog/">All Articles</a>`
    })}

    <section class="section">
      <div class="wrap">
        <div class="split">
          <div class="split-copy prose">
            <h2>About ${esc(a.name)}</h2>
            ${a.bio.map((para) => `<p>${esc(para)}</p>`).join('\n            ')}
          </div>
          <div class="split-media">
            <div class="callout" style="margin-top:0">
              <h3>At A Glance</h3>
              <ul class="summary-list" style="margin-top:16px">
                <li><span class="k">Role</span><span class="v">${esc(a.role.split(',')[0])}</span></li>
                <li><span class="k">Based</span><span class="v">Ocala, Florida</span></li>
                <li><span class="k">Covers</span><span class="v">Marion County</span></li>
                <li><span class="k">Articles</span><span class="v">${written.length}</span></li>
              </ul>
            </div>
            ${mediaFrame(a.slug === 'jay' ? 'interiorBA1' : a.slug === 'matt' ? 'correctionBA1' : 'foam', {
              className: 'is-wide'
            })}
          </div>
        </div>
      </div>
    </section>

    <section class="section section-alt">
      <div class="wrap">
        <p class="eyebrow">Articles</p>
        <h2>Written by ${esc(a.name)}</h2>
        <div class="grid grid-3" style="margin-top:30px">
          ${cards}
        </div>
      </div>
    </section>

    <section class="section">
      <div class="wrap">
        <p class="eyebrow">The Rest Of The Team</p>
        <h2>Other Authors</h2>
        <div class="grid grid-2" style="margin-top:28px">
          ${others
            .map(
              (o) => `<a class="card" href="/author/${o.slug}/">
            <h3>${esc(o.name)}</h3>
            <p class="small">${esc(o.summary)}</p>
            <span class="card-link">Read ${esc(o.name)}</span>
          </a>`
            )
            .join('\n          ')}
        </div>
        <p style="margin-top:28px"><a href="/blog/">All articles</a>, <a href="/about/">about the business</a>, or <a href="/">back to the homepage</a>.</p>
      </div>
    </section>

${ctaBand('Book With The Team', 'Pick your service and we will confirm pricing and an arrival window.')}`;

    write(
      `/author/${a.slug}`,
      page({
        title,
        description,
        path: `/author/${a.slug}/`,
        current: '/blog/',
        body,
        schema: [
          breadcrumbSchema(site.origin, trail),
          {
            '@context': 'https://schema.org',
            '@type': 'ProfilePage',
            mainEntity: {
              '@type': 'Person',
              '@id': `${site.origin}/author/${a.slug}/#person`,
              name: a.name,
              jobTitle: a.role,
              description: a.bio[0],
              worksFor: { '@id': site.origin + '/#business' },
              url: `${site.origin}/author/${a.slug}/`
            }
          }
        ]
      }),
      {
        title,
        description,
        label: a.name,
        group: 'Authors',
        priority: '0.4',
        changefreq: 'monthly',
        keywords: `${a.name} author detailer ocala elite car detailing`
      }
    );
  });
}

/* ------------------------------------------------------------------- 404 -- */

function buildNotFound() {
  const body = `    <section class="page-head">
      <div class="wrap">
        <div class="slash-rule"></div>
        <h1>Page Not Found</h1>
        <p class="lead">That page does not exist, or it has moved. Everything on this site is reachable from the links below.</p>
      </div>
    </section>

    <section class="section">
      <div class="wrap">
        <h2>Try One Of These Instead</h2>
        <div class="grid grid-4" style="margin-top:30px">
          <a class="card" href="/"><h3>Home</h3><p>Start over from the top, including the booking wizard.</p><span class="card-link">Go Home</span></a>
          <a class="card" href="/services/"><h3>Services</h3><p>All five detailing services with scope and pricing.</p><span class="card-link">Open</span></a>
          <a class="card" href="/blog/"><h3>Blog</h3><p>Guides on paint protection and Florida-specific damage.</p><span class="card-link">Open</span></a>
          <a class="card" href="/search/"><h3>Search</h3><p>Search every page on this site by keyword.</p><span class="card-link">Open</span></a>
        </div>
        <p style="margin-top:30px">Still stuck? The full <a href="/sitemap/">site map</a> lists every page, or <a href="/contact/">contact us</a> directly.</p>
      </div>
    </section>

${ctaBand('Looking To Book?', 'The booking wizard takes about two minutes from the homepage.')}`;

  writeRaw(
    '404.html',
    page({
      title: 'Page Not Found | Ocala Elite Car Detailing',
      description: 'That page could not be found. Browse services, the blog, reviews, or search the site.',
      path: '/404.html',
      current: '',
      robots: 'noindex, follow',
      body
    })
  );
}

/* ------------------------------------------------------------------ main -- */

function main() {
  buildHome();
  buildServices();
  buildBlog();
  buildReviews();
  buildSearch();
  buildAbout();
  buildContact();
  buildServiceAreas();
  buildCosts();
  buildAuthors();
  buildLegal(legal.disclaimer, 'disclaimer');
  buildLegal(legal.privacy, 'privacy');
  buildLegal(legal.terms, 'terms');
  buildSitemapPage();
  buildNotFound();

  buildSitemapXml();
  buildRobots();
  buildManifest();
  buildSearchIndex();

  console.log(`Built ${written.length} files, ${registry.length} indexed pages.`);
  written.forEach((f) => console.log('  ' + f));
}

main();
