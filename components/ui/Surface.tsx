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

// `solid` uses a top-and-bottom alpha mask so its rectangular bg + backdrop
// blur both feather to transparent at the card's vertical edges. Without the
// mask, the hard top edge of bg-black/65 over the page-wide scrub video
// reads as a horizontal seam where the section above ends.
const variantClass: Record<Variant, string> = {
  solid:
    "bg-black/65 backdrop-blur-sm [mask-image:linear-gradient(to_bottom,transparent_0%,black_12%,black_88%,transparent_100%)]",
  veil: "bg-black/40",
  edge: "bg-gradient-to-b from-black/75 via-black/25 to-black/75",
  glass:
    "bg-white/[0.04] backdrop-blur-md border border-white/[0.08] " +
    "ring-1 ring-inset ring-white/[0.04] " +
    "shadow-[0_24px_60px_-20px_rgba(0,0,0,0.45)]",
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
