const { site, headerNav, footerNav } = require('../data/site');

const esc = (s = '') =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const year = new Date().getFullYear();

function nav(current) {
  return headerNav
    .map((item) => {
      const isCurrent =
        item.href === current || (item.href !== '/' && current.startsWith(item.href));
      return `<a href="${item.href}"${isCurrent ? ' aria-current="page"' : ''}>${item.label}</a>`;
    })
    .join('\n          ');
}

function header(current) {
  return `<header class="site-header">
    <div class="topbar">
      <div class="wrap">
        <span class="topbar-note">Mobile detailing across Ocala and Marion County</span>
        <span><a href="tel:${site.phoneHref}">${site.phone}</a></span>
      </div>
    </div>
    <div class="wrap">
      <div class="header-inner">
        <a class="brand" href="/">
          <img src="/assets/img/logo-mark.svg" width="42" height="42" alt="${esc(site.name)} logo">
          <span class="brand-text">
            <span class="brand-name">Ocala Elite</span>
            <span class="brand-sub">Car Detailing</span>
          </span>
        </a>
        <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="primary-nav">Menu</button>
        <nav class="nav" id="primary-nav" aria-label="Primary">
          ${nav(current)}
        </nav>
      </div>
    </div>
  </header>`;
}

function footer() {
  const links = footerNav
    .map((item) => `<li><a href="${item.href}">${item.label}</a></li>`)
    .join('\n        ');

  return `<footer class="site-footer">
    <div class="wrap">
      <div class="footer-top">
        <div class="footer-brand">
          <img src="/assets/img/logo-mark.svg" width="46" height="46" alt="${esc(site.name)} logo">
          <p>${esc(site.name)} connects drivers across Ocala and Marion County with vetted mobile detailing operators. One request, one standard, work done at your address.</p>
          <p class="small muted">${esc(site.addressLocality)}, ${esc(site.addressRegion)} ${esc(site.postalCode)}<br>
          <a href="tel:${site.phoneHref}">${site.phone}</a> &middot; <a href="mailto:${site.email}">${site.email}</a></p>
        </div>
        <div>
          <h4>Services</h4>
          <ul>
            <li><a href="/services/mobile-detailing/">Mobile Detailing</a></li>
            <li><a href="/services/ceramic-coating/">Ceramic Coating</a></li>
            <li><a href="/services/exterior-detailing/">Exterior Detailing</a></li>
            <li><a href="/services/interior-detailing/">Interior Detailing</a></li>
            <li><a href="/services/full-package/">Full Package</a></li>
          </ul>
        </div>
        <div>
          <h4>Hours</h4>
          <ul>
            ${site.hours.map((h) => `<li>${esc(h.days)}<br><span class="muted">${esc(h.time)}</span></li>`).join('\n            ')}
          </ul>
        </div>
      </div>
      <nav aria-label="Footer">
        <ul class="footer-nav">
        ${links}
        </ul>
      </nav>
      <div class="footer-bottom">
        <p>&copy; ${year} ${esc(site.name)}. All rights reserved.</p>
        <p>Booking and dispatch service. Detailing performed by independent operators.</p>
      </div>
    </div>
  </footer>`;
}

/**
 * Render a complete HTML document.
 *
 * @param {object} opts
 * @param {string} opts.title      - title tag
 * @param {string} opts.description- meta description
 * @param {string} opts.path       - absolute site path, e.g. "/services/"
 * @param {string} opts.body       - page markup
 * @param {string} [opts.current]  - nav highlight path (defaults to opts.path)
 * @param {object[]} [opts.schema] - JSON-LD objects
 * @param {string} [opts.ogType]
 * @param {string} [opts.bodyClass]
 * @param {string} [opts.extraHead]
 * @param {string[]} [opts.scripts]- extra script srcs
 */
function page(opts) {
  const {
    title,
    description,
    path,
    body,
    current = path,
    schema = [],
    ogType = 'website',
    robots = 'index, follow, max-image-preview:large',
    extraHead = '',
    scripts = []
  } = opts;

  const canonical = site.origin + path;
  const schemaBlocks = schema
    .map((obj) => `<script type="application/ld+json">${JSON.stringify(obj)}</script>`)
    .join('\n  ');

  const extraScripts = scripts.map((src) => `<script src="${src}" defer></script>`).join('\n  ');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(description)}">
  <link rel="canonical" href="${canonical}">
  <meta name="robots" content="${robots}">
  <meta name="theme-color" content="#08080a">

  <meta property="og:type" content="${ogType}">
  <meta property="og:site_name" content="${esc(site.name)}">
  <meta property="og:title" content="${esc(title)}">
  <meta property="og:description" content="${esc(description)}">
  <meta property="og:url" content="${canonical}">
  <meta property="og:image" content="${site.origin}/assets/img/og-image.png">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${esc(title)}">
  <meta name="twitter:description" content="${esc(description)}">
  <meta name="twitter:image" content="${site.origin}/assets/img/og-image.png">

  <link rel="icon" href="/favicon.ico" sizes="32x32">
  <link rel="icon" href="/assets/img/favicon.svg" type="image/svg+xml">
  <link rel="apple-touch-icon" href="/assets/img/apple-touch-icon.png">
  <link rel="manifest" href="/site.webmanifest">

  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;600;700&family=Inter:wght@400;500;600&display=swap">
  <link rel="stylesheet" href="/assets/css/site.css">
  ${extraHead}
  ${schemaBlocks}
</head>
<body>
  <a class="skip-link" href="#main">Skip to content</a>
  ${header(current)}
  <main id="main">
${body}
  </main>
  ${footer()}
  <script src="/assets/js/site.js" defer></script>
  ${extraScripts}
</body>
</html>
`;
}

module.exports = { page, esc, site };
