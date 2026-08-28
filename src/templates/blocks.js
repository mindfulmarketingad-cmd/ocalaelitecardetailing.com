const { esc } = require('./layout');
const { photos } = require('../data/photos');

// Render an ordered list of content blocks into prose HTML.
function renderBlocks(blocks) {
  return blocks
    .map((b) => {
      if (b.h2) return `<h2>${esc(b.h2)}</h2>`;
      if (b.h3) return `<h3>${esc(b.h3)}</h3>`;
      if (b.p) return `<p>${b.p}</p>`;
      if (b.quote) return `<blockquote>${esc(b.quote)}</blockquote>`;
      if (b.list) return `<ul>${b.list.map((li) => `<li>${li}</li>`).join('')}</ul>`;
      if (b.html) return b.html;
      return '';
    })
    .join('\n      ');
}

// Breadcrumb trail. `trail` is [{label, href}], last item has no href.
function crumbs(trail) {
  const parts = trail.map((item, i) => {
    const last = i === trail.length - 1;
    return last ? `<span aria-current="page">${esc(item.label)}</span>` : `<a href="${item.href}">${esc(item.label)}</a>`;
  });
  return `<nav class="crumbs" aria-label="Breadcrumb">${parts.join('<span>/</span>')}</nav>`;
}

function breadcrumbSchema(origin, trail) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.label,
      item: origin + (item.href || item.self || '/')
    }))
  };
}

function pageHead({ trail, h1, lead, ctas = '' }) {
  return `    <section class="page-head">
      <div class="wrap">
        ${crumbs(trail)}
        <div class="slash-rule"></div>
        <h1>${esc(h1)}</h1>
        ${lead ? `<p class="lead">${lead}</p>` : ''}
        ${ctas ? `<div class="btn-row" style="margin-top:26px">${ctas}</div>` : ''}
      </div>
    </section>`;
}

// <img> for a photo key, wrapped in the angular media frame.
function mediaFrame(key, { className = '', loading = 'lazy', sizes = '' } = {}) {
  const p = photos[key];
  if (!p) throw new Error('Unknown photo key: ' + key);
  return `<figure class="media-frame ${className}">
          <img src="${p.src}" alt="${esc(p.alt)}" width="${p.width}" height="${p.height}" loading="${loading}"${
    loading === 'eager' ? ' fetchpriority="high" decoding="async"' : ''
  }${sizes ? ` sizes="${sizes}"` : ''}>
        </figure>`;
}

function faqBlock(faqs) {
  if (!faqs || !faqs.length) return '';
  return `<div class="stack">
        ${faqs
          .map(
            (f) => `<div class="card">
          <h3>${esc(f.q)}</h3>
          <p>${esc(f.a)}</p>
        </div>`
          )
          .join('\n        ')}
      </div>`;
}

function faqSchema(faqs) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a }
    }))
  };
}

module.exports = { renderBlocks, crumbs, breadcrumbSchema, pageHead, mediaFrame, faqBlock, faqSchema };
