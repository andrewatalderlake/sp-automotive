"use client";
import { useEffect, useRef, type ReactNode } from "react";
import { useReducedMotion } from "framer-motion";
import { DWELL_LEAD_VH, DWELL_TRAIL_VH } from "@/lib/scrub-config";
import Surface from "@/components/ui/Surface";

// Section primitive used by the home-page chapter blocks.
//
// Layout (desktop): a wide chapter "banner" sits ~40% down the section
// — vertical accent stripe in `--color-ignite`, large display chapter
// number, eyebrow label — and below it the body region renders one of
// two ways depending on the `layout` prop:
//
//   layout="card"  — body sits inside a `Surface variant="glass-dense"`
//                    rounded card. Used by chapter 01 (TotalLossPlay)
//                    only, because that chapter sits over the scroll-
//                    scrubbed hero video and needs a contrast floor.
//   layout="plain" — headline + body + optional CTA render directly on
//                    the section's gradient atmosphere with no card,
//                    no rounded corners, no padding. Body copy is
//                    constrained to `max-w-3xl` for a comfortable
//                    reading measure. Used by chapters 02–05.
//
// The body region spans the majority of the section width (max-w-5xl,
// centered) in either layout. On mobile both stack in document flow with
// proportional spacing. Whatever media layer sits behind the section
// bleeds uninterrupted through the gaps. The previous uniform glass card
// across all chapters was replaced in the "no more cards" rework — only
// chapter 01 retains a card (now glass-dense), and the standard `glass`
// variant is no longer used by chapters.
//
// Visibility (scroll-driven): banner + body opacity-fade in as the
// section approaches its "fills viewport" position, hold at full
// visibility through a dwell window centered on the viewport, and recede
// as the section moves past. Fade thresholds derive from `DWELL_LEAD_VH`
// / `DWELL_TRAIL_VH` in `lib/scrub-config`, so any future scroll-scrub
// video can lock onto the same geometry by construction. Honors
// prefers-reduced-motion.
//
// Reveal is opacity-only on both groups — earlier presets (slide / sweep
// / lift / spring / tilt) have been collapsed to a single calm fade for
// a "normal cool website" feel. The `animation` prop is kept on the API
// so callsites don't churn, but the value is ignored.

type AnimationType = "fade" | "slide" | "sweep" | "lift" | "spring" | "tilt";

// Length of each fade in / fade out, in viewport heights. 0.4 → 40vh of
// scroll across each ramp. Larger = lazier and starts revealing earlier;
// smaller = snappier. Paired with DWELL_LEAD_VH and DWELL_TRAIL_VH so
// adjacent sections' visible windows overlap (no empty gap on scroll).
const FADE_VH = 0.4;

type Props = {
  /** Two-digit chapter number, displayed monospace top-left ("01", "02"...). */
  chapterNumber: string;
  /** Eyebrow text below the chapter number — uppercase, tracked. */
  eyebrow: string;
  /**
   * Headline (display face). Use `\n` for an explicit line break — the
   * h2 has `whitespace-pre-line` so newlines render as breaks. Two short
   * lines reads best.
   */
  headline: string;
  /** Body copy — accepts paragraphs/markup. */
  body: ReactNode;
  /** Optional CTA row beneath the body. Used by section 04. */
  cta?: ReactNode;
  /** id for aria-labelledby; the headline renders with this id. */
  headingId: string;
  /**
   * Optional video timestamp (seconds) at which a chapter-aware scroll-scrub
   * video should dwell while this section fills the viewport. Forwarded to
   * the section element as `data-scrub-time`. Currently inert — no consumer
   * on the home page; reserved for future per-section treatments.
   */
  scrubTime?: number;
  /**
   * Optional override for this chapter's dwell trail (post-roll), in viewport
   * heights. Forwarded as `data-scrub-trail`. Used by CornerSection itself
   * to control how long the chapter copy holds full opacity past the
   * viewport center; future video layers can read it for the same purpose.
   */
  scrubTrailVh?: number;
  /**
   * Currently a no-op. The per-preset reveal animations (`slide`, `sweep`,
   * `lift`, `spring`, `tilt`) were collapsed to a single opacity fade in
   * the calm-site refactor. The prop is preserved on the API — and the
   * `AnimationType` union still names the intended vocabulary — so the five
   * chapter call sites don't churn when the presets are reinstated. Passing
   * any value today resolves to the same fade. See the file header.
   */
  animation?: AnimationType;
  /**
   * Optional CSS background applied inline to the `<section>` element. Used
   * by chapter wrappers to paint a per-section atmosphere (gradient or
   * solid) without nesting an extra DOM layer.
   */
  background?: string;
  /**
   * When true, reduces the top padding (pt-12 md:pt-16 instead of the
   * default pt-28 md:pt-36) so the chapter mark sits closer to the section's
   * upper edge. Bottom padding is unchanged. Use to tighten the perceived
   * gap between consecutive chapters.
   */
  tightTop?: boolean;
  /**
   * Body presentation. `"card"` wraps headline + body in a dense glass
   * card (only chapter 01, over the hero scrub video). `"plain"` renders
   * heading-above-body directly on the section atmosphere with no card
   * (chapters 02–05). Required — no default so the layout intent is
   * obvious at every call site.
   */
  layout: "card" | "plain";
};

