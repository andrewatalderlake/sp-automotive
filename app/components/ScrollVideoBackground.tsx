"use client";

import { useEffect, useRef } from "react";

/**
 * Page-wide background video with section-anchored hold zones.
 *
 * # Behavior
 *
 * Each section opts into the video timeline by adding either
 * `data-scroll-anchor="<fraction>"` (0–1 of the video) or
 * `data-scroll-anchor-seconds="<seconds>"` (absolute time). Sections
 * register themselves; this component discovers them via DOM query.
 *
 *   <section data-scroll-anchor="0">           → holds at first frame
 *   <section data-scroll-anchor="1">           → holds at last frame
 *   <section data-scroll-anchor-seconds="7">   → holds at 7s into the video
 *
 * Use seconds when you're targeting specific moments in the cut (the
 * common case for editorial pacing); use fraction when you want the anchor
 * to follow if the video gets re-cut to a different total length. If both
 * are present on the same element, seconds wins.
 *
 * # Mapping
 *
 * The viewport center y-coordinate is the input signal. Each section
 * defines a single TRIGGER POINT — a Y position on the page where this
 * section's frame is reached. The video lerps linearly between adjacent
 * triggers; before the first trigger and after the last trigger it holds.
 *
 *   page Y →
 *   ────────────●────────────────────────────────────●─────────────
 *               ▲                                    ▲
 *               trigger A                            trigger B
 *               (this section's frame                (this section's frame
 *                is reached here)                     is reached here)
 *
 *      ╞═════ hold A ═════╡╞══════ lerp A→B ══════╡╞══ hold B ══╡
 *      vCenter < A         A < vCenter < B          vCenter > B
 *
 * Trigger Y defaults to the section's vertical midpoint, override per
 * section via `data-scroll-anchor-trigger-pct="<n>"` where 0 = section
 * top, 100 = section bottom, 50 = center (default).
 *
 * Why this model: the animation span is automatically the entire scroll
 * distance between the first and last trigger — no spacers needed, no
 * shrunken transition bands at section boundaries. With centered triggers
 * the animation occupies ~86% of total page scroll, naturally slowing the
 * play to one video-second per ~150px of scroll. Holds happen for free
 * outside the trigger range (page top before trigger 1, page bottom after
 * the last trigger).
 *
 * # Why offsetTop/Height instead of IntersectionObserver
 *
 * IntersectionObserver gives binary in/out callbacks but can't tell us
 * *where* in a section the viewport center sits — and that's the signal
 * we need to drive the smooth lerp between triggers. So we compute it
 * directly from cached `offsetTop`/`offsetHeight`, refreshed on
 * resize/reflow only (NOT in the rAF loop — that would force layout
 * every frame).
 *
 * # Smoothing
 *
 * A rAF lerp loop pulls `current` toward `target` so the visible scrub
 * doesn't twitch on raw scroll deltas; the same loop also produces graceful
 * settling when the user stops at a hold zone. Mirrors the smoothing
 * pattern in `app/hooks/useCursorProgress.ts`.
 *
 * # Reduced motion
 *
 * Video stays paused on the poster frame; the rAF loop never starts.
 */

type Anchor = {
  el: HTMLElement;
  frame: number; // 0..1
};

