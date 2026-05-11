"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import PhoneCTA from "@/components/ui/PhoneCTA";
import SmsCTA from "@/components/ui/SmsCTA";
import SplitText from "@/components/effects/SplitText";

// Atmospheric video is provided by SectionScrubVideo behind the hero +
// chapter 01 region on the home page. This component owns the foreground
// composition only: a "Totaled." kinetic reveal followed by "Paid in
// Full." fading in as a block, a glass lead card that lifts in afterward,
// and a hero-only parallax that drifts the text upward as the user starts
// scrolling.
//
// Entry choreography (mount sequence):
//   200 ms — "Totaled." characters stagger in
//   600 ms — "Paid in Full." fades in as a single block
//   950 ms — glass lead card translates up + fades in
//  1100 ms — phone + SMS CTAs fade up
//
// Parallax: text drifts at 0.10x scroll, card at 0.08x. CSS variables on
// the section element propagate to mobile + desktop subtrees so a single
// rAF writer drives both breakpoints without a ref-collision bug.
// Coefficients were toned down from the original 0.22 / 0.16 — page now
// reads as a normal site with a hint of drift rather than a kinetic edit.

export default function HeroVideo() {
  const [secondPhraseReady, setSecondPhraseReady] = useState(false);
  const [cardReady, setCardReady] = useState(false);
  const [ctasReady, setCtasReady] = useState(false);
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const p = window.setTimeout(() => setSecondPhraseReady(true), 600);
    const a = window.setTimeout(() => setCardReady(true), 950);
    const b = window.setTimeout(() => setCtasReady(true), 1100);
    return () => {
      window.clearTimeout(p);
      window.clearTimeout(a);
      window.clearTimeout(b);
    };
  }, []);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    let rafId = 0;
    const apply = () => {
      rafId = 0;
      const hero = heroRef.current;
      if (!hero) return;
      const heroH = hero.offsetHeight || window.innerHeight;
      const y = Math.min(window.scrollY, heroH);
      hero.style.setProperty("--hero-y-text", `${-y * 0.10}px`);
      hero.style.setProperty("--hero-y-card", `${-y * 0.08}px`);
    };
    const onScroll = () => {
      if (rafId) return;
      rafId = window.requestAnimationFrame(apply);
    };
    apply();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafId) window.cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <section
      ref={heroRef}
      className="relative min-h-[100svh] w-full overflow-hidden"
      aria-label="Exotic collision — totaled, paid in full."
    >
      <h1 className="sr-only">
        Totaled. Paid in Full. — SP Automotive exotic collision repair in Sarasota, FL.
      </h1>

      {/* Mobile: vertical flow, no edge bleed */}
      <div
        className="md:hidden relative pt-24 pb-12 px-6 flex flex-col items-center gap-8 text-center"
        style={{ transform: "translate3d(0, var(--hero-y-text, 0px), 0)" }}
      >
        <SplitText
          as="span"
          className="display-bleed"
          mountDelayMs={200}
          staggerMs={28}
          durationMs={420}
        >
          Totaled.
        </SplitText>
        <span
          className={`display-bleed transition-opacity duration-[420ms] ease-out ${
            secondPhraseReady ? "opacity-100" : "opacity-0"
          }`}
        >
          Paid in Full.
        </span>
        <p
          className={`lead text-bone/85 max-w-md mt-4 transition-[opacity,transform] duration-[420ms] ease-out ${
            cardReady ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
          }`}
        >
          We deal with the insurance. You walk away whole — sometimes tens of
          thousands ahead.
        </p>
        <div
          className={`flex flex-wrap gap-4 justify-center transition-opacity duration-300 ease-out ${
            ctasReady ? "opacity-100" : "opacity-0"
          }`}
        >
          <PhoneCTA size="lg" location="hero" />
          <SmsCTA location="hero" />
        </div>
        <p
          className={`eyebrow transition-opacity duration-300 ease-out ${
            ctasReady ? "opacity-100" : "opacity-0"
          }`}
          style={{ transitionDelay: ctasReady ? "60ms" : "0ms" }}
        >
          Or{" "}
          <Link
            href="/estimate"
            className="link-underline text-bone hover:text-ignite transition-colors"
          >
            send 3 photos for a callback
          </Link>
        </p>
      </div>

      {/* Desktop: layered edge-bleed text */}
      <div
        className="hidden md:block absolute inset-0 pointer-events-none"
        style={{ transform: "translate3d(0, var(--hero-y-text, 0px), 0)" }}
      >
        <SplitText
          as="span"
          className="display-bleed absolute top-[14%] left-[3vw] z-[5]"
          mountDelayMs={200}
          staggerMs={32}
          durationMs={460}
        >
          Totaled.
        </SplitText>
        <span
          className={`display-bleed absolute bottom-[22%] right-[3vw] z-[5] text-right transition-opacity duration-[420ms] ease-out ${
            secondPhraseReady ? "opacity-100" : "opacity-0"
          }`}
        >
          Paid in Full.
        </span>
      </div>

      {/* Desktop: liquid-glass lead card — bottom-left, off-axis from "Paid in Full." */}
      <div
        className={`hidden md:block absolute bottom-12 left-10 z-20 max-w-sm text-left transition-[opacity,transform] duration-[420ms] ease-out ${
          cardReady ? "opacity-100" : "opacity-0"
        }`}
        style={{
          transform: cardReady
            ? "translate3d(0, var(--hero-y-card, 0px), 0)"
            : "translate3d(0, calc(20px + var(--hero-y-card, 0px)), 0)",
        }}
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
            We deal with the insurance. You walk away whole — sometimes tens
            of thousands ahead.
          </p>
          <div
            className={`mt-6 flex flex-wrap gap-3 transition-opacity duration-300 ease-out ${
              ctasReady ? "opacity-100" : "opacity-0"
            }`}
          >
            <PhoneCTA size="lg" location="hero" />
            <SmsCTA location="hero" />
          </div>
          <p
            className={`eyebrow mt-5 transition-opacity duration-300 ease-out ${
              ctasReady ? "opacity-100" : "opacity-0"
            }`}
            style={{ transitionDelay: ctasReady ? "60ms" : "0ms" }}
          >
            Or{" "}
            <Link
              href="/estimate"
              className="link-underline text-bone hover:text-ignite transition-colors"
            >
              send 3 photos for a callback
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
