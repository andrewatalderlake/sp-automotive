"use client";
import { useEffect, useRef } from "react";
import Image from "next/image";
import { useMediaQuery } from "@/lib/hooks/useMediaQuery";

// Per-section scroll-scrub video. Renders an absolute-fill layer inside its
// parent section (which must be `position: relative`). As the user scrolls
// through the parent section's visibility range, the video's currentTime is
// driven 0 -> duration. Below the section, the video rests at frame 0; above,
// it rests at the final frame.
//
// Sibling to PageScrubVideo. The two coexist: PageScrubVideo provides the
// fixed atmospheric backdrop for the rest of the page, and SectionScrubVideo
// occludes it locally with section-specific footage while the parent section
// is in view.
//
// Pattern notes match PageScrubVideo:
// - Mute + playsInline + no autoplay; manual seek per frame.
// - Source clips are encoded at 120fps with dense keyframes (gop=12 = 0.1s
//   at 120fps) so seeks land on a real frame at any scroll position and
//   reverse-scroll only decodes ~12 frames of lookback per seek.
//   faststart puts moov at the head so seeks work mid-load.
// - rAF-throttled scroll handler with a `1/120` seek-threshold gate (one
//   120fps frame) so we write currentTime at the source frame rate. Was
//   0.03s previously, which gated out small seeks and read as choppy on
//   slow scroll.
// - iOS Safari quirk: setting currentTime on a paused video doesn't render
//   new frames until play() then pause() once -- we prime on first scroll.
// - ResizeObserver on the section keeps the cached bounds current when
//   neighboring content settles or fonts load.
// - Reduced motion: render only the static poster, no scroll listener.

type Props = {
  /** Path under /public, e.g. "/chapter-clips/02-paperwork.mp4". */
  src: string;
  /** Poster image (first frame), shown before the video loads and in
   *  reduced-motion mode. */
  poster: string;
};

export default function SectionScrubVideo({ src, poster }: Props) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  // serverDefault: false matches PageScrubVideo. SSR ships the video element;
  // reduced-motion users swap to the static poster after hydration.
  const reduced = useMediaQuery("(prefers-reduced-motion: reduce)");

  useEffect(() => {
    if (reduced) return;
    const wrapper = wrapperRef.current;
    const video = videoRef.current;
    if (!wrapper || !video) return;
    const section = wrapper.parentElement;
    if (!section) return;

    let rafId = 0;
    let lastTarget = -1;
    let primed = false;

    // Prime: play() then pause() once so subsequent currentTime seeks
    // render frames. Without this, Safari / WebKit shows the poster
    // forever on a never-played paused video, even after setting
    // currentTime — which looks identical to a frozen still image.
    //
    // Three things this implementation guards against:
    //   1. Visible autoplay during the play() promise's async window —
    //      call pause() SYNCHRONOUSLY right after play() so the video
    //      element doesn't render its way through frames before the
    //      promise resolves. Without this, the video appears to play
    //      from frame 0 forward until the .then() finally fires.
    //   2. Stale playhead — after priming, immediately call apply()
    //      so currentTime jumps to wherever the scroll position now
    //      maps to. Covers the case where the user scrolled during
    //      the play() window.
    //   3. Silent autoplay rejection — `primed` flips to true ONLY in
    //      the .then() success branch. If play() rejects (autoplay
    //      throttling, no user gesture, hidden tab), primed stays
    //      false and the next scroll/metadata event retries.
    function prime() {
      if (primed) return;
      const playPromise = video!.play();
      // (1) Halt any auto-playback synchronously. If play() hasn't
      // entered "playing" state yet this is a no-op; if it has, this
      // stops visible frame progression immediately.
      try { video!.pause(); } catch {/* ignore */}
      if (playPromise && typeof playPromise.then === "function") {
        playPromise.then(() => {
          primed = true;
          // (1, again) Safety re-pause in case the sync pause was
          // ignored while play() was still pending.
          try { video!.pause(); } catch {/* ignore */}
          // (2) Sync playhead to current scroll position.
          apply();
        }).catch(() => {
          // (3) Play rejected — leave primed=false for retry.
        });
      } else {
        // Legacy browsers: play() returned undefined synchronously.
        primed = true;
        apply();
      }
    }

    function apply() {
      rafId = 0;
      const dur = video!.duration;
      if (!dur || Number.isNaN(dur)) return;

      // Map the parent section's scroll-through range to [0, 1]:
      //   p = 0 -> section's TOP has just reached the viewport's TOP
      //            (rect.top === 0). Video sits at frame 0.
      //   p = 1 -> section's TOP has scrolled past the viewport's TOP by
      //            (1 / SPEED) of the section's height. After that the
      //            clamp keeps the video parked at the final frame while
      //            the user finishes reading the section.
      //
      // SPEED > 1 compresses the playthrough into the first chunk of the
      // section's scroll range (so videos feel snappy, not lethargic).
      // Below 0 (section still entering from below) we clamp to 0.
      //
      // This is the right model for sticky-cinema scrubs: the playthrough
      // happens *as the section fills the screen*, then the clip rests on
      // its final frame while the chapter copy holds the eye. Critically,
      // it makes the page-top hero start at frame 0 instead of mid-clip
      // (the old visibility-window formula treated "entering" as progress
      // and so half-played the hero at scrollY=0).
      const SPEED = 1.0;
      const rect = section!.getBoundingClientRect();
      const h = rect.height || 1;
      const p = Math.max(0, Math.min(1, (-rect.top / h) * SPEED));
      // Pin a hair shy of the duration; some browsers rewind to 0 on
      // out-of-range seeks.
      const target = Math.min(dur - 0.05, p * dur);

      if (Math.abs(target - lastTarget) < 1 / 120) return;
      lastTarget = target;
      try { video!.currentTime = target; } catch {/* pre-metadata, ignore */}
    }

    function onScroll() {
      prime();
      if (rafId) return;
      rafId = requestAnimationFrame(apply);
    }

    // Prime + seek as soon as metadata is available so the video element
    // actually renders a frame on first paint — without this, the poster
    // sits there forever if the user never scrolls (the hero case, before
    // any scroll input has happened).
    function onMeta() {
      prime();
      apply();
    }

    const ro = new ResizeObserver(apply);
    ro.observe(section);

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", apply);
    if (video.readyState >= 1) {
      prime();
      apply();
    } else {
      video.addEventListener("loadedmetadata", onMeta, { once: true });
    }

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", apply);
      video.removeEventListener("loadedmetadata", onMeta);
      ro.disconnect();
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [reduced]);

  if (reduced) {
    return (
      <div
        ref={wrapperRef}
        aria-hidden
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <Image
          src={poster}
          alt=""
          fill
          sizes="100vw"
          className="object-cover"
        />
      </div>
    );
  }

  return (
    <div
      ref={wrapperRef}
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      <video
        ref={videoRef}
        muted
        playsInline
        // Matches PageScrubVideo: preload metadata, prime on first scroll.
        // No autoplay (it fights the per-frame currentTime writes — the
        // browser keeps trying to advance the playhead, our seek yanks it
        // back, and the result is stutter or "video stops randomly").
        preload="metadata"
        poster={poster}
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src={src} type="video/mp4" />
      </video>
    </div>
  );
}
