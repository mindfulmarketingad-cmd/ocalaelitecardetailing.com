/* Renders raster brand assets from the SVG logo and the site palette.
 *
 *   node tools/gen-assets.js
 *
 * Requires Playwright + the preinstalled Chromium. Output is committed, so
 * this only needs re-running when the logo or the placeholder set changes.
 */
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const ROOT = path.join(__dirname, '..');
const IMG = path.join(ROOT, 'assets', 'img');
const faviconSvg = fs.readFileSync(path.join(IMG, 'favicon.svg'), 'utf8');
const logoSvg = fs.readFileSync(path.join(IMG, 'logo.svg'), 'utf8');

/* Google Fonts is fetched here and inlined as data URIs. Chromium in a
 * sandboxed build environment often cannot reach fonts.gstatic.com itself, and
 * a fallback font would bake the wrong typeface into committed assets. */
const UA = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

async function inlineFontCss(families) {
  try {
    const res = await fetch('https://fonts.googleapis.com/css2?' + families + '&display=swap', {
      headers: { 'User-Agent': UA }
    });
    if (!res.ok) throw new Error('HTTP ' + res.status);
    const css = await res.text();

    // Keep only the latin block of each face, then inline its woff2.
    const faces = css.split('@font-face').slice(1).map((b) => '@font-face' + b);
    const latin = faces.filter((f) => /U\+0000-00FF/.test(f));
    const out = [];

    for (const face of latin) {
      const url = (face.match(/url\((https:[^)]+)\)/) || [])[1];
      if (!url) continue;
      const font = await fetch(url, { headers: { 'User-Agent': UA } });
      if (!font.ok) continue;
      const b64 = Buffer.from(await font.arrayBuffer()).toString('base64');
      out.push(face.replace(/url\(https:[^)]+\)/, `url(data:font/woff2;base64,${b64})`));
    }
    console.log(`Fonts: inlined ${out.length} face(s)`);
    return out.join('\n');
  } catch (err) {
    console.warn('Fonts: could not fetch webfonts (' + err.message + '), falling back to system fonts');
    return '';
  }
}

let FONT_CSS = '';

const shell = (css, html) => `<!doctype html><meta charset="utf-8">
<style>
  ${FONT_CSS}
  *{margin:0;padding:0;box-sizing:border-box}
  html,body{background:#08080a}
  ${css}
</style>${html}`;

// --- icons -------------------------------------------------------------------

const iconPage = (size, pad) =>
  shell(
    `body{width:${size}px;height:${size}px;display:flex;align-items:center;justify-content:center;background:#08080a}
     svg{width:${size - pad * 2}px;height:${size - pad * 2}px}`,
    faviconSvg
  );

// --- open graph card ---------------------------------------------------------

const ogPage = () =>
  shell(
    `body{width:1200px;height:630px;position:relative;overflow:hidden;
          background:radial-gradient(900px 500px at 78% -12%, rgba(255,255,255,.10), transparent 62%),
                     linear-gradient(180deg,#101014,#08080a);
          font-family:Inter,Arial,sans-serif;color:#a4a4b0}
     .slashes{position:absolute;right:-10%;top:-40%;width:60%;height:200%;
              background:repeating-linear-gradient(115deg, rgba(255,255,255,.055) 0 2px, transparent 2px 26px);
              transform:skewX(-14deg)}
     .grid{position:absolute;inset:0;
           background-image:linear-gradient(rgba(255,255,255,.03) 1px,transparent 1px),
                            linear-gradient(90deg,rgba(255,255,255,.03) 1px,transparent 1px);
           background-size:64px 64px;
           -webkit-mask-image:linear-gradient(180deg,rgba(0,0,0,.9),transparent 80%)}
     .inner{position:relative;z-index:2;padding:74px 78px;height:100%;display:flex;flex-direction:column;justify-content:space-between}
     .logo svg{width:330px;height:66px}
     h1{font-family:Oswald,Arial,sans-serif;font-weight:600;text-transform:uppercase;color:#f4f4f6;
        font-size:70px;line-height:1.04;letter-spacing:-.5px;max-width:940px}
     .rule{height:3px;width:110px;margin:0 0 26px;
           background:repeating-linear-gradient(115deg,#d8d8de 0 4px,transparent 4px 9px)}
     p{font-size:26px;line-height:1.45;max-width:820px;margin-top:22px}
     .foot{display:flex;justify-content:space-between;align-items:center;
           border-top:1px solid #26262e;padding-top:26px;
           font-family:Oswald,Arial,sans-serif;text-transform:uppercase;letter-spacing:4px;font-size:19px;color:#8b8b96}
     .foot strong{color:#f4f4f6;font-weight:500}`,
    `<div class="slashes"></div><div class="grid"></div>
     <div class="inner">
       <div class="logo">${logoSvg}</div>
       <div>
         <div class="rule"></div>
         <h1>Mobile Car Detailing<br>Ocala, Florida</h1>
         <p>Exterior, interior, full packages, and ceramic coating &mdash; done at your address.</p>
       </div>
       <div class="foot"><span><strong>OcalaEliteCarDetailing.com</strong></span><span>Book Online</span></div>
     </div>`
  );

