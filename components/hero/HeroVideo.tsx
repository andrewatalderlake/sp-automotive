"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import PhoneCTA from "@/components/ui/PhoneCTA";
import SmsCTA from "@/components/ui/SmsCTA";

// The atmospheric video lives on PageScrubVideo at the page root; this
// component only paints the foreground composition. The placeholder div
// stands in for /hero-clips/hero-car.png and is grep-able via its
// data-placeholder attribute so the swap is a one-line change.
export default function HeroVideo() {
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setRevealed(true), 250);
    return () => clearTimeout(t);
  }, []);

  return (
    <section
      className="relative min-h-[100svh] w-full overflow-hidden"
      aria-label="Exotic collision — totaled, paid in full."
    >
      <h1 className="sr-only">
        Totaled. Paid in Full. — SP Automotive exotic collision repair in Sarasota, FL.
      </h1>

      {/* Mobile: vertical flow, no edge bleed */}
      <div
        className="md:hidden relative pt-24 pb-12 px-6 flex flex-col items-center gap-8 text-center transition-opacity duration-700"
        style={{ opacity: revealed ? 1 : 0 }}
      >
        <span className="display-bleed">Totaled.</span>
        <span className="display-bleed">Paid in Full.</span>
        <p className="lead text-bone/85 max-w-md mt-4">
          We deal with the insurance. You walk away whole — sometimes ahead.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <PhoneCTA size="lg" location="hero" />
          <SmsCTA location="hero" />
        </div>
        <p className="eyebrow">
          Or{" "}
          <Link
            href="/estimate"
            className="link-underline text-text hover:text-accent transition-colors"
          >
            send 3 photos for a callback
          </Link>
        </p>
      </div>

      {/* Desktop: layered edge-bleed text + bottom-left glass card */}
      <div className="hidden md:block">
        <span
          className="display-bleed absolute top-[14%] left-[3vw] z-[5] transition-opacity duration-700"
          style={{ opacity: revealed ? 1 : 0 }}
        >
          Totaled.
        </span>
        <span
          className="display-bleed absolute bottom-[22%] right-[3vw] z-[5] text-right transition-opacity duration-700"
          style={{ opacity: revealed ? 1 : 0 }}
        >
          Paid in Full.
        </span>

        {/* Liquid-glass lead card — bottom-left, off-axis from "Paid in Full."
            Smaller footprint + visible elevation + hover lift so it reads as
            a floating element rather than a flush panel. */}
        <div
          className="absolute bottom-12 left-10 z-20 max-w-sm text-left transition-opacity duration-700"
          style={{ opacity: revealed ? 1 : 0 }}
        >
          <div
            className="
              rounded-2xl border border-white/[0.06] bg-white/[0.015] p-8
              ring-1 ring-inset ring-white/[0.03]
              shadow-[0_24px_60px_-20px_rgba(0,0,0,0.5)]
              backdrop-blur-sm backdrop-saturate-110
              transition-[transform,background-color,box-shadow] duration-300 ease-out
              hover:-translate-y-1 hover:bg-white/[0.035]
              hover:shadow-[0_36px_80px_-20px_rgba(0,0,0,0.65)]
            "
          >
            <p className="lead text-bone/90">
              We deal with the insurance. You walk away whole — sometimes ahead.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <PhoneCTA size="lg" location="hero" />
              <SmsCTA location="hero" />
            </div>
            <p className="eyebrow mt-5">
              Or{" "}
              <Link
                href="/estimate"
                className="link-underline text-text hover:text-accent transition-colors"
              >
                send 3 photos for a callback
              </Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
