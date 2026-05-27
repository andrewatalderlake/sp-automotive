"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useReducedMotion } from "framer-motion";

type Props = {
  src: string;
  poster: string;
  alt: string;
  className?: string;
};

// Drag-to-spin 360 viewer. Wraps a short orbit video as the frame source;
// horizontal pointer delta over the card width maps 1:1 to a full revolution
// of video.currentTime. No autoplay, no audio, no controls — pure scrub.
// Reduced-motion users get the poster still and no video element.
export default function CarOrbit({ src, poster, alt, className = "" }: Props) {
  const reduced = useReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const dragRef = useRef<{
    startX: number;
    startTime: number;
    pointerId: number;
    width: number;
  } | null>(null);

  const [mounted, setMounted] = useState(false);
  const [ready, setReady] = useState(false);
  const [errored, setErrored] = useState(false);
  const [hinted, setHinted] = useState(false);

  // Interactive only once the video has actually loaded a frame.
  // Marques without an orbit video file yet (404 → error event,
  // loadeddata never fires) stay non-interactive — no grab cursor,
  // no "Drag to spin" hint, no failed pointer handlers.
  const interactive = ready && !errored;

  // Lazy-mount the <video> element until the card is near the viewport. Five
  // cards × preload=metadata otherwise fires five network requests on first
  // paint. IO with 200px rootMargin gives us time to fetch before the user
  // scrolls into reach.
  useEffect(() => {
    if (reduced) return;
    const root = rootRef.current;
    if (!root) return;
    if (typeof IntersectionObserver === "undefined") {
      // Legacy fallback: browsers without IO (vanishingly rare) skip
      // lazy-mount and just render the video. Defer to a microtask so
      // the setState lands after the current render — keeps the
      // react-hooks/set-state-in-effect lint rule happy.
      queueMicrotask(() => setMounted(true));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setMounted(true);
          io.disconnect();
        }
      },
      { rootMargin: "200px" },
    );
    io.observe(root);
    return () => io.disconnect();
  }, [reduced]);

  function onPointerDown(e: React.PointerEvent<HTMLDivElement>) {
    const v = videoRef.current;
    const root = rootRef.current;
    if (!v || !root || !ready) return;
    const width = root.clientWidth;
    if (width <= 0) return;
    dragRef.current = {
      startX: e.clientX,
      startTime: v.currentTime,
      pointerId: e.pointerId,
      width,
    };
    e.currentTarget.setPointerCapture(e.pointerId);
    if (!hinted) setHinted(true);
  }

  function onPointerMove(e: React.PointerEvent<HTMLDivElement>) {
    const drag = dragRef.current;
    const v = videoRef.current;
    if (!drag || !v || e.pointerId !== drag.pointerId) return;
    const duration = v.duration;
    if (!isFinite(duration) || duration <= 0) return;
    const deltaX = e.clientX - drag.startX;
    const fraction = deltaX / drag.width;
    // Wrap into [0, duration) so the orbit is continuous past either edge.
    const raw = drag.startTime + fraction * duration;
    v.currentTime = ((raw % duration) + duration) % duration;
  }

  function endDrag(e: React.PointerEvent<HTMLDivElement>) {
    const drag = dragRef.current;
    if (!drag || e.pointerId !== drag.pointerId) return;
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      // Some browsers throw if capture was already released; safe to ignore.
    }
    dragRef.current = null;
  }

  if (reduced) {
    return (
      <div
        ref={rootRef}
        className={`relative aspect-video overflow-hidden rounded-2xl bg-steel ${className}`}
      >
        <Image
          src={poster}
          alt={alt}
          fill
          className="object-cover"
          sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
        />
      </div>
    );
  }

  return (
    <div
      ref={rootRef}
      className={`relative aspect-video overflow-hidden rounded-2xl bg-steel select-none touch-none ${className} ${
        interactive ? "cursor-grab active:cursor-grabbing" : ""
      }`}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
    >
      <Image
        src={poster}
        alt={alt}
        fill
        className="object-cover pointer-events-none"
        sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
      />
      {mounted && !errored && (
        <video
          ref={videoRef}
          src={src}
          poster={poster}
          muted
          playsInline
          preload="auto"
          aria-label={alt}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 pointer-events-none ${
            ready ? "opacity-100" : "opacity-0"
          }`}
          onLoadedData={() => setReady(true)}
          onError={() => setErrored(true)}
        />
      )}
      <div
        aria-hidden="true"
        className={`absolute bottom-3 right-3 z-10 spec text-[10px] uppercase tracking-[0.18em] text-bone/85 bg-ink/60 backdrop-blur-sm px-2 py-1 rounded transition-opacity duration-300 ${
          hinted || !interactive ? "opacity-0" : "opacity-100"
        }`}
      >
        Drag to spin &rarr;
      </div>
    </div>
  );
}
