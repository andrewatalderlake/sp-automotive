"use client";
import { MessageSquare } from "lucide-react";
import Button from "./Button";
import { SMS_HREF } from "@/lib/site";
import { track } from "@/lib/analytics";

type Props = { size?: "default" | "lg"; className?: string; location?: string };

// Secondary CTA paired with PhoneCTA. Lower-friction path on mobile (one tap
// opens the SMS composer pre-filled with "Photos of damage:"). On desktop,
// opens the system SMS handler if one is registered, else falls back to a
// browser dialog. Ghost variant so it reads as a quieter sibling next to the
// phone button, never a competitor.

export default function SmsCTA({ size = "default", className = "", location }: Props) {
  const sizing = size === "lg" ? "px-10 py-5 text-base" : "";
  return (
    <Button
      variant="ghost"
      href={SMS_HREF}
      ariaLabel="Text photos of the damage"
      onClick={() => {
        track("sms_cta_click", location ? { location } : undefined);
      }}
      className={`${sizing} ${className}`}
    >
      <MessageSquare className="h-4 w-4" aria-hidden /> Or text photos
    </Button>
  );
}
