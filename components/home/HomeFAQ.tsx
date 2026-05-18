"use client";
import { useRef } from "react";
import SplitText from "@/components/effects/SplitText";
import SmsCTA from "@/components/ui/SmsCTA";

// Inline FAQ between the AboutStrip ("The signature") and the final CTA.
// Pure typography on the ink ground — no glass, no video. The page has had
// enough material by here; this is the breather before the close.
//
// Built on native <details>/<summary> so keyboard, focus, and screen-reader
// support come for free. The "+" affordance is rendered via a ::marker
// replacement (display: list-item is suppressed) and CSS rotates it when
// the parent is open. One row open at a time is enforced via an
// onClick handler that closes siblings; we don't fight the DOM here.

const QUESTIONS: { q: string; a: string }[] = [
  {
    q: "Do you work with my insurance carrier?",
    a: "Yes — we work with every major carrier and most regional ones. We document, supplement, and negotiate the file end-to-end. You don't talk to the adjuster; we do.",
  },
  {
    q: "How long does the whole process take?",
    a: "One to two days from your first call to a written estimate on your driveway. Repair timelines depend on parts availability and damage scope — usually two to six weeks for an exotic. We give you a real schedule, not a placeholder.",
  },
  {
    q: "What if my car is already at another shop or a tow yard?",
    a: "We coordinate the transport ourselves at no extra cost on accepted jobs. If it's still in a yard, we'll pull the vehicle and bring it straight into indoor storage.",
  },
  {
    q: "Do you work outside the Sarasota area?",
    a: "Sarasota and within an hour's drive. The mobile estimate model means we come to you — but only inside that radius. Outside it, we can take a look from photos and coordinate transport into the shop.",
  },
  {
    q: "What does 'paid in full' actually mean for my settlement?",
    a: "When the cost to repair crosses the carrier's total-loss threshold (commonly around 70% of ACV), they owe you the value of the car — not a patched version of it. We document the damage so the file clears that threshold cleanly.",
  },
  {
    q: "Will the repair look factory-original?",
    a: "Yes. Every panel, paint pass, and reassembly is on Serge personally — no subcontractors. We refinish to OEM specifications and color-match in a controlled booth.",
  },
];

export default function HomeFAQ() {
  // Track the open row so we can collapse siblings when a new one opens.
  // Using a ref instead of state because each <details> manages its own
  // open state in the DOM — we just enforce single-open across them.
  const wrapperRef = useRef<HTMLDivElement>(null);

  function handleToggle(e: React.SyntheticEvent<HTMLDetailsElement>) {
    const opened = e.currentTarget;
    if (!opened.open) return;
    const wrap = wrapperRef.current;
    if (!wrap) return;
    wrap.querySelectorAll("details").forEach((d) => {
      if (d !== opened) d.open = false;
    });
  }

  return (
    <section
      aria-labelledby="home-faq-heading"
      data-theme="dark"
      className="relative w-full text-bone px-6 py-20 md:px-10 md:py-28"
    >
      {/* Section label — Anton uppercase, no chapter numeral. Dark register
          (text-bone). §07 is the back-half dark interlude — breaks the
          paper run between Selected work and FinalCTA so the bottom of
          the page doesn't read as one continuous cream slab. */}
      <div className="relative z-10 mx-auto mb-10 max-w-3xl md:mb-14">
        <p className="font-display uppercase tracking-[0.10em] text-left text-bone text-3xl md:text-5xl leading-none">
          Common questions
        </p>
      </div>

      {/* Display headline — quieter than other chapters (8–10vw), since this
          is a typographic interview moment. */}
      <div className="relative z-10 mx-auto max-w-3xl">
        <SplitText
          as="h2"
          id="home-faq-heading"
          className="font-display leading-[1.05] tracking-[-0.02em] text-bone text-[clamp(2.5rem,8vw,5.5rem)]"
          reveal="mount"
          mountDelayMs={300}
          staggerMs={22}
        >
          {"The parts\npeople ask about."}
        </SplitText>
      </div>

      {/* FAQ rows. max-w narrow, hairline dividers, "+" affordance. */}
      <div
        ref={wrapperRef}
        className="home-faq mx-auto mt-16 max-w-3xl md:mt-20 divide-y divide-bone/10 border-y border-bone/10"
      >
        {QUESTIONS.map((item, i) => (
          <details
            key={i}
            onToggle={handleToggle}
            className="home-faq__row group py-6 md:py-8"
          >
            <summary
              className="home-faq__summary flex cursor-pointer items-start gap-6 list-none outline-none focus-visible:ring-2 focus-visible:ring-bone focus-visible:ring-offset-4 focus-visible:ring-offset-ink"
            >
              <span className="font-mono text-bone/60 text-sm pt-1 shrink-0">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="flex-1 text-bone text-lg md:text-xl leading-snug">
                {item.q}
              </span>
              <span
                aria-hidden
                className="home-faq__plus shrink-0 text-bone text-2xl leading-none transition-transform duration-300 ease-out"
              >
                +
              </span>
            </summary>
            <div className="mt-5 pl-12 pr-12 md:pr-16 text-bone/80 max-w-[60ch]">
              {item.a}
            </div>
          </details>
        ))}
      </div>

      {/* Closing line + SMS CTA to keep the urgent path one tap away. */}
      <div className="mx-auto mt-12 max-w-3xl flex flex-wrap items-center gap-6">
        <p className="text-bone/80">More questions? Text us a photo —</p>
        <SmsCTA location="home-faq" />
      </div>

      <style jsx>{`
        :global(.home-faq__row[open] .home-faq__plus) {
          transform: rotate(45deg);
        }
        :global(.home-faq__summary::-webkit-details-marker) {
          display: none;
        }
      `}</style>
    </section>
  );
}
