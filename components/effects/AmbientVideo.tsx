"use client";
import Image from "next/image";
import { useEffect, useRef } from "react";
import { useMediaQuery } from "@/lib/hooks/useMediaQuery";

// Ambient autoplay backdrop. Renders a muted, looping `<video>` filling
// its parent (which must be `position: relative`), or — when the user
// has set `prefers-reduced-motion: reduce` — a static poster `<Image>`
// in the same slot.
//
// WCAG 2.2.2: auto-playing motion longer than 5s must not start at all
// for users who have expressed the reduced-motion preference. Mirrors
// the reduced-motion swap pattern used by SectionScrubVideo so the two
// stay consistent.
//
// Playback gating: an IntersectionObserver pauses the video when the
// wrapper scrolls out of viewport and resumes it when it comes back.
// Stops continuous GPU frame decode (and the battery cost that comes
// with it on mobile) while the section is offscreen. The footer is
// the largest beneficiary — its ambient loop now only plays when the
// user has actually scrolled to the bottom of the page. Falls back to
// "always play" if IntersectionObserver isn't available (matches the
// pre-gating behavior).
//
// SSR: matches SectionScrubVideo's serverDefault (false). The server
// ships the video element; reduced-motion clients swap to the poster
// after hydration.

type Props = {
  /** Path under /public, e.g. "/chapter-clips/05-workshop.mp4". */
  src: string;
  /** Poster image (first frame). Shown before the video loads, and as
   *  the sole rendered layer in reduced-motion mode. */
  poster: string;
  /** Optional override for the absolute-fill wrapper classes. */
  className?: string;
};

const DEFAULT_WRAPPER =
  "pointer-events-none absolute inset-0 overflow-hidden";

export default function AmbientVideo({ src, poster, className }: Props) {
  const reduced = useMediaQuery("(prefers-reduced-motion: reduce)");
  const wrapperClass = className ?? DEFAULT_WRAPPER;
  const wrapperRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (reduced) return;
    const wrapper = wrapperRef.current;
    const video = videoRef.current;
    if (!wrapper || !video) return;

    // If IntersectionObserver is unavailable, fall back to always-on
    // playback — matches the pre-gating behavior, no regression.
    if (typeof IntersectionObserver === "undefined") {
      video.play().catch(() => {});
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            // play() can reject when the browser's autoplay policy
            // blocks (rare for muted+playsInline, but guard anyway).
            video.play().catch(() => {});
          } else {
            video.pause();
          }
        }
      },
      {
        // Start playback slightly before the section is fully on-screen
        // so the user doesn't see a frozen poster as they scroll into it.
        rootMargin: "200px 0px",
        threshold: 0,
      },
    );
    io.observe(wrapper);
    return () => io.disconnect();
  }, [reduced]);

  if (reduced) {
    return (
      <div aria-hidden className={wrapperClass}>
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
    <div ref={wrapperRef} aria-hidden className={wrapperClass}>
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        // No `autoPlay` — the IO effect above starts playback once the
        // wrapper enters the viewport. Mounting an autoplay video that's
        // immediately offscreen would waste a decode burst before the IO
        // had a chance to pause it.
        loop
        muted
        playsInline
        preload="auto"
        className="absolute inset-0 w-full h-full object-cover"
      />
    </div>
  );
}
