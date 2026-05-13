"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

type TColorProp = string | string[];

interface ShineBorderProps {
  /** Outer corner radius in px. Match the parent's rounded-* class. */
  borderRadius?: number;
  /** Stroke width in px. Used by both the base ring (box-shadow) and the
   *  shine ring (::before padding). */
  borderWidth?: number;
  /** One full rotation duration, in seconds. */
  duration?: number;
  /** Hex string for a solid base ring, or `[base, highlight]` for a
   *  colored base plus a separate highlight color in the rotating sweep.
   *  e.g. `["#000000", "#FFFFFF"]` gives a black ring with a white shine. */
  color?: TColorProp;
  /** Set false to render the base ring without the rotating shine. */
  animated?: boolean;
  className?: string;
  children: React.ReactNode;
}

/**
 * Two-layer border: a solid colored base ring + a rotating bright arc on
 * top. The arc lives in a ::before pseudo on a separate layer; its
 * conic-gradient starts at `var(--shine-angle, 0deg)`, and that angle is
 * animated 0→360deg via `@keyframes shine-rotate` (with `@property
 * --shine-angle` so CSS can interpolate it). mask-composite: exclude
 * carves out the interior so only the border ring of the rotating
 * gradient stays visible.
 *
 * Border-radius and padding are applied via inline `style` rather than
 * Tailwind's `rounded-[--var]` / `p-[--var]` arbitrary-value syntax —
 * Tailwind passes the literal `--var` through without wrapping in
 * `var()`, so those classes silently emit invalid CSS and the values get
 * dropped. Empirical bug: the wrapper renders as a square (corners
 * clipped) and the mask XORs to empty (shine invisible). Inline styles
 * bypass the parser entirely.
 */
export function ShineBorder({
  borderRadius = 8,
  borderWidth = 1,
  duration = 6,
  color = "#000000",
  animated = true,
  className,
  children,
}: ShineBorderProps) {
  const colors = Array.isArray(color) ? color : [color];
  const primary = colors[0] ?? "#000000";
  // Second color drives the rotating highlight. Fallback is a soft white
  // so single-color callers still see a shine on dark imagery.
  const highlight = colors[1] ?? "rgba(255, 255, 255, 0.9)";

  return (
    <div
      style={{ borderRadius: `${borderRadius}px` }}
      className={cn("relative overflow-hidden", className)}
    >
      {/* Always-on solid base ring in the primary color. Inset box-shadow
          follows the element's own border-radius, so the ring tracks the
          wrapper's rounded corners cleanly. */}
      <div
        aria-hidden
        style={{
          borderRadius: `${borderRadius}px`,
          boxShadow: `inset 0 0 0 ${borderWidth}px ${primary}`,
        }}
        className="pointer-events-none absolute inset-0 z-10"
      />
      {/* Rotating shine highlight. The ::before fills the layer and uses a
          conic gradient whose start angle is animated via --shine-angle;
          mask-composite: exclude on a (content-box, border-box) pair of
          mask layers isolates only the border-ring portion of the
          gradient. The animation lives on this layer; @property
          --shine-angle has inherits:true so the ::before sees the
          interpolated value. */}
      <div
        aria-hidden
        style={
          {
            borderRadius: `${borderRadius}px`,
            "--duration": `${duration}s`,
            "--border-width": `${borderWidth}px`,
            "--mask-linear-gradient":
              "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
            "--shine-bg": `conic-gradient(from var(--shine-angle, 0deg), transparent 0%, transparent 22%, ${highlight} 50%, transparent 78%, transparent 100%)`,
          } as React.CSSProperties
        }
        className={cn(
          "pointer-events-none absolute inset-0 z-20",
          // ::before fills the layer, inherits the layer's radius, and
          // pads in by the configured border-width to create the band the
          // mask will isolate.
          "before:absolute before:inset-0 before:size-full",
          'before:content-[""]',
          "before:[border-radius:inherit]",
          "before:[padding:var(--border-width)]",
          // Mask: two opaque mask layers, one clipped to content-box, one
          // to border-box; XORed via mask-composite: exclude → only the
          // padding ring (border band) is visible.
          "before:![-webkit-mask-composite:xor] before:![mask-composite:exclude]",
          "before:[background-image:var(--shine-bg)]",
          "before:[mask:var(--mask-linear-gradient)]",
          animated && "motion-safe:animate-shine-rotate",
        )}
      />
      {children}
    </div>
  );
}
