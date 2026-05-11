"use client";
import { useEffect, useRef } from "react";
import Image from "next/image";
import { useReducedMotion } from "framer-motion";

// Full-bleed background image for a chapter section. Provides a subtle
// ken-burns scale (1.0 → 1.0 + scaleAmplitude) and brightness ramp
// (brightnessFloor → 1.0) tied to scroll position, so the image feels
// alive without competing with the chapter copy on top of it.
//
// Wrap a chapter like this:
//
//   <div className="relative isolate min-h-[100svh] overflow-hidden">
//     <SectionParallaxImage src="/sections/ch02-…" alt="…" />
//     <CornerSection chapterNumber="02" … />
//   </div>
//
// The outer wrapper provides the stacking context, defines the section
// height, and clips the zoom so it never escapes its band.
//
// Behavior
// - Image renders via Next.js <Image fill> with sizes="100vw"; non-priority
//   so it streams after the LCP poster.
// - rAF-throttled scroll handler computes a 0→1 visibility curve from the
//   nearest ancestor section's offsetTop + window.scrollY (mirrors the
//   geometry CornerSection.compute uses; same ramp shape: rise as the
//   section enters, hold while it fills the viewport, fall as it exits).
// - On each frame writes inline transform/filter to the image wrapper,
//   skipping React state to avoid a re-render per tick.
// - ResizeObserver on documentElement catches font swaps and lazy image
//   loads that shift the section's offsetTop after first paint.
// - Reduced motion: effect early-returns; image renders static at full
//   brightness (no scale, no curve).

type Props = {
  src: string;
  alt: string;
  /** Dark scrim opacity layered above the image (under chapter copy) so
   *  glass cards stay legible across light/dark photo subjects. */
  scrimOpacity?: number;
  /** Ken-burns scale range. The image scales from 1.0 to (1 + amplitude)
   *  across the dwell window. */
  scaleAmplitude?: number;
  /** Brightness floor — the image starts darker (multiplied by this
   *  factor) and fades to full brightness as it enters the viewport. */
  brightnessFloor?: number;
};

// Same fade-shape constants CornerSection uses for chapter copy, so the
// image's visibility ramp aligns with the chapter mark + glass card.
const LEAD_VH = 0.05;
const TRAIL_VH = 0.2;
const FADE_VH = 0.3;

export default function SectionParallaxImage({
  src,
  alt,
  scrimOpacity = 0.4,
  scaleAmplitude = 0.05,
  brightnessFloor = 0.7,
}: Props) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    // Find the chapter wrapper to measure visibility against. Prefer a
    // <section> or [data-section-host] ancestor (e.g. FinalCTA's <section>);
    // fall back to parentElement for chapters wrapped in a plain <div>
    // (CustomWork, InsuranceHandling, StorageBlock — there CornerSection's
    // <section> is a sibling, not an ancestor, so closest() won't find it).
    // compute() reads getBoundingClientRect() so the measurement is
    // page-space-correct regardless of which element we land on or how its
    // offsetParent chain resolves — offsetTop alone is 0 for absolute-
    // positioned fallback elements and silently breaks the curve.
    const section = wrapper.closest<HTMLElement>("section, [data-section-host]")
      ?? wrapper.parentElement;
    if (!section) return;

    let rafId = 0;

    function compute() {
      rafId = 0;
      const el = section!;
      const vh = window.innerHeight;
      const top = el.getBoundingClientRect().top + window.scrollY;
      const center = top + el.offsetHeight / 2 - vh / 2;
      const progress = window.scrollY - center;

      const lead = LEAD_VH * vh;
      const trail = TRAIL_VH * vh;
      const fade = FADE_VH * vh;

      // Piecewise visibility curve identical to CornerSection's `o` so the
      // image ramp aligns with the chapter copy reveal.
      let o: number;
      if (progress <= -lead - fade) o = 0;
      else if (progress <= -lead) o = (progress + lead + fade) / fade;
      else if (progress <= trail) o = 1;
      else if (progress <= trail + fade) o = 1 - (progress - trail) / fade;
      else o = 0;

      const scale = 1 + scaleAmplitude * o;
      const brightness = brightnessFloor + (1 - brightnessFloor) * o;
      wrapper!.style.transform = `scale(${scale.toFixed(4)})`;
      wrapper!.style.filter = `brightness(${brightness.toFixed(3)})`;
    }

    function onScroll() {
      if (rafId) return;
      rafId = requestAnimationFrame(compute);
    }

    const ro = new ResizeObserver(compute);
    ro.observe(document.documentElement);

    compute();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", compute);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", compute);
      ro.disconnect();
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [reduced, scaleAmplitude, brightnessFloor]);

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
    >
      <div
        ref={wrapperRef}
        // transform-origin: center so the ken-burns zoom feels balanced;
        // will-change hints the compositor to keep this on the GPU.
        className="absolute inset-0 will-change-transform"
        style={{ transformOrigin: "center" }}
      >
        <Image
          src={src}
          alt={alt}
          fill
          sizes="100vw"
          priority={false}
          className="object-cover"
        />
      </div>
      {/* Dark scrim above the image so glass cards always have a contrast
          floor to land on, regardless of the photo's local luminance. */}
      <div
        className="absolute inset-0 bg-black"
        style={{ opacity: scrimOpacity }}
        aria-hidden
      />
    </div>
  );
}
