"use client";
import { useEffect, useRef } from "react";
import Magnetic from "@/components/effects/Magnetic";
import {
  PUBLISHED_VIDEO_TESTIMONIALS,
  type VideoTestimonial,
} from "./video-testimonials-data";
import Surface from "@/components/ui/Surface";

// Video testimonials surface. Mirrors the gating pattern of
// TestimonialsSection — empty published list ⇒ section renders nothing,
// so the home page composition stays tight until real assets land.
//
// Each clip auto-plays muted on a loop, but pauses when scrolled out of
// view (IntersectionObserver). Native <video> — no library, no extra JS.

export default function VideoTestimonials() {
  if (PUBLISHED_VIDEO_TESTIMONIALS.length === 0) return null;

  return (
    <section
      id="video-testimonials"
      className="relative px-6 md:px-10 py-32 border-t border-divider"
    >
      <Surface variant="solid" className="max-w-6xl mx-auto rounded-md py-20 px-6 md:px-10">
        <p className="eyebrow">From the owners</p>
        <h2 className="mt-4 display-md">Watch them tell it.</h2>

        <ul className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {PUBLISHED_VIDEO_TESTIMONIALS.map((t) => (
            <li key={t.id}>
              <VideoCard testimonial={t} />
            </li>
          ))}
        </ul>
      </Surface>
    </section>
  );
}

function VideoCard({ testimonial }: { testimonial: VideoTestimonial }) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      // Reduced-motion: leave the poster visible, never auto-play.
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            video.play().catch(() => {
              /* swallow autoplay rejection */
            });
          } else {
            video.pause();
          }
        }
      },
      { threshold: 0.4 },
    );

    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  return (
    <Magnetic display="block" radius={140} strength={0.18}>
      <figure
        data-cursor="Watch"
        className="relative border border-white/10 overflow-hidden bg-steel"
      >
        <video
          ref={videoRef}
          poster={testimonial.posterSrc}
          muted
          loop
          playsInline
          preload="none"
          className={`w-full ${testimonial.aspectClass ?? "aspect-[4/5]"} object-cover`}
          aria-label={`${testimonial.name}, ${testimonial.vehicle} — ${testimonial.repairType}`}
        >
          {testimonial.webmSrc && <source src={testimonial.webmSrc} type="video/webm" />}
          <source src={testimonial.mp4Src} type="video/mp4" />
        </video>
        <figcaption className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/85 to-transparent">
          <p className="font-display text-xl text-bone leading-tight">
            {testimonial.captionText}
          </p>
          <p className="mt-2 text-[10px] uppercase tracking-[0.22em] text-graphite">
            {testimonial.name} <span className="text-bone">·</span>{" "}
            {testimonial.vehicle}
          </p>
        </figcaption>
      </figure>
    </Magnetic>
  );
}
