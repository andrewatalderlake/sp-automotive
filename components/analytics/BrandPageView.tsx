"use client";
import { useEffect } from "react";
import { track } from "@/lib/analytics";

// Fire a single brand_page_view event on mount. Lets GA4 segment traffic and
// conversions per brand without depending on URL parsing in tags.
export default function BrandPageView({ brand }: { brand: string }) {
  useEffect(() => {
    track("brand_page_view", { brand });
  }, [brand]);
  return null;
}
