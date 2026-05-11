"use client";

import {
  siAudi,
  siBmw,
  siFerrari,
  siLamborghini,
  siMclaren,
  siPorsche,
} from "simple-icons";

import { BRANDS } from "@/components/brand/brands-data";

// Continuously-scrolling brand ticker. Emblem + brand name per item, looped
// for seamless scrolling. CSS @keyframes only — no carousel libraries, no
// rAF. Honors prefers-reduced-motion.
//
// Emblems come from the `simple-icons` package (monochrome SVG path data,
// tree-shaken named imports). BMW M reuses the BMW emblem since simple-icons
// has no M-specific mark.

type Emblem = { path: string };

const BRAND_EMBLEMS: Record<string, Emblem> = {
  lamborghini: siLamborghini,
  mclaren: siMclaren,
  audi: siAudi,
  "bmw-m": siBmw,
  ferrari: siFerrari,
  porsche: siPorsche,
};

export default function BrandShowcaseStrip() {
  const items = [...BRANDS, ...BRANDS];

  return (
    <section
      className="relative py-10 md:py-14 bg-ink/40 border-y border-divider overflow-hidden"
      aria-label="Brands we work on"
    >
      {/* Screen-reader fallback — the visual marquee is aria-hidden. */}
      <ul className="sr-only">
        {BRANDS.map((b) => (
          <li key={b.slug}>{b.name}</li>
        ))}
      </ul>

      <div aria-hidden className="relative">
        <div
          className="brand-strip-track flex items-center whitespace-nowrap"
          style={{ width: "max-content" }}
        >
          {items.map((b, i) => {
            const emblem = BRAND_EMBLEMS[b.brandKey];
            return (
              <div
                key={`${b.slug}-${i}`}
                className="flex items-center gap-4 md:gap-6 px-8 md:px-14 text-3xl md:text-5xl font-display tracking-wide text-bone uppercase"
              >
                {emblem && (
                  <svg
                    viewBox="0 0 24 24"
                    className="h-8 w-8 md:h-12 md:w-12 shrink-0 fill-current"
                    aria-hidden="true"
                  >
                    <path d={emblem.path} />
                  </svg>
                )}
                <span>{b.name}</span>
              </div>
            );
          })}
        </div>
      </div>

      <style>{`
        @keyframes brand-strip {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        .brand-strip-track {
          animation: brand-strip 60s linear infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .brand-strip-track {
            animation: none;
            transform: translateX(0);
          }
        }
      `}</style>
    </section>
  );
}
