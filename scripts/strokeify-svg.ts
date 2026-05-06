// One-time: take potrace's filled-path SVG and convert it into a stroked, animated SVG.
// Each <path> gets a normalized length and a staggered "draw" animation via stroke-dashoffset.
// Run: bun scripts/strokeify-svg.ts
import { readFileSync, writeFileSync } from "fs";

const PATH = "/Users/abuts/Projects/sp-automotive/public/logos/sp-illustration.svg";

const TOTAL_DURATION_MS = 2500; // total time for all paths to finish drawing
const STAGGER_MS = 25;          // delay between successive paths

function main() {
  let svg = readFileSync(PATH, "utf-8");

  // Tag each <path> with sequential index n so we can stagger via CSS variable.
  let n = 0;
  svg = svg.replace(/<path /g, () => `<path data-n="${n++}" pathLength="100" `);

  // Strip any existing fill on <path>; replace transform-wrapped <g> fill.
  // Potrace usually emits a <g> wrapping all paths with fill="black" (or similar).
  // Strategy: we leave any group fill intact (in case fragments are needed) but override on the
  // path level via CSS so the brand color wins.

  // Inject a style block right after the opening <svg ...> tag.
  const style = `
  <style>
    path {
      fill: none;
      stroke: #ef4444; /* bright brand red — only place red appears on the site */
      stroke-width: 14;
      stroke-linecap: round;
      stroke-linejoin: round;
      stroke-dasharray: 100;
      stroke-dashoffset: 100;
      animation: heroLoaderDraw ${TOTAL_DURATION_MS}ms ease-out forwards;
      animation-delay: calc(var(--n, 0) * ${STAGGER_MS}ms);
      animation-iteration-count: infinite;
    }
    ${Array.from({ length: 200 }, (_, i) => `path[data-n="${i}"] { --n: ${i}; }`).join("\n    ")}
    @keyframes heroLoaderDraw {
      0%   { stroke-dashoffset: 100; opacity: 0; }
      10%  { opacity: 1; }
      70%  { stroke-dashoffset: 0; opacity: 1; }
      85%  { stroke-dashoffset: 0; opacity: 1; }
      100% { stroke-dashoffset: 0; opacity: 0; }
    }
  </style>`;
  svg = svg.replace(/<svg([^>]*)>/, (m, attrs) => `<svg${attrs}>${style}`);

  writeFileSync(PATH, svg);
  console.log(`Strokeified ${n} paths in ${PATH}`);
}

main();
