// Typed event helpers. All events flow through GTM's dataLayer (loaded by
// the GoogleTagManager component in `components/analytics/Analytics.tsx`)
// and reach GA4 via a tag inside the GTM container. If GTM hasn't been
// configured (env vars missing), `sendGTMEvent` from @next/third-parties
// no-ops gracefully.

import { sendGTMEvent } from "@next/third-parties/google";

type EventMap = {
  phone_cta_click: { location?: string };
  contact_submit_attempt: Record<string, never>;
  contact_submit_success: Record<string, never>;
  contact_submit_error: { reason?: string };
  brand_page_view: { brand: string };
  process_scroll_depth: { depth: 25 | 50 | 75 | 100; beat?: string };
  before_after_interact: { pair_id?: string };
  sms_cta_click: { location?: string };
  estimate_submit_attempt: Record<string, never>;
  estimate_submit_success: Record<string, never>;
  estimate_submit_error: { reason?: string };
};

export function track<K extends keyof EventMap>(
  event: K,
  params?: EventMap[K],
) {
  if (typeof window === "undefined") return;
  sendGTMEvent({ event, ...(params ?? {}) });
}
