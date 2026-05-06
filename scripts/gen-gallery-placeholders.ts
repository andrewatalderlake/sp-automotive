// One-time: generate 8 placeholder JPGs (4 before/after pairs) for the gallery.
// Run: bun scripts/gen-gallery-placeholders.ts
import sharp from "sharp";

const W = 1600;
const H = 1200;

const pairs = [
  { id: 1, beforeShade: 40, afterShade: 200, label: "LAMBORGHINI HURACÁN" },
  { id: 2, beforeShade: 50, afterShade: 195, label: "MCLAREN 720S" },
  { id: 3, beforeShade: 60, afterShade: 205, label: "AUDI R8" },
  { id: 4, beforeShade: 45, afterShade: 200, label: "BMW M4" },
];

async function main() {
  for (const p of pairs) {
    for (const phase of ["before", "after"] as const) {
      const shade = phase === "before" ? p.beforeShade : p.afterShade;
      const accent = phase === "before" ? "#737373" : "#F5F5F5";
      const svg = `
        <svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
          <rect width="${W}" height="${H}" fill="rgb(${shade},${shade},${shade})" />
          <text x="50%" y="46%" font-family="Arial, sans-serif" font-size="80" font-weight="bold" fill="${accent}" text-anchor="middle" dominant-baseline="middle">${p.label}</text>
          <text x="50%" y="56%" font-family="Arial, sans-serif" font-size="60" font-weight="bold" fill="${accent}" text-anchor="middle" dominant-baseline="middle">${phase.toUpperCase()}</text>
        </svg>
      `;
      const out = `/Users/abuts/Projects/sp-automotive/public/before-after/0${p.id}-${phase}.jpg`;
      await sharp(Buffer.from(svg)).jpeg({ quality: 80 }).toFile(out);
      console.log(`Wrote ${out}`);
    }
  }
}

main().catch((e) => { console.error(e); process.exit(1); });
