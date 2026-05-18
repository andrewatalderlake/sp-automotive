"use client";
import { useEffect, useRef, type ReactNode } from "react";
import { useReducedMotion } from "framer-motion";
import { DWELL_LEAD_VH, DWELL_TRAIL_VH } from "@/lib/scrub-config";
import { useViewportHeight } from "@/lib/hooks/useViewportHeight";
import SplitText from "@/components/effects/SplitText";
import Surface from "@/components/ui/Surface";
import SectionScrubVideo from "@/components/effects/SectionScrubVideo";

// Corner-anchored cinematic section primitive used by the four home-page copy
// blocks. Chapter mark pins to the top-left; body lives in a liquid-glass tab
// anchored bottom-right on desktop / stacked below the mark on mobile. The
// full section can host a per-chapter SectionScrubVideo (via videoSrc /
// videoPoster) or sit on the html canvas background if no video is provided.
//
// Visibility (scroll-driven): chapter mark + glass card reveal as the section
// approaches its "fills viewport" position, hold at full visibility through
// the dwell window, and recede as the section's scrub video starts moving
// toward the next chapter. The fade thresholds are derived from the section's
// own geometry (center + scrubTrailVh), so the text and the video pause stay
// aligned. Honors prefers-reduced-motion.
//
// Each chapter can pick a distinct motion preset via the `animation` prop:
//
//   `fade`   — opacity-only crossfade (baseline)
//   `slide`  — mark slides in from the left, body slides in from the right
//              with a subtle rotateY tilt. (Section 02.)
//   `sweep`  — clip-path mask reveals each piece from its anchor corner
//              outward.
//   `lift`   — body translates up from below + opacity. (Section 01.)
//   `spring` — body scales 0.88 → 1.04 → 1 with damped overshoot. (Section 03.)
//   `tilt`   — body rises with rotateX + translateY + blur, settling into
//              focus. (Section 04.)

type AnimationType = "fade" | "slide" | "sweep" | "lift" | "spring" | "tilt";

// Length of each fade in / fade out, in viewport heights. 0.3 → 30vh of
// scroll across each ramp. Larger = lazier; smaller = snappier.
const FADE_VH = 0.3;

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
  /**
   * Optional per-section scroll-scrub video. When provided, a SectionScrubVideo
   * renders absolutely-positioned behind the chapter content, occluding the
   * global PageScrubVideo while this section is in view. Use for chapters
   * with their own dedicated atmospheric footage (e.g. paperwork-being-filed
   * for ch02). Omit to let PageScrubVideo show through.
   */
  videoSrc?: string;
  /**
   * Poster image for the per-section video — shown before the video loads
   * and in reduced-motion mode. Required if `videoSrc` is provided.
   */
  videoPoster?: string;
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
  switch (anim) {
    case "slide": {
      // Mark slides from left (x = -100% at o=0 → 0 at o=1), body slides
      // from right (x = +100% → 0) with a subtle 3D tilt as it lands.
      const dir = group === "mark" ? -1 : 1;
      const tx = (1 - o) * 100 * dir;
      const rotY = group === "body" ? (1 - o) * -6 : 0;
      const transform =
        group === "body"
          ? `translate3d(${tx}%, 0, 0) rotateY(${rotY}deg)`
          : `translate3d(${tx}%, 0, 0)`;
      return { opacity: String(o), transform, clipPath: "", filter: "" };
    }
    case "sweep": {
      // Diagonal clip-path reveal anchored at each element's corner. Mark
      // expands from top-left toward bottom-right; body expands from
      // bottom-right toward top-left. At o=0 the inset is 100% on both sides
      // → nothing visible; at o=1 the inset is 0 → fully visible.
      const inset = (1 - o) * 100;
      const clip =
        group === "mark"
          ? `inset(0 ${inset}% ${inset}% 0)`
          : `inset(${inset}% 0 0 ${inset}%)`;
      return { opacity: String(o), transform: "", clipPath: clip, filter: "" };
    }
    case "lift": {
      // Body lifts up from below as it reveals. Mark just fades.
      if (group === "body") {
        const ty = (1 - o) * 32;
        return {
          opacity: String(o),
          transform: `translate3d(0, ${ty}px, 0)`,
          clipPath: "",
          filter: "",
        };
      }
      return { opacity: String(o), transform: "", clipPath: "", filter: "" };
    }
    case "spring": {
      // Body scales 0.88 → 1.04 (overshoot) → 1.0 (settle) as o goes 0→1.
      // Two-segment piecewise: rise to overshoot at o=0.7, settle by o=1.
      // Mark just fades.
      if (group === "body") {
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
      return { opacity: String(o), transform: "", clipPath: "", filter: "" };
    }
    case "tilt": {
      // Body rises into focus with a 3D rotateX, vertical translation, and
      // a blur that clears as it settles. Mark just fades.
      if (group === "body") {
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
      return { opacity: String(o), transform: "", clipPath: "", filter: "" };
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
  videoSrc,
  videoPoster,
}: Props) {
  const reduced = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  // Stable viewport-height accessor — see lib/hooks/useViewportHeight.ts.
  // Reading window.innerHeight inside compute() directly would drift on
  // iOS Safari as the address bar collapses mid-scroll; the hook caches
  // the value and only updates on actual resize / orientation events.
  const getVh = useViewportHeight();

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
      const vh = getVh();
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
  }, [reduced, scrubTrailVh, animation, getVh]);

  return (
    <section
      ref={sectionRef}
      aria-labelledby={headingId}
      data-scrub-time={scrubTime}
      data-scrub-trail={scrubTrailVh}
      className="relative min-h-[100svh] w-full overflow-hidden px-6 py-20 md:px-10 md:py-36"
    >
      {/* Optional per-section atmospheric video. Sits behind chapter content
          in the section's stacking context (no z-index needed — document
          order paints it first, content paints over). */}
      {videoSrc && videoPoster && (
        <SectionScrubVideo src={videoSrc} poster={videoPoster} />
      )}
      {/* Chapter mark — pinned top-left via section padding (document flow). */}
      <div ref={markRef} className="relative z-10">
        <div className="font-display text-bone leading-none tracking-[-0.02em] text-3xl md:text-5xl">
          {chapterNumber}
        </div>
        <p className="eyebrow mt-2">
          / {eyebrow}
        </p>
      </div>

      {/* Body block — liquid-glass card, absolute bottom-right on desktop,
          in-flow below chapter on mobile. The bodyRef is on the outer
          positioning wrapper so the animation transforms apply to the whole
          card (incl. its glass background) as a single unit. The Surface
          inside is the visible card. transform-origin is set so the spring
          and tilt presets pivot around a sensible point (card center). */}
      <div
        ref={bodyRef}
        className="relative z-10 mt-12 md:absolute md:right-10 md:bottom-24 md:mt-0 md:max-w-2xl"
        style={{ transformOrigin: "center" }}
      >
        <Surface
          variant="glass"
          className="rounded-2xl p-8 md:p-12 text-left"
        >
          <SplitText
            as="h2"
            id={headingId}
            className="display-md text-bone leading-[1.05]"
            reveal="controlled"
            staggerMs={25}
            durationMs={320}
          >
            {headline}
          </SplitText>
          <div className="mt-6 lead text-bone">{body}</div>
          {cta && (
            <div className="mt-10 flex flex-wrap gap-4">{cta}</div>
          )}
        </Surface>
      </div>
    </section>
  );
}
