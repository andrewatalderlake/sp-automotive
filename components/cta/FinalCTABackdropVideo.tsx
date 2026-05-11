"use client";
import { useEffect, useRef } from "react";
import { useMediaQuery } from "@/lib/hooks/useMediaQuery";
import { DWELL_LEAD_VH, DWELL_TRAIL_VH } from "@/lib/scrub-config";

// Length of each fade-in / fade-out ramp, in viewport heights. Matches
// the chapter sections' FADE_VH so the closing CTA's backdrop reveals
// on the same cadence the rest of the page is tuned to.
const FADE_VH = 0.4;

// Looping ambient backdrop video for the closing CTA (`FinalCTA`).
//
// Visibility (scroll-driven): the container's opacity is computed from
// the section's position relative to viewport center, on the same curve
// CornerSection uses for the chapter cards (DWELL_LEAD_VH pre-roll,
// DWELL_TRAIL_VH post-roll, FADE_VH ramps). The video plays only while
// opacity > 0, pauses when fully faded out — so it isn't decoding while
// off-screen.
//
// Edge blending: a vertical `mask-image` on the container fades the top
// and bottom ~18% of the backdrop to transparent. Above the masked top,
// the section's CSS gradient (`ink → ink-deep`) shows through, blending
// into whatever sits above the section (the preceding chapter's gradient
// on /home, AboutHero/Story stack on /about, etc.). Same on the bottom
// into the footer. No more hard horizontal cut at the section boundary.
//
// iOS Safari sometimes ignores `play()` on a muted video until after
// `loadeddata`; the play call is fire-and-forget with a swallowed catch
// so an early-call rejection doesn't surface as an unhandled promise.
// Honors prefers-reduced-motion by rendering nothing — the section's
// gradient background remains as the fallback contrast floor.

export default function FinalCTABackdropVideo() {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const reduced = useMediaQuery("(prefers-reduced-motion: reduce)");

  useEffect(() => {
    if (reduced) return;
    const v = videoRef.current;
    const c = containerRef.current;
    if (!v || !c) return;
    const section = c.parentElement;
    if (!section) return;

    let rafId = 0;
    let playing = false;
    // With preload="none" the browser holds the fetch until we ask. We
    // trigger v.load() the first time the visibility curve becomes
    // non-zero — i.e. the section is entering its leading fade ramp,
    // approaching the viewport — so the file doesn't compete with LCP
    // resources on first paint.
    let loaded = false;

    const tryPlay = () => {
      if (playing) return;
      playing = true;
      const p = v.play();
      if (p && typeof p.catch === "function") {
        p.catch(() => {
          playing = false;
        });
      }
    };

    const pause = () => {
      if (!playing) return;
      playing = false;
      v.pause();
    };

    function compute() {
      rafId = 0;
      const vh = window.innerHeight;
      const top = section!.getBoundingClientRect().top + window.scrollY;
      const center = top + section!.offsetHeight / 2 - vh / 2;
      const progress = window.scrollY - center;

      const lead = DWELL_LEAD_VH * vh;
      const trail = DWELL_TRAIL_VH * vh;
      const fade = FADE_VH * vh;

      // Piecewise visibility curve — identical shape to the one in
      // CornerSection.compute(). Symmetric ramps, flat hold across the
      // dwell window centered on the section's viewport-center crossing.
      let o: number;
      if (progress <= -lead - fade) o = 0;
      else if (progress <= -lead) o = (progress + lead + fade) / fade;
      else if (progress <= trail) o = 1;
      else if (progress <= trail + fade) o = 1 - (progress - trail) / fade;
      else o = 0;

      c!.style.opacity = String(o);
      if (o > 0 && !loaded) {
        loaded = true;
        v!.load();
      }
      if (o > 0.01) tryPlay();
      else pause();
    }

    function onScroll() {
      if (rafId) return;
      rafId = requestAnimationFrame(compute);
    }

    compute();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", compute);

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", compute);
    };
  }, [reduced]);

  if (reduced) return null;

  return (
    <div
      ref={containerRef}
      aria-hidden
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
      style={{
        // Initial opacity 0; compute() sets the real value on mount so
        // there's no flash of full-opacity video before scroll measures.
        opacity: 0,
        // Top + bottom 18% fade to transparent. The container's parent
        // section has a gradient CSS background that shows through the
        // masked-out edges, so the video reads as a glowing band in the
        // middle of the section rather than a hard rectangle.
        maskImage:
          "linear-gradient(to bottom, transparent 0%, black 18%, black 82%, transparent 100%)",
        WebkitMaskImage:
          "linear-gradient(to bottom, transparent 0%, black 18%, black 82%, transparent 100%)",
      }}
    >
      <video
        ref={videoRef}
        src="/sections/radiant-backdrop.mp4"
        loop
        muted
        playsInline
        preload="none"
        className="absolute inset-0 h-full w-full object-cover"
      />
      {/* Dark scrim — matches the prior SectionParallaxImage scrimOpacity
          (0.55) used here, so CTA contrast stays where it was. */}
      <div aria-hidden className="absolute inset-0 bg-black/55" />
    </div>
  );
}
