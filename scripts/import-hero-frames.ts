// One-time: import + convert real hero photos to optimized WebP at the manifest paths.
// Run: bun scripts/import-hero-frames.ts
import sharp from "sharp";
import { existsSync } from "fs";

const SRC = "/Users/abuts/Desktop/Serges web photos";
const DEST = "/Users/abuts/Projects/sp-automotive/public/hero-frames";

// ordered: source file → target frame file
const MAPPING: { src: string; out: string }[] = [
  { src: `${SRC}/wreck\\.jpg`,             out: `${DEST}/01-wreck.webp` },
  { src: `${SRC}/parts explosion 2 .jpg`,  out: `${DEST}/02-explosion.webp` },
  { src: `${SRC}/damaged panal.jpg`,       out: `${DEST}/03-damaged-panel.webp` },
  { src: `${SRC}/panal transition.jpg`,    out: `${DEST}/04-painted-panel.webp` },
  { src: `${SRC}/fixed panal.jpg`,         out: `${DEST}/05-reassembly.webp` },
  { src: `${SRC}/fixed car.jpg`,           out: `${DEST}/06-reveal.webp` },
];

async function main() {
  for (const { src, out } of MAPPING) {
    if (!existsSync(src)) {
      console.error(`MISSING: ${src}`);
      process.exit(1);
    }
    const meta = await sharp(src).metadata();
    await sharp(src)
      .resize({ width: 1920, withoutEnlargement: true })
      .webp({ quality: 85, effort: 4 })
      .toFile(out);
    const outMeta = await sharp(out).metadata();
    console.log(
      `${src.split("/").pop()} (${meta.width}x${meta.height}) → ${out.split("/").pop()} (${outMeta.width}x${outMeta.height}, ${(outMeta.size! / 1024).toFixed(0)} KB)`
    );
  }
}

main().catch((e) => { console.error(e); process.exit(1); });
