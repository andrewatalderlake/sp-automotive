"use client";

import Image from "next/image";
import { useReducedMotion } from "framer-motion";

// Generic auto-scrolling logo marquee. Used by:
//   - CarrierMarquee (insurance carriers in §InsuranceHandling)
//   - MarqueMarquee (car marques in §FeaturedBuilds)
//
// Caller passes a typed items array. Each item supplies a name plus an
// optional logo path under /public. When `logo` is set, the marquee
// renders <Image> at uniform height; when null, it falls back to an
// Anton uppercase wordmark at the same height so a missing-asset
// state still ships and looks intentional.
//
// === Seamless-loop trick ===
// The items array is rendered FOUR times in one flat list. Each item
// carries its own right-padding (`pr-12 md:pr-16`), so the spacing
// AFTER every item is identical — including at every copy boundary.
// That makes the total track width exactly 4× one copy's width, so a
// `translate3d(-25%)` animation advances by exactly one copy's worth
// of items and the next copy lines up where the first started —
// seamless.
//
// Why 4× and not 2×: the track must stay wider than the viewport at
// every animation frame, otherwise the right edge of the track scrolls
// past the viewport's right edge mid-cycle and you see empty space.
// With N copies, a single copy only needs to be ≥ viewport_width /
// (N-1). At N=4 that's viewport/3 — comfortable on any common screen.
//
// (Using `gap-x-*` instead of `pr-*` leaves a half-gap unaccounted for
// at the copy boundary, which creates a different visible jump. Don't
// put it back.)

export type LogoMarqueeItem = {
  name: string;
  /** Path under /public, e.g. "/logos/carriers/state-farm.png". Leave
   *  null to fall back to the Anton wordmark text. */
  logo: string | null;
  /** Optional 0–1 multiplier on rendered logo height within its uniform
   *  container. Defaults to 1 (full container height). Useful for
   *  visually balancing tall heraldic shields (Ferrari, Lamborghini)
   *  against wide horizontal wordmarks at the same nominal height. */
  scale?: number;
};

// Row-height presets. Carriers ("small") sit quietly as supporting
// credibility — their logos are wordmarks designed to read at small
// sizes. Marques ("large") are the brand-promise beat (the cars we
// restore) and visually carry more weight; the car-brand emblems
// also have more detail that benefits from a taller render.
const ROW_HEIGHT = {
  small: "h-6 md:h-8",
  large: "h-10 md:h-14",
} as const;

type Props = {
  items: readonly LogoMarqueeItem[];
  /** Read out to screen readers as the list's accessible name. */
  ariaLabel: string;
  /** "small" for the carrier strip, "large" for the marque strip. */
  size?: keyof typeof ROW_HEIGHT;
};

export default function LogoMarquee({ items, ariaLabel, size = "small" }: Props) {
  const reduced = useReducedMotion();
  // Animated mode: render four copies of the list in a single flat <ul>
  // so the translate3d(-25%) keyframe lines up seamlessly (see header).
  // Reduced-motion mode: render one copy and let it wrap onto multiple
  // lines — the "final state with no animation" required by AGENTS.md
  // for a marquee means every logo must be visible, not a fragment
  // clipped by the parent's overflow-hidden.
  const list = reduced ? items : [...items, ...items, ...items, ...items];

  return (
    <div className="logo-marquee relative overflow-hidden">
      <ul
        aria-label={ariaLabel}
        className={
          reduced
            ? "flex flex-wrap items-center justify-center gap-x-12 md:gap-x-16 gap-y-4 list-none m-0 p-0"
            : "flex w-max items-center list-none m-0 p-0 logo-marquee__track"
        }
      >
        {list.map((item, i) => (
          <li
            key={`${item.name}-${i}`}
            // Only the first copy is announced; duplicates are decorative.
            // In reduced mode `list === items` so nothing gets hidden.
            aria-hidden={!reduced && i >= items.length ? true : undefined}
            className={`shrink-0 ${ROW_HEIGHT[size]} flex items-center ${reduced ? "" : "pr-12 md:pr-16"}`}
          >
            {item.logo ? (
              <Image
                src={item.logo}
                alt={item.name}
                width={160}
                height={48}
                style={
                  item.scale != null
                    ? {
                        transform: `scale(${item.scale})`,
                        transformOrigin: "center",
                      }
                    : undefined
                }
                className="h-full w-auto object-contain opacity-70 transition-opacity duration-300 hover:opacity-100"
              />
            ) : (
              <span className="font-display uppercase tracking-[0.10em] text-xs md:text-sm text-ink/85">
                {item.name}
              </span>
            )}
          </li>
        ))}
      </ul>

      <style jsx>{`
        .logo-marquee {
          /* Edge fades so the row dissolves into the section background
             instead of cutting at a hard line. 8% of the width on each
             side feels right at 1440px. */
          mask-image: linear-gradient(
            to right,
            transparent 0%,
            black 8%,
            black 92%,
            transparent 100%
          );
          -webkit-mask-image: linear-gradient(
            to right,
            transparent 0%,
            black 8%,
            black 92%,
            transparent 100%
          );
        }
        .logo-marquee__track {
          /* 40s loop — slow enough to read each logo as it passes; long
             enough that the eye doesn't sense the seam. */
          animation: logo-marquee-scroll 40s linear infinite;
          will-change: transform;
        }
        .logo-marquee:hover .logo-marquee__track {
          animation-play-state: paused;
        }
        @keyframes logo-marquee-scroll {
          0% {
            transform: translate3d(0, 0, 0);
          }
          100% {
            transform: translate3d(-25%, 0, 0);
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .logo-marquee__track {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
}
