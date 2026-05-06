"use client";
import { useEffect, useRef, type ReactNode } from "react";
import { useReducedMotion } from "framer-motion";
import { DWELL_LEAD_VH, DWELL_TRAIL_VH } from "@/lib/scrub-config";

// Corner-anchored cinematic section primitive used by the four home-page copy
// blocks. Chapter mark pins to the top-left, body floats anchored bottom-right
// on desktop / stacks below the chapter mark on mobile. The diagonal between
// them is uninterrupted PageScrubVideo bleed; vignette gradients in the two
// occupied corners keep copy legible on bright video frames.
//
// Visibility (scroll-driven): chapter mark + body reveal as the section
// approaches its "fills viewport" position, hold at full visibility through
// the PageScrubVideo dwell window, and recede as the video starts moving
// toward the next chapter. The fade thresholds are derived from the same
// geometry PageScrubVideo uses (section center + scrubTrailVh), so the text
// and the video pause stay aligned. Honors prefers-reduced-motion.
//
// The reveal can use one of three motion presets, picked per chapter via the
// `animation` prop:
//
//   `fade`  — opacity-only crossfade (default; section 01, 04)
//   `slide` — chapter mark slides in from the left, body slides in from the
//             right; vignettes follow their corresponding text. Used by
//             section 02.
//   `sweep` — clip-path mask reveals each piece from its anchor corner
//             outward (mark expands toward bottom-right, body expands toward
//             top-left). Used by section 03.

type AnimationType = "fade" | "slide" | "sweep";

// Length of each fade in / fade out, in viewport heights. 0.3 → 30vh of
// scroll across each ramp. Larger = lazier; smaller = snappier.
const FADE_VH = 0.3;

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
  /**
   * Optional video timestamp (seconds) at which `PageScrubVideo` should dwell
   * while this section fills the viewport. Discovered via the `data-scrub-time`
   * attribute on the section element — see PageScrubVideo for the contract.
   */
  scrubTime?: number;
  /**
   * Optional override for this chapter's dwell trail (post-roll), in viewport
   * heights. Lets a single chapter rest on its frame for shorter or longer
   * than the global default in `PageScrubVideo`. Read off `data-scrub-trail`.
   */
  scrubTrailVh?: number;
  /**
   * Reveal animation preset. Defaults to `"fade"`. See file header for the
   * options.
   */
  animation?: AnimationType;
};

// Vignettes split into two pieces — one pinned to the mark corner, one to
// the body corner — so each can animate alongside its corresponding text.
const VIGNETTE_DESKTOP_MARK =
  "radial-gradient(ellipse 45% 45% at top left, rgba(0,0,0,0.78), transparent 70%)";
const VIGNETTE_DESKTOP_BODY =
  "radial-gradient(ellipse 60% 55% at bottom right, rgba(0,0,0,0.78), transparent 70%)";
const VIGNETTE_MOBILE_MARK =
  "radial-gradient(ellipse 100% 40% at top, rgba(0,0,0,0.78), transparent 70%)";
const VIGNETTE_MOBILE_BODY =
  "radial-gradient(ellipse 100% 40% at bottom, rgba(0,0,0,0.78), transparent 70%)";

// Resolve a motion preset → the style values we should write for a given
// element group ("mark" = top-left anchor, "body" = bottom-right anchor) at
// a given visibility `o` ∈ [0, 1]. Empty string means "clear that property".
function resolveAnim(
  anim: AnimationType,
  group: "mark" | "body",
  o: number,
): { opacity: string; transform: string; clipPath: string } {
  switch (anim) {
    case "slide": {
      // Mark slides from left (x = -100% at o=0 → 0 at o=1), body slides
      // from right (x = +100% → 0). Opacity follows so off-screen elements
      // don't bleed transparent ghosts past the section boundary.
      const dir = group === "mark" ? -1 : 1;
      const tx = (1 - o) * 100 * dir;
      return {
        opacity: String(o),
        transform: `translate3d(${tx}%, 0, 0)`,
        clipPath: "",
      };
    }
    case "sweep": {
      // Diagonal clip-path reveal anchored at each element's corner. Mark
      // expands from top-left toward bottom-right (right + bottom insets
      // shrink); body expands from bottom-right toward top-left (top + left
      // insets shrink). At o=0 the inset is 100% on both sides → nothing
      // visible; at o=1 the inset is 0 → fully visible.
      const inset = (1 - o) * 100;
      const clip =
        group === "mark"
          ? `inset(0 ${inset}% ${inset}% 0)`
          : `inset(${inset}% 0 0 ${inset}%)`;
      return { opacity: String(o), transform: "", clipPath: clip };
    }
    case "fade":
    default:
      return { opacity: String(o), transform: "", clipPath: "" };
  }
}

