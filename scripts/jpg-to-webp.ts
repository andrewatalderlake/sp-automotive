// Convert all hero-clips/frames/*.jpg to webp using sharp for ~60% smaller files.
// Run: bun scripts/jpg-to-webp.ts
import sharp from "sharp";
import { readdirSync, statSync, unlinkSync } from "fs";
import { join } from "path";

const DIR = "/Users/abuts/Projects/sp-automotive/public/hero-clips/frames";

async function main() {
  const files = readdirSync(DIR).filter((f) => f.endsWith(".jpg")).sort();
  console.log(`Converting ${files.length} JPGs to WebP...`);
  let totalIn = 0, totalOut = 0;
  for (const f of files) {
    const inPath = join(DIR, f);
    const outPath = inPath.replace(/\.jpg$/, ".webp");
    totalIn += statSync(inPath).size;
    await sharp(inPath).webp({ quality: 78, effort: 4 }).toFile(outPath);
    totalOut += statSync(outPath).size;
    unlinkSync(inPath);
  }
  console.log(`Done. JPG total: ${(totalIn / 1024 / 1024).toFixed(1)} MB → WebP total: ${(totalOut / 1024 / 1024).toFixed(1)} MB`);
}

main().catch((e) => { console.error(e); process.exit(1); });