export function ScrollVideoBackground() {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const mqReduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mqReduce.matches) {
      video.pause();
      try {
        video.currentTime = 0;
      } catch {
        /* metadata not ready yet — first paint shows the poster */
      }
      return;
    }

    // --- Anchor discovery ---------------------------------------------------
    // Sorted by `offsetTop` ascending. Refreshed when the document resizes
    // (e.g. responsive breakpoint changes) AND when the video metadata
    // arrives (seconds-based anchors need `video.duration` to convert to a
    // fraction). NEVER refreshed inside the rAF loop.
    let anchors: Anchor[] = [];
    const refreshAnchors = () => {
      const els = Array.from(
        document.querySelectorAll<HTMLElement>(
          "[data-scroll-anchor], [data-scroll-anchor-seconds]"
        )
      );
      const duration = video.duration;
      const haveDuration = Number.isFinite(duration) && duration > 0;

      anchors = els
        .map((el) => {
          // Seconds wins if both attributes are present. Fall back to the
          // fraction form (or 0) when seconds can't be resolved yet because
          // duration isn't known — anchors will be re-resolved on
          // `loadedmetadata`.
          const secondsAttr = el.dataset.scrollAnchorSeconds;
          if (secondsAttr !== undefined && haveDuration) {
            const s = parseFloat(secondsAttr);
            if (Number.isFinite(s)) {
              return { el, frame: clamp01(s / duration) };
            }
          }
          const frac = parseFloat(el.dataset.scrollAnchor ?? "0");
          return { el, frame: clamp01(Number.isFinite(frac) ? frac : 0) };
        })
        .sort((a, b) => a.el.offsetTop - b.el.offsetTop);
    };
    refreshAnchors();

    const ro = new ResizeObserver(refreshAnchors);
    ro.observe(document.documentElement);
    window.addEventListener("resize", refreshAnchors, { passive: true });
    // Re-resolve seconds → fraction once the browser knows the duration.
    video.addEventListener("loadedmetadata", refreshAnchors);

    // --- Target computation -------------------------------------------------
    // Returns the desired video progress in [0, 1] for the current scroll
    // position. Designed to be cheap: only reads `window.scrollY`,
    // `window.innerHeight`, and the cached anchor `offsetTop`/`offsetHeight`.
    //
    // Algorithm:
    //   1. Compute each anchor's trigger Y (section.offsetTop + fraction *
    //      section.offsetHeight).
    //   2. If vCenter is at or before the first trigger → first frame held.
    //   3. If vCenter is at or after the last trigger → last frame held.
    //   4. Otherwise vCenter is between triggers i-1 and i — lerp linearly
    //      from prev.frame to curr.frame across that span.
    const computeTarget = (): number => {
      if (anchors.length === 0) return 0;

      const vCenter = window.scrollY + window.innerHeight / 2;

      // Build trigger points from current layout. Cheap — no
      // getBoundingClientRect, just cached offsetTop/Height arithmetic.
      const triggers = anchors.map((a) => ({
        y: a.el.offsetTop + a.el.offsetHeight * resolveTriggerFraction(a.el),
        frame: a.frame,
      }));

      // Before/at the first trigger → first frame held.
      if (vCenter <= triggers[0].y) return triggers[0].frame;

      // After/at the last trigger → last frame held.
      const last = triggers[triggers.length - 1];
      if (vCenter >= last.y) return last.frame;

      // Between triggers — find the bracketing pair and lerp.
      for (let i = 1; i < triggers.length; i++) {
        const curr = triggers[i];
        if (vCenter < curr.y) {
          const prev = triggers[i - 1];
          const t = clamp01((vCenter - prev.y) / (curr.y - prev.y));
          return prev.frame + (curr.frame - prev.frame) * t;
        }
      }

      // Should be unreachable given the bounds checks above.
      return last.frame;
    };

    let target = computeTarget();
    const onScroll = () => {
      target = computeTarget();
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    // --- rAF lerp loop ------------------------------------------------------
    let current = target;
    let raf = 0;
    let lastApplied = -1;

    // Lerp factor — gentler value (0.10) vs. the original 0.15. Backward
    // h.264 seeks are inherently slow because the decoder has to walk forward
    // from the nearest keyframe; a slower lerp keeps target deltas small
    // enough that the decoder can keep up on scroll-up.
    const lerp = 0.1;

    // Skip seek requests below ~2 frames (66 ms at 30fps). Any smaller and
    // the change isn't visible anyway, but the seek call still costs the
    // decoder real work — especially when scrolling backward.
    const FRAME_DT = 2 / 30;

    // Seek-pending guard. `video.currentTime = x` triggers an async seek;
    // assigning it again before `seeked` fires queues another seek and the
    // decoder falls behind, which is the root cause of scroll-up jitter.
    // We coalesce: while a seek is in flight, only remember the latest
    // requested time and issue it on `seeked`.
    let seekPending = false;
    let pendingTarget: number | null = null;

    const requestSeek = (t: number) => {
      if (seekPending) {
        // Decoder is still catching up — overwrite, don't queue.
        pendingTarget = t;
        return;
      }
      seekPending = true;
      pendingTarget = null;
      video.currentTime = t;
      lastApplied = t;
    };

    const onSeeked = () => {
      seekPending = false;
      // If a newer target arrived while we were seeking, satisfy it now.
      if (pendingTarget !== null) {
        const next = pendingTarget;
        pendingTarget = null;
        seekPending = true;
        video.currentTime = next;
        lastApplied = next;
      }
    };
    video.addEventListener("seeked", onSeeked);

    const tick = () => {
      current += (target - current) * lerp;
      if (Math.abs(current - target) < 0.0005) current = target;

      const d = video.duration;
      if (Number.isFinite(d) && d > 0) {
        // Stay a hair off the end so the decoder never tries to decode past
        // the last frame (some browsers stall at exact d).
        const t = Math.min(d - 0.001, Math.max(0, current * d));
        if (Math.abs(t - lastApplied) > FRAME_DT) {
          requestSeek(t);
        }
      }

      raf = requestAnimationFrame(tick);
    };

    // We own currentTime — make sure the video doesn't try to play natively.
    video.pause();
    try {
      video.currentTime = 0;
    } catch {
      /* metadata not ready — first tick will set it */
    }

    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", refreshAnchors);
      video.removeEventListener("loadedmetadata", refreshAnchors);
      video.removeEventListener("seeked", onSeeked);
    };
  }, []);

  return (
    <>
      {/* Fixed full-viewport video. -z-20 sits behind everything including
          the contrast overlay below. object-cover crops to fill on any
          aspect ratio; the master is 16:9 so portrait viewports crop the
          sides — fine for a scrub background. */}
      <video
        ref={videoRef}
        src="/videos/scroll-bg.mp4"
        poster="/videos/scroll-bg-poster.jpg"
        muted
        playsInline
        preload="auto"
        aria-hidden
        className="fixed inset-0 -z-20 h-full w-full object-cover"
      />

      {/* Contrast overlay — single global vignette, sits between the video
          and the page content. Top/bottom darker than middle so the header
          and the footer-adjacent area read cleanly without flattening the
          image at mid-scroll. pointer-events-none so it never eats clicks. */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.35),rgba(0,0,0,0.15)_30%,rgba(0,0,0,0.15)_70%,rgba(0,0,0,0.45))]"
      />
    </>
  );
}

function clamp01(n: number): number {
  return Math.min(1, Math.max(0, n));
}

// Default trigger position within a section: 50% = the section's vertical
// midpoint. Per-section override:
//
//   <section data-scroll-anchor="0" data-scroll-anchor-trigger-pct="20">
//
// 0 = top of section, 50 = center (default), 100 = bottom of section.
// Smaller values for an early section make its hold-at-frame end sooner
// (animation starts sooner). Smaller values for a late section make the
// hold-at-frame begin sooner (animation ends sooner / final pause feels
// longer).
const TRIGGER_FRACTION_DEFAULT = 0.5;

function resolveTriggerFraction(el: HTMLElement): number {
  const attr = el.dataset.scrollAnchorTriggerPct;
  if (attr !== undefined) {
    const n = parseFloat(attr);
    if (Number.isFinite(n)) return clamp01(n / 100);
  }
  return TRIGGER_FRACTION_DEFAULT;
}