export default function CornerSection({
  chapterNumber,
  eyebrow,
  headline,
  body,
  cta,
  headingId,
  scrubTime,
  scrubTrailVh,
  animation = "fade",
}: Props) {
  const reduced = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);

  // Two text refs + two vignette refs per breakpoint × per group. Six total.
  // The compute loop groups them so a single resolveAnim() call drives every
  // element belonging to the same anchor corner.
  const markRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const vMobileMarkRef = useRef<HTMLDivElement>(null);
  const vMobileBodyRef = useRef<HTMLDivElement>(null);
  const vDesktopMarkRef = useRef<HTMLDivElement>(null);
  const vDesktopBodyRef = useRef<HTMLDivElement>(null);

  // We write opacity/transform/clip-path directly to the DOM instead of going
  // through React state — this fires every scroll frame and we don't want a
  // re-render per tick. SSR markup ships visible (no inline animation styles),
  // so JS-off readers and the brief pre-hydration window still see chapter
  // content; the effect below snaps each piece to the correct scroll-driven
  // value on hydration.
  useEffect(() => {
    const mark = markRef.current;
    const body = bodyRef.current;
    const vMM = vMobileMarkRef.current;
    const vMB = vMobileBodyRef.current;
    const vDM = vDesktopMarkRef.current;
    const vDB = vDesktopBodyRef.current;
    if (!mark || !body || !vMM || !vMB || !vDM || !vDB) return;

    const markGroup = [mark, vMM, vDM];
    const bodyGroup = [body, vMB, vDB];

    function clearAnim(els: HTMLElement[]) {
      for (const el of els) {
        el.style.opacity = "1";
        el.style.transform = "";
        el.style.clipPath = "";
      }
    }

    if (reduced) {
      clearAnim(markGroup);
      clearAnim(bodyGroup);
      return;
    }
    const el = sectionRef.current;
    if (!el) return;

    const trailVh = scrubTrailVh ?? DWELL_TRAIL_VH;
    let rafId = 0;

    function compute() {
      rafId = 0;
      const vh = window.innerHeight;
      // Section center → scrollY at which this section's center aligns with
      // viewport center. For 100svh sections that's section.offsetTop, but
      // the formula stays correct if a chapter grows taller than the viewport.
      const center = el!.offsetTop + el!.offsetHeight / 2 - vh / 2;
      const progress = window.scrollY - center;

      const lead = DWELL_LEAD_VH * vh;
      const trail = trailVh * vh;
      const fade = FADE_VH * vh;

      // Piecewise visibility curve, identical to the fade case but the
      // resolved value `o` now drives whichever animation preset was picked.
      let o: number;
      if (progress <= -lead - fade) o = 0;
      else if (progress <= -lead) o = (progress + lead + fade) / fade;
      else if (progress <= trail) o = 1;
      else if (progress <= trail + fade) o = 1 - (progress - trail) / fade;
      else o = 0;

      const markStyle = resolveAnim(animation, "mark", o);
      const bodyStyle = resolveAnim(animation, "body", o);
      for (const m of markGroup) {
        m.style.opacity = markStyle.opacity;
        m.style.transform = markStyle.transform;
        m.style.clipPath = markStyle.clipPath;
      }
      for (const b of bodyGroup) {
        b.style.opacity = bodyStyle.opacity;
        b.style.transform = bodyStyle.transform;
        b.style.clipPath = bodyStyle.clipPath;
      }
    }

    function onScroll() {
      if (rafId) return;
      rafId = requestAnimationFrame(compute);
    }

    // ResizeObserver on documentElement catches font swaps, hero clip
    // metadata loading, and image lazy-loads — anything that changes
    // section.offsetTop without firing a window `resize` event.
    const ro = new ResizeObserver(compute);
    ro.observe(document.documentElement);

    compute();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", compute);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", compute);
      ro.disconnect();
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [reduced, scrubTrailVh, animation]);

  return (
    <section
      ref={sectionRef}
      aria-labelledby={headingId}
      data-scrub-time={scrubTime}
      data-scrub-trail={scrubTrailVh}
      className="relative min-h-[100svh] w-full px-6 py-28 md:px-10 md:py-36"
    >
      {/* Vignette gradients — split into mark / body halves so each can
          animate alongside its corresponding text. Pure CSS, no backdrop-
          filter (cheap on compositor). The `md:` visibility toggles paint
          the correct breakpoint on first SSR frame without waiting for
          hydration. */}
      <div
        ref={vMobileMarkRef}
        aria-hidden
        className="absolute inset-0 pointer-events-none md:hidden"
        style={{ background: VIGNETTE_MOBILE_MARK }}
      />
      <div
        ref={vMobileBodyRef}
        aria-hidden
        className="absolute inset-0 pointer-events-none md:hidden"
        style={{ background: VIGNETTE_MOBILE_BODY }}
      />
      <div
        ref={vDesktopMarkRef}
        aria-hidden
        className="absolute inset-0 pointer-events-none hidden md:block"
        style={{ background: VIGNETTE_DESKTOP_MARK }}
      />
      <div
        ref={vDesktopBodyRef}
        aria-hidden
        className="absolute inset-0 pointer-events-none hidden md:block"
        style={{ background: VIGNETTE_DESKTOP_BODY }}
      />

      {/* Chapter mark — pinned top-left via section padding (document flow). */}
      <div ref={markRef} className="relative z-10">
        <div className="font-display text-accent leading-none tracking-[-0.02em] text-3xl md:text-5xl">
          {chapterNumber}
        </div>
        <p className="eyebrow mt-2">
          / {eyebrow}
        </p>
      </div>

      {/* Body block — absolute bottom-right on desktop, in-flow below chapter on mobile. */}
      <div
        ref={bodyRef}
        className="relative z-10 mt-12 max-w-none text-left md:absolute md:right-10 md:bottom-32 md:mt-0 md:max-w-lg md:text-right"
      >
        <h2 id={headingId} className="display-md text-bone leading-[1.05]">
          {headline}
        </h2>
        <div className="mt-6 lead text-bone/85">{body}</div>
        {cta && (
          <div className="mt-10 flex flex-wrap gap-4 justify-start md:justify-end">
            {cta}
          </div>
        )}
      </div>
    </section>
  );
}
