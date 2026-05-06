// Translucent scrim wrapper that sits between page content and the page-wide
// scroll-scrub video. Each variant solves a different legibility need:
//
//   solid — dense copy areas (testimonials, gallery, about, final CTA, footer)
//   veil  — light-touch scrim for marquees / strips where the video should still feel present
//   edge  — top-and-bottom gradient that lets a single hero frame breathe in the middle

import type { ReactNode } from "react";

type Variant = "solid" | "veil" | "edge";

const variantClass: Record<Variant, string> = {
  solid: "bg-black/65 backdrop-blur-sm",
  veil: "bg-black/40",
  edge: "bg-gradient-to-b from-black/75 via-black/25 to-black/75",
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
