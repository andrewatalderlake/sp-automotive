"use client";
import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";
import SplitText from "@/components/effects/SplitText";
import Surface from "@/components/ui/Surface";

// Chapter 02 — Carrier-side advocacy. Mirrors the §05 composition:
// chapter mark top-left, display-bleed headline on the canvas, row of
// three glass cards below connected by a hairline that draws across on
// reveal. No per-section backdrop — the html canvas ink gradient shows
// through. Cards describe the three phases of how the claim is handled.

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
      { rootMargin: "-15% 0px -15% 0px", threshold: 0 },
    );
    io.observe(section);
    return () => io.disconnect();
  }, [reduced]);

  return (
    <section
      ref={sectionRef}
      aria-labelledby="insurance-handling-heading"
      data-scrub-time={SCRUB_TIME}
      className="insurance-handling relative w-full overflow-hidden bg-paper text-ink px-6 py-20 md:px-10 md:py-28"
    >
      <div className="relative z-10 mx-auto max-w-7xl">
        {/* Chapter mark — Lambo-style section label: bigger numeral + Anton
            uppercase label inline. Reads as a confident section header. */}
        <div className="flex flex-wrap items-baseline gap-x-5 gap-y-2">
          <div className="font-display leading-none tracking-[-0.02em] text-4xl md:text-6xl text-ink">
            02
          </div>
          <p className="font-display uppercase tracking-[0.10em] text-ink text-lg md:text-2xl leading-none">
            Carrier-side advocacy
          </p>
        </div>

        {/* Display headline — left-aligned to the chapter mark's edge. */}
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
                <Surface
                  variant="light"
                  className="relative h-full rounded-2xl p-7 md:p-8 text-left"
                >
                  <span
                    aria-hidden
                    className="pointer-events-none absolute right-5 top-3 font-display leading-none tracking-[-0.02em] text-ink/[0.10] text-[5rem] md:text-[6rem]"
                  >
                    {phase.n}
                  </span>
                  <p className="eyebrow text-graphite">Phase {phase.n}</p>
                  <h3 className="mt-3 font-display text-2xl md:text-3xl leading-tight text-ink">
                    {phase.label}
                  </h3>
                  <p className="mt-4 text-ink/80">{phase.body}</p>
                </Surface>
              </li>
            ))}
          </ol>

          <p className="mt-10 text-graphite max-w-2xl">
            You don&apos;t sit on the phone. You see the number that came back.
          </p>
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
