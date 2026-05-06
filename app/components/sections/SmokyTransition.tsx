"use client";

import { useId } from "react";
import { useReducedMotion } from "motion/react";

/**
 * SmokyTransition — full-width band of soft drifting smoke. Uses a real
 * fractal-noise texture (`/images/smoke-texture.png`, generated with
 * ImageMagick from layered plasma + blur + cool-gray tint) instead of a
 * gradient, so the result actually looks like clouds rather than a soft fade.
 *
 * Composition (back to front):
 *   1. Cool-gray base background — fills any pixels the texture doesn't reach.
 *   2. Smoke texture layer A — the main cloud structure, scaled up and slowly
 *      drifting via `smoke-drift-slow` (35s loop). 60% opacity so it doesn't
 *      get too heavy.
 *   3. Smoke texture layer B — the same texture mirrored and at a different
 *      scale, drifting via `smoke-drift-fast` (22s loop). Two layers at
 *      different speeds and orientations create the parallax-y, never-quite-
 *      tiling feel real fog has.
 *   4. SVG turbulence noise overlay — adds high-frequency grain so the whole
 *      band has texture down at the pixel level rather than reading flat.
 *   5. Top/bottom mask gradients — fade the band into whatever sits above and
 *      below so there are no hard horizontal seams.
 *
 * Stacking: the section is `relative z-20 pointer-events-none` so it can
 * be set with a negative bottom-margin in the parent layout to overlap the
 * top of the next section, where the sticky bird's-eye car will appear
 * BEHIND the smoke (the car emerges from the cloud as it scrolls down).
 */
export function SmokyTransition({ className = "" }: { className?: string }) {
  const reduce = useReducedMotion();
  // Per-instance ID so multiple SmokyTransitions on a page don't collide on
  // the SVG filter's global document id namespace.
  const filterId = useId();

  // Background-image sequence — the smoke texture, then a cool-gray base color
  // beneath it. Each layer is positioned independently so it can be scaled
  // and drifted without affecting the other.
  const textureUrl = "/images/smoke-texture.png";

  return (
    <section
      aria-hidden
      className={`relative z-20 w-full h-[35vh] lg:h-[45vh] overflow-hidden pointer-events-none ${className}`}
      style={{
        // ~15% fade at top and bottom so the smoke emerges from and dissolves
        // back into the surrounding background without a hard edge.
        WebkitMaskImage:
          "linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)",
        maskImage:
          "linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)",
      }}
    >
      {/* Base color — what shows through any thin spots in the texture */}
      <div className="absolute inset-0 bg-[#E2E6EB]" />

      {/* Slow drifting texture layer */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `url(${textureUrl})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: 0.7,
          animation: reduce ? "none" : "smoke-drift-slow 35s ease-in-out infinite",
          willChange: "transform",
        }}
      />

      {/* Faster, mirrored counter-drift layer for parallax / non-tiling feel */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `url(${textureUrl})`,
          backgroundSize: "140% 140%",
          backgroundPosition: "right top",
          transform: "scaleX(-1)", // mirrored — different visible texture vs layer A
          mixBlendMode: "screen",
          opacity: 0.55,
          animation: reduce ? "none" : "smoke-drift-fast 22s ease-in-out infinite",
          willChange: "transform",
        }}
      />

      {/* Subtle high-frequency grain via SVG turbulence so the band has
          micro-texture beyond the smooth cloud shapes. */}
      <svg
        className="absolute inset-0 h-full w-full opacity-25 mix-blend-overlay"
        preserveAspectRatio="none"
        viewBox="0 0 1200 400"
      >
        <filter id={filterId} x="0" y="0" width="100%" height="100%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.9"
            numOctaves="2"
            seed="5"
          />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0.85
                    0 0 0 0 0.88
                    0 0 0 0 0.92
                    0 0 0 0.6 0"
          />
        </filter>
        <rect width="100%" height="100%" filter={`url(#${filterId})`} />
      </svg>
    </section>
  );
}
