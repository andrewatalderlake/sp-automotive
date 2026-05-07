"use client";
import { useEffect, useRef } from "react";
import Image from "next/image";
import { useMediaQuery } from "@/lib/hooks/useMediaQuery";
import { DWELL_LEAD_VH, DWELL_TRAIL_VH } from "@/lib/scrub-config";

// Page-wide scroll-scrub video. Sits as a fixed-position layer behind the
// landing-page content; document scroll position drives the video's
// currentTime via a piecewise-linear waypoint table. Sections render above it
// (each section uses position: relative so it paints on top of this fixed
// sibling in the body's stacking context).
//
// Pattern notes:
// - Mute + playsInline + no autoplay; we seek manually each frame.
// - The McLaren reel was re-encoded at 60fps with a forced keyframe every
//   ~0.1s so seeks are buttery. faststart puts moov at the head so seeks
//   work mid-load.
// - rAF-throttled scroll handler with a 0.03s seek-threshold gate so we
//   don't write currentTime more often than the decoder can render.
// - ResizeObserver on documentElement keeps the cached document height +
//   waypoints current when fonts/images settle or the viewport rotates.
// - iOS Safari quirk: setting currentTime on a paused video doesn't render
//   new frames until play() then pause() once — we prime on first scroll.
// - Reduced motion: render only the static poster, no scroll listener.
//
// Chapter dwells (see docs/superpowers/specs/2026-05-06-page-scrub-video-…):
// instead of a flat `time = (scrolled / total) * duration`, we build an array
// of (scrollY, time) waypoints. Two consecutive waypoints with the same
// `time` produce a *dwell* — scroll keeps moving but time stays put, so the
// clip rests on a target frame while a chapter fills the viewport. Chapters
// opt in by rendering `data-scrub-time="<seconds>"` on their section element
// (CornerSection forwards it from the optional `scrubTime` prop).

const POSTER = "/hero-clips/cinematic-poster.jpg";
const VIDEO_SRC = "/hero-clips/cinematic.mp4";

// Dwell timing constants live in `lib/scrub-config` so CornerSection's text
// fade can mirror the same numbers without drift.

type Waypoint = { scrollY: number; time: number };

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
    let waypoints: Waypoint[] = [];

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

    // Build the (scrollY, time) waypoint table from the current document
    // layout + the video's known duration. Two waypoints with the same `time`
    // form a dwell segment. Chapters declare themselves in the DOM via
    // `data-scrub-time="<seconds>"`; we sort by document position so the
    // table is always monotonic in scrollY.
    function buildWaypoints() {
      const dur = video!.duration;
      if (!dur || Number.isNaN(dur)) {
        waypoints = [];
        return;
      }
      const vh = window.innerHeight;
      const docHeight = document.documentElement.scrollHeight;
      const maxScroll = Math.max(0, docHeight - vh);
      const lead = DWELL_LEAD_VH * vh;

      const chapters = Array.from(
        document.querySelectorAll<HTMLElement>("[data-scrub-time]"),
      )
        .map((el) => {
          const time = Number(el.dataset.scrubTime);
          // Per-chapter trail override: `data-scrub-trail="<vh-fraction>"`
          // shortens or lengthens that chapter's hold without affecting
          // siblings. Falls back to the global DWELL_TRAIL_VH.
          const trailRaw = Number(el.dataset.scrubTrail);
          const trailVh = Number.isFinite(trailRaw) ? trailRaw : DWELL_TRAIL_VH;
          return { el, time, trailVh };
        })
        .filter((c) => Number.isFinite(c.time))
        .sort((a, b) => a.el.offsetTop - b.el.offsetTop);

      const wps: Waypoint[] = [{ scrollY: 0, time: 0 }];
      for (const { el, time, trailVh } of chapters) {
        // Center = scrollY at which the section's center aligns with the
        // viewport's center. For a 100svh section this resolves to
        // section.offsetTop, but the formula stays correct if a chapter
        // grows taller than the viewport.
        const center = el.offsetTop + el.offsetHeight / 2 - vh / 2;
        const start = Math.max(0, Math.min(maxScroll, center - lead));
        const end = Math.max(0, Math.min(maxScroll, center + trailVh * vh));
        // Guard against out-of-order entries if dwell windows overlap due to
        // an unexpected layout — clamp each waypoint to be ≥ the previous.
        const last = wps[wps.length - 1].scrollY;
        wps.push({ scrollY: Math.max(start, last), time });
        wps.push({ scrollY: Math.max(end, Math.max(start, last)), time });
      }
      const lastWp = wps[wps.length - 1];
      // Final waypoint pins the very end of the clip to the bottom of the
      // page so the remaining sections after the last dwell scrub through
      // the leftover footage.
      wps.push({
        scrollY: Math.max(maxScroll, lastWp.scrollY),
        time: dur - 0.05,
      });
      waypoints = wps;
    }

    function recacheLayout() {
      buildWaypoints();
      apply();
    }

    function apply() {
      rafId = 0;
      if (waypoints.length < 2) return;
      const last = waypoints[waypoints.length - 1].scrollY;
      const scrolled = Math.max(0, Math.min(last, window.scrollY));

      // Linear scan — at most ~8 waypoints, so the cost is negligible and
      // we avoid the binary-search edge cases at duplicate scrollY values.
      let i = 0;
      while (
        i < waypoints.length - 2 &&
        scrolled > waypoints[i + 1].scrollY
      ) {
        i++;
      }
      const a = waypoints[i];
      const b = waypoints[i + 1];
      const span = b.scrollY - a.scrollY;
      const t = span > 0 ? (scrolled - a.scrollY) / span : 0;
      const target = a.time + (b.time - a.time) * t;

      if (Math.abs(target - lastTarget) < 0.03) return;
      lastTarget = target;
      try { video!.currentTime = target; } catch {/* pre-metadata seek, ignore */}
    }

    function onScroll() {
      prime();
      if (rafId) return;
      rafId = requestAnimationFrame(apply);
    }

    function onMeta() { recacheLayout(); }

    const ro = new ResizeObserver(recacheLayout);
    ro.observe(document.documentElement);

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", recacheLayout);
    if (video.readyState >= 1) recacheLayout();
    else video.addEventListener("loadedmetadata", onMeta, { once: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", recacheLayout);
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
