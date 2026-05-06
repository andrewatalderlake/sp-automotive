"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { Beat, Overlay } from "@/lib/process-narrative";
import PhoneCTA from "@/components/ui/PhoneCTA";
import { track } from "@/lib/analytics";

const SCROLL_DEPTH_THRESHOLDS = [25, 50, 75, 100] as const;

gsap.registerPlugin(ScrollTrigger);

// Each beat pins for this many vh of scroll; user "earns" the reveal.
const PIN_DISTANCE_VH = 60;

// Smooth 0..1 reveal that opens after `revealAt` and completes within ~0.25
function revealOpacity(progress: number, revealAt: number): number {
  return Math.max(0, Math.min(1, (progress - revealAt) * 4));
}

export default function ProcessBeat({ beat }: { beat: Beat }) {
  const containerRef = useRef<HTMLElement>(null);

  const hasPin = beat.overlays.length > 0;

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !hasPin) return;

    // Snapshot every overlay element once, then drive style updates from
    // GSAP's scroll loop directly — no React re-renders per scroll tick.
    const overlays = Array.from(
      container.querySelectorAll<HTMLElement>("[data-reveal]"),
    ).map((el) => ({
      el,
      revealAt: parseFloat(el.dataset.reveal || "0"),
      kind: el.dataset.kind || "",
    }));
    const scrollEl = container.querySelector<HTMLElement>("[data-scroll-indicator]");
    const emitted = new Set<number>();

    function apply(p: number) {
      for (const o of overlays) {
        const op = revealOpacity(p, o.revealAt);
        o.el.style.opacity = String(op);
        if (o.kind === "panel") {
          o.el.style.transform = `translate(-50%, calc(-50% + ${(1 - op) * 16}px))`;
        } else if (o.kind === "layer") {
          o.el.style.transform = `translateY(${(1 - op) * 12}px)`;
        }
      }
      if (scrollEl) scrollEl.style.opacity = String(Math.max(0, 1 - p));
      const pct = p * 100;
      for (const depth of SCROLL_DEPTH_THRESHOLDS) {
        if (pct >= depth && !emitted.has(depth)) {
          emitted.add(depth);
          track("process_scroll_depth", { depth, beat: beat.id });
        }
      }
    }

    const obj = { p: 0 };
    const tween = gsap.to(obj, {
      p: 1,
      ease: "none",
      scrollTrigger: {
        trigger: container,
        start: "top top",
        end: () => `+=${window.innerHeight * (PIN_DISTANCE_VH / 100)}`,
        scrub: true,
        pin: true,
        anticipatePin: 1,
      },
      onUpdate: () => apply(obj.p),
    });

    apply(0);

    return () => {
      tween.scrollTrigger?.kill(true);
      tween.kill();
    };
  }, [hasPin, beat.id]);

  return (
    <section ref={containerRef} className="relative h-screen w-full overflow-hidden bg-bg">
      <div className="relative z-10 h-full grid grid-cols-1 md:grid-cols-12 gap-6 px-6 md:px-10 py-16">
        <div className="md:col-span-4 flex flex-col justify-center">
          <p className="eyebrow">{beat.eyebrow}</p>
          <h3 className="mt-4 display-lg">{beat.title}</h3>
          <p className="mt-6 lead max-w-md">{beat.copy}</p>
          {beat.showCta && (
            <div className="mt-8">
              <PhoneCTA size="lg" location={`process-${beat.id}`} />
            </div>
          )}
        </div>

        <div className="md:col-span-8 relative hidden md:block">
          <OverlayLayer beat={beat} />
        </div>
      </div>

      {hasPin && (
        <div
          data-scroll-indicator
          className="absolute bottom-6 left-1/2 -translate-x-1/2 text-muted text-[10px] uppercase tracking-[0.3em]"
          style={{ opacity: 1 }}
        >
          scroll
        </div>
      )}
    </section>
  );
}

