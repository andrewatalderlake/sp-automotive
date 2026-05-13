"use client";
import { useEffect, useRef } from "react";
import { useMediaQuery } from "@/lib/hooks/useMediaQuery";

// Desktop-only custom cursor: a tiny bone-colored dot that follows the
// mouse 1:1, plus a soft radial spotlight behind it on dark surfaces.
// No ring, no labelled pill — kept deliberately minimal.
//
// Skipped on coarse pointers (touch) and prefers-reduced-motion.

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const spotlightRef = useRef<HTMLDivElement>(null);
  // Server snapshot for coarse=true so SSR renders null (cursor stays hidden
  // until hydration commits with the real pointer/motion values).
  const isCoarse = useMediaQuery("(pointer: coarse)", true);
  const isReduced = useMediaQuery("(prefers-reduced-motion: reduce)");
  const enabled = !isCoarse && !isReduced;

  useEffect(() => {
    if (!enabled) return;

    const dot = dotRef.current;
    const spotlight = spotlightRef.current;
    if (!dot || !spotlight) return;

    function setVisible(visible: boolean) {
      const o = visible ? "1" : "0";
      dot!.style.opacity = o;
      spotlight!.style.opacity = o;
    }

    function applyPosition(x: number, y: number) {
      const t = `translate3d(${x}px, ${y}px, 0)`;
      dot!.style.transform = t;
      spotlight!.style.transform = t;
    }

    function onMove(e: PointerEvent) {
      applyPosition(e.clientX, e.clientY);
      setVisible(true);
    }

    // Keyboard navigation: when focus moves via Tab, snap the cursor to the
    // focused element's center so the spotlight tracks tab order.
    function onFocus(e: FocusEvent) {
      const t = e.target as HTMLElement | null;
      if (!t || !(t instanceof HTMLElement)) return;
      const rect = t.getBoundingClientRect();
      applyPosition(rect.left + rect.width / 2, rect.top + rect.height / 2);
      setVisible(true);
    }

    // Hide while the page is hidden so the cursor doesn't flash at a stale
    // position when the user switches back. The next pointermove re-snaps it.
    function onVisibility() {
      if (document.visibilityState === "hidden") setVisible(false);
    }

    document.addEventListener("pointermove", onMove);
    document.addEventListener("pointerenter", onMove);
    document.addEventListener("focusin", onFocus);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      document.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerenter", onMove);
      document.removeEventListener("focusin", onFocus);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <>
      <div
        ref={spotlightRef}
        aria-hidden
        className="pointer-events-none fixed top-0 left-0 z-[60]"
        style={{
          width: "480px",
          height: "480px",
          marginLeft: "-240px",
          marginTop: "-240px",
          background: "radial-gradient(circle, rgba(255,255,255,0.035) 0%, rgba(255,255,255,0) 55%)",
          mixBlendMode: "screen",
        }}
      />
      <div
        ref={dotRef}
        aria-hidden
        className="pointer-events-none fixed top-0 left-0 z-[71] rounded-full bg-bone"
        style={{
          width: "6px",
          height: "6px",
          marginLeft: "-3px",
          marginTop: "-3px",
          boxShadow: "0 0 1px rgba(255,255,255,0.25)",
        }}
      />
      <style>{`
        @media (pointer: fine) {
          html, body { cursor: none; }
          html, body *:not(input):not(textarea):not(select):not([contenteditable="true"]) {
            cursor: none;
          }
        }
      `}</style>
    </>
  );
}
