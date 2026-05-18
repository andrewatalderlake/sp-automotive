"use client";

import { motion, useReducedMotion } from "framer-motion";

// Animated SVG paths that flow across the viewport. Adapted from the
// user-provided BackgroundPaths reference to fit this codebase:
//   1. Dropped the hero title + shadcn Button wrapper — we use this purely as
//      a background layer behind FAQ content.
//   2. Stroke color is driven by `text-bone` (currentColor → --color-bone)
//      instead of the source's slate/white dark-mode toggle, since the app
//      is dark-only.
//   3. strokeOpacity ramp lowered from (0.10 + i·0.03) → (0.04 + i·0.004),
//      capping near 0.18 so the lines stay ambient and never compete with
//      FAQ copy on the #0E0F11 background.
//   4. Wrapped in `fixed inset-0 -z-10 pointer-events-none aria-hidden` so a
//      single mount underlays every section of the FAQ page and stays in
//      view while the user scrolls.
//   5. Per-path durations use `20 + ((i * 7) % 10)` (20–29s, stride-
//      coprime modulus). The source used `Math.random()` for this which
//      trips `react-hooks/purity`; the modulus is deterministic but
//      preserves the desync that produces the original cascade — each
//      path snaps from `pathLength: 1` back to its `initial: 0.3` at a
//      different time, so the layer reads as a wave of strokes drawing
//      and redrawing themselves rather than a synced pulse. With 20
//      paths per layer (i = 0..19) the modulus still emits all 10
//      distinct durations, so the cascade is preserved.
//   6. 20 paths per layer (40 total) — down from the source's 36 each.
//      The reference was a single-viewport hero; here this underlays a
//      long scrollable page, so the ambient layer is kept cheap to
//      composite (120 property animations instead of 216).
//   7. Honors `prefers-reduced-motion`: when set, `BackgroundPaths`
//      returns null. The element is aria-hidden decoration, so removing
//      it entirely is the cleanest opt-out and matches the codebase
//      pattern used by `RevealWords`, `SplitText`, et al.
//
// Slice preserveAspectRatio fills the viewport on both narrow and wide
// screens — curves extend well beyond the 696×316 viewBox, so cropping
// keeps the canvas covered without empty bands.

function FloatingPaths({ position }: { position: number }) {
  const paths = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    d: `M-${380 - i * 5 * position} -${189 + i * 6}C-${
      380 - i * 5 * position
    } -${189 + i * 6} -${312 - i * 5 * position} ${216 - i * 6} ${
      152 - i * 5 * position
    } ${343 - i * 6}C${616 - i * 5 * position} ${470 - i * 6} ${
      684 - i * 5 * position
    } ${875 - i * 6} ${684 - i * 5 * position} ${875 - i * 6}`,
    width: 0.5 + i * 0.03,
    // Deterministic per-path duration (20–29s). The source used Math.random,
    // which trips react-hooks/purity; a stride-coprime modulus gives the
    // same visual desync without an impure call during render — and the
    // desync is exactly what produces the staggered "one-by-one" cascade.
    duration: 20 + ((i * 7) % 10),
  }));

  return (
    <div className="absolute inset-0 pointer-events-none">
      <svg
        className="w-full h-full text-bone"
        viewBox="0 0 696 316"
        fill="none"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
      >
        {paths.map((path) => (
          <motion.path
            key={path.id}
            d={path.d}
            stroke="currentColor"
            strokeWidth={path.width}
            strokeOpacity={0.04 + path.id * 0.004}
            initial={{ pathLength: 0.3, opacity: 0.4 }}
            animate={{
              pathLength: 1,
              opacity: [0.2, 0.5, 0.2],
              pathOffset: [0, 1, 0],
            }}
            transition={{
              duration: path.duration,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
          />
        ))}
      </svg>
    </div>
  );
}

export default function BackgroundPaths() {
  const reduced = useReducedMotion();
  if (reduced) return null;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      <FloatingPaths position={1} />
      <FloatingPaths position={-1} />
    </div>
  );
}
