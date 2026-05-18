import { useCallback, useEffect, useRef } from "react";

// Stable viewport-height accessor for scroll/layout math.
//
// iOS Safari's address bar collapses and expands during scroll, which makes
// reading `window.innerHeight` inside a RAF/scroll handler unstable: each
// frame can see a different value while the toolbar animates, and any math
// that depends on it (parallax dwell windows, sticky thresholds, GSAP
// ScrollTrigger end positions) drifts. This hook decouples those reads from
// scroll by caching innerHeight in a ref and updating it only on real
// resize/orientation events, not on every scroll frame.
//
// API: returns a stable `getVh()` accessor — callable inside RAF loops, GSAP
// scrollTrigger `end: () => …` callbacks, or anywhere a current snapshot is
// needed without subscribing to re-renders.
export function useViewportHeight(): () => number {
  const vhRef = useRef<number>(
    typeof window !== "undefined" ? window.innerHeight : 800,
  );

  useEffect(() => {
    const update = () => {
      vhRef.current = window.innerHeight;
    };
    update();
    // `resize` alone — NOT `orientationchange`. On iOS Safari (and some
    // Android engines) `orientationchange` fires BEFORE innerHeight has
    // committed the new viewport dimensions, so reading it there caches
    // the pre-rotation height. The browser always fires `resize` once
    // the post-rotation layout is settled, which is the correct moment
    // to capture innerHeight.
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("resize", update);
    };
  }, []);

  return useCallback(() => vhRef.current, []);
}
