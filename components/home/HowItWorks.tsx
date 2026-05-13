"use client";
import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";
import AmbientVideo from "@/components/effects/AmbientVideo";
import SplitText from "@/components/effects/SplitText";
import Surface from "@/components/ui/Surface";

// Section 05 — How It Works. Bridges the "what we do" chapters (02-04)
// into the gallery. Composition is deliberately distinct from the
// corner-anchored CornerSection pattern: display-bleed headline at the top,
// four glass step cards in a horizontal row connected by a hairline.
//
// Background: the OOF workshop clip plays as an autoplay loop (not scroll-
// scrubbed) — the OOF nature of the clip means it reads as ambient texture
// without demanding attention.
//
// Animations: cards stagger-translate-up on viewport entry; the connecting
// hairline draws left -> right after card 01 lands.

const SCRUB_TIME = 28; // sits after BodyworkAndEstimates (scrubTime=24)

const STEPS = [
  {
    n: "01",
    label: "Send photos",
    body: "Text us the damage. We come back with a number, fast.",
  },
  {
    n: "02",
    label: "We come to you",
    body: "Mobile estimate at your home or storage. Mon-Sat. No tow required.",
  },
  {
    n: "03",
    label: "We work the file",
    body: "Supplements, documentation, carrier negotiation — handled end-to-end.",
  },
  {
    n: "04",
    label: "You walk away whole",
    body: "Settlement plus repair completed. Indoor storage while we wait.",
  },
];

export default function HowItWorks() {
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
      aria-labelledby="how-it-works-heading"
      data-scrub-time={SCRUB_TIME}
      data-theme="dark"
      className="how-it-works relative min-h-[110svh] w-full overflow-hidden px-6 py-20 md:px-10 md:py-28"
    >
      {/* Workshop OOF backdrop — autoplay loop, no scroll scrub. The clip
          is intentionally out-of-focus so a continuous loop reads as
          ambient atmosphere rather than literal action. AmbientVideo
          swaps to a static poster for prefers-reduced-motion users. */}
      <AmbientVideo
        src="/chapter-clips/05-workshop.mp4"
        poster="/chapter-clips/05-workshop-poster.jpg"
      />

      {/* Chapter mark — same convention as CornerSection. */}
      <div className="relative z-10">
        <div className="font-display leading-none tracking-[-0.02em] text-3xl md:text-5xl text-bone">
          05
        </div>
        <p className="eyebrow mt-2 text-graphite">/ How it works</p>
      </div>

      {/* Display-bleed headline. Lives in the canvas, NOT inside a glass
          card — matches the hero recipe. */}
      <div className="relative z-10 mx-auto mt-16 max-w-6xl md:mt-24">
        <SplitText
          as="h2"
          id="how-it-works-heading"
          className="display-md leading-[1.05] text-bone"
          reveal="mount"
          mountDelayMs={400}
          staggerMs={24}
        >
          {"Four steps.\nOne phone number."}
        </SplitText>
      </div>

      {/* Four glass step cards. Hairline connector draws across when the
          section reveals. On mobile, cards stack vertically and the
          connector hides. */}
      <div className="relative z-10 mx-auto mt-16 max-w-7xl md:mt-24">
        {/* Hairline connector. Sits absolutely, only painted on md+. */}
        <span
          aria-hidden
          className="how-it-works__connector hidden md:block absolute left-[8%] right-[8%] top-[44%] h-px origin-left bg-bone/15"
        />
        <ol className="relative grid grid-cols-1 gap-8 md:grid-cols-4 md:gap-6">
          {STEPS.map((step, i) => (
            <li
              key={step.n}
              className="how-it-works__card"
              style={{ "--i": i } as React.CSSProperties}
            >
              <Surface variant="glass" className="relative h-full rounded-2xl p-7 md:p-8 text-left">
                {/* Step number sits oversize behind the body text. */}
                <span
                  aria-hidden
                  className="pointer-events-none absolute right-5 top-3 font-display leading-none tracking-[-0.02em] text-bone/[0.18] text-[5rem] md:text-[6rem]"
                >
                  {step.n}
                </span>
                <p className="eyebrow text-graphite">Step {step.n}</p>
                <h3 className="mt-3 font-display text-2xl md:text-3xl leading-tight text-bone">
                  {step.label}
                </h3>
                <p className="mt-4 text-bone/80">{step.body}</p>
              </Surface>
            </li>
          ))}
        </ol>
      </div>

      <style jsx>{`
        .how-it-works__connector {
          transform: scaleX(0);
          transition: transform var(--motion-shutter, 600ms)
            cubic-bezier(0.83, 0, 0.17, 1);
          transition-delay: 360ms;
        }
        .how-it-works[data-revealed="1"] .how-it-works__connector {
          transform: scaleX(1);
        }
        :global(.how-it-works__card) {
          opacity: 0;
          transform: translateY(16px);
          transition:
            opacity var(--motion-shutter, 600ms)
              cubic-bezier(0.83, 0, 0.17, 1),
            transform var(--motion-shutter, 600ms)
              cubic-bezier(0.83, 0, 0.17, 1);
          transition-delay: calc(240ms + var(--i) * 80ms);
        }
        :global(.how-it-works[data-revealed="1"] .how-it-works__card) {
          opacity: 1;
          transform: translateY(0);
        }
        @media (prefers-reduced-motion: reduce) {
          .how-it-works__connector,
          :global(.how-it-works__card) {
            transition: none;
          }
        }
      `}</style>
    </section>
  );
}
