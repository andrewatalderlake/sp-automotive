"use client";
import { useEffect } from "react";
import { useReducedMotion } from "framer-motion";

// Lenis smooth-scroll initializer mounted at the app root. Lenis takes over
// wheel + touch and updates window.scrollY smoothly via rAF, so existing
// rAF readers (PageScrubVideo, CornerSection.compute()) keep working
// unchanged.
//
// Reduced motion: Lenis is not constructed at all. Native scroll behavior
// is preserved.
//
// iOS-safe scroll lock compatibility: Navigation.tsx sets `body { position:
// fixed }` when the mobile dialog opens. Lenis v1 handles that fine — it
// pauses its rAF loop while the body is fixed because window.scrollY can't
// change. When the dialog closes and `position: fixed` is removed, Lenis
// resumes from the restored scroll position.

export default function SmoothScroll() {
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;

    let cancelled = false;
    let rafId = 0;
    let lenis: { raf: (time: number) => void; destroy: () => void } | null =
      null;

    // Lazy-import so Lenis stays out of the SSR bundle path.
    void (async () => {
      const { default: Lenis } = await import("lenis");
      if (cancelled) return;

      lenis = new Lenis({
        // lerp: low → snappier, high → smoother. 0.1 is Lenis's default and
        // matches the StringTune-reference feel out of the box.
        lerp: 0.1,
        smoothWheel: true,
        // syncTouch deliberately off — letting iOS use its own native
        // momentum scroll feels better than Lenis on touch.
        syncTouch: false,
        wheelMultiplier: 1,
      });

      const loop = (time: number) => {
        lenis?.raf(time);
        rafId = window.requestAnimationFrame(loop);
      };
      rafId = window.requestAnimationFrame(loop);
    })();

    return () => {
      cancelled = true;
      if (rafId) window.cancelAnimationFrame(rafId);
      lenis?.destroy();
      lenis = null;
    };
  }, [reduced]);

  return null;
}
