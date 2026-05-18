"use client";
import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";
import { TextScramble } from "@/components/effects/TextScramble";

// Chapter 01 — paper-light editorial. Replaces the older corner-cinematic
// TotalLossPlay for this slot. The section is the first (and only first-half)
// "light break" in the otherwise dark cinematic scroll: full-bleed cream
// paper with a tileable grain overlay, ink type, animated measurement rule
// + tabular-figure numerals stagger.
//
// Layout choice: no glass card. The type IS the composition. Three big
// numerals (70% / 100% / +30%) read like a Bloomberg ticker, sub-captioned
// in mono.
//
// Like the other chapters, exposes a `data-scrub-time` attribute so the
// shared PageScrubVideo dwells while this section fills the viewport (the
// page video is occluded behind the paper background but its waypoint
// timing still drives the rest of the scroll runway downstream).

const SCRUB_TIME = 7; // matches the prior ch01 slot in PageScrubVideo's waypoint table

export default function TheMath() {
  const sectionRef = useRef<HTMLElement>(null);
  const ruleRef = useRef<HTMLSpanElement>(null);
  const numsRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const section = sectionRef.current;
    const rule = ruleRef.current;
    const nums = numsRef.current;
    if (!section || !rule || !nums) return;

    if (reduced) {
      rule.style.setProperty("--rule-progress", "1");
      Array.from(nums.children).forEach((el) => {
        (el as HTMLElement).style.opacity = "1";
        (el as HTMLElement).style.transform = "none";
      });
      return;
    }

    // Reveal once the section's center crosses into the viewport. We don't
    // need a per-frame driver — this is a one-shot stagger, not a scroll-
    // bound animation. IntersectionObserver flips a single class.
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
      aria-labelledby="the-math-heading"
      data-scrub-time={SCRUB_TIME}
      className="the-math relative min-h-screen w-full overflow-hidden px-6 py-28 md:px-10 md:py-36"
      style={{
        // Paper-light editorial ground. The two adjacent dark sections
        // (hero above, ch02 below) make this a high-contrast rhythm break.
        backgroundColor: "var(--color-paper, #F4F2EE)",
        color: "var(--color-ink, #0E0F11)",
      }}
    >
      {/* Tileable AI-generated paper grain at 6% opacity. multiply blend
          adds subtle fiber/scan texture without darkening the page. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.06] mix-blend-multiply"
        style={{
          backgroundImage: "url(/textures/paper-grain.png)",
          backgroundRepeat: "repeat",
          backgroundSize: "512px 512px",
        }}
      />

      {/* Section heading — Anton uppercase, no chapter numeral. Wrapped in the
          same max-w-7xl container as the numerals below so the heading aligns
          with the section's content grid (not the section's edge padding). */}
      <div className="relative z-10 mx-auto max-w-7xl">
        <h2
          id="the-math-heading"
          className="font-display uppercase tracking-[0.10em] text-left text-ink text-3xl md:text-5xl leading-none"
        >
          The numbers
        </h2>
      </div>

      {/* Center stack: measurement rule -> three big numerals. max-w keeps
          the columns from spreading on ultra-wide. */}
      <div className="relative z-10 mx-auto mt-20 max-w-7xl md:mt-28">
        {/* Animated measurement rule — draws left -> right when the section
            reveals. CSS var `--rule-progress` drives scaleX. */}
        <span
          ref={ruleRef}
          aria-hidden
          className="the-math__rule block h-px w-full origin-left bg-ink/30"
        />

        {/* Three numerals — staggered fade/translate-up reveal. tabular-nums
            keeps the digits from jittering. */}
        <div
          ref={numsRef}
          className="mt-12 grid grid-cols-1 gap-12 md:mt-16 md:grid-cols-3 md:gap-8"
          style={{ fontVariantNumeric: "tabular-nums" }}
        >
          <NumeralBlock
            eyebrow="Insurance offers"
            value="70%"
            caption="of ACV"
          />
          <NumeralBlock
            eyebrow="What you owe"
            value="100%"
            caption="payoff + value"
          />
          <NumeralBlock
            eyebrow="The gap we close"
            value="+30%"
            caption="& up recovered"
          />
        </div>
      </div>

      {/* Scoped animation rules. We can't drive these from Tailwind alone
          because the stagger delays vary per numeral and the rule scales
          via CSS var. Kept tight; no module CSS needed for one section. */}
      <style jsx>{`
        .the-math__rule {
          transform: scaleX(0);
          transition: transform var(--motion-manual, 420ms)
            cubic-bezier(0.83, 0, 0.17, 1);
        }
        .the-math[data-revealed="1"] .the-math__rule {
          transform: scaleX(1);
        }
        :global(.the-math__num) {
          opacity: 0;
          transform: translateY(16px);
          transition:
            opacity var(--motion-shutter, 600ms)
              cubic-bezier(0.83, 0, 0.17, 1),
            transform var(--motion-shutter, 600ms)
              cubic-bezier(0.83, 0, 0.17, 1);
        }
        :global(.the-math[data-revealed="1"] .the-math__num) {
          opacity: 1;
          transform: translateY(0);
        }
        :global(.the-math[data-revealed="1"] .the-math__num:nth-child(1)) {
          transition-delay: 240ms;
        }
        :global(.the-math[data-revealed="1"] .the-math__num:nth-child(2)) {
          transition-delay: 300ms;
        }
        :global(.the-math[data-revealed="1"] .the-math__num:nth-child(3)) {
          transition-delay: 360ms;
        }
        @media (prefers-reduced-motion: reduce) {
          .the-math__rule,
          :global(.the-math__num) {
            transition: none;
          }
        }
      `}</style>
    </section>
  );
}

function NumeralBlock({
  eyebrow,
  value,
  caption,
}: {
  eyebrow: string;
  value: string;
  caption: string;
}) {
  return (
    <div className="the-math__num text-left">
      <p className="eyebrow text-graphite">{eyebrow}</p>
      <div className="mt-3 font-display text-[clamp(4rem,12vw,9rem)] leading-none tracking-[-0.03em] text-ink">
        <TextScramble duration={2} speed={0.05} characterSet="0123456789">
          {value}
        </TextScramble>
      </div>
      <p className="mt-3 text-ink/80">{caption}</p>
    </div>
  );
}
