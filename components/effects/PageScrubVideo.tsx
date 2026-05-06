"use client";
import { useEffect, useRef } from "react";
import Image from "next/image";
import { useMediaQuery } from "@/lib/hooks/useMediaQuery";

// Page-wide scroll-scrub video. Sits as a fixed-position layer behind the
// landing-page content; total document scroll progress drives the video's
// currentTime. Sections render above it (each section uses position: relative
// so it paints on top of this fixed sibling in the body's stacking context).
//
// Pattern notes:
// - Mute + playsInline + no autoplay; we seek manually each frame.
// - The McLaren reel was re-encoded at 60fps with a forced keyframe every
//   ~0.1s so seeks are buttery. faststart puts moov at the head so seeks
//   work mid-load.
// - rAF-throttled scroll handler with a 0.03s seek-threshold gate so we
//   don't write currentTime more often than the decoder can render.
// - ResizeObserver on documentElement keeps the cached scrollHeight current
//   when fonts/images settle or the viewport rotates.
// - iOS Safari quirk: setting currentTime on a paused video doesn't render
//   new frames until play() then pause() once — we prime on first scroll.
// - Reduced motion: render only the static poster, no scroll listener.

const POSTER = "/hero-clips/cinematic-poster.jpg";
const VIDEO_SRC = "/hero-clips/cinematic.mp4";

export default function PageScrubVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const reduced = useMediaQuery("(prefers-reduced-motion: reduce)");

  useEffect(() => {
    if (reduced) return;
    const video = videoRef.current;
    if (!video) return;

    let rafId = 0;
    let lastTarget = -1;
    let primed = false;
    let docHeight = document.documentElement.scrollHeight;

    function prime() {
      if (primed) return;
      primed = true;
      const p = video!.play();
      if (p && typeof p.then === "function") {
        p.then(() => video!.pause()).catch(() => {/* ignore */});
      } else {
        try { video!.pause(); } catch {/* ignore */}
      }
    }

    function recacheHeight() {
      docHeight = document.documentElement.scrollHeight;
      apply();
    }

    function apply() {
      rafId = 0;
      const vh = window.innerHeight;
      const total = docHeight - vh;
      if (total <= 0) return;
      const scrolled = Math.max(0, Math.min(total, window.scrollY));
      const p = scrolled / total;
      const dur = video!.duration;
      if (!dur || Number.isNaN(dur)) return;
      const target = Math.min(dur - 0.05, p * dur);
      if (Math.abs(target - lastTarget) < 0.03) return;
      lastTarget = target;
      try { video!.currentTime = target; } catch {/* pre-metadata seek, ignore */}
    }

    function onScroll() {
      prime();
      if (rafId) return;
      rafId = requestAnimationFrame(apply);
    }

    function onMeta() { apply(); }

    const ro = new ResizeObserver(recacheHeight);
    ro.observe(document.documentElement);

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", recacheHeight);
    if (video.readyState >= 1) apply();
    else video.addEventListener("loadedmetadata", onMeta, { once: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", recacheHeight);
      video.removeEventListener("loadedmetadata", onMeta);
      ro.disconnect();
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [reduced]);

  if (reduced) {
    return (
      <div aria-hidden className="pointer-events-none fixed inset-0 overflow-hidden">
        <Image
          src={POSTER}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      </div>
    );
  }

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 overflow-hidden">
      <video
        ref={videoRef}
        muted
        playsInline
        // preload="metadata" downloads only the moov atom (already at the head
        // via faststart) so duration is known and apply() can seek immediately.
        // Frames buffer progressively as scroll advances; deep-jump scrubs may
        // briefly stall while data arrives. Trade-off: ~22 s of bandwidth
        // reclaimed on a 10 Mbps cold load vs the prior preload="auto" pull
        // of the full 27 MB clip on every page entry.
        preload="metadata"
        poster={POSTER}
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src={VIDEO_SRC} type="video/mp4" />
      </video>
    </div>
  );
}
