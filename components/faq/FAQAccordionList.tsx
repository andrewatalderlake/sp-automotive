"use client";

import { useCallback, useEffect, useState } from "react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  type Transition,
} from "framer-motion";
import type { FAQ } from "@/lib/faq-data";

// Client-side accordion that backs both the chip jump-nav and the question
// list on /faq. State lives here (not in the URL or each <details>) because
// the chips need to *open* a row in addition to scrolling to it, and the
// rows want a single shared "open set" — multiple rows may be open at once.
//
// Visual contract:
//   - No outer border on the list. A single hairline divides each row from
//     the next (`divide-y`). When a row is open, a second hairline sits
//     between the question button and its answer panel.
//   - Numeric label ("01", "02", …) only renders when the row is open.
//     Width is reserved either way so opening doesn't shift the question
//     text horizontally.
//
// Scroll reveal mirrors the editorial entry used elsewhere on the site
// (see RevealWords.tsx, TestimonialsSection.tsx): a one-shot fade + rise
// keyed off `whileInView` with the standard cinematic easing.

type Props = {
  faqs: FAQ[];
};

// Standard easing curves used across the site — kept inline so this
// component has no runtime dependency on CSS custom properties.
const ENTRY_EASE: Transition["ease"] = [0.22, 1, 0.36, 1]; // --motion-cinema
const SHUTTER_EASE: Transition["ease"] = [0.83, 0, 0.17, 1]; // --motion-shutter

// Mirrors the rows' Tailwind `scroll-mt-32` (8rem = 128px). Lenis's
// scrollTo doesn't observe CSS scroll-margin, so the offset is supplied
// explicitly. Negative because Lenis adds offset to the resolved target
// position — a negative offset lands the row that many px below the top
// of the viewport.
const SCROLL_OFFSET = -128;

