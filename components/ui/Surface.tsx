// Translucent scrim wrapper that sits between page content and the page-wide
// scroll-scrub video. Each variant solves a different legibility need:
//
//   solid — dense copy areas (testimonials, gallery, about, final CTA, footer)
//   veil  — light-touch scrim for marquees / strips where the video should still feel present
//   edge  — top-and-bottom gradient that lets a single hero frame breathe in the middle
//   glass — Apple-style liquid-glass card: low-alpha white tint, backdrop
//           blur, soft border + inner ring, drop shadow. For chapter body
//           tabs and any card that should read as floating glass over the
//           cinematic backdrop. Pair with rounded-2xl + padding on caller.

import type { ReactNode } from "react";

type Variant = "solid" | "veil" | "edge" | "glass";

const variantClass: Record<Variant, string> = {
  solid: "bg-black/65 backdrop-blur-sm",
  veil: "bg-black/40",
  edge: "bg-gradient-to-b from-black/75 via-black/25 to-black/75",
  glass:
    "bg-black/30 backdrop-blur-md backdrop-saturate-110 " +
    "border border-white/[0.08] ring-1 ring-inset ring-white/[0.06] " +
    "shadow-[0_24px_60px_-20px_rgba(0,0,0,0.55)]",
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
