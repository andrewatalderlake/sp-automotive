// One-time: generate 6 numbered gray placeholder hero frames at 1920x1080.
// Run: bun scripts/gen-hero-placeholders.ts
import sharp from "sharp";

const FRAMES = [
  { name: "01-wreck", shade: 30, label: "01 — WRECK" },
  { name: "02-explosion", shade: 60, label: "02 — EXPLOSION" },
  { name: "03-damaged-panel", shade: 90, label: "03 — DAMAGED PANEL" },
  { name: "04-painted-panel", shade: 130, label: "04 — PAINTED PANEL" },
  { name: "05-reassembly", shade: 170, label: "05 — REASSEMBLY" },
  { name: "06-reveal", shade: 220, label: "06 — REVEAL" },
];

const W = 1920;
const H = 1080;

async function main() {
  for (const f of FRAMES) {
    const svg = `
      <svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
        <rect width="${W}" height="${H}" fill="rgb(${f.shade},${f.shade},${f.shade})" />
        <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="120" font-weight="bold" fill="rgba(255,255,255,0.7)" text-anchor="middle" dominant-baseline="middle">${f.label}</text>
      </svg>
    `;
    const out = `/Users/abuts/Projects/sp-automotive/public/hero-frames/${f.name}.webp`;
    await sharp(Buffer.from(svg)).webp({ quality: 80 }).toFile(out);
    console.log(`Wrote ${out}`);
  }
}

main().catch((e) => { console.error(e); process.exit(1); });
