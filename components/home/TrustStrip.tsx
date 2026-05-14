"use client";
import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";
import { MapPin } from "lucide-react";
import { CITY, REGION, PHONE, PHONE_HREF, HOURS_LABEL } from "@/lib/site";

// Trust strip — three horizontal rows immediately after the hero.
// First: where + how to reach us (Sarasota, phone, hours). Then the
// credibility beats: which insurance carriers we work with, and which
// makes/models we restore. The reach-us row surfaces contact info
// above the fold without depending on the sticky CTA bar or scrolling
// to the footer. Typography-only (no logos) so we don't have to source
// brand SVGs or argue with usage rights for v1.

const CARRIERS = [
  "State Farm",
  "Allstate",
  "GEICO",
  "Progressive",
  "USAA",
  "Liberty Mutual",
  "Chubb",
];

// Six prestige marques — aligned with the Footer nav links and the FAQ
// "models we work on" answer in lib/faq-data.ts. Trimmed from 9 (was
// wrapping to two rows awkwardly on desktop); the dropped marques
// (Mercedes-AMG, Aston Martin, Bentley) aren't promoted elsewhere on
// the site, so this is a single-source-of-truth alignment.
const MAKES = [
  "Ferrari",
  "Lamborghini",
  "McLaren",
  "Porsche",
  "Audi R8",
  "BMW M",
];

// Two-tier sizing so the row hierarchy reflects emotional weight:
//   small  — carriers (supporting credibility)
//   large  — marques (the "do you work on my car?" question, louder)
const WORDMARK_SIZE = {
  small: "text-xs md:text-sm gap-x-4 md:gap-x-6",
  large: "text-base md:text-xl gap-x-5 md:gap-x-8",
} as const;

function Wordmarks({
  items,
  size = "small",
}: {
  items: string[];
  size?: keyof typeof WORDMARK_SIZE;
}) {
  return (
    <p
      className={`flex flex-wrap items-baseline gap-y-3 font-display uppercase tracking-[0.10em] text-ink/85 leading-tight ${WORDMARK_SIZE[size]}`}
    >
      {items.map((item, i) => (
        <span
          key={item}
          className={`inline-flex items-baseline ${WORDMARK_SIZE[size].split(" ").slice(1).join(" ")}`}
        >
          {item}
          {i < items.length - 1 && (
            <span aria-hidden className="text-ink/25">
              ·
            </span>
          )}
        </span>
      ))}
    </p>
  );
}

export default function TrustStrip() {
  const sectionRef = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    if (reduced) {
      section.dataset.revealed = "1";
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) section.dataset.revealed = "1";
        }
      },
      { rootMargin: "-10% 0px -10% 0px", threshold: 0 },
    );
    io.observe(section);
    return () => io.disconnect();
  }, [reduced]);

  return (
    <section
      ref={sectionRef}
      aria-label="How to reach us, carriers we work with, and marques we restore"
      className="trust-strip relative w-full bg-paper border-y border-ink/15 px-6 py-14 md:px-10 md:py-20"
    >
      {/* Reach us — quiet single-line dateline. Deliberately styled
          differently from the carrier/marque rows below so practical
          info doesn't get flattened into the same wordmark register. */}
      <div className="trust-strip__row mx-auto max-w-6xl">
        <p className="flex flex-wrap items-baseline justify-center gap-x-3 gap-y-2 text-graphite text-sm md:text-base">
          <span className="inline-flex items-center gap-1.5 text-ink">
            <MapPin className="h-3.5 w-3.5 md:h-4 md:w-4" aria-hidden />
            {CITY}, {REGION}
          </span>
          <span aria-hidden className="text-graphite/30">·</span>
          <a
            href={PHONE_HREF}
            aria-label={`Call ${PHONE}`}
            className="link-underline text-ink hover:text-ignite transition-colors"
          >
            {PHONE}
          </a>
          <span aria-hidden className="text-graphite/30">·</span>
          <span>By appointment</span>
          <span aria-hidden className="text-graphite/30">·</span>
          <span>{HOURS_LABEL}</span>
        </p>
      </div>
      <div className="trust-strip__row mx-auto mt-10 max-w-6xl md:mt-14 pt-10 md:pt-14 border-t border-ink/15">
        <p className="eyebrow text-graphite">{"// We work with"}</p>
        <div className="mt-4">
          <Wordmarks items={CARRIERS} size="small" />
        </div>
      </div>
      <div className="trust-strip__row mx-auto mt-10 max-w-6xl md:mt-14">
        <p className="eyebrow text-graphite">{"// We restore"}</p>
        <div className="mt-4">
          <Wordmarks items={MAKES} size="large" />
        </div>
      </div>

      <style jsx>{`
        :global(.trust-strip__row) {
          opacity: 0;
          transform: translateY(8px);
          transition:
            opacity var(--motion-shutter, 600ms)
              cubic-bezier(0.83, 0, 0.17, 1),
            transform var(--motion-shutter, 600ms)
              cubic-bezier(0.83, 0, 0.17, 1);
        }
        :global(.trust-strip[data-revealed="1"] .trust-strip__row) {
          opacity: 1;
          transform: translateY(0);
        }
        :global(
            .trust-strip[data-revealed="1"]
              .trust-strip__row:nth-child(1)
          ) {
          transition-delay: 120ms;
        }
        :global(
            .trust-strip[data-revealed="1"]
              .trust-strip__row:nth-child(2)
          ) {
          transition-delay: 260ms;
        }
        :global(
            .trust-strip[data-revealed="1"]
              .trust-strip__row:nth-child(3)
          ) {
          transition-delay: 400ms;
        }
        @media (prefers-reduced-motion: reduce) {
          :global(.trust-strip__row) {
            transition: none;
          }
        }
      `}</style>
    </section>
  );
}
