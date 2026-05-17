"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { useMediaQuery } from "@/lib/hooks/useMediaQuery";

// Image-sequence scroll-scrub via canvas. Replaces SectionScrubVideo
// for the hero because video element seek+decode+paint cycles couldn't
// keep up with Lenis-driven scroll on either Chrome or Safari.
//
// Why canvas over <img src> swaps:
//   The naive image-sequence approach swaps a single <img>'s src on
//   each scroll tick. Even with frames preloaded into HTTP cache
//   AND into Image() objects in JS, each src assignment triggers
//   a fresh JPEG decode for the visible <img>'s own buffer — the
//   preload's decoded buffer is NOT shared with the <img>. At 60
//   swaps/sec on 1080p images, that's enough decode work to lag
//   the main thread.
//
//   Canvas + drawImage paints DIRECTLY from the cached HTMLImageElement's
//   own decoded buffer. No re-decode on scroll. GPU-composited paint.
//   Same memory cost as the <img> approach (one decoded buffer per
//   frame, held by the Image objects), but zero per-scroll decode.
//
// Reduced motion: render the fallback poster as a static <Image>.

type Props = {
  frameCount: number;
  /** URL pattern with `{n}` replaced by 3-digit padded 1-indexed frame number. */
  framePattern: string;
  fallbackPoster: string;
};

function framePath(pattern: string, oneIndexed: number): string {
  return pattern.replace("{n}", String(oneIndexed).padStart(3, "0"));
}

export default function ScrollFrames({ frameCount, framePattern, fallbackPoster }: Props) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduced = useMediaQuery("(prefers-reduced-motion: reduce)");

  useEffect(() => {
    if (reduced) return;
    const wrapper = wrapperRef.current;
    const canvas = canvasRef.current;
    if (!wrapper || !canvas) return;
    const section = wrapper.parentElement;
    if (!section) return;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;
    // Better than the default "low"/"medium" — canvas downsample from
    // the source image to the canvas backing store uses a higher-quality
    // resampler, eliminating the grainy/aliased look on Retina canvases
    // where the source is scaled. Free perf-wise; modern browsers do
    // this in the GPU compositor.
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    let rafId = 0;
    let lastIndex = -1;
    const images: HTMLImageElement[] = [];
    let loadedCount = 0;

    // Decode all frames once. Each Image holds its decoded buffer; we
    // paint from those buffers on every scroll tick — no re-decode.
    for (let i = 1; i <= frameCount; i++) {
      const im = new window.Image();
      im.src = framePath(framePattern, i);
      im.decoding = "async";
      im.onload = () => {
        loadedCount++;
        // Once frame 1 is loaded, paint it as the initial frame.
        if (i === 1) draw(0);
      };
      images.push(im);
    }

    function sizeCanvas() {
      const rect = wrapper!.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = Math.max(1, Math.round(rect.width * dpr));
      const h = Math.max(1, Math.round(rect.height * dpr));
      if (canvas!.width !== w || canvas!.height !== h) {
        canvas!.width = w;
        canvas!.height = h;
      }
    }

    function draw(index: number) {
      const im = images[index];
      if (!im || !im.complete || im.naturalWidth === 0) return;
      sizeCanvas();
      // Cover-fit: scale image to cover canvas, preserving aspect.
      const cw = canvas!.width;
      const ch = canvas!.height;
      const iw = im.naturalWidth;
      const ih = im.naturalHeight;
      const scale = Math.max(cw / iw, ch / ih);
      const dw = iw * scale;
      const dh = ih * scale;
      const dx = (cw - dw) / 2;
      const dy = (ch - dh) / 2;
      ctx!.drawImage(im, dx, dy, dw, dh);
    }

    function apply() {
      rafId = 0;
      const SPEED = 1.0;
      const rect = section!.getBoundingClientRect();
      const h = rect.height || 1;
      const p = Math.max(0, Math.min(1, (-rect.top / h) * SPEED));
      // Index in [0, frameCount-1]. Skip the paint if frame hasn't
      // loaded yet — once loaded, the next scroll tick will paint it.
      const index = Math.min(frameCount - 1, Math.floor(p * frameCount));
      if (index === lastIndex) return;
      // Don't update lastIndex until we actually painted; if image not
      // loaded yet, retry on next scroll.
      const im = images[index];
      if (!im || !im.complete || im.naturalWidth === 0) {
        // Loading — keep the previous frame on screen rather than blank.
        return;
      }
      lastIndex = index;
      draw(index);
    }

    function onScroll() {
      if (rafId) return;
      rafId = requestAnimationFrame(apply);
    }

    const ro = new ResizeObserver(() => {
      // On resize, repaint current frame at new canvas size.
      if (lastIndex >= 0) draw(lastIndex);
      else apply();
    });
    ro.observe(wrapper);
    window.addEventListener("scroll", onScroll, { passive: true });
    apply();

    return () => {
      window.removeEventListener("scroll", onScroll);
      ro.disconnect();
      if (rafId) cancelAnimationFrame(rafId);
      // Release references; browser GC can free decoded buffers.
      images.length = 0;
      void loadedCount;
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
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
      />
    </div>
  );
}
