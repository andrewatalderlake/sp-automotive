"use client";
import { useEffect, useRef, type ReactNode } from "react";
import { useReducedMotion } from "framer-motion";
import { DWELL_LEAD_VH, DWELL_TRAIL_VH } from "@/lib/scrub-config";
import SplitText from "@/components/effects/SplitText";
import Surface from "@/components/ui/Surface";

// Cinematic section primitive used by the home-page chapter blocks.
//
// Layout (desktop): a wide chapter "banner" sits ~40% down the section
// — vertical accent stripe in `--color-ignite`, large display chapter
// number, eyebrow label — and below it a liquid-glass body card spans
// the majority of the section width (max-w-5xl, centered). On mobile
// both stack in document flow with proportional spacing. Whatever media
// layer sits behind the section bleeds uninterrupted through the gaps.
//
// Visibility (scroll-driven): banner + glass card reveal as the section
// approaches its "fills viewport" position, hold at full visibility
// through a dwell window centered on the viewport, and recede as the
// section moves past. Fade thresholds are derived from `DWELL_LEAD_VH`
// / `DWELL_TRAIL_VH` in `lib/scrub-config`, so any future scroll-scrub
// video can lock onto the same geometry by construction. Honors
// prefers-reduced-motion.
//
// The banner ALWAYS slides in from off-canvas-left, independent of the
// `animation` prop — gives every chapter the same signature motion
// while each body card carries its own reveal personality:
//
//   `fade`   — body opacity-only crossfade (baseline)
//   `slide`  — body slides in from the right with a subtle rotateY tilt
//              (Section 02)
//   `sweep`  — clip-path mask reveals body from its anchor corner outward
//              (Section 05)
//   `lift`   — body translates up from below + opacity (Section 01)
//   `spring` — body scales 0.88 → 1.04 → 1 with damped overshoot
//              (Section 03)
//   `tilt`   — body rises with rotateX + translateY + blur, settling
//              into focus (Section 04)

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
   * Headline (display face). String only so SplitText can animate the
   * reveal character-by-character. Use `\n` for an explicit line break.
   * Two short lines reads best.
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
   * Reveal animation preset. Defaults to `"fade"`. See file header for the
   * options.
   */
  animation?: AnimationType;
  /**
   * Optional CSS background applied inline to the `<section>` element. Used
   * by chapter wrappers to paint a per-section atmosphere (gradient or
   * solid) without nesting an extra DOM layer.
   */
  background?: string;
};

