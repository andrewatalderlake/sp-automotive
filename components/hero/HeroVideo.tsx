"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import PhoneCTA from "@/components/ui/PhoneCTA";
import SmsCTA from "@/components/ui/SmsCTA";
import SplitText from "@/components/effects/SplitText";
import SectionScrubVideo from "@/components/effects/SectionScrubVideo";
import Surface from "@/components/ui/Surface";

// Atmospheric video is now scoped to the hero region only — rendered via a
// SectionScrubVideo behind the foreground composition. The legacy PageScrubVideo
// was removed because per-chapter clips (ch02-05) clashed with a single
// page-wide ambient layer. Each downstream chapter now owns its own footage.
//
// This component owns the foreground composition: a kinetic two-phrase
// headline with staggered character reveals, a glass lead card that lifts in
// afterward, and a hero-only parallax that drifts the text upward as the
// user starts scrolling.
//
// Entry choreography (mount sequence):
//   200 ms — "Totaled." characters stagger in
//   600 ms — "Paid in Full." characters stagger in
//   950 ms — glass lead card translates up + fades in
//  1100 ms — phone + SMS CTAs fade up
//
// Parallax: text drifts at 0.22x scroll, card at 0.16x. CSS variables on
// the section element propagate to mobile + desktop subtrees so a single
// rAF writer drives both breakpoints without a ref-collision bug.

export default function HeroVideo() {
  const [cardReady, setCardReady] = useState(false);
  const [ctasReady, setCtasReady] = useState(false);
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const a = window.setTimeout(() => setCardReady(true), 950);
    const b = window.setTimeout(() => setCtasReady(true), 1100);
    return () => {
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
      hero.style.setProperty("--hero-y-text", `${-y * 0.22}px`);
      hero.style.setProperty("--hero-y-card", `${-y * 0.16}px`);
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
      data-theme="dark"
      className="relative min-h-[100svh] w-full overflow-hidden"
      aria-label="Exotic collision — totaled, paid in full."
    >
      {/* Hero-scoped atmospheric video. As you scroll through the hero, the
          clip scrubs from frame 0 toward the end and rests there as ch01
          takes over. Replaces the prior page-wide PageScrubVideo. */}
      <SectionScrubVideo
        src="/hero-clips/cinematic.mp4"
        poster="/hero-clips/cinematic-poster.jpg"
      />
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
          className="display-bleed display-bleed--shine"
          mountDelayMs={200}
          staggerMs={28}
          durationMs={420}
        >
          Totaled.
        </SplitText>
        <SplitText
          as="span"
          className="display-bleed display-bleed--shine"
          mountDelayMs={600}
          staggerMs={26}
          durationMs={420}
        >
          Paid in Full.
        </SplitText>
        <p
          className={`lead text-bone/85 max-w-md mt-4 transition-[opacity,transform] duration-[420ms] ease-out ${
            cardReady ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
          }`}
        >
          We deal with the insurance. You walk away whole — sometimes ahead.
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
          className="display-bleed display-bleed--shine absolute top-[14%] left-[3vw] z-[5]"
          mountDelayMs={200}
          staggerMs={32}
          durationMs={460}
        >
          Totaled.
        </SplitText>
        <SplitText
          as="span"
          className="display-bleed display-bleed--shine absolute bottom-[22%] right-[3vw] z-[5] text-right"
          mountDelayMs={600}
          staggerMs={26}
          durationMs={460}
        >
          Paid in Full.
        </SplitText>
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
        {/* Committed-glass lead card. Earlier iteration used a hand-rolled
            bg-white/[0.015] treatment that read as nearly invisible against
            the cinematic backdrop — original audit P2-a. Now uses the
            shared Surface "glass" variant (dark mid-alpha tint + strong
            backdrop blur + border + ring + shadow) so the card establishes
            itself as a deliberate floating element on the hero video. */}
        <Surface
          variant="glass"
          className="rounded-2xl p-8 transition duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_36px_80px_-20px_rgba(0,0,0,0.7)] motion-reduce:transition-none motion-reduce:hover:translate-y-0"
        >
          <p className="lead text-bone/90">
            We deal with the insurance. You walk away whole — sometimes ahead.
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
        </Surface>
      </div>
    </section>
  );
}
