"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

// Draggable before/after comparison slider. Two stacked next/image fills
// in a 16:9 frame (matches the Higgsfield gen ratio); the top image is
// clipped via `clip-path: inset(0 N% 0 0)` driven by a 0..100 state.
// The handle is keyboard-accessible (Left / Right move ±5%; Home / End
// snap to 0 / 100).
//
// Below `md` (768px) or under prefers-reduced-motion, we fall back to a
// stacked layout — two images one above the other with text labels — so
// the drag gesture never conflicts with mobile page scroll.

type Props = {
  stockImage: string;
  kitImage: string;
  /** Visible labels overlaid on each side. */
  stockLabel?: string;
  kitLabel?: string;
  /** Alt text for the underlying images. Provide one alt for both. */
  alt: string;
  className?: string;
};

const STEP = 5;

export function BeforeAfterSlider({
  stockImage,
  kitImage,
  stockLabel = "Stock",
  kitLabel = "With kit",
  alt,
  className,
}: Props) {
  const reduced = useReducedMotion();
  const frameRef = useRef<HTMLDivElement>(null);
  const [pct, setPct] = useState(50);
  const draggingRef = useRef(false);

  // Track viewport width via media query (no SSR mismatch — start with the
  // mobile-safe fallback, swap once we know the real width on mount).
  const [isWide, setIsWide] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const update = () => setIsWide(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const useSlider = isWide && !reduced;

  function setFromClientX(clientX: number) {
    const frame = frameRef.current;
    if (!frame) return;
    const rect = frame.getBoundingClientRect();
    const next = ((clientX - rect.left) / rect.width) * 100;
    setPct(Math.max(0, Math.min(100, next)));
  }

  function onPointerDown(e: React.PointerEvent<HTMLDivElement>) {
    draggingRef.current = true;
    (e.currentTarget as HTMLDivElement).setPointerCapture(e.pointerId);
    setFromClientX(e.clientX);
  }

  function onPointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (!draggingRef.current) return;
    setFromClientX(e.clientX);
  }

  function onPointerUp(e: React.PointerEvent<HTMLDivElement>) {
    draggingRef.current = false;
    (e.currentTarget as HTMLDivElement).releasePointerCapture(e.pointerId);
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      setPct((p) => Math.max(0, p - STEP));
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      setPct((p) => Math.min(100, p + STEP));
    } else if (e.key === "Home") {
      e.preventDefault();
      setPct(0);
    } else if (e.key === "End") {
      e.preventDefault();
      setPct(100);
    }
  }

  if (!useSlider) {
    return (
      <div className={cn("flex flex-col gap-4", className)}>
        <FrameImage src={stockImage} alt={`${alt} — ${stockLabel}`} label={stockLabel} />
        <FrameImage src={kitImage} alt={`${alt} — ${kitLabel}`} label={kitLabel} />
      </div>
    );
  }

  return (
    <div
      ref={frameRef}
      className={cn(
        "relative aspect-[16/9] w-full overflow-hidden rounded-xl bg-ink-deep select-none",
        "ring-1 ring-bone/10 shadow-2xl",
        className,
      )}
      role="slider"
      aria-label={`${alt} — before/after comparison. Use arrow keys to compare.`}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(pct)}
      tabIndex={0}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onKeyDown={onKeyDown}
    >
      {/* Base layer: kit image (revealed as the slider moves right). */}
      <Image
        src={kitImage}
        alt={`${alt} — ${kitLabel}`}
        fill
        sizes="(max-width: 1280px) 100vw, 1280px"
        className="object-cover"
        priority
        draggable={false}
      />

      {/* Top layer: stock image, clipped from the right. */}
      <div
        className="absolute inset-0"
        style={{ clipPath: `inset(0 ${100 - pct}% 0 0)` }}
      >
        <Image
          src={stockImage}
          alt={`${alt} — ${stockLabel}`}
          fill
          sizes="(max-width: 1280px) 100vw, 1280px"
          className="object-cover"
          priority
          draggable={false}
        />
      </div>

      {/* Labels. */}
      <span className="absolute left-4 top-4 rounded-full bg-ink/70 px-3 py-1 text-xs uppercase tracking-[0.18em] text-bone backdrop-blur">
        {stockLabel}
      </span>
      <span className="absolute right-4 top-4 rounded-full bg-ignite/80 px-3 py-1 text-xs uppercase tracking-[0.18em] text-bone backdrop-blur">
        {kitLabel}
      </span>

      {/* Divider + handle. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 w-px bg-bone/80"
        style={{ left: `${pct}%` }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute top-1/2 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-bone text-ink shadow-lg ring-2 ring-ink/40"
        style={{ left: `${pct}%` }}
      >
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M9 6l-4 6 4 6" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M15 6l4 6-4 6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </div>
  );
}

function FrameImage({ src, alt, label }: { src: string; alt: string; label: string }) {
  return (
    <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl bg-ink-deep ring-1 ring-bone/10 shadow-xl">
      <Image
        src={src}
        alt={alt}
        fill
        sizes="100vw"
        className="object-cover"
        draggable={false}
      />
      <span className="absolute left-4 top-4 rounded-full bg-ink/70 px-3 py-1 text-xs uppercase tracking-[0.18em] text-bone backdrop-blur">
        {label}
      </span>
    </div>
  );
}

export default BeforeAfterSlider;
