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
//   glass-dense —
//           Denser sibling of `glass` for chapter 01 (TotalLossPlay),
//           which sits over the scroll-scrubbed hero video. Same shape,
//           tighter values: 75% black tint, larger blur, slightly heavier
//           border + ring + shadow. The other home chapters dropped their
//           glass card in the "no more cards" rework; only chapter 01
//           keeps a card because video is moving behind it.

import type { ReactNode } from "react";

type Variant = "solid" | "veil" | "edge" | "glass" | "glass-dense";

const variantClass: Record<Variant, string> = {
  solid: "bg-black/65 backdrop-blur-sm",
  veil: "bg-black/40",
  edge: "bg-gradient-to-b from-black/75 via-black/25 to-black/75",
  glass:
    "bg-black/55 backdrop-blur-xl backdrop-saturate-[1.10] " +
    "border border-white/[0.10] ring-1 ring-inset ring-white/[0.06] " +
    "shadow-[0_24px_60px_-20px_rgba(0,0,0,0.6)]",
  "glass-dense":
    "bg-black/75 backdrop-blur-2xl backdrop-saturate-[1.15] " +
    "border border-white/[0.12] ring-1 ring-inset ring-white/[0.08] " +
    "shadow-[0_28px_70px_-22px_rgba(0,0,0,0.7)]",
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
