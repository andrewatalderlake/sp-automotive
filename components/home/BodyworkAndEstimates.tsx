"use client";
import { useEffect, useRef } from "react";
import Image from "next/image";
import { useReducedMotion } from "framer-motion";
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

type Step = {
  n: string;
  label: string;
  body: string;
  hasDot?: boolean;
};

const STEPS: Step[] = [
  {
    n: "01",
    label: "Call or text",
    body: "Photos, location, what happened. Window confirmed inside the hour.",
  },
  {
    n: "02",
    label: "On-site walkaround",
    body: "Driveway, garage, storage. OEM-term documentation on the spot.",
  },
  {
    n: "03",
    label: "Written estimate",
    body: "Real number, on email within forty-eight hours. Carrier-ready.",
    hasDot: true,
  },
];

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
      className="bodywork-estimates relative w-full overflow-hidden bg-paper text-ink px-6 py-20 md:px-10 md:py-28"
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

        {/* Three asymmetric cards. items-stretch keeps all cards equal
            height — the photo card uses object-cover, the steps list and
            the CTA flex to fill. */}
        <div className="mt-12 md:mt-16">
          <div className="grid grid-cols-1 items-stretch gap-6 md:grid-cols-3 md:gap-6">

          {/* Card 1 — photo, edge-to-edge inside the light surface. */}
          <div
            className="bodywork-estimates__card"
            style={{ "--i": 0 } as React.CSSProperties}
          >
            <Surface
              variant="light"
              className="relative h-full overflow-hidden rounded-2xl p-0"
            >
              <div className="relative h-full min-h-[18rem] w-full bg-ink">
                <Image
                  src="/sections/ch04-estimate.webp"
                  alt="Stylus and tablet resting on the polished hood of a luxury exotic car at golden hour"
                  fill
                  sizes="(min-width: 1024px) 30rem, 100vw"
                  className="object-cover"
                />
              </div>
            </Surface>
          </div>

          {/* Card 2 — the three-step path, compact stacked list. */}
          <div
            className="bodywork-estimates__card"
            style={{ "--i": 1 } as React.CSSProperties}
          >
            <Surface
              variant="light"
              className="h-full rounded-2xl p-7 md:p-8 text-left"
            >
              <p className="eyebrow text-graphite">{"// The path"}</p>
              <ol className="mt-5 divide-y divide-ink/10 border-y border-ink/10">
                {STEPS.map((step) => (
                  <li
                    key={step.n}
                    className="flex items-start gap-4 py-4"
                  >
                    <span
                      aria-hidden
                      className="spec text-graphite text-sm leading-none pt-1 tabular-nums shrink-0"
                      style={{ fontVariantNumeric: "tabular-nums" }}
                    >
                      {step.n}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-display text-ink text-lg md:text-xl leading-tight">
                          {step.label}
                        </h3>
                        {step.hasDot && (
                          <span
                            aria-hidden
                            className="bodywork-estimates__dot inline-block size-1.5 rounded-full bg-ignite"
                          />
                        )}
                      </div>
                      <p className="mt-1.5 text-ink/80 text-sm md:text-[0.95rem] leading-snug">
                        {step.body}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            </Surface>
          </div>

            {/* Card 3 — CTA. Heading + closing line + phone/SMS buttons. */}
            <div
              className="bodywork-estimates__card"
              style={{ "--i": 2 } as React.CSSProperties}
            >
              <Surface
                variant="light"
                className="flex h-full flex-col rounded-2xl p-7 md:p-8 text-left"
              >
                <p className="eyebrow text-graphite">{"// Next move"}</p>
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
        :global(.bodywork-estimates__dot) {
          opacity: 0;
          transform: scale(0);
          transition:
            opacity 360ms cubic-bezier(0.83, 0, 0.17, 1),
            transform 360ms cubic-bezier(0.34, 1.56, 0.64, 1);
          transition-delay: 760ms;
        }
        :global(
            .bodywork-estimates[data-revealed="1"] .bodywork-estimates__dot
          ) {
          opacity: 1;
          transform: scale(1);
        }
        @media (prefers-reduced-motion: reduce) {
          :global(.bodywork-estimates__card),
          :global(.bodywork-estimates__dot) {
            transition: none;
          }
        }
      `}</style>
    </section>
  );
}
