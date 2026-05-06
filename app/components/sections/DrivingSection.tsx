"use client";

import { motion, useReducedMotion } from "motion/react";

/**
 * DrivingSection — three-column section: insurance card on the left,
 * services card on the right, and an empty middle column where the
 * page-wide scroll video shows through.
 *
 * Desktop layout (lg+):
 *   ┌─────────┬─────────────┬─────────┐
 *   │ insur-  │   (empty    │ services│
 *   │ ance    │    middle,  │  card   │
 *   │ card    │    video    │         │
 *   │         │    showing  │         │
 *   │         │    through) │         │
 *   │ ~28%    │   ~36%      │  ~28%   │
 *   └─────────┴─────────────┴─────────┘
 *
 * Earlier passes had a sticky bird's-eye Porsche image and a flat dark road
 * strip in the center column. Both have been removed: the page-wide scroll
 * video provides the visual now, and the empty middle gives it room to
 * breathe between the two cards.
 *
 * Mobile (<lg): cards stack directly with no center column.
 *
 * `data-scroll-anchor-seconds="7"` registers this section with
 * `ScrollVideoBackground` to hold at the 7-second mark of the video while
 * the viewport is centered on this section. The transition from Hero
 * (frame 0) to here animates the first 7 seconds of footage as the user
 * crosses the section boundary.
 */

const insuranceContent = [
  "Specialists in exotic and rental vehicle claims. When the cost to repair exceeds 70% of your car's value, totaling out is often the smarter move — and we'll help you get paid in full, with the potential for an additional $10,000–$20,000 above your purchase price depending on how the market has shifted.",
  "We handle the insurance side so you don't have to. Most body shops pocket the profit and forget about the owner. We fight to make sure you walk away paid in full — and ahead.",
  "Your car stays in our enclosed, secure facility for the entire repair process. Totaled or not, your vehicle is protected from the moment it arrives.",
  "Direct billing with every major carrier — Geico, State Farm, Progressive, Allstate, USAA, Liberty Mutual, AAA. You pay your deductible; we handle everything else, including supplements when hidden damage shows up after the teardown.",
  "When the carrier's actual cash value offer comes in low, we file the dispute on your behalf. Recent comparable listings, mileage adjustments, market appreciation — the paperwork sits on our side of the desk, not yours.",
];

const servicesContent = [
  "We come to you. Mobile estimates available based on your location and the extent of damage — saving you a tow and a trip.",
  "Estimates typically completed within 1–2 days. Once approved, repairs begin immediately.",
  "Open Monday through Saturday. Talk to a real human, not a call center.",
  "In-house spray booth tuned for the demanding finishes exotic manufacturers use — multi-stage candies, color-shifting metallics, raw-carbon clears. Porsche, Lamborghini, Ferrari, McLaren, Aston Martin, Bentley are routine work for us.",
  "OEM and OEM-equivalent parts only. Every fastener, every bracket, every panel sourced to factory spec — because what holds your car together matters as much as what shows on the surface.",
];

export function DrivingSection() {
  return (
    <section
      id="services"
      aria-label="Insurance and services"
      // Background removed — the page-wide scroll video shows through. Cards
      // below convert from solid off-white to translucent dark glass so they
      // still frame their content without hiding the video.
      // data-scroll-anchor-seconds="7" → ScrollVideoBackground holds at
      // the 7-second mark of the video while the viewport is centered on
      // this section. See app/components/ScrollVideoBackground.tsx.
      data-scroll-anchor-seconds="7"
      className="relative z-0 w-full lg:min-h-[110vh]"
    >
      <div
        className="
          mx-auto grid w-full max-w-[1600px]
          grid-cols-1 gap-y-12 px-6 py-16
          sm:px-10
          lg:grid-cols-[28%_36%_28%] lg:gap-x-[4%] lg:gap-y-0 lg:px-12 lg:py-0
        "
      >
        <ContentCard heading="Insurance Done Right" blocks={insuranceContent} />

        {/* Empty grid cell on desktop — the scroll video shows through here.
            Hidden on mobile so the two cards stack with no awkward gap. */}
        <div aria-hidden className="hidden lg:block" />

        <ContentCard
          heading="Body Work & Mobile Estimates"
          blocks={servicesContent}
        />
      </div>
    </section>
  );
}

/**
 * One side card — heading on top, a wrapper with the 3 motion-revealed text
 * blocks below. Two separate spacings:
 *   • heading → first block: ~3 lines of body text (`mt-12` mobile / `lg:mt-20`)
 *   • block → block: ~1–2 lines (`gap-6` mobile / `lg:gap-8`)
 *
 * Earlier versions used a single `flex gap-[15vh]` on the aside which spread
 * the heading and all blocks the same huge distance apart — visually fine
 * for scroll-runway pacing but disconnected the heading from its content.
 * The two-tier spacing puts the heading close to its body while the blocks
 * still breathe between each other.
 */
function ContentCard({
  heading,
  blocks,
}: {
  heading: string;
  blocks: string[];
}) {
  return (
    <aside
      className="
        flex flex-col
        rounded-2xl border border-white/10 bg-black/40 p-8 shadow-2xl shadow-black/40 backdrop-blur-md
        lg:my-[5vh] lg:p-10
      "
    >
      <h3 className="text-3xl font-bold tracking-tight text-white lg:text-4xl">
        {heading}
      </h3>

      <div className="mt-12 flex flex-col gap-6 lg:mt-20 lg:gap-8">
        {blocks.map((text, i) => (
          <RevealBlock key={i} text={text} delay={i * 0.08} />
        ))}
      </div>
    </aside>
  );
}

/**
 * One revealable text block: thin accent line above, body copy below. Fades
 * up on scroll-into-view via Motion's `whileInView`. Skipped under
 * prefers-reduced-motion.
 */
function RevealBlock({ text, delay }: { text: string; delay: number }) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 20 }}
      whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6, ease: "easeOut", delay }}
      className="flex flex-col gap-4"
    >
      <span aria-hidden className="block h-px w-12 bg-white/30" />
      <p className="text-base leading-relaxed text-white/80 lg:text-lg">
        {text}
      </p>
    </motion.div>
  );
}

