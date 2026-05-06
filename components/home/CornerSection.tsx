"use client";
import type { ReactNode } from "react";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { useMediaQuery } from "@/lib/hooks/useMediaQuery";

// Corner-anchored cinematic section primitive used by the four home-page copy
// blocks. Chapter mark pins to the top-left, body floats anchored bottom-right
// on desktop / stacks below the chapter mark on mobile. The diagonal between
// them is uninterrupted PageScrubVideo bleed; vignette gradients in the two
// occupied corners keep copy legible on bright video frames.
//
// Motion: chapter mark slides in diagonally from off-screen top-left, body
// slides in from off-screen right edge. Honors prefers-reduced-motion.

type Props = {
  /** Two-digit chapter number, displayed monospace top-left ("01", "02"...). */
  chapterNumber: string;
  /** Eyebrow text below the chapter number — uppercase, tracked. */
  eyebrow: string;
  /** Headline (display face). Two short lines reads best. */
  headline: ReactNode;
  /** Body copy — accepts paragraphs/markup. */
  body: ReactNode;
  /** Optional CTA row beneath the body. Used by section 04. */
  cta?: ReactNode;
  /** id for aria-labelledby; the headline renders with this id. */
  headingId: string;
};

const EASE = [0.65, 0, 0.35, 1] as const;

const chapterDesktop: Variants = {
  hidden: { opacity: 0, x: -40, y: -40 },
  visible: { opacity: 1, x: 0, y: 0, transition: { duration: 0.55, ease: EASE } },
};
const bodyDesktop: Variants = {
  hidden: { opacity: 0, x: 40 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6, delay: 0.15, ease: EASE } },
};
const chapterMobile: Variants = {
  hidden: { opacity: 0, y: -16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
};
const bodyMobile: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, delay: 0.15, ease: EASE } },
};

const VIGNETTE_DESKTOP =
  "radial-gradient(ellipse 45% 45% at top left, rgba(0,0,0,0.78), transparent 70%)," +
  "radial-gradient(ellipse 60% 55% at bottom right, rgba(0,0,0,0.78), transparent 70%)";
const VIGNETTE_MOBILE =
  "radial-gradient(ellipse 100% 40% at top, rgba(0,0,0,0.78), transparent 70%)," +
  "radial-gradient(ellipse 100% 40% at bottom, rgba(0,0,0,0.78), transparent 70%)";

export default function CornerSection({
  chapterNumber,
  eyebrow,
  headline,
  body,
  cta,
  headingId,
}: Props) {
  const reduced = useReducedMotion();
  // SSR fallback `false` = render mobile shell on server (safe default for slow
  // hydration on real mobile). Matches the convention in ProcessNarrative.
  const isDesktop = useMediaQuery("(min-width: 768px)", false);

  const chapterVariants = isDesktop ? chapterDesktop : chapterMobile;
  const bodyVariants = isDesktop ? bodyDesktop : bodyMobile;

  // Reduced motion: skip the slide-in entirely; render at final position.
  const motionProps = reduced
    ? { initial: false as const, animate: "visible" as const }
    : {
        initial: "hidden" as const,
        whileInView: "visible" as const,
        viewport: { once: true, margin: "-15% 0px -15% 0px" },
      };

  return (
    <section
      aria-labelledby={headingId}
      className={`relative min-h-[100svh] w-full overflow-hidden ${
        isDesktop ? "px-10 py-20" : "px-6 py-16"
      }`}
    >
      {/* Vignette gradients — pure CSS, no backdrop-filter (cheap on compositor). */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{ background: isDesktop ? VIGNETTE_DESKTOP : VIGNETTE_MOBILE }}
      />

      {/* Chapter mark — pinned top-left via section padding (document flow). */}
      <motion.div
        variants={chapterVariants}
        {...motionProps}
        className="relative z-10"
      >
        <div
          className={`font-display text-accent leading-none tracking-[-0.02em] ${
            isDesktop ? "text-5xl" : "text-3xl"
          }`}
        >
          {chapterNumber}
        </div>
        <p className="mt-2 text-[10px] uppercase tracking-[0.3em] text-accent/85">
          / {eyebrow}
        </p>
      </motion.div>

      {/* Body block — absolute bottom-right on desktop, in-flow below chapter on mobile. */}
      <motion.div
        variants={bodyVariants}
        {...motionProps}
        className={
          isDesktop
            ? "absolute right-10 bottom-20 z-10 max-w-md text-right"
            : "relative z-10 mt-12 max-w-none text-left"
        }
      >
        <h2 id={headingId} className="display-md text-bone leading-[1.05]">
          {headline}
        </h2>
        <div className="mt-6 lead text-bone/85">{body}</div>
        {cta && (
          <div
            className={`mt-10 flex flex-wrap gap-4 ${
              isDesktop ? "justify-end" : "justify-start"
            }`}
          >
            {cta}
          </div>
        )}
      </motion.div>
    </section>
  );
}
