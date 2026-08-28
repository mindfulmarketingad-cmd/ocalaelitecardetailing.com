/* Verifies every internal href in the generated HTML resolves to a real file,
 * and that every page has a title, description, and canonical.
 *
 *   node tools/check-links.js
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const problems = [];

function htmlFiles(dir, acc = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === 'node_modules' || entry.name === '.git' || entry.name === 'src' || entry.name === 'tools') continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) htmlFiles(full, acc);
    else if (entry.name.endsWith('.html')) acc.push(full);
  }
  return acc;
}

function resolves(href) {
  const clean = href.split('#')[0].split('?')[0];
  if (!clean || clean === '/') return fs.existsSync(path.join(ROOT, 'index.html'));
  const target = path.join(ROOT, clean);
  if (fs.existsSync(target)) {
    return fs.statSync(target).isDirectory() ? fs.existsSync(path.join(target, 'index.html')) : true;
  }
  return fs.existsSync(target + '.html') || fs.existsSync(path.join(target, 'index.html'));
}

const files = htmlFiles(ROOT);
const anchors = new Set(['#main', '#book', '#services']);

for (const file of files) {
  const rel = path.relative(ROOT, file);
  const html = fs.readFileSync(file, 'utf8');

  for (const tag of ['<title>', 'name="description"', 'rel="canonical"']) {
    if (!html.includes(tag)) problems.push(`${rel}: missing ${tag}`);
  }

  const hrefs = [...html.matchAll(/(?:href|src)="([^"]+)"/g)].map((m) => m[1]);
  for (const href of hrefs) {
    if (/^(https?:|mailto:|tel:|data:)/.test(href)) continue;
    if (href.startsWith('#')) {
      if (!anchors.has(href) && !html.includes(`id="${href.slice(1)}"`)) {
        problems.push(`${rel}: dangling anchor ${href}`);
      }
      continue;
    }
    if (!href.startsWith('/')) {
      problems.push(`${rel}: non-absolute internal link ${href}`);
      continue;
    }
    if (!resolves(href)) problems.push(`${rel}: broken link ${href}`);
  }
}

if (problems.length) {
  console.error(`${problems.length} problem(s):`);
  problems.forEach((p) => console.error('  ' + p));
  process.exit(1);
}
console.log(`OK: ${files.length} pages, all internal links resolve.`);
