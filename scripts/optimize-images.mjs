/**
 * Optimize static images in public/.
 *
 * Currently only the big logo JPEGs are handled — they were the heavy items
 * on the menu pages (each ~500 KB → ~70–100 KB at quality 88, visually
 * lossless).
 *
 * PNGs (incl. the payment QR codes) are deliberately NOT rewritten: re-coding
 * them through image libraries changes pixels (palette re-encoding, colour
 * management), and a payment QR code must never be altered without a real
 * device scan verifying it afterwards. If you want smaller QR PNGs, generate
 * them from source with a proper PNG quantizer and scan-test them first.
 *
 * Run: node scripts/optimize-images.mjs
 */
import { statSync, renameSync, unlinkSync } from "fs";
import { resolve } from "path";
import sharp from "sharp";

const PUBLIC = resolve(import.meta.dirname ?? ".", "..", "public");
const JPG_LOGOS = ["cafe-light-logo.jpg", "rest-light-logo.jpg", "rest-dark-logo.jpg"];

function fmt(n) {
  return n > 1024 * 1024 ? `${(n / 1024 / 1024).toFixed(2)} MB` : `${Math.round(n / 1024)} KB`;
}

for (const name of JPG_LOGOS) {
  const file = resolve(PUBLIC, name);
  const tmp = `${file}.opt.tmp`;
  const before = statSync(file).size;
  try {
    await sharp(file).jpeg({ quality: 88, mozjpeg: true }).toFile(tmp);
  } catch (err) {
    console.error(`  ✗ ${name}: encode failed — ${err.message}`);
    continue;
  }
  const after = statSync(tmp).size;
  if (after < before) {
    renameSync(tmp, file);
    console.log(
      `  ✓ ${name}: ${fmt(before)} → ${fmt(after)} (-${Math.round((1 - after / before) * 100)}%)`,
    );
  } else {
    unlinkSync(tmp);
    console.log(`  = ${name}: ${fmt(before)} → kept original (no gain)`);
  }
}

console.log("\nDone.");
