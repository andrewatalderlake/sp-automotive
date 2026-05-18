import { useMediaQuery } from "./useMediaQuery";

// Mobile breakpoint shared across components that need a layout/perf branch
// (e.g. ProgressiveBlur layer count, optional canvas gating). Matches the
// Tailwind `md:` boundary at 768px. SSR default is `true` so the server
// ships the lighter mobile shell; large screens upgrade after hydration.
export function useIsMobile(): boolean {
  return useMediaQuery("(max-width: 767px)", true);
}