function OverlayLayer({ beat }: { beat: Beat }) {
  // Paint layers stack vertically; everything else is positioned absolutely on the beat image.
  if (beat.id === "paint") {
    return (
      <div className="absolute inset-0 flex flex-col justify-center items-end pr-6 gap-4">
        {beat.overlays.map((ov, i) => {
          if (ov.kind !== "layer") return null;
          return (
            <div
              key={i}
              data-reveal={ov.revealAt}
              data-kind="layer"
              className="flex items-baseline gap-4 will-change-transform"
              style={{ opacity: 0, transform: "translateY(12px)" }}
            >
              <span className="font-display text-3xl md:text-4xl text-accent tracking-wide">{ov.label}</span>
              <span className="spec text-sm uppercase tracking-[0.18em] text-muted">{ov.thickness}</span>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className="absolute inset-0">
      {beat.overlays.map((ov, i) => (
        <OverlayItem key={i} overlay={ov} />
      ))}
    </div>
  );
}

function OverlayItem({ overlay }: { overlay: Overlay }) {
  if (overlay.kind === "callout") {
    return (
      <div
        data-reveal={overlay.revealAt}
        data-kind="callout"
        className="absolute pointer-events-none"
        style={{
          left: `${overlay.x}%`,
          top: `${overlay.y}%`,
          transform: "translate(-50%, -50%)",
          opacity: 0,
        }}
      >
        <Marker />
        <div className="ml-8 -mt-3">
          <div className="spec text-2xl md:text-3xl text-accent leading-none">
            {overlay.text}
          </div>
          {overlay.sub && (
            <div className="mt-1 text-[11px] uppercase tracking-[0.22em] text-muted whitespace-nowrap">
              {overlay.sub}
            </div>
          )}
        </div>
      </div>
    );
  }

  if (overlay.kind === "panel") {
    return (
      <div
        data-reveal={overlay.revealAt}
        data-kind="panel"
        className="absolute will-change-transform pointer-events-none"
        style={{
          left: `${overlay.x}%`,
          top: `${overlay.y}%`,
          transform: "translate(-50%, calc(-50% + 16px))",
          opacity: 0,
        }}
      >
        <Marker />
        <div className="ml-8 -mt-3 text-base md:text-lg uppercase tracking-[0.22em] text-accent whitespace-nowrap">
          {overlay.label}
        </div>
      </div>
    );
  }

  if (overlay.kind === "torque") {
    return (
      <div
        data-reveal={overlay.revealAt}
        data-kind="torque"
        className="absolute pointer-events-none"
        style={{
          left: `${overlay.x}%`,
          top: `${overlay.y}%`,
          transform: "translate(-50%, -50%)",
          opacity: 0,
        }}
      >
        <Marker />
        <div className="ml-8 -mt-3">
          <div className="spec text-xl md:text-2xl text-accent leading-none">
            {overlay.spec}
          </div>
          <div className="mt-1 text-[10px] uppercase tracking-[0.22em] text-muted">torque-spec</div>
        </div>
      </div>
    );
  }

  if (overlay.kind === "gap") {
    return (
      <div
        data-reveal={overlay.revealAt}
        data-kind="gap"
        className="absolute pointer-events-none"
        style={{
          left: `${overlay.x}%`,
          top: `${overlay.y}%`,
          transform: "translate(-50%, -50%)",
          opacity: 0,
        }}
      >
        <div className="flex items-center gap-2">
          <div className="h-px w-12 bg-accent" />
          <div className="spec text-base md:text-lg text-accent whitespace-nowrap">
            {overlay.measurement}
          </div>
          <div className="h-px w-12 bg-accent" />
        </div>
        <div className="mt-1 text-[10px] uppercase tracking-[0.22em] text-muted text-center">gap</div>
      </div>
    );
  }

  return null;
}

function Marker() {
  return (
    <span className="block w-3 h-3 rounded-full bg-accent ring-4 ring-accent/15" />
  );
}
