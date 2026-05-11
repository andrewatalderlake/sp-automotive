"use client";
import { useEffect, useRef } from "react";
import Image from "next/image";
import { useReducedMotion } from "framer-motion";

// Full-bleed background image for a chapter section. Provides a subtle
// brightness ramp (brightnessFloor → 1.0) tied to scroll position, so the
// image feels alive without competing with the chapter copy on top of it.
// A ken-burns scale ramp was retired in the calm-site refactor; the
// `scaleAmplitude` prop is preserved as a documented no-op for callers
// that may opt back in (see the prop's JSDoc).
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
// - Image renders via Next.js <Image fill> with sizes="100vw"; not preloaded
//   so it streams after the LCP poster.
// - rAF-throttled scroll handler computes a 0→1 visibility curve from the
//   nearest ancestor section's offsetTop + window.scrollY (mirrors the
//   geometry CornerSection.compute uses; same ramp shape: rise as the
//   section enters, hold while it fills the viewport, fall as it exits).
// - On each frame writes inline transform/filter to the image wrapper,
//   skipping React state to avoid a re-render per tick.
// - ResizeObserver on the section element catches font swaps and lazy
//   image loads that shift its offsetTop after first paint, without
//   firing for unrelated document-level resizes (which would multiply
//   work across every <SectionParallaxImage> on the page).
// - Reduced motion: effect early-returns; image renders static at full
//   brightness (no scale, no curve).

type Props = {
  src: string;
  alt: string;
  /** Dark scrim opacity layered above the image (under chapter copy) so
   *  glass cards stay legible across light/dark photo subjects. */
  scrimOpacity?: number;
  /** Currently a no-op. The ken-burns scale ramp this prop controlled was
   *  retired in the calm-site refactor in favor of a still frame; the prop
   *  is kept on the API so a caller can opt back in once the ramp is
   *  reinstated. Passing a non-default value today has no visual effect. */
  scaleAmplitude?: number;
  /** Brightness floor — the image starts darker (multiplied by this
   *  factor) and fades to full brightness as it enters the viewport. */
  brightnessFloor?: number;
  /** CSS `object-position` for the underlying <Image>. Use to bias the
   *  crop when the subject doesn't sit at the source's center (e.g. a
   *  car parked low in a tall portrait shot). Defaults to "center". */
  objectPosition?: string;
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
  objectPosition = "center",
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
      // Cancel any pending rAF so a synchronous call (resize, RO, initial)
      // doesn't leave an already-queued frame in flight to re-run us. On the
      // rAF-dispatch path this is a no-op (the ID has already fired).
      if (rafId) cancelAnimationFrame(rafId);
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

      // Ken-burns scale ramp retired for a calmer feel — keep the brightness
      // ramp (it reads as ambient, not animated) and leave transform untouched
      // so the wrapper holds its initial frame (no inline transform = scale 1).
      // `scaleAmplitude` left in the API for callers that opt back in, but
      // the read here is intentionally inert.
      void scaleAmplitude;
      const brightness = brightnessFloor + (1 - brightnessFloor) * o;
      wrapper!.style.filter = `brightness(${brightness.toFixed(3)})`;
    }

    function onScroll() {
      if (rafId) return;
      rafId = requestAnimationFrame(compute);
    }

    const ro = new ResizeObserver(compute);
    ro.observe(section);

    compute();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", compute);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", compute);
      ro.disconnect();
      if (rafId) cancelAnimationFrame(rafId);
    };
    // scaleAmplitude/brightnessFloor are intentionally NOT in deps —
    // they're captured by closure in compute() at effect setup and are
    // passed as literals at every call site. Including them would tear
    // down and rebuild listeners + RO on parent re-render with no
    // benefit. If a future call site needs dynamic values, lift them
    // to refs read inside compute() rather than re-running the effect.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduced]);

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
          className="object-cover"
          style={{ objectPosition }}
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
