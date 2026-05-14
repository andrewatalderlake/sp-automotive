"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion, type MotionProps } from "framer-motion";

// Per-character "scramble" reveal: each glyph cycles random characters from
// `characterSet`, resolving left-to-right to the final text over `duration`
// seconds. Used on marquee stats (§01 TheMath, §07 AboutStrip) so the
// numbers feel computed-in-place when their section enters view.
//
// Adapted from a user-provided snippet. Deltas:
//   - useReducedMotion() short-circuits the scramble to plain text.
//   - Auto-triggers when the element scrolls into view (IntersectionObserver,
//     rootMargin matches the rest of the site). Caller can override with the
//     `trigger` prop for manual control.
//   - Preserves non-alphanumeric characters during scramble (spaces, %, +, .,
//     -, ,). Only letters/digits cycle — keeps "+30%" and "200+" clean.
//   - Renders as a fixed `motion.span` (created at module scope) so we don't
//     run afoul of react-hooks/static-components. The snippet's flexible
//     `as` prop is dropped — both call sites use a span wrapper.
//   - setInterval is cleared on unmount.

// Created once at module scope (NOT inside the component body) so the
// motion component identity is stable and react-hooks/static-components
// stays happy.
const MotionSpan = motion.span;

const DEFAULT_CHARS =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

type Props = {
  children: string;
  /** Total scramble window in seconds. Default 0.8s. */
  duration?: number;
  /** Tick interval in seconds. Default 0.04s (~25 fps). */
  speed?: number;
  /** Pool of characters to sample during scramble. For digit-only content
   *  (stats), pass "0123456789" to keep tabular-nums columns stable. */
  characterSet?: string;
  className?: string;
  /** Manual trigger override. If omitted, the component auto-triggers once
   *  when its element scrolls into view. */
  trigger?: boolean;
  onScrambleComplete?: () => void;
} & MotionProps;

export function TextScramble({
  children,
  duration = 0.8,
  speed = 0.04,
  characterSet = DEFAULT_CHARS,
  className,
  trigger,
  onScrambleComplete,
  ...motionProps
}: Props) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLSpanElement | null>(null);
  const [displayText, setDisplayText] = useState(children);
  const [inView, setInView] = useState(false);
  const ranRef = useRef(false);

  // In-view trigger. Only attaches when the caller hasn't passed an explicit
  // `trigger` prop — that way external trigger control still works.
  useEffect(() => {
    if (trigger !== undefined) return;
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setInView(true);
      },
      { rootMargin: "-10% 0px -10% 0px", threshold: 0 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [trigger]);

  const shouldRun = trigger ?? inView;

  // Scramble effect. Runs once per mount (gated by ranRef). When reduced-
  // motion is on, the scramble simply never runs and displayText stays at
  // its useState initializer (= children). Cleans up the interval on
  // unmount so a fast unmount mid-scramble doesn't leak.
  useEffect(() => {
    if (reduced || !shouldRun || ranRef.current) return;
    ranRef.current = true;

    const steps = duration / speed;
    let step = 0;
    const interval = setInterval(
      () => {
        let out = "";
        const progress = step / steps;
        for (let i = 0; i < children.length; i++) {
          const ch = children[i];
          // Preserve whitespace + non-alphanumeric chars (e.g. %, +, ., -).
          // Only letters/digits cycle — keeps "+30%" and "200+" clean.
          if (!/[A-Za-z0-9]/.test(ch)) {
            out += ch;
            continue;
          }
          if (progress * children.length > i) {
            out += ch;
          } else {
            out +=
              characterSet[Math.floor(Math.random() * characterSet.length)];
          }
        }
        setDisplayText(out);
        step++;
        if (step > steps) {
          clearInterval(interval);
          setDisplayText(children);
          onScrambleComplete?.();
        }
      },
      speed * 1000,
    );

    return () => clearInterval(interval);
  }, [shouldRun, reduced, children, characterSet, duration, speed, onScrambleComplete]);

  return (
    <MotionSpan
      ref={ref}
      className={className}
      // Final value always available to assistive tech, even mid-scramble.
      aria-label={children}
      {...motionProps}
    >
      {displayText}
    </MotionSpan>
  );
}
