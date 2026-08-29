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
        <span class="topbar-actions">
          <a href="tel:${site.phoneHref}">${site.phone}</a>
          <a class="topbar-book" href="/#book">Book Online</a>
        </span>
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

/* Inline SVG marks, so the footer needs no icon font or extra request.
 * Only profiles with a configured URL in src/data/site.js are rendered. */
const SOCIAL_ICONS = {
  google:
    '<path d="M12 10.2v3.9h5.5a4.7 4.7 0 0 1-2 3.1v2.6h3.3c1.9-1.8 3-4.4 3-7.5 0-.7-.1-1.4-.2-2.1H12z"/><path d="M12 22c2.7 0 5-.9 6.7-2.4l-3.3-2.6c-.9.6-2.1 1-3.4 1-2.6 0-4.8-1.8-5.6-4.1H3v2.6A10 10 0 0 0 12 22z"/><path d="M6.4 13.9a6 6 0 0 1 0-3.8V7.5H3a10 10 0 0 0 0 9z"/><path d="M12 5.9c1.5 0 2.8.5 3.8 1.5l2.9-2.9A10 10 0 0 0 3 7.5l3.4 2.6C7.2 7.8 9.4 5.9 12 5.9z"/>',
  facebook:
    '<path d="M22 12a10 10 0 1 0-11.6 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.5h-1.3c-1.2 0-1.6.8-1.6 1.6V12h2.8l-.4 2.9h-2.4v7A10 10 0 0 0 22 12z"/>',
  instagram:
    '<path d="M12 2.2c3.2 0 3.6 0 4.9.1 1.2.1 1.8.2 2.2.4.6.2 1 .5 1.4.9.4.4.7.8.9 1.4.2.4.4 1 .4 2.2.1 1.3.1 1.7.1 4.9s0 3.6-.1 4.9c0 1.2-.2 1.8-.4 2.2-.2.6-.5 1-.9 1.4-.4.4-.8.7-1.4.9-.4.2-1 .4-2.2.4-1.3.1-1.7.1-4.9.1s-3.6 0-4.9-.1c-1.2 0-1.8-.2-2.2-.4-.6-.2-1-.5-1.4-.9-.4-.4-.7-.8-.9-1.4-.2-.4-.4-1-.4-2.2C2.2 15.6 2.2 15.2 2.2 12s0-3.6.1-4.9c0-1.2.2-1.8.4-2.2.2-.6.5-1 .9-1.4.4-.4.8-.7 1.4-.9.4-.2 1-.4 2.2-.4C8.4 2.2 8.8 2.2 12 2.2zm0 1.8c-3.1 0-3.5 0-4.7.1-1.1 0-1.7.2-2.1.3-.5.2-.9.4-1.3.8-.4.4-.6.8-.8 1.3-.1.4-.3 1-.3 2.1-.1 1.2-.1 1.6-.1 4.7s0 3.5.1 4.7c0 1.1.2 1.7.3 2.1.2.5.4.9.8 1.3.4.4.8.6 1.3.8.4.1 1 .3 2.1.3 1.2.1 1.6.1 4.7.1s3.5 0 4.7-.1c1.1 0 1.7-.2 2.1-.3.5-.2.9-.4 1.3-.8.4-.4.6-.8.8-1.3.1-.4.3-1 .3-2.1.1-1.2.1-1.6.1-4.7s0-3.5-.1-4.7c0-1.1-.2-1.7-.3-2.1-.2-.5-.4-.9-.8-1.3-.4-.4-.8-.6-1.3-.8-.4-.1-1-.3-2.1-.3-1.2-.1-1.6-.1-4.7-.1z"/><path d="M12 15.3a3.3 3.3 0 1 1 0-6.6 3.3 3.3 0 0 1 0 6.6zm0-8.4a5.1 5.1 0 1 0 0 10.2 5.1 5.1 0 0 0 0-10.2z"/><circle cx="17.3" cy="6.7" r="1.2"/>',
  youtube:
    '<path d="M21.6 7.2a2.5 2.5 0 0 0-1.8-1.8C18.2 5 12 5 12 5s-6.2 0-7.8.4a2.5 2.5 0 0 0-1.8 1.8A26 26 0 0 0 2 12a26 26 0 0 0 .4 4.8 2.5 2.5 0 0 0 1.8 1.8C5.8 19 12 19 12 19s6.2 0 7.8-.4a2.5 2.5 0 0 0 1.8-1.8A26 26 0 0 0 22 12a26 26 0 0 0-.4-4.8zM10 15V9l5.2 3z"/>',
  tiktok:
    '<path d="M16.6 5.8a4.8 4.8 0 0 1-1-2.8h-3v12.2a2.4 2.4 0 1 1-2.4-2.4c.2 0 .5 0 .7.1v-3a5.5 5.5 0 1 0 4.7 5.4V8.9a7.8 7.8 0 0 0 4.4 1.4V7.4a4.8 4.8 0 0 1-3.4-1.6z"/>',
  x: '<path d="M17.5 3h3.1l-6.8 7.8L21.8 21h-6.2l-4.9-6.4L5.1 21H2l7.3-8.3L2.3 3h6.4l4.4 5.8zm-1.1 16.1h1.7L7.7 4.8H5.9z"/>'
};

const SOCIAL_LABELS = {
  google: 'Google Business Profile',
  facebook: 'Facebook',
  instagram: 'Instagram',
  youtube: 'YouTube',
  tiktok: 'TikTok',
  x: 'X'
};

/** Footer icon row. Renders nothing at all until a URL is configured. */
function socialLinks() {
  const entries = Object.entries(site.social || {}).filter(([k, v]) => v && SOCIAL_ICONS[k]);
  if (!entries.length) return '';
  return `<ul class="social-row" aria-label="Social profiles">
            ${entries
              .map(
                ([k, url]) => `<li><a href="${url}" target="_blank" rel="noopener me" aria-label="${SOCIAL_LABELS[k]}">
              <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">${SOCIAL_ICONS[k]}</svg>
            </a></li>`
              )
              .join('\n            ')}
          </ul>`;
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
          ${socialLinks()}
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
        <p>Licensed and insured. Booking and dispatch service; detailing performed by vetted independent operators.</p>
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
