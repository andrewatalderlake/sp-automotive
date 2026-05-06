"use client";

import { useEffect, useRef, type RefObject } from "react";

/**
 * Cursor-driven explosion progress hook.
 *
 * Tracks the pointer relative to a container's center and drives a normalized
 * progress value (0 → 1) which is applied to a video element's `currentTime`.
 *
 * Mental model:
 *   - Pointer at the dead center of the container → progress 1 (fully exploded).
 *   - Pointer at any edge of the container's bounding box (top, bottom, left,
 *     right) or beyond → progress 0 (assembled, matches the static
 *     `floating-car` image).
 *   - Pointer somewhere in between → linear ramp using the **Chebyshev**
 *     distance in box-normalized coordinates: `max(|dx|/halfW, |dy|/halfH)`.
 *     This produces a square-shaped contour map of progress that matches the
 *     rectangular container — entering the box from any side starts the
 *     animation evenly, and the dead center is the only point where progress
 *     reaches 1.
 *
 * The progress value is **smoothed** with a single requestAnimationFrame lerp
 * loop. The same loop handles both approach (cursor entering) and retreat
 * (cursor leaving / off-page) — on `pointerleave` we just snap the *target* to
 * 0 and let the lerp ease back. With `lerp = 0.08` this produces roughly the
 * 600ms decay the design called for.
 *
 * The hook is a no-op if the user prefers reduced motion or is on a coarse
 * pointer (touch). HeroVisual decides whether to even mount the hook based on
 * those queries; the early-return inside is a safety net.
 *
 * Repurposing later: the only thing tied to a video here is the
 * `applyProgress` step. To swap in a different visual (e.g. animating square
 * positions for a placeholder, or driving GSAP timelines), replace the
 * `applyProgress` body — everything else stays the same.
 */
