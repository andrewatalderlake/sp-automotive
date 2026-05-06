"use client";
import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useMediaQuery } from "@/lib/hooks/useMediaQuery";

gsap.registerPlugin(ScrollTrigger);

// Outer wrapper for the /process WebGL piece. Owns:
//   - mobile / reduced-motion gate (static fallback, no WebGL bundle)
//   - IntersectionObserver mount gate (don't load three until in view)
//   - GSAP ScrollTrigger pin + scroll-driven progress ref
//
// The r3f scene reads from the same progressRef each frame via useFrame.
// Because progressRef is a mutable object passed by reference, GSAP's
// onUpdate doesn't trigger a React re-render — only the WebGL frame loop
// reacts to the value change.

// Lazy-load the inner scene. ssr:false because three touches `window` and
// `document` at import time. The bundle becomes its own chunk that only
// downloads when this component renders.
const CraftScene = dynamic(() => import("./CraftCanvas.client"), {
  ssr: false,
  loading: () => null,
});

const PIN_DISTANCE_VH = 120;

export default function CraftCanvas() {
  const reduced = useMediaQuery("(prefers-reduced-motion: reduce)");
  const coarse = useMediaQuery("(pointer: coarse)");
  const containerRef = useRef<HTMLElement>(null);
  const progressRef = useRef(0);
  const [mounted, setMounted] = useState(false);

  // Static fallback for mobile and reduced-motion users — no WebGL bundle.
  const useFallback = reduced || coarse;

  useEffect(() => {
    if (useFallback) return;
    const container = containerRef.current;
    if (!container) return;

    // Defer mount until the section is near the viewport. Saves WebGL init
    // for users who never scroll this far.
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setMounted(true);
            io.disconnect();
            break;
          }
        }
      },
      { rootMargin: "200px 0px" },
    );
    io.observe(container);

    // Pin the section and feed scroll progress into progressRef so the inner
    // scene's useFrame loop reads it each frame without React re-renders.
    const tween = gsap.to(progressRef, {
      current: 1,
      ease: "none",
      scrollTrigger: {
        trigger: container,
        start: "top top",
        end: () => `+=${window.innerHeight * (PIN_DISTANCE_VH / 100)}`,
        scrub: 0.4,
        pin: true,
        anticipatePin: 1,
      },
    });

    return () => {
      io.disconnect();
      tween.scrollTrigger?.kill(true);
      tween.kill();
    };
  }, [useFallback]);

  if (useFallback) {
    return <CraftCanvasFallback />;
  }

  return (
    <section
      ref={containerRef}
      aria-label="Disassembled exotic reassembling"
      className="relative h-screen w-full overflow-hidden bg-bg border-t border-divider"
    >
      <div className="absolute inset-0 z-0">
        {mounted ? <CraftScene progressRef={progressRef} /> : null}
      </div>

      {/* Editorial overlay — sits above the canvas, lets the geometry
          breathe. The text doesn't change with scroll progress; the visual
          assembly does the storytelling. */}
      <div className="relative z-10 h-full grid grid-cols-1 md:grid-cols-12 gap-6 px-6 md:px-10 py-16 pointer-events-none">
        <div className="md:col-span-4 flex flex-col justify-center">
          <p className="eyebrow">Interlude</p>
          <h3 className="mt-4 display-md">From parts, to whole.</h3>
          <p className="mt-6 lead max-w-md">
            Every panel comes off. Every panel goes back on. Torque-spec, gap-measured, signed.
          </p>
        </div>
      </div>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-muted text-[10px] uppercase tracking-[0.3em] pointer-events-none">
        scroll to assemble
      </div>
    </section>
  );
}

// Static fallback for mobile + reduced-motion. Renders the same editorial
// shell so the section reads in narrative order; the canvas is replaced by a
// placeholder block. Real assembled-car photo drops in here when shot.
function CraftCanvasFallback() {
  return (
    <section
      aria-label="From parts, to whole"
      className="relative w-full bg-bg border-t border-b border-divider px-6 md:px-10 py-20"
    >
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-6">
        <div className="md:col-span-5 flex flex-col justify-center">
          <p className="eyebrow">Interlude</p>
          <h3 className="mt-4 display-md">From parts, to whole.</h3>
          <p className="editorial mt-6 max-w-md">
            Every panel comes off. Every panel goes back on. Torque-spec, gap-measured, signed.
          </p>
        </div>
        <div className="md:col-span-7 relative aspect-[16/10] border border-white/10 bg-surface flex items-end justify-center">
          <p className="mb-6 text-[10px] uppercase tracking-[0.3em] text-muted/60">
            Assembled — pending
          </p>
        </div>
      </div>
    </section>
  );
}