// --- photo placeholders ------------------------------------------------------

const placeholders = [
  { file: 'photo-tesla-driveway.jpg', w: 1200, h: 1600, label: 'Lead hero photo' },
  { file: 'photo-gwagon-wash.jpg', w: 1920, h: 1080, label: 'Wash in progress' },
  { file: 'photo-wheel-foam.jpg', w: 1000, h: 1500, label: 'Wheel and tire work' },
  { file: 'photo-civic-front.jpg', w: 1000, h: 1330, label: 'Finished vehicle' }
];

const placeholderPage = (p) =>
  shell(
    `body{width:${p.w}px;height:${p.h}px;position:relative;overflow:hidden;
          background:linear-gradient(150deg,#1d1d24,#0b0b0e 62%);
          font-family:Oswald,Arial,sans-serif;color:#6e6e79;
          display:flex;align-items:center;justify-content:center;text-align:center}
     .slashes{position:absolute;inset:0;
              background:repeating-linear-gradient(115deg, rgba(255,255,255,.035) 0 3px, transparent 3px 30px)}
     .box{position:relative;z-index:2;border:2px dashed #3a3a44;padding:${Math.round(p.w * 0.05)}px;max-width:82%}
     .t{color:#d8d8de;text-transform:uppercase;letter-spacing:.22em;font-size:${Math.round(p.w * 0.038)}px;margin-bottom:${Math.round(p.w * 0.022)}px}
     .s{text-transform:uppercase;letter-spacing:.16em;font-size:${Math.round(p.w * 0.021)}px;line-height:1.7}`,
    `<div class="slashes"></div>
     <div class="box">
       <div class="t">Photo Placeholder</div>
       <div class="s">${p.label}<br>Replace assets/img/${p.file}<br>${p.w} &times; ${p.h}</div>
     </div>`
  );

(async () => {
  FONT_CSS = await inlineFontCss('family=Oswald:wght@400;500;600;700&family=Inter:wght@400;500');

  const browser = await chromium.launch();

  async function shoot(html, width, height, out, opts = {}) {
    const pg = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 1 });
    await pg.setContent(html, { waitUntil: 'load' });
    await pg.evaluate(() => document.fonts && document.fonts.ready);
    await pg.screenshot({ path: out, omitBackground: false, ...opts });
    await pg.close();
    console.log('  ' + path.relative(ROOT, out));
  }

  console.log('Icons');
  for (const [size, pad, name] of [
    [16, 0, 'icon-16.png'],
    [32, 0, 'icon-32.png'],
    [48, 0, 'icon-48.png'],
    [180, 14, 'apple-touch-icon.png'],
    [192, 16, 'icon-192.png'],
    [512, 44, 'icon-512.png']
  ]) {
    await shoot(iconPage(size, pad), size, size, path.join(IMG, name));
  }

  console.log('Open Graph card');
  await shoot(ogPage(), 1200, 630, path.join(IMG, 'og-image.png'));

  console.log('Photo placeholders');
  for (const p of placeholders) {
    await shoot(placeholderPage(p), p.w, p.h, path.join(IMG, p.file), {
      type: 'jpeg',
      quality: 82
    });
  }

  await browser.close();
})();
