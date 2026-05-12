"use client";
import { useEffect, useRef } from "react";
import Image from "next/image";
import { useMediaQuery } from "@/lib/hooks/useMediaQuery";

// Region-bound scroll-scrub video. Sticks at the top of its parent
// `[data-scrub-region]` ancestor; scroll progress through that region drives
// `video.currentTime` linearly. Sibling sections render above (their own
// `position: relative`) and overlay this layer.
//
// Pattern notes:
// - Mute + playsInline + no autoplay; we seek manually each frame.
// - Source clip should be re-encoded with dense keyframes (gop=1 for
//   frame-accurate scrub) and `+faststart` so seeks work mid-load.
// - rAF-throttled scroll handler with a 0.016s seek-threshold gate (~60Hz,
//   one display refresh) so we don't burn cycles on seeks the user can't see.
// - ResizeObserver on the *region* (not documentElement) keeps the cached
//   region geometry current as fonts/images settle and on viewport rotation.
// - iOS Safari quirk: setting currentTime on a paused video doesn't render
//   new frames until play() then pause() once — we prime on first scroll.
// - Reduced motion: render only the static poster, no scroll listener,
//   no <video> element at all.

type Props = {
  src: string;
  poster: string;
};

export default function SectionScrubVideo({ src, poster }: Props) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  // serverDefault: true — SSR + first hydration render the static poster
  // branch. After hydration commits, useSyncExternalStore re-snapshots and
  // non-reduced users swap to <video>. Reduced-motion users (the ones who
  // would notice an unwanted video element) see no swap. Non-reduced users
  // see a brief Image→video swap, but the video's poster is the same image,
  // so it's visually near-imperceptible.
  const reduced = useMediaQuery("(prefers-reduced-motion: reduce)", true);

  useEffect(() => {
    if (reduced) return;
    const wrapper = wrapperRef.current;
    const video = videoRef.current;
    if (!wrapper || !video) return;

    const region = wrapper.closest<HTMLElement>("[data-scrub-region]");
    if (!region) return;

    let rafId = 0;
    let lastTarget = -1;
    let primed = false;
    let dur = 0;
    let regionTop = 0;
    let scrollSpan = 0;

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

    // Cache region geometry. `regionTop` is the document-space scrollY at
    // which the region's top reaches the viewport's top; `scrollSpan` is the
    // additional scroll required for the region's bottom to reach the
    // viewport's bottom (i.e. for the sticky child to release).
    function recacheLayout() {
      const r = region!;
      const rect = r.getBoundingClientRect();
      regionTop = rect.top + window.scrollY;
      const vh = window.innerHeight;
      scrollSpan = Math.max(1, r.offsetHeight - vh);
      dur = video!.duration || 0;
      apply();
    }

    function apply() {
      // Cancel any pending rAF so a synchronous call (resize → recacheLayout,
      // RO, initial, loadedmetadata) doesn't leave an already-queued frame in
      // flight to re-seek the video. On the rAF-dispatch path this is a no-op.
      if (rafId) cancelAnimationFrame(rafId);
      rafId = 0;
      if (!dur) return;
      const scrolled = window.scrollY - regionTop;
      const t = Math.max(0, Math.min(1, scrolled / scrollSpan));
      // Stop ~50ms shy of the end so the decoder doesn't stall on the final
      // frame boundary on some browsers.
      const target = t * Math.max(0, dur - 0.05);

      if (Math.abs(target - lastTarget) < 0.016) return;
      lastTarget = target;
      try { video!.currentTime = target; } catch {/* pre-metadata seek, ignore */}
    }

    function onScroll() {
      prime();
      if (rafId) return;
      rafId = requestAnimationFrame(apply);
    }

    function onMeta() { recacheLayout(); }
    // Surface load failures (404, CORS, codec) — otherwise the component
    // silently displays the poster forever and the failure is invisible
    // to anyone debugging from the console.
    function onError() {
      console.warn("SectionScrubVideo: video failed to load", video!.error);
    }

    const ro = new ResizeObserver(recacheLayout);
    ro.observe(region);

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", recacheLayout);
    video.addEventListener("error", onError);
    if (video.readyState >= 1) recacheLayout();
    else video.addEventListener("loadedmetadata", onMeta, { once: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", recacheLayout);
      video.removeEventListener("loadedmetadata", onMeta);
      video.removeEventListener("error", onError);
      ro.disconnect();
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [reduced, src]);

  // Wrapper takes the full height of its `[data-scrub-region]` parent (which
  // gets its height from the in-flow sibling sections — hero + ch01 = ~200vh).
  // The sticky child pins at viewport top while the wrapper is in viewport,
  // releases naturally as the wrapper exits at the bottom. Sibling sections
  // are `position: relative` and thus paint above this absolute layer in
  // document order without explicit z-index.
  if (reduced) {
    return (
      <div
        ref={wrapperRef}
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0"
      >
        <div className="sticky top-0 h-screen w-full overflow-hidden">
          <Image
            src={poster}
            alt=""
            fill
            // `preload` replaces deprecated `priority` in Next 16+; reduced-motion LCP candidate.
            preload
            sizes="100vw"
            className="object-cover"
          />
        </div>
      </div>
    );
  }

  return (
    <div
      ref={wrapperRef}
      aria-hidden
      className="pointer-events-none absolute inset-0 z-0"
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <video
          ref={videoRef}
          muted
          playsInline
          // preload="metadata" downloads only the moov atom (already at the head
          // via faststart) so duration is known and apply() can seek immediately.
          preload="metadata"
          poster={poster}
          className="absolute inset-0 h-full w-full object-cover"
        >
          <source src={src} type="video/mp4" />
        </video>
      </div>
    </div>
  );
}
