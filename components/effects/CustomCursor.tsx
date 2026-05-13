"use client";
import { useEffect, useRef, useState } from "react";
import { useMediaQuery } from "@/lib/hooks/useMediaQuery";

// Desktop-only custom cursor.
//
// Default: small bone dot follows the mouse 1:1 (no lerp, no orbiting
//   ring). Soft radial spotlight behind it on dark surfaces.
// Labelled state: hovering an element with `data-cursor="<text>"` swaps
//   the dot for a small pill containing that word (e.g. "Call", "View",
//   "Read"). The pill follows the cursor directly.
//
// Skipped on coarse pointers (touch) and prefers-reduced-motion.

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const spotlightRef = useRef<HTMLDivElement>(null);
  // Server snapshot for coarse=true so SSR renders null (cursor stays hidden
  // until hydration commits with the real pointer/motion values).
  const isCoarse = useMediaQuery("(pointer: coarse)", true);
  const isReduced = useMediaQuery("(prefers-reduced-motion: reduce)");
  const enabled = !isCoarse && !isReduced;
  const [label, setLabel] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled) return;

    const dot = dotRef.current;
    const labelEl = labelRef.current;
    const spotlight = spotlightRef.current;
    if (!dot || !spotlight) return;

    function setVisible(visible: boolean) {
      const o = visible ? "1" : "0";
      dot!.style.opacity = o;
      spotlight!.style.opacity = o;
      if (labelEl) labelEl.style.opacity = o;
    }

    function applyPosition(x: number, y: number) {
      const t = `translate3d(${x}px, ${y}px, 0)`;
      dot!.style.transform = t;
      spotlight!.style.transform = t;
      if (labelEl) labelEl.style.transform = t;
    }

    function onMove(e: PointerEvent) {
      applyPosition(e.clientX, e.clientY);
      setVisible(true);
    }

    function onOver(e: PointerEvent) {
      const t = e.target as HTMLElement | null;
      if (!t) return;
      const labelled = t.closest<HTMLElement>("[data-cursor]");
      setLabel(labelled?.dataset.cursor || null);
    }

    // Keyboard navigation: when focus moves via Tab, snap the cursor to the
    // focused element's center so the spotlight tracks tab order.
    function onFocus(e: FocusEvent) {
      const t = e.target as HTMLElement | null;
      if (!t || !(t instanceof HTMLElement)) return;
      const rect = t.getBoundingClientRect();
      applyPosition(rect.left + rect.width / 2, rect.top + rect.height / 2);
      setVisible(true);
      const labelled = t.closest<HTMLElement>("[data-cursor]");
      setLabel(labelled?.dataset.cursor || null);
    }

    // Hide while the page is hidden so the cursor doesn't flash at a stale
    // position when the user switches back. The next pointermove/pointerenter
    // re-snaps it to the real cursor position.
    function onVisibility() {
      if (document.visibilityState === "hidden") setVisible(false);
    }

    document.addEventListener("pointermove", onMove);
    document.addEventListener("pointerover", onOver);
    document.addEventListener("pointerenter", onMove);
    document.addEventListener("focusin", onFocus);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      document.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerover", onOver);
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
          width: "720px",
          height: "720px",
          marginLeft: "-360px",
          marginTop: "-360px",
          background: "radial-gradient(circle, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0) 60%)",
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
          boxShadow: "0 0 8px rgba(255,255,255,0.8)",
          transition: "opacity 200ms",
          opacity: label ? 0 : 1,
        }}
      />
      <div
        ref={labelRef}
        aria-hidden
        className="pointer-events-none fixed top-0 left-0 z-[70] flex items-center justify-center rounded-full uppercase"
        style={{
          padding: "0 18px",
          height: "44px",
          translate: "-50% -50%",
          fontSize: "11px",
          letterSpacing: "0.2em",
          fontWeight: 600,
          color: "var(--color-ink)",
          backgroundColor: "var(--color-bone)",
          boxShadow: "0 0 12px rgba(0,0,0,0.6), inset 0 0 0 1px rgba(0,0,0,0.25)",
          transition: "opacity 220ms cubic-bezier(.65,0,.35,1)",
          whiteSpace: "nowrap",
          opacity: label ? 1 : 0,
        }}
      >
        {label}
      </div>
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
