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

    // Only gate via IO; do NOT call .play() ourselves on first intersect.
    // iOS Safari only trusts gesture-less muted/playsInline playback when
    // the `autoplay` HTML attribute is present on mount — a programmatic
    // .play() from an IO callback is NOT a user-activation context, so
    // it would be rejected on first load before the user has tapped
    // anything. With the attribute set (see <video autoPlay/> below),
    // the video starts playing on mount; our IO then has authority to
    // pause it when offscreen and resume when it re-enters view — those
    // calls ARE permitted on a video that has already played.
    if (typeof IntersectionObserver === "undefined") return;

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            video.play().catch(() => {
              /* may reject before initial autoplay-start; safe to ignore */
            });
          } else {
            video.pause();
          }
        }
      },
      {
        // Resume playback slightly before the section is fully on-screen
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
        // `autoPlay` IS required for iOS Safari to trust the playback
        // context — see effect comment above. Yes, this means a section
        // that mounts offscreen (e.g. the footer) gets a brief decode
        // burst before the IO callback fires the first pause(). That's
        // the cost of cross-browser reliability; without autoplay,
        // iOS users see a frozen poster on first paint.
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        className="absolute inset-0 w-full h-full object-cover"
      />
    </div>
  );
}
