"use client";
import { Phone } from "lucide-react";
import Button from "./Button";
import Magnetic from "@/components/effects/Magnetic";
import { PHONE, PHONE_HREF } from "@/lib/site";
import { track } from "@/lib/analytics";

type Props = { size?: "default" | "lg"; className?: string; location?: string };

// Note: we intentionally render a <button> rather than an <a href="tel:…">.
// Chrome shows a native "Click-to-Call" hover card on tel: links that we
// can't suppress from the page. A button + window.location.replace("tel:…")
// keeps tap-to-call working on mobile (the dialer opens the same way) and
// avoids leaking "#" into the URL or a tel: history entry on desktop click.
// Tradeoff: this makes the CTA JS-dependent (no anchor fallback for
// JS-disabled clients / bots), which we accept on a hydrated marketing page.
export default function PhoneCTA({ size = "default", className = "", location }: Props) {
  const sizing = size === "lg" ? "px-10 py-5 text-base" : "";
  return (
    <Magnetic radius={80} strength={0.15}>
      <span className="inline-block">
        <Button
          variant="primary"
          onClick={() => {
            track("phone_cta_click", location ? { location } : undefined);
            window.location.replace(PHONE_HREF);
          }}
          ariaLabel={`Call ${PHONE}`}
          className={`${sizing} ${className}`}
        >
          <Phone className="h-4 w-4" aria-hidden /> {PHONE}
        </Button>
      </span>
    </Magnetic>
  );
}
