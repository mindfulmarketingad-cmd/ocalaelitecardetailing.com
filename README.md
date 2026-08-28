# ocalaelitecardetailing.com

Static marketing and lead-capture site for **Ocala Elite Car Detailing**, a
booking and dispatch service for mobile vehicle detailing in Ocala and Marion
County, Florida.

No framework and no runtime. Content lives in `src/data`, templates live in
`src/templates`, and `build.js` renders plain HTML into the repository root so
the site can be served from any static host.

---

## Quick start

```bash
npm run build     # render all pages
npm run check     # verify every internal link resolves
npm run serve     # preview at http://localhost:8080
```

`npm run dev` does all three in order.

---

## Repository layout

```
build.js                  page generator - run after any content edit
src/data/site.js          business details, header nav, footer nav, Supabase config
src/data/services.js      the five service pages
src/data/blog.js          blog posts
src/data/legal.js         disclaimer, privacy, terms
src/data/photos.js        photo paths and alt text
src/templates/layout.js   document shell: head, header, footer
src/templates/blocks.js   prose, breadcrumbs, media, FAQ helpers
assets/css/site.css       the whole stylesheet
assets/js/                supabase helper, booking wizard, reviews, contact, search
supabase/schema.sql       database tables, grants, and row level security
tools/gen-assets.js       renders icons, the OG card, and photo placeholders
tools/make-ico.js         packs favicon.ico
tools/check-links.js      internal link and metadata check
```

Generated output (`index.html`, `services/`, `blog/`, `sitemap.xml`,
`search-index.json`, `404.html`, …) is committed so the repository can be
deployed directly with no build step.

---

## Editing content

| To change | Edit | Then |
| --- | --- | --- |
| Phone, email, hours, service areas | `src/data/site.js` | `npm run build` |
| A service page | `src/data/services.js` | `npm run build` |
| Blog posts | `src/data/blog.js` | `npm run build` |
| Policy wording | `src/data/legal.js` | `npm run build` |
| Header or footer links | `src/data/site.js` | `npm run build` |

Every page, the XML sitemap, the `/sitemap/` page, and the search index are
derived from the same registry, so a new page appears everywhere at once.

---

## Photography

The four photo slots are defined in `src/data/photos.js`. The files currently
committed at those paths are **labelled placeholders**. Replace them with the
real photographs, keeping the same filenames:

| File | Orientation | Used on |
| --- | --- | --- |
| `assets/img/photo-tesla-driveway.jpg` | portrait, ~1200x1600 | homepage hero, ceramic coating, full package, about |
| `assets/img/photo-gwagon-wash.jpg` | landscape, ~1920x1080 | homepage intro, mobile detailing, about |
| `assets/img/photo-wheel-foam.jpg` | portrait, ~1000x1500 | homepage process band, exterior detailing, blog hub |
| `assets/img/photo-civic-front.jpg` | portrait, ~1000x1330 | interior detailing, services hub, reviews, contact |

Photos are rendered greyscale and darkened in CSS so colour images sit inside
the black-and-grey palette. Update the `alt` text in `src/data/photos.js` if the
replacement image shows something different, then run `npm run build`.

---

## Branding

- `assets/img/logo-mark.svg` - the badge, used in the header and footer
- `assets/img/logo.svg` - horizontal lockup
- `assets/img/favicon.svg` + `favicon.ico` + `apple-touch-icon.png` + `icon-192/512.png`
- `assets/img/og-image.png` - social share card, 1200x630

Regenerate the raster set after editing the SVGs:

```bash
npm run assets
```

Requires Playwright and Chromium.

---

## Supabase

Three tables back the site: `bookings`, `contact_messages`, and `reviews`.
See [`supabase/README.md`](./supabase/README.md) for setup, and
[`supabase/schema.sql`](./supabase/schema.sql) for the schema, grants, and RLS
policies.

The publishable key in `assets/js/supabase.js` is public by design. **The
service role key must never be committed to this repository or shipped in
client code.**

Reviews submitted through `/reviews/` land with `status = 'pending'` and only
appear on the site once set to `approved` in the dashboard.

---

## Site structure

```
/                          homepage (hero, services, booking wizard)
├── /services/             hub
│   ├── /services/mobile-detailing/
│   ├── /services/ceramic-coating/
│   ├── /services/exterior-detailing/
│   ├── /services/interior-detailing/
│   └── /services/full-package/
├── /blog/                 hub
│   └── /blog/<post>/      five articles
├── /reviews/              hub
├── /search/               hub
├── /about/  /contact/
└── /disclaimer/  /privacy/  /terms/  /sitemap/
```

Every individual page links back to its hub and to the homepage, keeping click
depth from the homepage at two. `/sitemap.xml` and `/robots.txt` are generated
by the build.

---

## Deploying

The repository root is the web root. Netlify (`netlify.toml`) and Vercel
(`vercel.json`) configs are included; GitHub Pages and Cloudflare Pages work
with no configuration because every route is a directory containing
`index.html`.
