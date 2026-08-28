const { esc } = require('./layout');
const { photos } = require('../data/photos');

// Turn an h2's text into a stable anchor id, e.g. "Washing: Every Week" -> "washing-every-week".
function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Render an ordered list of content blocks into prose HTML. h2 blocks get an
// id so a table of contents (see tocFromBlocks) can link straight to them.
function renderBlocks(blocks) {
  return blocks
    .map((b) => {
      if (b.h2) return `<h2 id="${slugify(b.h2)}">${esc(b.h2)}</h2>`;
      if (b.h3) return `<h3>${esc(b.h3)}</h3>`;
      if (b.p) return `<p>${b.p}</p>`;
      if (b.quote) return `<blockquote>${esc(b.quote)}</blockquote>`;
      if (b.list) return `<ul>${b.list.map((li) => `<li>${li}</li>`).join('')}</ul>`;
      if (b.image) {
        const photo = photos[b.image];
        if (!photo) throw new Error('Unknown photo key: ' + b.image);
        return `<figure class="media-frame is-wide" style="margin:2em 0">
          <img src="${photo.src}" alt="${esc(b.alt || photo.alt)}" width="${photo.width}" height="${photo.height}" loading="lazy">
        </figure>${b.caption ? `<p class="media-caption" style="margin-top:-1.6em;margin-bottom:2em">${esc(b.caption)}</p>` : ''}`;
      }
      if (b.html) return b.html;
      return '';
    })
    .join('\n      ');
}

// Pull { id, text } for every h2 in a post body, for a table of contents.
function tocFromBlocks(blocks) {
  return blocks.filter((b) => b.h2).map((b) => ({ id: slugify(b.h2), text: b.h2 }));
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
function mediaFrame(key, { className = '', loading = 'lazy', sizes = '', parallax = null } = {}) {
  const p = photos[key];
  if (!p) throw new Error('Unknown photo key: ' + key);
  // `parallax` is a factor (see assets/js/parallax.js); the frame gets a
  // matching class so its base scale/overflow accommodate the drift.
  const parallaxAttrs = parallax ? ` data-parallax="${parallax}" data-parallax-scale="1.12"` : '';
  return `<figure class="media-frame ${className}${parallax ? ' has-parallax' : ''}">
          <img src="${p.src}" alt="${esc(p.alt)}" width="${p.width}" height="${p.height}" loading="${loading}"${
    loading === 'eager' ? ' fetchpriority="high" decoding="async"' : ''
  }${sizes ? ` sizes="${sizes}"` : ''}${parallaxAttrs}>
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

module.exports = { renderBlocks, tocFromBlocks, crumbs, breadcrumbSchema, pageHead, mediaFrame, faqBlock, faqSchema };
