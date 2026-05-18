"use client";
import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";
import AmbientVideo from "@/components/effects/AmbientVideo";
import SplitText from "@/components/effects/SplitText";
import Surface from "@/components/ui/Surface";
import PhoneCTA from "@/components/ui/PhoneCTA";
import SmsCTA from "@/components/ui/SmsCTA";

// Chapter 04 — Estimate without the haul. Asymmetric layout, distinct
// from §02 (text-only cards) and §03 (single hero photo). Three glass
// cards side-by-side, each a different kind: a photo card (sunset tablet
// on a hood), a steps card (compact list of the three phases of the
// visit), and a CTA card (heading + phone/SMS buttons). All three cards
// stretch to equal height. The single ignite-red dot accents step 03.

const SCRUB_TIME = 24;

export default function BodyworkAndEstimates() {
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
      aria-labelledby="bodywork-estimates-heading"
      data-scrub-time={SCRUB_TIME}
      className="bodywork-estimates relative w-full overflow-hidden bg-paper text-ink px-6 py-20 md:px-10 md:py-28 border-t border-ink/15"
    >
      <div className="relative z-10 mx-auto max-w-7xl">
        {/* Section label — Anton uppercase, no chapter numeral. */}
        <p className="font-display uppercase tracking-[0.10em] text-left text-ink text-3xl md:text-5xl leading-none">
          Estimate without the haul
        </p>

        <div className="mt-10 md:mt-14 max-w-4xl">
          <SplitText
            as="h2"
            id="bodywork-estimates-heading"
            className="display-md leading-[1.05] text-ink"
            reveal="mount"
            mountDelayMs={400}
            staggerMs={24}
          >
            {"We come to you."}
          </SplitText>
        </div>

        {/* Two-card composition: ambient video on the left, CTA on the
            right. The middle "// The path" steps card was dropped — it
            duplicated §05's 4-step list and competed for attention with
            no narrative payoff unique to this section. items-stretch
            keeps both cards equal height. */}
        <div className="mt-12 md:mt-16">
          <div className="grid grid-cols-1 items-stretch gap-6 md:grid-cols-2 md:gap-6">

          {/* Card 1 — ambient video of an inspection lamp passing over a
              carbon-fiber panel + gloved hands hovering over the weave.
              Replaces the previous static estimate-tablet photo. Autoplay
              loop with a poster fallback for reduced-motion users
              (AmbientVideo handles the swap). */}
          <div
            className="bodywork-estimates__card"
            style={{ "--i": 0 } as React.CSSProperties}
          >
            <Surface
              variant="light"
              className="relative h-full overflow-hidden rounded-2xl p-0"
            >
              <div className="relative h-full min-h-[18rem] w-full bg-ink">
                <AmbientVideo
                  src="/chapter-clips/04-estimate.mp4"
                  poster="/chapter-clips/04-estimate-poster.jpg"
                />
              </div>
            </Surface>
          </div>

            {/* Card 2 — CTA. Heading + closing line + phone/SMS buttons. */}
            <div
              className="bodywork-estimates__card"
              style={{ "--i": 1 } as React.CSSProperties}
            >
              <Surface
                variant="light"
                className="flex h-full flex-col rounded-2xl p-7 md:p-8 text-left"
              >
                <p className="eyebrow text-graphite">{"// On the schedule"}</p>
                <h3 className="mt-3 font-display text-2xl md:text-3xl leading-tight text-ink">
                  Get on the schedule.
                </h3>
                <p className="mt-4 text-ink/80">
                  Monday through Saturday. Sarasota and within an hour&apos;s
                  drive.
                </p>
                <div className="mt-auto flex flex-wrap gap-3 pt-8">
                  <PhoneCTA size="lg" theme="light" location="bodywork-estimates" />
                  <SmsCTA theme="light" location="bodywork-estimates" />
                </div>
              </Surface>
            </div>

          </div>
        </div>
      </div>

      <style jsx>{`
        :global(.bodywork-estimates__card) {
          opacity: 0;
          transform: translateY(16px);
          transition:
            opacity var(--motion-shutter, 600ms)
              cubic-bezier(0.83, 0, 0.17, 1),
            transform var(--motion-shutter, 600ms)
              cubic-bezier(0.83, 0, 0.17, 1);
          transition-delay: calc(280ms + var(--i) * 90ms);
        }
        :global(
            .bodywork-estimates[data-revealed="1"] .bodywork-estimates__card
          ) {
          opacity: 1;
          transform: translateY(0);
        }
        @media (prefers-reduced-motion: reduce) {
          :global(.bodywork-estimates__card) {
            transition: none;
          }
        }
      `}</style>
    </section>
  );
}
