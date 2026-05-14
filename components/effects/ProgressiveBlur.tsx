"use client";

import { motion, type HTMLMotionProps } from "framer-motion";

// Apple-style "iOS nav" gradient blur: stacks N layers of backdrop-filter,
// each masked to a contiguous slice along the chosen direction. Result:
// content blur intensity ramps from 0 → max along the chosen edge.
//
// Used on sp-auto to soften the §05 (dark workshop video) → Selected Work
// (paper) handoff — the bottom of §05 fades into blur instead of cutting
// abruptly. Could also be applied under the floating nav, at the top of
// any video-backed section, etc.
//
// Performance note: stacked backdrop-filter compounds. Each layer creates
// its own compositor layer; mobile Safari can get sluggish past ~5 layers.
// Default kept at 5 (down from the upstream snippet's 8) for that reason.

export const GRADIENT_ANGLES = {
  top: 0,
  right: 90,
  bottom: 180,
  left: 270,
} as const;

export type ProgressiveBlurProps = {
  direction?: keyof typeof GRADIENT_ANGLES;
  /** Number of stacked blur layers. More = smoother gradient, heavier paint. */
  blurLayers?: number;
  className?: string;
  /** Per-layer blur radius increment in px. Final layer blur = (layers-1) * intensity. */
  blurIntensity?: number;
} & HTMLMotionProps<"div">;

export function ProgressiveBlur({
  direction = "bottom",
  blurLayers = 5,
  className,
  blurIntensity = 0.25,
  ...props
}: ProgressiveBlurProps) {
  // segmentSize must derive from the CLAMPED layers value, not the raw
  // prop — otherwise blurLayers={1} (clamped to 2) ends up with two
  // layers whose mask windows both span the same mid-range slice
  // instead of forming a progressive gradient.
  const layers = Math.max(blurLayers, 2);
  const segmentSize = 1 / (layers + 1);

  // Caller owns positioning via className (typically `absolute inset-x-0
  // bottom-0 …` to overlay a section's bottom edge). We do NOT prepend
  // `relative` here — when both classes land on the same element,
  // Tailwind's generated CSS emits `.relative` after `.absolute` in the
  // position-utilities group, so `relative` wins via cascade and the
  // wrapper falls back into normal flow instead of overlaying. The inner
  // motion.div layers carry their own `absolute inset-0`, anchoring to
  // the nearest positioned ancestor (the caller's positioned wrapper).
  return (
    <div className={className ?? ""}>
      {Array.from({ length: layers }).map((_, index) => {
        const angle = GRADIENT_ANGLES[direction];
        const gradientStops = [
          index * segmentSize,
          (index + 1) * segmentSize,
          (index + 2) * segmentSize,
          (index + 3) * segmentSize,
        ].map(
          (pos, posIndex) =>
            `rgba(255, 255, 255, ${posIndex === 1 || posIndex === 2 ? 1 : 0}) ${pos * 100}%`,
        );

        const gradient = `linear-gradient(${angle}deg, ${gradientStops.join(", ")})`;

        return (
          // `{...props}` first so the essential mask + backdrop-filter
          // styles below always win — caller-supplied style/className
          // can't silently disable the gradient blur by collision.
          <motion.div
            key={index}
            {...props}
            className="pointer-events-none absolute inset-0 rounded-[inherit]"
            style={{
              maskImage: gradient,
              WebkitMaskImage: gradient,
              backdropFilter: `blur(${index * blurIntensity}px)`,
            }}
          />
        );
      })}
    </div>
  );
}