export function useCursorProgress(opts: {
  videoRef: RefObject<HTMLVideoElement | null>;
  /**
   * Fraction of the box's half-dimensions where progress hits 0 (uniform on
   * both axes). 1 = exactly the bounding-box edges (default). 0.5 = the
   * inner half-box. Higher than 1 extends the active zone outside the box.
   * Overridden per-axis by `reachX` / `reachY`.
   */
  reach?: number;
  /** Per-axis override for the horizontal active zone. Defaults to `reach`. */
  reachX?: number;
  /** Per-axis override for the vertical active zone. Defaults to `reach`. */
  reachY?: number;
  /** Override for the LEFT half of the box only. Defaults to `reachX`. */
  reachLeft?: number;
  /** Override for the RIGHT half of the box only. Defaults to `reachX`. */
  reachRight?: number;
  /** Override for the TOP half of the box only. Defaults to `reachY`. */
  reachTop?: number;
  /** Override for the BOTTOM half of the box only. Defaults to `reachY`. */
  reachBottom?: number;
  /** Smoothing factor per frame. ~0.08 ≈ 600ms decay. Higher = snappier, lower = floatier. */
  lerp?: number;
}): { containerRef: RefObject<HTMLDivElement | null> } {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const {
    videoRef,
    reach = 1,
    reachX,
    reachY,
    reachLeft,
    reachRight,
    reachTop,
    reachBottom,
    lerp = 0.08,
  } = opts;
  // Resolve cascading defaults: per-side falls back to per-axis falls back to
  // uniform `reach`. So a caller passing only `reachTop: 0.6` keeps the
  // bottom/left/right at whatever `reachY`/`reachX`/`reach` resolves to.
  const rx = reachX ?? reach;
  const ry = reachY ?? reach;
  const rLeft = reachLeft ?? rx;
  const rRight = reachRight ?? rx;
  const rTop = reachTop ?? ry;
  const rBottom = reachBottom ?? ry;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Safety net: bail if we've been mounted in a context that shouldn't run
    // the cursor scrub. HeroVisual already gates this, but mediaqueries can
    // change after mount (user attaches a mouse, toggles reduced-motion).
    const mqReduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const mqCoarse = window.matchMedia("(pointer: coarse)");
    if (mqReduce.matches || mqCoarse.matches) return;

    // --- Bounding box cache -------------------------------------------------
    // Read once on mount, refresh on resize/scroll/layout changes. NEVER read
    // inside the rAF loop — getBoundingClientRect every frame is what kills
    // perf for these effects.
    let box = container.getBoundingClientRect();
    const refreshBox = () => {
      box = container.getBoundingClientRect();
    };

    const ro = new ResizeObserver(refreshBox);
    ro.observe(container);
    window.addEventListener("resize", refreshBox, { passive: true });
    window.addEventListener("scroll", refreshBox, { passive: true });

    // --- Pointer tracking ---------------------------------------------------
    // Listen on window (not container) so a pointer leaving the visual still
    // smoothly retreats progress to 0. The lerp does the easing.
    const pointer = { x: -Infinity, y: -Infinity };
    let target = 0;

    const onPointerMove = (e: PointerEvent) => {
      pointer.x = e.clientX;
      pointer.y = e.clientY;

      const cx = box.left + box.width / 2;
      const cy = box.top + box.height / 2;
      // Per-side reach: the active rectangle can be asymmetric around the
      // center (e.g. extend further up than down to capture a tall roofline
      // without stretching the bottom into empty space below the wheels).
      const dx = pointer.x - cx;
      const dy = pointer.y - cy;
      const halfW = box.width / 2;
      const halfH = box.height / 2;
      const dxr = dx >= 0 ? dx / (halfW * rRight) : -dx / (halfW * rLeft);
      const dyr = dy >= 0 ? dy / (halfH * rBottom) : -dy / (halfH * rTop);
      // Chebyshev: progress hits 0 the moment the cursor crosses the active
      // rectangle on either side, and reaches 1 only at the dead center.
      const distNormalized = Math.max(dxr, dyr);
      target = 1 - Math.min(1, Math.max(0, distNormalized));
      ensureTicking();
    };

    const onPointerLeave = () => {
      // Cursor left the viewport entirely — smoothly retreat.
      target = 0;
      ensureTicking();
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerleave", onPointerLeave);

    // --- rAF lerp loop ------------------------------------------------------
    let current = 0;
    let raf = 0;

    const applyProgress = (p: number): boolean => {
      const v = videoRef.current;
      if (!v) return false;
      const d = v.duration;
      // duration is NaN until `loadedmetadata`. Signal "not yet" to the loop.
      if (!Number.isFinite(d) || d <= 0) return false;
      // Clamp defensively even though `target` is already clamped — `current`
      // can briefly overshoot due to lerp arithmetic.
      v.currentTime = Math.min(d, Math.max(0, p * d));
      return true;
    };

    const tick = () => {
      current += (target - current) * lerp;
      // Snap to target once we're effectively there to avoid endless tiny work.
      const settled = Math.abs(current - target) < 0.0005;
      if (settled) current = target;
      const applied = applyProgress(current);
      // Park the loop only when we've reached target *and* the video accepted
      // the seek. If duration isn't ready yet, keep spinning so we catch up
      // once `loadedmetadata` fires. Otherwise pointer events will re-kick us.
      if (settled && applied) {
        raf = 0;
        return;
      }
      raf = requestAnimationFrame(tick);
    };

    // Idempotent loop start. `cancelAnimationFrame(0)` is a documented no-op,
    // so using 0 as the "not running" sentinel keeps cleanup simple.
    const ensureTicking = () => {
      if (raf === 0) raf = requestAnimationFrame(tick);
    };

    // Make sure the video doesn't try to play natively — we own currentTime.
    // Snapshot the element so the cleanup pauses the same node we set up,
    // even if React has already nulled the ref by unmount time.
    const videoAtMount = videoRef.current;
    if (videoAtMount) {
      videoAtMount.pause();
      // Seek to 0 so the first paint matches the static `floating-car` image.
      try {
        videoAtMount.currentTime = 0;
      } catch {
        // ignored — duration may not be ready yet, will settle on first tick.
      }
    }

    raf = requestAnimationFrame(tick);

    // --- Cleanup ------------------------------------------------------------
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("resize", refreshBox);
      window.removeEventListener("scroll", refreshBox);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerleave", onPointerLeave);
      videoAtMount?.pause();
    };
  }, [videoRef, rLeft, rRight, rTop, rBottom, lerp]);

  return { containerRef };
}
