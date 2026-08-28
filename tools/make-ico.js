/* Packs the rendered 16/32/48 PNGs into favicon.ico (PNG-compressed entries).
 *
 *   node tools/make-ico.js
 */
const fs = require('fs');
const path = require('path');

const IMG = path.join(__dirname, '..', 'assets', 'img');
const sizes = [16, 32, 48];

const images = sizes.map((s) => ({ size: s, data: fs.readFileSync(path.join(IMG, `icon-${s}.png`)) }));

const header = Buffer.alloc(6);
header.writeUInt16LE(0, 0); // reserved
header.writeUInt16LE(1, 2); // type: icon
header.writeUInt16LE(images.length, 4);

const dir = Buffer.alloc(16 * images.length);
let offset = header.length + dir.length;

images.forEach((img, i) => {
  const p = i * 16;
  dir.writeUInt8(img.size === 256 ? 0 : img.size, p);     // width
  dir.writeUInt8(img.size === 256 ? 0 : img.size, p + 1); // height
  dir.writeUInt8(0, p + 2);  // palette size
  dir.writeUInt8(0, p + 3);  // reserved
  dir.writeUInt16LE(1, p + 4);   // colour planes
  dir.writeUInt16LE(32, p + 6);  // bits per pixel
  dir.writeUInt32LE(img.data.length, p + 8);
  dir.writeUInt32LE(offset, p + 12);
  offset += img.data.length;
});

const out = Buffer.concat([header, dir, ...images.map((i) => i.data)]);
fs.writeFileSync(path.join(__dirname, '..', 'favicon.ico'), out);
console.log(`favicon.ico written (${images.length} sizes, ${out.length} bytes)`);
