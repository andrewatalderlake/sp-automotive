// One-time: vectorize sp-illustration.png to a true SVG with <path> elements via potrace.
// Run: bun scripts/vectorize-illustration.ts
import sharp from "sharp";
import { writeFileSync, readFileSync } from "fs";
import { spawnSync } from "child_process";

const SRC = "/Users/abuts/Projects/sp-automotive/public/logos/sp-illustration.png";
const PGM = "/tmp/sp-illustration.pgm";
const OUT = "/Users/abuts/Projects/sp-automotive/public/logos/sp-illustration.svg";

async function main() {
  // Step 1: load PNG, flatten any transparency to white bg, grayscale, threshold to B&W,
  // output raw 8-bit grayscale buffer.
  const { data, info } = await sharp(SRC)
    .flatten({ background: { r: 255, g: 255, b: 255 } })
    .grayscale()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const W = info.width!;
  const H = info.height!;

  // Step 2: write as PGM (Portable GreyMap, P5 binary). Potrace accepts this.
  // Format: "P5\n<w> <h>\n<maxval>\n<binary 8-bit data>"
  const header = Buffer.from(`P5\n${W} ${H}\n255\n`);
  const pgm = Buffer.concat([header, data]);
  writeFileSync(PGM, pgm);
  console.log(`Wrote PGM: ${PGM} (${W}x${H}, ${pgm.length} bytes)`);

  // Step 3: run potrace to produce SVG with real <path> elements
  // -s = SVG output
  // -t 5 = suppress speckles up to 5 pixels (cleans noise)
  // -k 0.5 = threshold (0.5 means anything darker than mid-gray is black)
  // -O 0.4 = curve optimization
  const res = spawnSync("potrace", [
    "-s",
    "-o", OUT,
    "-t", "5",
    "-O", "0.4",
    "-k", "0.5",
    PGM,
  ], { stdio: "inherit" });

  if (res.status !== 0) {
    console.error(`potrace failed with status ${res.status}`);
    process.exit(1);
  }

  // Step 4: report
  const svg = readFileSync(OUT, "utf-8");
  const pathCount = (svg.match(/<path/g) || []).length;
  console.log(`Wrote SVG: ${OUT} (${(svg.length / 1024).toFixed(1)} KB, ${pathCount} <path> elements)`);
}

main().catch((e) => { console.error(e); process.exit(1); });
