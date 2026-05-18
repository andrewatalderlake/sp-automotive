"use client";
import { useEffect } from "react";
import { useReducedMotion } from "framer-motion";

// Lenis smooth-scroll initializer mounted at the app root. Lenis takes over
// wheel + touch and updates window.scrollY smoothly via rAF, so existing
// rAF readers (SectionScrubVideo, CornerSection.compute()) keep working
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

// Minimal subset of Lenis's public API we expose for cross-component
// programmatic scrolling (FAQ jump-nav, future "back to top", etc.).
// Native scrollIntoView fights Lenis's rAF lerp; this handle lets callers
// route through Lenis itself so the scroll lands deterministically.
type LenisHandle = {
  scrollTo: (
    target: string | HTMLElement | number,
    options?: {
      offset?: number;
      immediate?: boolean;
      duration?: number;
      lock?: boolean;
      force?: boolean;
    },
  ) => void;
};

declare global {
  interface Window {
    __lenis?: LenisHandle;
  }
}

export default function SmoothScroll() {
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;

    let cancelled = false;
    let rafId = 0;
    let lenis:
      | (LenisHandle & { raf: (time: number) => void; destroy: () => void })
      | null = null;

    // Lazy-import so Lenis stays out of the SSR bundle path.
    void (async () => {
      const { default: Lenis } = await import("lenis");
      if (cancelled) return;

      lenis = new Lenis({
        // lerp: low → snappier, high → smoother. 0.08 reins the float in a
        // notch from Lenis's 0.1 default — still smooth, but the page tracks
        // the scroll wheel more directly. Calmer than the previous setting.
        lerp: 0.08,
        smoothWheel: true,
        // syncTouch deliberately off — letting iOS use its own native
        // momentum scroll feels better than Lenis on touch.
        syncTouch: false,
        wheelMultiplier: 1,
      });

      // Publish the instance so other components can call lenis.scrollTo
      // instead of fighting it via native scrollIntoView. Kept on window
      // (not React Context) because the consumers — anchor handlers, jump
      // nav — fire from event callbacks, not render.
      window.__lenis = lenis;

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
      delete window.__lenis;
    };
  }, [reduced]);

  return null;
}
