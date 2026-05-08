// Translucent scrim wrapper that sits between page content and the page-wide
// scroll-scrub video. Each variant solves a different legibility need:
//
//   solid — dense copy areas (testimonials, gallery, about, final CTA, footer)
//   veil  — light-touch scrim for marquees / strips where the video should still feel present
//   edge  — top-and-bottom gradient that lets a single hero frame breathe in the middle
//   glass — liquid-glass card: dark mid-alpha tint with strong backdrop
//           blur + saturate, soft border + inner ring, drop shadow. The
//           dark tint (bg-black/55) holds contrast on light cinematic
//           frames; the strong blur dampens busy backgrounds (e.g. the
//           chapter 02 carbon-fiber weave). For chapter body tabs and any
//           card that should read as floating glass over the cinematic
//           backdrop. Pair with rounded-2xl + padding on caller.

import type { ReactNode } from "react";

type Variant = "solid" | "veil" | "edge" | "glass";

const variantClass: Record<Variant, string> = {
  solid: "bg-black/65 backdrop-blur-sm",
  veil: "bg-black/40",
  edge: "bg-gradient-to-b from-black/75 via-black/25 to-black/75",
  glass:
    "bg-black/55 backdrop-blur-xl backdrop-saturate-[1.10] " +
    "border border-white/[0.10] ring-1 ring-inset ring-white/[0.06] " +
    "shadow-[0_24px_60px_-20px_rgba(0,0,0,0.6)]",
};

export default function Surface({
  variant = "solid",
  className = "",
  children,
}: {
  variant?: Variant;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={`${variantClass[variant]} ${className}`.trim()}>
      {children}
    </div>
  );
}