export default function FAQAccordionList({ faqs }: Props) {
  const reduced = useReducedMotion();
  const [openIds, setOpenIds] = useState<Set<string>>(() => new Set());

  const toggle = useCallback((id: string) => {
    setOpenIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const openAndScroll = useCallback((id: string) => {
    setOpenIds((prev) => {
      if (prev.has(id)) return prev;
      const next = new Set(prev);
      next.add(id);
      return next;
    });
    // Defer scroll to a macrotask so it runs *after* React commits the
    // open-state update. Mirrors components/nav/Navigation.tsx's pattern.
    //
    // Prefer the Lenis handle exposed by SmoothScroll. Native
    // scrollIntoView fights Lenis's rAF lerp (Lenis is continuously
    // setting window.scrollY toward its own target, so a native scroll
    // would get clipped back), which previously surfaced as a
    // "two-clicks-to-jump" feel. Lenis's own scrollTo writes that target
    // directly, so the move lands deterministically.
    //
    // SCROLL_OFFSET mirrors the rows' Tailwind `scroll-mt-32` (8rem). On
    // the scrollIntoView fallback path, CSS scroll-margin handles it; on
    // the Lenis path we have to pass it ourselves.
    setTimeout(() => {
      const lenis = typeof window !== "undefined" ? window.__lenis : undefined;
      if (lenis) {
        lenis.scrollTo(`#${id}`, { offset: SCROLL_OFFSET });
        return;
      }
      const el = document.getElementById(id);
      el?.scrollIntoView({ block: "start" });
    }, 0);
  }, []);

  // Honor deep links like /faq#timeline — open that row on mount and bring
  // it into view. Lenis (mounted at the app root) lerps the resulting
  // window.scrollY change so the arrival is still smooth.
  //
  // This *must* live in an effect rather than a useState initializer:
  // window.location.hash is browser-only, so seeding state from it during
  // the first render would mismatch the server HTML and trip React's
  // hydration check. The one-shot setState that follows is intentional.
  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (!hash) return;
    if (!faqs.some((f) => f.id === hash)) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- hydration-safe deep-link seed
    openAndScroll(hash);
  }, [faqs, openAndScroll]);

  return (
    <>
      {/* Chip jump-nav. Buttons (not anchors) since clicking opens the row
          as well as scrolling to it. */}
      <section className="bg-ink px-6 md:px-10 pt-16 pb-8">
        <div className="max-w-3xl mx-auto">
          <p className="eyebrow mb-4">Jump to a question</p>
          <ul className="flex flex-wrap gap-2">
            {faqs.map((f) => (
              <li key={f.id}>
                {/* Strip trailing "?" so chip widths follow the original
                    design — the pill row is sized for the question text
                    without punctuation. */}
                <button
                  type="button"
                  onClick={() => openAndScroll(f.id)}
                  className="inline-block rounded-full border border-white/10 px-3 py-1.5 text-xs text-bone/80 hover:text-bone hover:border-white/30 hover:bg-white/[0.02] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-bone focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
                >
                  {f.question.replace(/\?$/, "")}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* The list. `divide-y` supplies the line between every row and the
          next; there is no `border-y`, so the list has no outer edges. */}
      <section className="bg-ink px-6 md:px-10 pt-12 pb-24 md:pb-32">
        <div className="max-w-3xl mx-auto">
          <ul className="divide-y divide-bone/10">
            {faqs.map((f, idx) => (
              <FAQRow
                key={f.id}
                faq={f}
                index={idx}
                open={openIds.has(f.id)}
                onToggle={() => toggle(f.id)}
                reduced={!!reduced}
              />
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}

type RowProps = {
  faq: FAQ;
  index: number;
  open: boolean;
  onToggle: () => void;
  reduced: boolean;
};

function FAQRow({ faq, index, open, onToggle, reduced }: RowProps) {
  const panelId = `${faq.id}-panel`;
  // The trigger button owns the row's accessible name. The panel's
  // aria-labelledby points here (not at the <li>) so the a11y label stays
  // intact even if the decorative number / "+" siblings are restructured.
  const buttonId = `${faq.id}-btn`;
  const number = String(index + 1).padStart(2, "0");

  return (
    <motion.li
      id={faq.id}
      className="scroll-mt-32"
      initial={reduced ? false : { opacity: 0, y: 24 }}
      whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10% 0px -10% 0px" }}
      transition={{ duration: 0.6, ease: ENTRY_EASE }}
    >
      <button
        id={buttonId}
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        aria-controls={panelId}
        className="group w-full flex items-start gap-6 text-left py-6 md:py-8 outline-none focus-visible:ring-2 focus-visible:ring-bone focus-visible:ring-offset-4 focus-visible:ring-offset-ink"
      >
        {/* Decorative number. Reserved width keeps the heading from
            jumping horizontally when a row opens. */}
        <span
          aria-hidden
          className={`spec text-xs text-graphite pt-3 md:pt-4 w-8 shrink-0 transition-opacity duration-300 ease-out ${
            open ? "opacity-100" : "opacity-0"
          }`}
        >
          {number}
        </span>

        <span className="flex-1 font-display text-2xl md:text-3xl text-bone leading-[1.1]">
          {faq.question}
        </span>

        <span
          aria-hidden
          className={`shrink-0 text-bone text-2xl leading-none pt-1 transition-transform duration-300 ease-out ${
            open ? "rotate-45" : "rotate-0"
          }`}
        >
          +
        </span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="panel"
            id={panelId}
            role="region"
            aria-labelledby={buttonId}
            initial={reduced ? false : { height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={
              reduced ? { duration: 0 } : { duration: 0.4, ease: SHUTTER_EASE }
            }
            style={{ overflow: "hidden" }}
          >
            {/* Inner div carries the divider between question and answer
                and the bottom padding. Keeping it off the motion element
                avoids the padding being interpolated during the height
                tween, which would visibly clip the text. */}
            <div className="border-t border-bone/10 pt-6 pb-8">
              <p className="editorial max-w-[65ch] pl-14">{faq.answer}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.li>
  );
}
