"use client";
import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";
import { MapPin } from "lucide-react";
import { CITY, REGION, PHONE, PHONE_HREF, HOURS_LABEL } from "@/lib/site";

// Reach-us dateline immediately after the hero — single quiet row of
// location / phone / appointment / hours. The carrier and marque rows
// that used to live here moved into the sections where they're the
// actual subject (§InsuranceHandling and §FeaturedBuilds).

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
      aria-label="How to reach us"
      className="trust-strip relative w-full bg-paper border-y border-ink/15 px-6 py-8 md:px-10 md:py-10"
    >
      <div className="trust-strip__row mx-auto max-w-6xl">
        <p className="flex flex-wrap items-baseline justify-center gap-x-3 gap-y-2 text-ink/80 text-sm md:text-base">
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

      <style jsx>{`
        :global(.trust-strip__row) {
          opacity: 0;
          transform: translateY(8px);
          transition:
            opacity var(--motion-shutter, 600ms)
              cubic-bezier(0.83, 0, 0.17, 1),
            transform var(--motion-shutter, 600ms)
              cubic-bezier(0.83, 0, 0.17, 1);
          transition-delay: 120ms;
        }
        :global(.trust-strip[data-revealed="1"] .trust-strip__row) {
          opacity: 1;
          transform: translateY(0);
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