// Resolve a visibility curve value `o` ∈ [0, 1] → the inline opacity to
// write for a reveal group ("mark" or "body"). Both groups now fade in
// uniformly — the AnimationType parameter is accepted so callsites stay
// unchanged but is intentionally unused. See file header.
function resolveAnim(
  _anim: AnimationType,
  _group: "mark" | "body",
  o: number,
): { opacity: string } {
  return { opacity: String(o) };
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
  background,
  tightTop = false,
  layout,
}: Props) {
  const reduced = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);

  // One ref per group. The compute loop writes opacity for each on every
  // scroll frame.
  const markRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);

  // We write opacity directly to the DOM instead of going through React
  // state — this fires every scroll frame and we don't want a re-render
  // per tick. SSR markup ships visible (no inline opacity), so JS-off
  // readers and the brief pre-hydration window still see chapter content;
  // the effect below snaps each piece to the correct scroll-driven value
  // on hydration.
  useEffect(() => {
    const mark = markRef.current;
    const body = bodyRef.current;
    if (!mark || !body) return;

    if (reduced) {
      mark.style.opacity = "1";
      body.style.opacity = "1";
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
      // viewport center. getBoundingClientRect().top + scrollY is page-space
      // correct regardless of offsetParent. offsetTop alone reads as 0 for
      // chapters where the <section> is a child of a relative wrapper div
      // (InsuranceHandling, StorageBlock, CustomWork — see the matching note
      // in SectionParallaxImage.compute), which silently zeros out `progress`
      // and collapses the visibility curve.
      const top = el!.getBoundingClientRect().top + window.scrollY;
      const center = top + el!.offsetHeight / 2 - vh / 2;
      const progress = window.scrollY - center;

      const lead = DWELL_LEAD_VH * vh;
      const trail = trailVh * vh;
      const fade = FADE_VH * vh;

      // Piecewise visibility curve. `o` drives both groups' opacity now
      // that the per-preset animations have been retired.
      let o: number;
      if (progress <= -lead - fade) o = 0;
      else if (progress <= -lead) o = (progress + lead + fade) / fade;
      else if (progress <= trail) o = 1;
      else if (progress <= trail + fade) o = 1 - (progress - trail) / fade;
      else o = 0;

      const markStyle = resolveAnim(animation, "mark", o);
      const bodyStyle = resolveAnim(animation, "body", o);

      mark!.style.opacity = markStyle.opacity;
      body!.style.opacity = bodyStyle.opacity;
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
      className={`relative min-h-[100svh] w-full px-6 md:px-10 pb-28 md:pb-36 ${
        tightTop ? "pt-12 md:pt-16" : "pt-28 md:pt-36"
      }`}
      style={background ? { background } : undefined}
    >
      {/* Banner — chapter mark reimagined as a wide horizontal element
          with a vertical accent stripe in `--color-ignite`. Sits ~40%
          down the section (via mt-[Xvh]) instead of pinned top-left, so
          the eye lands on it after the section scroll-snaps in. The
          banner opacity-fades in with the rest of the chapter; the
          previous slide-in-from-left has been retired with the other
          flashy presets. A red-glow SVG sits behind the chapter content
          inside the inner flex wrapper: rectangle that tapers down via a
          curved ~45° right end into transparent, emanating from the
          stripe. */}
      <div ref={markRef} className="relative z-10 mt-[22vh] md:mt-[26vh]">
        <div className="relative isolate inline-flex items-stretch gap-5 md:gap-6">
          {/* Red-glow shape behind the chapter content. Rectangle whose
              right end tapers down via a curved ~45° angle and fades into
              transparent (the section gradient shows through past it).
              ViewBox is stretched horizontally via preserveAspectRatio
              ="none"; the path's right-end curve span equals its viewBox
              height, so on the rendered element the curve reads as a
              ~45° tapered cut regardless of banner height. The gradient
              id is keyed off chapterNumber so the four chapter banners
              don't collide on `url(#...)` references. */}
          <svg
            aria-hidden
            className="pointer-events-none absolute left-0 top-0 -z-10 h-full w-[420px] md:w-[640px]"
            preserveAspectRatio="none"
            viewBox="0 0 100 30"
          >
            <defs>
              <linearGradient
                id={`banner-glow-${chapterNumber}`}
                x1="0"
                y1="0"
                x2="1"
                y2="0"
              >
                <stop offset="0%" stopColor="rgba(200, 40, 29, 0.55)" />
                <stop offset="55%" stopColor="rgba(200, 40, 29, 0.18)" />
                <stop offset="100%" stopColor="rgba(200, 40, 29, 0)" />
              </linearGradient>
            </defs>
            <path
              d="M 0 0 L 85 0 Q 100 0 100 30 L 0 30 Z"
              fill={`url(#banner-glow-${chapterNumber})`}
            />
          </svg>
          <div className="w-1 md:w-1.5 bg-ignite" aria-hidden />
          <div className="py-1 md:py-2">
            <div className="font-display text-bone leading-none tracking-[-0.02em] text-5xl md:text-7xl">
              {chapterNumber}
            </div>
            <p className="eyebrow mt-2 md:mt-3">
              / {eyebrow}
            </p>
          </div>
        </div>
      </div>

      {/* Body region — sits below the banner, in flow, centered with a
          wide max-w-5xl so it takes up the majority of the section's
          width. The bodyRef is on the outer positioning wrapper so the
          opacity-fade applies to the whole region (incl. any card
          background) as a single unit. The `layout` prop selects between
          a dense glass card (chapter 01 only) and a plain heading-above-
          body composition that renders directly on the section gradient
          (chapters 02–05). */}
      <div
        ref={bodyRef}
        className="relative z-10 mt-12 md:mt-20 md:max-w-5xl md:mx-auto"
      >
        {layout === "card" ? (
          <Surface
            variant="glass-dense"
            className="rounded-2xl p-8 md:p-14 text-left"
          >
            <h2
              id={headingId}
              className="display-lg text-bone leading-[1.05] whitespace-pre-line"
            >
              {headline}
            </h2>
            <div className="mt-8 text-bone text-xl md:text-2xl leading-relaxed">{body}</div>
            {cta && (
              <div className="mt-10 flex flex-wrap gap-4">{cta}</div>
            )}
          </Surface>
        ) : (
          <>
            <h2
              id={headingId}
              className="display-lg text-bone leading-[1.05] whitespace-pre-line"
            >
              {headline}
            </h2>
            <div className="mt-8 max-w-3xl text-bone text-xl md:text-2xl leading-relaxed">
              {body}
            </div>
            {cta && (
              <div className="mt-10 flex flex-wrap gap-4">{cta}</div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
