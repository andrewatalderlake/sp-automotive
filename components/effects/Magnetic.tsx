"use client";
import { ReactNode, useEffect, useRef } from "react";

// Magnetic wrapper: child element subtly translates toward the cursor when the
// cursor is within `radius` pixels. Snaps back when the cursor leaves. Disabled
// on coarse pointers and reduced motion.

type Props = {
  children: ReactNode;
  /** Pull radius in px. Default 100. */
  radius?: number;
  /** How far the element travels (0..1 of the cursor offset). Default 0.35. */
  strength?: number;
  /** Wrapper display mode. Use "block" inside a grid/flex item. Default "inline-block". */
  display?: "inline-block" | "block";
  className?: string;
};

export default function Magnetic({ children, radius = 100, strength = 0.35, display = "inline-block", className = "" }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const isCoarse = window.matchMedia("(pointer: coarse)").matches;
    const isReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (isCoarse || isReduced) return;

    let frame = 0;
    let running = false;
    let targetX = 0;
    let targetY = 0;
    let curX = 0;
    let curY = 0;

    function ensureRunning() {
      if (running) return;
      running = true;
      frame = requestAnimationFrame(tick);
    }

    function onMove(e: MouseEvent) {
      const rect = el!.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.hypot(dx, dy);
      if (dist < radius) {
        targetX = dx * strength;
        targetY = dy * strength;
      } else {
        targetX = 0;
        targetY = 0;
      }
      ensureRunning();
    }

    function tick() {
      curX += (targetX - curX) * 0.18;
      curY += (targetY - curY) * 0.18;
      el!.style.transform = `translate3d(${curX}px, ${curY}px, 0)`;
      // Stop the rAF loop once the element has settled back to rest. Restarts
      // on the next mousemove via ensureRunning().
      const settledAtRest =
        targetX === 0 && targetY === 0 &&
        Math.abs(curX) < 0.05 && Math.abs(curY) < 0.05;
      if (settledAtRest) {
        el!.style.transform = "translate3d(0, 0, 0)";
        running = false;
        return;
      }
      frame = requestAnimationFrame(tick);
    }

    window.addEventListener("mousemove", onMove);

    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("mousemove", onMove);
    };
  }, [radius, strength]);

  return (
    <div ref={ref} className={`${display} will-change-transform ${className}`}>
      {children}
    </div>
  );
}
