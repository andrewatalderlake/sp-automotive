"use client";
import { useEffect, useRef, useState } from "react";
import { useMediaQuery } from "@/lib/hooks/useMediaQuery";

// Desktop-only custom cursor with multiple states.
//
// Default: small ring + dot, follows mouse with a lerp. Soft radial spotlight
//   behind it on dark surfaces.
// Hover (any link/button): ring grows.
// Labelled state: hovering an element with `data-cursor="<text>"` shows that
//   word inside the ring (e.g. "Call", "View", "Read"). Ring grows to a pill
//   and the dot hides so the label can read.
//
// Skipped on coarse pointers (touch) and prefers-reduced-motion.

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const spotlightRef = useRef<HTMLDivElement>(null);
  // Server snapshot for coarse=true so SSR renders null (cursor stays hidden
  // until hydration commits with the real pointer/motion values).
  const isCoarse = useMediaQuery("(pointer: coarse)", true);
  const isReduced = useMediaQuery("(prefers-reduced-motion: reduce)");
  const enabled = !isCoarse && !isReduced;
  const [hover, setHover] = useState(false);
  const [label, setLabel] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled) return;

    const dot = dotRef.current;
    const ring = ringRef.current;
    const spotlight = spotlightRef.current;
    if (!dot || !ring || !spotlight) return;

    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight / 2;
    let ringX = targetX;
    let ringY = targetY;

    function setVisible(visible: boolean) {
      const o = visible ? "1" : "0";
      dot!.style.opacity = o;
      ring!.style.opacity = o;
      spotlight!.style.opacity = o;
    }

    function onMove(e: PointerEvent) {
      targetX = e.clientX;
      targetY = e.clientY;
      dot!.style.transform = `translate3d(${targetX}px, ${targetY}px, 0)`;
      spotlight!.style.transform = `translate3d(${targetX}px, ${targetY}px, 0)`;
      setVisible(true);
      // When the window isn't focused, Chrome throttles requestAnimationFrame
      // to ~1Hz, so the lerped ring tick can't keep up and the ring "skips".
      // Snap the ring directly to the cursor in that case — we lose the
      // smooth follow but it tracks cleanly while the user is in another app.
      if (!document.hasFocus()) {
        ringX = targetX;
        ringY = targetY;
        ring!.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;
      }
    }

    function tick() {
      ringX += (targetX - ringX) * 0.18;
      ringY += (targetY - ringY) * 0.18;
      ring!.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;
      raf = requestAnimationFrame(tick);
    }

    function onOver(e: PointerEvent) {
      const t = e.target as HTMLElement | null;
      if (!t) return;
      // First check for an explicit cursor label
      const labelled = t.closest<HTMLElement>("[data-cursor]");
      if (labelled) {
        setLabel(labelled.dataset.cursor || null);
        setHover(true);
        return;
      }
      setLabel(null);
      const interactive = t.closest("a, button, [role='button'], input, textarea, label");
      setHover(!!interactive);
    }

    // Hide while the page is hidden so the cursor doesn't flash at a stale
    // position when the user switches back. The next pointermove/pointerenter
    // re-snaps it to the real cursor position.
    function onVisibility() {
      if (document.visibilityState === "hidden") setVisible(false);
    }

    let raf = requestAnimationFrame(tick);
    document.addEventListener("pointermove", onMove);
    document.addEventListener("pointerover", onOver);
    document.addEventListener("pointerenter", onMove);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerover", onOver);
      document.removeEventListener("pointerenter", onMove);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [enabled]);

  if (!enabled) return null;

  // Sizing: default 36, hover 56, labelled grows to a pill (auto width)
  const ringW = label ? "auto" : hover ? "56px" : "36px";
  const ringH = label ? "44px" : hover ? "56px" : "36px";

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
        ref={ringRef}
        aria-hidden
        className="pointer-events-none fixed top-0 left-0 z-[70] rounded-full border-2 border-accent flex items-center justify-center text-bg uppercase"
        style={{
          width: ringW,
          height: ringH,
          // Center via translate(-50%) when in label mode (auto width); fixed margins otherwise
          translate: label ? "-50% -50%" : undefined,
          marginLeft: label ? 0 : hover ? "-28px" : "-18px",
          marginTop: label ? 0 : hover ? "-28px" : "-18px",
          padding: label ? "0 18px" : 0,
          fontSize: label ? "11px" : 0,
          letterSpacing: label ? "0.2em" : 0,
          fontWeight: 600,
          backgroundColor: label ? "var(--color-accent)" : hover ? "rgba(255,255,255,0.10)" : "transparent",
          boxShadow: "0 0 12px rgba(0,0,0,0.6), inset 0 0 0 1px rgba(0,0,0,0.25)",
          transition: "width 220ms cubic-bezier(.65,0,.35,1), height 220ms cubic-bezier(.65,0,.35,1), background-color 200ms, padding 220ms, font-size 200ms, margin 220ms",
          whiteSpace: "nowrap",
        }}
      >
        {label}
      </div>
      <div
        ref={dotRef}
        aria-hidden
        className="pointer-events-none fixed top-0 left-0 z-[71] rounded-full bg-accent"
        style={{
          width: label ? 0 : hover ? "4px" : "6px",
          height: label ? 0 : hover ? "4px" : "6px",
          marginLeft: label ? 0 : hover ? "-2px" : "-3px",
          marginTop: label ? 0 : hover ? "-2px" : "-3px",
          boxShadow: "0 0 8px rgba(255,255,255,0.8)",
          transition: "width 200ms, height 200ms, margin 200ms, opacity 200ms",
          opacity: label ? 0 : 1,
        }}
      />
      <style>{`
        @media (pointer: fine) {
          html, body { cursor: none; }
          html, body *:not(input):not(textarea):not(select):not([contenteditable="true"]) {
            cursor: none !important;
          }
        }
      `}</style>
    </>
  );
}
