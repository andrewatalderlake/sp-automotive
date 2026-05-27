"use client";
import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";

// Section wrapper that flips `data-revealed="1"` on the first scroll-into-view
// intersection, then disconnects. Children opt into the reveal via the
// `.reveal-up`, `.reveal-up-stagger`, and `.reveal-line` CSS classes defined
// in app/globals.css. Reduced-motion users get the revealed state on mount
// (no animation, no IO).
//
// Why a wrapper instead of duplicating the IO logic per page: the homepage
// has bespoke reveal choreography (HowItWorks' hairline connector,
// FeaturedBuilds' card stagger) that earns its own styled-jsx. Service
// pages don't — they just need "fade + translate up on enter," repeated
// across several sections. This component standardises that case.

type Props = {
  children: ReactNode;
  id?: string;
  ariaLabelledBy?: string;
  /** Forwarded to the underlying <section>. */
  className?: string;
  style?: CSSProperties;
  /** IO rootMargin — defaults to "-100px 0px" so the reveal fires once the
   *  section is reasonably in view, not at the very top edge. */
  rootMargin?: string;
};

export default function RevealSection({
  children,
  id,
  ariaLabelledBy,
  className,
  style,
  rootMargin = "-100px 0px",
}: Props) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = ref.current;
    if (!section) return;

    // Reduced-motion: skip the observer, render at the revealed state.
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduced || typeof IntersectionObserver === "undefined") {
      section.dataset.revealed = "1";
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            section.dataset.revealed = "1";
            io.disconnect();
            break;
          }
        }
      },
      { rootMargin, threshold: 0 },
    );
    io.observe(section);
    return () => io.disconnect();
  }, [rootMargin]);

  return (
    <section
      ref={ref}
      id={id}
      aria-labelledby={ariaLabelledBy}
      className={className}
      style={style}
    >
      {children}
    </section>
  );
}