// Resolve a motion preset → the style values we should write for a given
// element group ("mark" = top-left anchor, "body" = bottom-right glass tab)
// at a given visibility `o` ∈ [0, 1]. Empty string means "clear that
// property". The four channels (opacity, transform, clipPath, filter) cover
// every preset's needs without conditional property writes in the loop.
function resolveAnim(
  anim: AnimationType,
  group: "mark" | "body",
  o: number,
): { opacity: string; transform: string; clipPath: string; filter: string } {
  // Banner (mark group) — ALWAYS slides in from off-canvas-left,
  // independent of the section's body animation preset. Keeps the
  // banner motion consistent across every chapter so the eye learns
  // the cadence on Section 02 and gets it back on every following beat.
  if (group === "mark") {
    const tx = (1 - o) * -100;
    return {
      opacity: String(o),
      transform: `translate3d(${tx}%, 0, 0)`,
      clipPath: "",
      filter: "",
    };
  }

  // Body group — per-section reveal preset.
  switch (anim) {
    case "slide": {
      // Body slides in from the right (x = +100% at o=0 → 0 at o=1) with
      // a subtle 3D tilt as it lands.
      const tx = (1 - o) * 100;
      const rotY = (1 - o) * -6;
      return {
        opacity: String(o),
        transform: `translate3d(${tx}%, 0, 0) rotateY(${rotY}deg)`,
        clipPath: "",
        filter: "",
      };
    }
    case "sweep": {
      // Diagonal clip-path reveal — body expands from bottom-right toward
      // top-left. At o=0 the inset is 100% → nothing visible; at o=1 the
      // inset is 0 → fully visible.
      const inset = (1 - o) * 100;
      const clip = `inset(${inset}% 0 0 ${inset}%)`;
      return { opacity: String(o), transform: "", clipPath: clip, filter: "" };
    }
    case "lift": {
      // Body lifts up from below as it reveals.
      const ty = (1 - o) * 32;
      return {
        opacity: String(o),
        transform: `translate3d(0, ${ty}px, 0)`,
        clipPath: "",
        filter: "",
      };
    }
    case "spring": {
      // Body scales 0.88 → 1.04 (overshoot) → 1.0 (settle) as o goes 0→1.
      // Two-segment piecewise: rise to overshoot at o=0.7, settle by o=1.
      const scale =
        o < 0.7
          ? 0.88 + (o / 0.7) * (1.04 - 0.88)
          : 1.04 - ((o - 0.7) / 0.3) * 0.04;
      return {
        opacity: String(o),
        transform: `scale(${scale.toFixed(4)})`,
        clipPath: "",
        filter: "",
      };
    }
    case "tilt": {
      // Body rises into focus with a 3D rotateX, vertical translation, and
      // a blur that clears as it settles.
      const rotX = (1 - o) * 14;
      const ty = (1 - o) * 40;
      const blur = (1 - o) * 8;
      return {
        opacity: String(o),
        transform: `translate3d(0, ${ty}px, 0) rotateX(${rotX}deg)`,
        clipPath: "",
        filter: blur > 0.1 ? `blur(${blur.toFixed(2)}px)` : "",
      };
    }
    case "fade":
    default:
      return { opacity: String(o), transform: "", clipPath: "", filter: "" };
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
  background,
}: Props) {
  const reduced = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);

  // One text ref per group. The compute loop drives both via resolveAnim()
  // for the chosen animation preset.
  const markRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);

  // We write opacity/transform/clip-path directly to the DOM instead of going
  // through React state — this fires every scroll frame and we don't want a
  // re-render per tick. SSR markup ships visible (no inline animation styles),
  // so JS-off readers and the brief pre-hydration window still see chapter
  // content; the effect below snaps each piece to the correct scroll-driven
  // value on hydration.
  useEffect(() => {
    const mark = markRef.current;
    const body = bodyRef.current;
    if (!mark || !body) return;

    const markGroup = [mark];
    const bodyGroup = [body];

    // Cache the kinetic-headline SplitText wrapper inside the body block.
    // Reduced-motion mode renders SplitText as plain text (no wrapper),
    // so this can legitimately be null.
    const splitTextEl =
      body.querySelector<HTMLElement>(
        '[data-split-text][data-reveal="controlled"]',
      ) ?? null;

    function clearAnim(els: HTMLElement[]) {
      for (const el of els) {
        el.style.opacity = "1";
        el.style.transform = "";
        el.style.clipPath = "";
        el.style.filter = "";
      }
    }

    if (reduced) {
      clearAnim(markGroup);
      clearAnim(bodyGroup);
      // Reduced-motion: render the headline fully revealed (st = 1).
      if (splitTextEl) splitTextEl.style.setProperty("--st", "1");
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

      // Piecewise visibility curve, identical to the fade case but the
      // resolved value `o` now drives whichever animation preset was picked.
      let o: number;
      if (progress <= -lead - fade) o = 0;
      else if (progress <= -lead) o = (progress + lead + fade) / fade;
      else if (progress <= trail) o = 1;
      else if (progress <= trail + fade) o = 1 - (progress - trail) / fade;
      else o = 0;

      // Kinetic-headline progress: rising edge only. Chars stay revealed
      // through the hold and the fade-out (block opacity handles the
      // exit). Avoids re-staggering when the user scrolls back down.
      let st: number;
      if (progress <= -lead - fade) st = 0;
      else if (progress <= -lead) st = (progress + lead + fade) / fade;
      else st = 1;

      // Chapter parallax: subtle vertical drift so mark and body move at
      // slightly different rates within the dwell window. Coefficient is
      // small (10% of progress for mark, 9.2% for body); difference is
      // capped naturally by the dwell window's small progress range.
      const baseY = -progress * 0.1;
      const markY = baseY;
      const bodyY = baseY * 0.92;

      const markStyle = resolveAnim(animation, "mark", o);
      const bodyStyle = resolveAnim(animation, "body", o);

      // Compose: parallax Y prepended to the preset's transform. For
      // empty-transform presets the result is just the parallax. For
      // slide/lift/spring/tilt the transforms compose correctly (parallax
      // applied first, then preset's translate/rotate/scale).
      for (const m of markGroup) {
        m.style.opacity = markStyle.opacity;
        m.style.transform = `translate3d(0, ${markY}px, 0) ${markStyle.transform}`.trim();
        m.style.clipPath = markStyle.clipPath;
        m.style.filter = markStyle.filter;
      }
      for (const b of bodyGroup) {
        b.style.opacity = bodyStyle.opacity;
        b.style.transform = `translate3d(0, ${bodyY}px, 0) ${bodyStyle.transform}`.trim();
        b.style.clipPath = bodyStyle.clipPath;
        b.style.filter = bodyStyle.filter;
      }

      // Drive the kinetic headline's per-char reveal via the shared --st var.
      if (splitTextEl) splitTextEl.style.setProperty("--st", String(st));
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
      style={background ? { background } : undefined}
    >
      {/* Banner — chapter mark reimagined as a wide horizontal element
          with a vertical accent stripe in `--color-ignite`. Sits ~40%
          down the section (via mt-[Xvh]) instead of pinned top-left, so
          the eye lands on it after the section scroll-snaps in. The
          banner ALWAYS slides in from off-canvas-left regardless of the
          `animation` prop — see resolveAnim's mark-group early return.
          A red-glow SVG sits behind the chapter content inside the inner
          flex wrapper: rectangle that tapers down via a curved
          ~45° right end into transparent, emanating from the stripe. */}
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

      {/* Body card — sits below the banner, in flow, centered with a
          wide max-w-5xl so it takes up the majority of the section's
          width. The bodyRef is on the outer positioning wrapper so the
          animation transforms apply to the whole card (incl. its glass
          background) as a single unit. transform-origin is set so the
          spring and tilt presets pivot around a sensible point. */}
      <div
        ref={bodyRef}
        className="relative z-10 mt-12 md:mt-20 md:max-w-5xl md:mx-auto"
        style={{ transformOrigin: "center" }}
      >
        <Surface
          variant="glass"
          className="rounded-2xl p-8 md:p-14 text-left"
        >
          <SplitText
            as="h2"
            id={headingId}
            className="display-lg text-bone leading-[1.05]"
            reveal="controlled"
            staggerMs={25}
            durationMs={320}
          >
            {headline}
          </SplitText>
          <div className="mt-8 text-bone text-xl md:text-2xl leading-relaxed">{body}</div>
          {cta && (
            <div className="mt-10 flex flex-wrap gap-4">{cta}</div>
          )}
        </Surface>
      </div>
    </section>
  );
}
