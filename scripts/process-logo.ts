// One-time script: crop sp-mark.jpeg tight to logo bounding box and chroma-key the white bg to transparent.
// Run with: bun scripts/process-logo.ts
import sharp from "sharp";
import { writeFileSync } from "fs";

const SRC = "/Users/abuts/Projects/sp-automotive/public/logos/sp-mark.jpeg";
const OUT = "/Users/abuts/Projects/sp-automotive/public/logos/sp-mark.png";

// Auto-detect the logo bounding box: scan the raw pixels for the tightest rectangle
// containing pixels darker than the threshold (i.e. the actual logo art).
async function findBoundingBox() {
  const meta = await sharp(SRC).metadata();
  const W = meta.width!;
  const H = meta.height!;
  const { data } = await sharp(SRC).removeAlpha().raw().toBuffer({ resolveWithObject: true });

  // pixel is "ink" if all three channels < THRESHOLD (i.e. dark, part of the logo)
  const THRESHOLD = 200;
  let minX = W, minY = H, maxX = 0, maxY = 0;
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const i = (y * W + x) * 3;
      const r = data[i], g = data[i + 1], b = data[i + 2];
      if (r < THRESHOLD && g < THRESHOLD && b < THRESHOLD) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }
  // small padding so anti-aliasing edges don't get cropped
  const PAD = 8;
  return {
    left: Math.max(0, minX - PAD),
    top: Math.max(0, minY - PAD),
    width: Math.min(W, maxX - minX + PAD * 2),
    height: Math.min(H, maxY - minY + PAD * 2),
  };
}

// Chroma-key: turn white-ish pixels transparent, keep dark pixels opaque.
// Soft cutoff so anti-aliased edges blend smoothly.
async function keyOutWhite(buffer: Buffer, width: number, height: number) {
  const { data, info } = await sharp(buffer).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const channels = info.channels; // should be 4
  const out = Buffer.alloc(data.length);

  for (let i = 0; i < data.length; i += channels) {
    const r = data[i], g = data[i + 1], b = data[i + 2];
    // luminance approximation
    const lum = (r + g + b) / 3;
    // soft alpha: white (lum=255) -> 0, mid-gray (lum=128) -> ~255
    let alpha;
    if (lum >= 245) alpha = 0;
    else if (lum <= 80) alpha = 255;
    else alpha = Math.round(255 * (245 - lum) / (245 - 80));

    out[i] = r;
    out[i + 1] = g;
    out[i + 2] = b;
    out[i + 3] = alpha;
  }
  return sharp(out, { raw: { width, height, channels: 4 } }).png().toBuffer();
}

async function main() {
  const box = await findBoundingBox();
  console.log(`Detected logo bbox: ${JSON.stringify(box)}`);

  const cropped = await sharp(SRC).extract(box).toBuffer();
  const transparent = await keyOutWhite(cropped, box.width, box.height);

  writeFileSync(OUT, transparent);
  const outMeta = await sharp(OUT).metadata();
  console.log(`Wrote ${OUT} — ${outMeta.width}x${outMeta.height} px`);
}

main().catch((e) => { console.error(e); process.exit(1); });
