"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { useMediaQuery } from "@/lib/hooks/useMediaQuery";

// Image-sequence scroll-scrub. Replaces SectionScrubVideo for the hero
// when the video element's decoder can't keep up with scroll-driven
// seeks (Apple does this for their heavy scroll-reveals — JPG swaps on
// cached images are essentially free vs. h264 seek+decode+paint cycles).
//
// On mount: preload all N frames into the browser cache via new Image().
// On scroll: compute frame index from the parent section's scroll
// progress and swap <img src> to that frame. The browser serves from
// memory cache — no network, no decode latency, no Promise chains.
//
// Reduced motion: render the fallback poster as a static <Image>.

type Props = {
  /** Total number of frames in the sequence. */
  frameCount: number;
  /** URL pattern with `{n}` placeholder, replaced with 3-digit padded
   *  1-indexed frame number. e.g. "/hero-clips/frames/frame-{n}.jpg" */
  framePattern: string;
  /** Static poster shown before frames preload + as reduced-motion fallback. */
  fallbackPoster: string;
};

function framePath(pattern: string, oneIndexed: number): string {
  return pattern.replace("{n}", String(oneIndexed).padStart(3, "0"));
}

export default function ScrollFrames({ frameCount, framePattern, fallbackPoster }: Props) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const reduced = useMediaQuery("(prefers-reduced-motion: reduce)");

  useEffect(() => {
    if (reduced) return;
    const wrapper = wrapperRef.current;
    const img = imgRef.current;
    if (!wrapper || !img) return;
    const section = wrapper.parentElement;
    if (!section) return;

    let rafId = 0;
    let lastIndex = -1;

    // Preload every frame into the browser cache. We don't need to wait
    // for them — first scroll may briefly fetch uncached frames, but
    // subsequent passes are instant. Holding references on the array
    // prevents GC from dropping the Image objects mid-fetch.
    const preloaded: HTMLImageElement[] = [];
    for (let i = 1; i <= frameCount; i++) {
      const im = new window.Image();
      im.src = framePath(framePattern, i);
      preloaded.push(im);
    }

    function apply() {
      rafId = 0;
      const SPEED = 1.0;
      const rect = section!.getBoundingClientRect();
      const h = rect.height || 1;
      const p = Math.max(0, Math.min(1, (-rect.top / h) * SPEED));
      // Map [0, 1] to [0, frameCount-1]. Floor so frame 1 covers
      // [0, 1/N) of progress, frame N covers [(N-1)/N, 1].
      const index = Math.min(frameCount - 1, Math.floor(p * frameCount));
      if (index === lastIndex) return;
      lastIndex = index;
      img!.src = framePath(framePattern, index + 1);
    }

    function onScroll() {
      if (rafId) return;
      rafId = requestAnimationFrame(apply);
    }

    const ro = new ResizeObserver(apply);
    ro.observe(section);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", apply);
    apply();

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", apply);
      ro.disconnect();
      if (rafId) cancelAnimationFrame(rafId);
      // Release preload refs so GC can clean up.
      preloaded.length = 0;
    };
  }, [reduced, frameCount, framePattern]);

  if (reduced) {
    return (
      <div ref={wrapperRef} aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <Image src={fallbackPoster} alt="" fill sizes="100vw" className="object-cover" />
      </div>
    );
  }

  return (
    <div ref={wrapperRef} aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* eslint-disable-next-line @next/next/no-img-element -- ScrollFrames swaps src per scroll; next/image's optimization pipeline would refetch on every swap, defeating the cache strategy */}
      <img
        ref={imgRef}
        src={framePath(framePattern, 1)}
        alt=""
        className="absolute inset-0 w-full h-full object-cover"
      />
    </div>
  );
}
