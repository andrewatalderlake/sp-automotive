"use client";
import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";
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

function Wordmarks({ items }: { items: string[] }) {
  return (
    <p className="flex flex-wrap items-baseline gap-x-5 gap-y-3 md:gap-x-8 font-display uppercase tracking-[0.10em] text-ink/85 text-sm md:text-base leading-tight">
      {items.map((item, i) => (
        <span key={item} className="inline-flex items-baseline gap-x-5 md:gap-x-8">
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
      className="trust-strip relative w-full bg-paper border-y border-ink/10 px-6 py-14 md:px-10 md:py-20"
    >
      <div className="trust-strip__row mx-auto max-w-6xl">
        <p className="eyebrow text-graphite">{"// Reach us"}</p>
        <p className="mt-4 flex flex-wrap items-baseline gap-x-5 gap-y-3 md:gap-x-8 font-display uppercase tracking-[0.10em] text-ink/85 text-sm md:text-base leading-tight">
          <span>{CITY}, {REGION}</span>
          <span aria-hidden className="text-ink/25">·</span>
          <a
            href={PHONE_HREF}
            aria-label={`Call ${PHONE}`}
            className="link-underline hover:text-ink transition-colors"
          >
            {PHONE}
          </a>
          <span aria-hidden className="text-ink/25">·</span>
          <span>By appointment</span>
          <span aria-hidden className="text-ink/25">·</span>
          <span>{HOURS_LABEL}</span>
        </p>
      </div>
      <div className="trust-strip__row mx-auto mt-10 max-w-6xl md:mt-14">
        <p className="eyebrow text-graphite">{"// We work with"}</p>
        <div className="mt-4">
          <Wordmarks items={CARRIERS} />
        </div>
      </div>
      <div className="trust-strip__row mx-auto mt-10 max-w-6xl md:mt-14">
        <p className="eyebrow text-graphite">{"// We restore"}</p>
        <div className="mt-4">
          <Wordmarks items={MAKES} />
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
