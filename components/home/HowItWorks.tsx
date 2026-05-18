"use client";
import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import AmbientVideo from "@/components/effects/AmbientVideo";
import { ProgressiveBlur } from "@/components/effects/ProgressiveBlur";
import SplitText from "@/components/effects/SplitText";
import Surface from "@/components/ui/Surface";
import { useMediaQuery } from "@/lib/hooks/useMediaQuery";

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
    body: "Text us the damage. We come back with a number, fast. Usually inside the hour.",
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
    label: "Keys back, file closed",
    body: "Settlement paid in full, repair completed, car returned. Indoor storage covered while we wait.",
  },
];

export default function HowItWorks() {
  const sectionRef = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  // Tracked separately from `data-revealed` (one-shot reveal flag) so
  // we can mount/unmount the ProgressiveBlur stack continuously as the
  // section enters and leaves the viewport. Five compositor layers of
  // `backdrop-filter: blur()` are cheap on the bottom edge of a
  // visible section but wasted when the section is offscreen.
  //
  // Always initialize false — matches SSR output and avoids the hydration
  // mismatch a lazy IO-availability check would cause. Browsers without
  // IntersectionObserver (vanishingly rare) gracefully degrade to never
  // rendering the blur, which is acceptable.
  const [blurVisible, setBlurVisible] = useState(false);
  // Mobile compositor can't carry the full 5-layer blur stack without
  // jank on the §HowItWorks → §FeaturedBuilds handoff. Drop to 3 layers
  // on phones; the gradient is shallower but still reads as a soft fade.
  const isMobile = useMediaQuery("(max-width: 767px)");

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

  // Separate IO for ProgressiveBlur visibility — continuous (toggles
  // on entry and exit) rather than one-shot. Generous rootMargin so
  // the blur is already mounted by the time the bottom edge is on
  // screen, avoiding a flash where the section cuts abruptly to paper.
  // Bails out if IntersectionObserver is unavailable; that path leaves
  // `blurVisible` at its initial false (no synchronous setState in the
  // effect body, no hydration mismatch).
  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;
    const section = sectionRef.current;
    if (!section) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) setBlurVisible(e.isIntersecting);
      },
      { rootMargin: "200px 0px", threshold: 0 },
    );
    io.observe(section);
    return () => io.disconnect();
  }, []);

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

      {/* Section label — Anton uppercase, no chapter numeral. */}
      <div className="relative z-10">
        <p className="font-display uppercase tracking-[0.10em] text-left text-bone text-3xl md:text-5xl leading-none">
          How it works
        </p>
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
              {/* `flex flex-col` + `mt-auto` on the body bottom-anchors body
                  text across all four cards so a wrapping headline (card 4)
                  doesn't push that card visibly taller than the rest.
                  Hover state: subtle lift + brighter border + deeper shadow
                  (on-voice with the glass surface; no 3D tilt drama).
                  motion-reduce:* cancels the lift + tween for reduced-motion. */}
              <Surface
                variant="glass"
                className="relative flex h-full flex-col rounded-2xl p-7 md:p-8 text-left transition duration-300 ease-out hover:-translate-y-1 hover:border-white/30 hover:shadow-[0_36px_80px_-20px_rgba(0,0,0,0.7)] motion-reduce:transition-none motion-reduce:hover:translate-y-0"
              >
                {/* Step number as the visual hero of the card — Anton, big,
                    bone-color. The hairline under it is an owner's-manual
                    ruling that separates the chapter mark from the headline.
                    Dropped the redundant "Step 01" eyebrow since the numeral
                    now carries that role. */}
                <div
                  aria-label={`Step ${step.n}`}
                  className="font-display leading-none tracking-[-0.03em] text-bone text-5xl md:text-6xl"
                >
                  {step.n}
                </div>
                <span aria-hidden className="mt-5 block h-px w-12 bg-bone/25" />
                <h3 className="mt-5 font-display text-2xl md:text-3xl leading-tight text-bone">
                  {step.label}
                </h3>
                <p className="mt-auto pt-4 text-bone/80">{step.body}</p>
              </Surface>
            </li>
          ))}
        </ol>
      </div>

      {/* Bottom progressive blur — softens the §HowItWorks dark →
          §FeaturedBuilds paper handoff. Conditionally rendered only
          while the section is in the viewport (continuous IO above) —
          stacked `backdrop-filter` layers cost compositor paint on
          every frame even when offscreen. Layer count drops from
          5 → 3 on mobile to stay under iOS Safari's blur budget.
          blurIntensity={3} gives a max blur of ~12px at the bottom-most
          layer (0.25 default was invisible — only ~1px max). Taller
          runway (h-40 / h-56) so the ramp is visible, not abrupt. */}
      {blurVisible && (
        <ProgressiveBlur
          direction="bottom"
          blurLayers={isMobile ? 3 : 5}
          blurIntensity={3}
          className="pointer-events-none absolute inset-x-0 bottom-0 h-40 md:h-56 z-20"
        />
      )}

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
