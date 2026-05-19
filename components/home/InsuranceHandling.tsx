"use client";
import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";
import SplitText from "@/components/effects/SplitText";
import Surface from "@/components/ui/Surface";
import CarrierMarquee from "@/components/home/CarrierMarquee";

// §02 Carrier-side advocacy. Mirrors the §05 composition: section label
// top-left, display headline on the canvas, row of three light cards
// below connected by a hairline that draws across on reveal. No per-
// section backdrop — the html canvas ink gradient shows through. Cards
// describe the three phases of how the claim is handled. Closes with a
// "// We work with" carrier marquee — relocated from TrustStrip so the
// carrier list lives where carriers are the actual subject. The carrier
// data + render logic lives in CarrierMarquee; real SVG logos drop into
// /public/logos/carriers/ to swap out the wordmark fallback.

const SCRUB_TIME = 11; // unchanged — keeps PageScrubVideo waypoint timing

const PHASES = [
  {
    n: "01",
    label: "Document",
    body: "Photos, OEM line items, scope of damage. Built before the carrier sees it.",
  },
  {
    n: "02",
    label: "Supplement",
    body: "Frame, paint, ADAS, diminished value. Re-priced in OEM terms, not their averages.",
  },
  {
    n: "03",
    label: "Negotiate",
    body: "Adjuster to estimator. Until the carrier pays for the car you actually own.",
  },
];

export default function InsuranceHandling() {
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
      { rootMargin: "-100px 0px -100px 0px", threshold: 0 },
    );
    io.observe(section);
    return () => io.disconnect();
  }, [reduced]);

  return (
    <section
      ref={sectionRef}
      aria-labelledby="insurance-handling-heading"
      data-scrub-time={SCRUB_TIME}
      // Pin the StickyContactBar's first appearance to this section so
      // it enters in light theme instead of popping in dark over
      // MeetSerge and flipping the moment this section arrives.
      data-sticky-bar-anchor
      className="insurance-handling relative w-full overflow-hidden bg-paper text-ink px-6 py-20 md:px-10 md:py-28 border-t border-ink/15"
    >
      <div className="relative z-10 mx-auto max-w-7xl">
        {/* Section label — Anton uppercase, no chapter numeral. */}
        <p className="font-display uppercase tracking-[0.10em] text-left text-ink text-3xl md:text-5xl leading-none">
          Carrier-side advocacy
        </p>

        {/* Display headline — left-aligned to the section-label edge. */}
        <div className="mt-10 md:mt-14 max-w-5xl">
          <SplitText
            as="h2"
            id="insurance-handling-heading"
            className="display-md leading-[1.05] text-ink"
            reveal="mount"
            mountDelayMs={400}
            staggerMs={24}
          >
            {"We fight the file.\nYou stay out of it."}
          </SplitText>
        </div>

        {/* Three light phase cards. Hairline connector draws across on reveal. */}
        <div className="relative mt-12 md:mt-16">
          <span
            aria-hidden
            className="insurance-handling__connector hidden md:block absolute left-[8%] right-[8%] top-[44%] h-px origin-left bg-ink/15"
          />
          <ol className="relative grid grid-cols-1 gap-6 md:grid-cols-3">
            {PHASES.map((phase, i) => (
              <li
                key={phase.n}
                className="insurance-handling__card"
                style={{ "--i": i } as React.CSSProperties}
              >
                {/* Card pattern mirrors §05 HowItWorks: big numeral as the
                    visual hero + 48px hairline rule + headline + body
                    bottom-anchored via flex+mt-auto. Drops the redundant
                    "Phase 01" eyebrow and the faint watermark numeral.
                    Hover treatment matches the FeaturedBuilds light cards
                    (lift + deeper shadow). aria-label on the numeral
                    preserves the "Phase XX" SR semantic. */}
                <Surface
                  variant="light"
                  className="relative flex h-full flex-col rounded-2xl p-7 md:p-8 text-left transition duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_36px_60px_-30px_rgba(14,15,17,0.4)] motion-reduce:transition-none motion-reduce:hover:translate-y-0"
                >
                  <div
                    aria-label={`Phase ${phase.n}`}
                    className="font-display leading-none tracking-[-0.03em] text-ink text-5xl md:text-6xl"
                  >
                    {phase.n}
                  </div>
                  <span aria-hidden className="mt-5 block h-px w-12 bg-ink/25" />
                  <h3 className="mt-5 font-display text-2xl md:text-3xl leading-tight text-ink">
                    {phase.label}
                  </h3>
                  <p className="mt-auto pt-4 text-ink/80">{phase.body}</p>
                </Surface>
              </li>
            ))}
          </ol>

          <p className="mt-10 text-ink/80 max-w-2xl">
            You don&apos;t sit on the phone. You see the number that came back.
          </p>
        </div>

        {/* Carrier strip — relocated from TrustStrip. Lives here because
            this is the section where carriers are the actual subject. */}
        <div className="insurance-handling__carriers mt-12 md:mt-16 pt-10 md:pt-14 border-t border-ink/10">
          <p className="eyebrow text-graphite">{"// We work with"}</p>
          <div className="mt-6 -mx-6 md:-mx-10">
            {/* Negative margin pulls the marquee edge-to-edge of the
                section padding so the mask gradient fades against the
                section edge, not against the inner container. */}
            <CarrierMarquee />
          </div>
        </div>
      </div>

      <style jsx>{`
        .insurance-handling__connector {
          transform: scaleX(0);
          transition: transform var(--motion-shutter, 600ms)
            cubic-bezier(0.83, 0, 0.17, 1);
          transition-delay: 360ms;
        }
        .insurance-handling[data-revealed="1"] .insurance-handling__connector {
          transform: scaleX(1);
        }
        :global(.insurance-handling__card) {
          opacity: 0;
          transform: translateY(16px);
          transition:
            opacity var(--motion-shutter, 600ms)
              cubic-bezier(0.83, 0, 0.17, 1),
            transform var(--motion-shutter, 600ms)
              cubic-bezier(0.83, 0, 0.17, 1);
          transition-delay: calc(240ms + var(--i) * 80ms);
        }
        :global(
            .insurance-handling[data-revealed="1"] .insurance-handling__card
          ) {
          opacity: 1;
          transform: translateY(0);
        }
        @media (prefers-reduced-motion: reduce) {
          .insurance-handling__connector,
          :global(.insurance-handling__card) {
            transition: none;
          }
        }
      `}</style>
    </section>
  );
}
