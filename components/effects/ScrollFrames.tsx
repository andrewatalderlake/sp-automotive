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
    // Tag each handle so cleanup can dispatch to the right canceller.
    // `setTimeout` returns a number in browsers (same as
    // `requestIdleCallback`), so `typeof` can't discriminate them.
    type PendingHandle =
      | { kind: "idle"; id: number }
      | { kind: "timeout"; id: ReturnType<typeof setTimeout> };
    const idleHandles: PendingHandle[] = [];

    // Decode the first EAGER_COUNT frames immediately so the first scroll
    // is smooth, then enqueue the rest at idle priority so they don't
    // race with above-the-fold resources (hero CTAs, fonts, scrub
    // canvas paint). Without this gating, 120 parallel image requests
    // fire on mount and the decoded pixel buffers stay resident for
    // the component's lifetime — costly on mobile and unnecessary
    // until the user actually scrolls.
    const EAGER_COUNT = 10;

    function scheduleAtIdle(fn: () => void) {
      const w = window as typeof window & {
        requestIdleCallback?: (cb: () => void) => number;
      };
      if (typeof w.requestIdleCallback === "function") {
        idleHandles.push({ kind: "idle", id: w.requestIdleCallback(fn) });
      } else {
        idleHandles.push({ kind: "timeout", id: setTimeout(fn, 0) });
      }
    }

    for (let i = 1; i <= frameCount; i++) {
      const im = new window.Image();
      im.decoding = "async";
      const idx = i;
      im.onload = () => {
        if (idx === 1) draw(0);
      };
      if (i <= EAGER_COUNT) {
        im.src = framePath(framePattern, i);
      } else {
        scheduleAtIdle(() => {
          im.src = framePath(framePattern, idx);
        });
      }
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
      // Cancel any pending idle-scheduled image loads so they don't
      // fire after unmount (would still hit the network needlessly).
      const w = window as typeof window & {
        cancelIdleCallback?: (id: number) => void;
      };
      for (const handle of idleHandles) {
        if (handle.kind === "idle") {
          w.cancelIdleCallback?.(handle.id);
        } else {
          clearTimeout(handle.id);
        }
      }
      idleHandles.length = 0;
      // Release references; browser GC can free decoded buffers.
      images.length = 0;
    };
  }, [reduced, frameCount, framePattern]);

  if (reduced) {
    return (
      <div ref={wrapperRef} aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* `priority`: the poster IS the hero in reduced-motion mode and
            therefore the LCP candidate. Without it Next.js won't emit a
            preload link and the browser only discovers the image when it
            parses the body — a full RTT added to the LCP on the critical
            path for ~15–20% of visitors. */}
        <Image src={fallbackPoster} alt="" fill sizes="100vw" priority className="object-cover" />
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
