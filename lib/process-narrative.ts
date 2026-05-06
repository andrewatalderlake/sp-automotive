// Process scroll-narrative data: 6 cinematic beats, each with a backdrop image
// and a timeline of overlay elements that reveal as the user scrolls through the
// pinned section.
//
// To swap a backdrop: replace the file at the `image` path with a 16:9 photo
// (recommend 1920x1080 webp under 250KB). The component reads `image` directly,
// no rebuild required beyond the file replace.

export type Overlay =
  | { kind: "callout"; text: string; sub?: string; x: number; y: number; revealAt: number }
  | { kind: "layer"; label: string; thickness: string; revealAt: number }
  | { kind: "panel"; label: string; x: number; y: number; revealAt: number }
  | { kind: "torque"; spec: string; x: number; y: number; revealAt: number }
  | { kind: "gap"; measurement: string; x: number; y: number; revealAt: number };

export type Beat = {
  id: string;
  index: number;
  title: string;
  eyebrow: string;
  copy: string;
  /** Default is a hero-frame keyframe; replace the file at this path to swap in a detail shot. Keep aspect 16:9. */
  image: string;
  overlays: Overlay[];
  /** Show the PhoneCTA on this beat (final beat only). */
  showCta?: boolean;
};

export const BEATS: Beat[] = [
  {
    id: "assessment",
    index: 0,
    title: "The Assessment",
    eyebrow: "Step 01",
    copy: "Forensic walkthrough. Every panel, every gap, every component documented. Insurance adjusters get a report they can defend.",
    image: "/process-narrative/01-assessment.webp",
    overlays: [
      { kind: "callout", text: "12mm",   sub: "rocker dent",       x: 22, y: 68, revealAt: 0.00 },
      { kind: "callout", text: "4°",     sub: "suspension toe",    x: 70, y: 72, revealAt: 0.20 },
      { kind: "callout", text: "8 panels", sub: "out of tolerance", x: 18, y: 30, revealAt: 0.40 },
      { kind: "callout", text: "320 µm", sub: "factory paint depth", x: 75, y: 28, revealAt: 0.60 },
    ],
  },
  {
    id: "disassembly",
    index: 1,
    title: "The Disassembly",
    eyebrow: "Step 02",
    copy: "Every body panel removed. What insurance estimates miss — frame stress, hidden fractures, suspension misalignment — we find here.",
    image: "/process-narrative/02-disassembly.webp",
    overlays: [
      { kind: "panel", label: "Front bumper", x: 28, y: 60, revealAt: 0.00 },
      { kind: "panel", label: "Hood",         x: 50, y: 35, revealAt: 0.20 },
      { kind: "panel", label: "Quarter panel", x: 75, y: 55, revealAt: 0.40 },
      { kind: "panel", label: "Door skin",    x: 60, y: 70, revealAt: 0.60 },
    ],
  },
  {
    id: "diagnosis",
    index: 2,
    title: "The Diagnosis",
    eyebrow: "Step 03",
    copy: "Carbon-weave-level inspection. We mark damage, plan repairs, and decide what gets restored versus replaced. Factory tolerances are the only standard.",
    image: "/process-narrative/03-diagnosis.webp",
    overlays: [
      { kind: "callout", text: "0.4mm", sub: "micro-fracture",     x: 30, y: 45, revealAt: 0.00 },
      { kind: "callout", text: "ΔE 1.8", sub: "paint variance",    x: 70, y: 38, revealAt: 0.20 },
      { kind: "callout", text: "weld",  sub: "factory line — preserved", x: 25, y: 70, revealAt: 0.40 },
      { kind: "callout", text: "85 µm", sub: "primer thickness",   x: 72, y: 65, revealAt: 0.60 },
    ],
  },
  {
    id: "paint",
    index: 3,
    title: "The Paint",
    eyebrow: "Step 04",
    copy: "Same paint codes the factory uses. Same primer process. Same clear coat depth. Same gloss level. Layered, not sprayed.",
    image: "/process-narrative/04-paint.webp",
    overlays: [
      { kind: "layer", label: "Bare metal",  thickness: "—",      revealAt: 0.00 },
      { kind: "layer", label: "Primer",      thickness: "85 µm",  revealAt: 0.15 },
      { kind: "layer", label: "Base coat",   thickness: "60 µm",  revealAt: 0.30 },
      { kind: "layer", label: "Clear coat",  thickness: "55 µm",  revealAt: 0.45 },
      { kind: "layer", label: "Polish",      thickness: "factory", revealAt: 0.60 },
    ],
  },
  {
    id: "reassembly",
    index: 4,
    title: "The Reassembly",
    eyebrow: "Step 05",
    copy: "Every panel torque-spec installed. Every gap measured against factory data. The car doesn't leave until it's right.",
    image: "/process-narrative/05-reassembly.webp",
    overlays: [
      { kind: "torque", spec: "32 Nm",  x: 28, y: 35, revealAt: 0.00 },
      { kind: "torque", spec: "47 Nm",  x: 70, y: 30, revealAt: 0.13 },
      { kind: "torque", spec: "18 Nm",  x: 55, y: 60, revealAt: 0.26 },
      { kind: "torque", spec: "62 Nm",  x: 30, y: 70, revealAt: 0.39 },
      { kind: "gap",    measurement: "3.2 mm", x: 22, y: 50, revealAt: 0.52 },
      { kind: "gap",    measurement: "3.1 mm", x: 75, y: 50, revealAt: 0.65 },
      { kind: "gap",    measurement: "factory spec", x: 50, y: 80, revealAt: 0.78 },
    ],
  },
  {
    id: "return",
    index: 5,
    title: "The Return",
    eyebrow: "Step 06",
    copy: "Restored. Refreshed. Returned with a complete record and a written warranty. Welcome home.",
    image: "/process-narrative/06-return.webp",
    overlays: [],
    showCta: true,
  },
];
