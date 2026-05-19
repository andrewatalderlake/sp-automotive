"use client";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Phone, MessageSquare } from "lucide-react";
import { PHONE, PHONE_HREF, SMS_HREF } from "@/lib/site";
import { track } from "@/lib/analytics";
import { useViewportHeight } from "@/lib/hooks/useViewportHeight";

// Sticky bottom contact bar. Slides up after the user scrolls past one
// viewport (i.e. past the hero) and stays anchored at the bottom for the
// remainder of the page. Hidden on routes where the actions are already
// the focus (`/estimate`, `/contact`).
//
// Visibility anchor: a page can opt into precise control by marking a
// section with `data-sticky-bar-anchor`. When present, the bar is
// visible while that section (or anything below it) overlaps the
// bottom-12% strip — the same geometry the theme observer uses below,
// so the bar enters in whatever theme the anchor declares without a
// mid-flight color swap. The homepage uses this on `InsuranceHandling`
// so the bar doesn't pop in dark over `MeetSerge` and then flip light
// the moment the next section arrives. Routes without an anchor fall
// back to the legacy "scrolled past one viewport" threshold.
//
// Section-aware theme: the bar reads whichever section currently sits
// under it (via IntersectionObserver targeting `[data-theme="dark"]`
// elements within a bottom-of-viewport strip). When a dark section is
// behind the bar, the bar flips to its dark treatment (ink bg, bone-
// outline Text button). When over light/paper sections, the bar uses
// the paper treatment (paper bg, ink-outline Text button). The Call
// button stays ignite-red in both themes — the urgency color reads on
// either surface.
//
// Call uses a <button> + window.location.replace("tel:…") rather than a
// `<a href="tel:">` so Chrome's "Click-to-Call" hover card doesn't
// appear on desktop. Mirrors the convention in `PhoneCTA.tsx`.

const HIDDEN_PATHS = ["/estimate", "/contact"];

const BTN_BASE =
  "inline-flex items-center justify-center gap-2 px-4 py-3 min-h-[44px] rounded-md font-body text-sm uppercase tracking-[0.18em] transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2";

type BarTheme = "dark" | "light";

export default function StickyContactBar() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);
  const [theme, setTheme] = useState<BarTheme>("light");
  // Stable vh accessor — see lib/hooks/useViewportHeight.ts. Reading raw
  // window.innerHeight inside the visibility check would drift the
  // threshold each time iOS Safari's address bar collapses or expands,
  // flickering the bar on/off in the narrow [oldThreshold, newThreshold]
  // band. The hook only updates on actual resize / orientationchange.
  const getVh = useViewportHeight();

  const hidden = Boolean(
    pathname && HIDDEN_PATHS.some((p) => pathname.startsWith(p)),
  );

  // Visibility — anchor-driven if the page declares one, otherwise
  // legacy "scrolled past ~1 viewport". The anchor path uses the same
  // bottom-strip geometry as the theme observer below so the bar
  // enters already in the right theme.
  useEffect(() => {
    if (hidden) return;
    const anchor = document.querySelector<HTMLElement>(
      "[data-sticky-bar-anchor]",
    );
    if (anchor) {
      const io = new IntersectionObserver(
        (entries) => {
          for (const e of entries) {
            // top < 0 keeps the bar visible after the anchor has
            // scrolled fully above the viewport.
            setVisible(e.isIntersecting || e.boundingClientRect.top < 0);
          }
        },
        { rootMargin: "-88% 0px 0px 0px", threshold: 0 },
      );
      io.observe(anchor);
      return () => io.disconnect();
    }
    let raf = 0;
    const check = () => {
      raf = 0;
      setVisible(window.scrollY > getVh() * 0.9);
    };
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(check);
    };
    check();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", check);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", check);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [hidden, getVh, pathname]);

  // Theme — watch dark sections and flip when any of them overlap the
  // bottom strip of the viewport (where the sticky bar sits). The strip
  // is roughly the bottom 12% of the viewport via rootMargin shrinking
  // the top edge. Dark sections are marked with `data-theme="dark"` on
  // their root <section> (hero + §05 HowItWorks today).
  useEffect(() => {
    if (hidden) return;
    const darkSections =
      document.querySelectorAll<HTMLElement>('[data-theme="dark"]');
    // No dark sections to observe → state stays at the default "light".
    if (darkSections.length === 0) return;
    const intersecting = new Set<Element>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) intersecting.add(e.target);
          else intersecting.delete(e.target);
        }
        setTheme(intersecting.size > 0 ? "dark" : "light");
      },
      // -88% on the top = effective root is the bottom 12vh strip.
      // Adjust if the bar height changes substantially.
      { rootMargin: "-88% 0px 0px 0px", threshold: 0 },
    );
    darkSections.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [hidden]);

  if (hidden) return null;

  const isDark = theme === "dark";
  const container = isDark
    ? "border-bone/10 bg-ink/90"
    : "border-ink/10 bg-paper/95";
  const tagline = isDark ? "text-bone/85" : "text-ink/85";
  const textBtn = isDark
    ? "border border-bone text-bone hover:bg-bone hover:text-ink focus-visible:ring-bone focus-visible:ring-offset-ink"
    : "border border-ink text-ink hover:bg-ink hover:text-paper focus-visible:ring-ink focus-visible:ring-offset-paper";
  const callBtn = isDark
    ? "bg-ignite text-white hover:bg-ignite/90 focus-visible:ring-bone focus-visible:ring-offset-ink"
    : "bg-ignite text-white hover:bg-ignite/90 focus-visible:ring-ink focus-visible:ring-offset-paper";

  return (
    <div
      aria-hidden={!visible}
      // `inert` removes descendants from the tab order AND from pointer
      // interaction while the bar is off-screen. Without it, the Call
      // <button> stays Tab-focusable below the fold — pressing Enter on
      // an invisible button fires window.location.replace(PHONE_HREF)
      // and triggers an unintended call.
      {...(!visible ? { inert: true } : {})}
      className={`fixed bottom-0 left-0 right-0 z-40 border-t backdrop-blur-md transition-transform duration-300 ease-out motion-reduce:transition-none ${container} ${
        visible ? "translate-y-0" : "pointer-events-none translate-y-full"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3 md:gap-6 md:px-10 md:py-4">
        <p
          className={`hidden flex-1 font-display uppercase tracking-[0.10em] text-sm md:block md:text-base ${tagline}`}
        >
          Totaled? Talk to Serge.
        </p>
        <div className="flex flex-1 items-center gap-3 md:flex-initial">
          <button
            type="button"
            aria-label={`Call ${PHONE}`}
            onClick={() => {
              track("phone_cta_click", { location: "sticky-bar" });
              window.location.replace(PHONE_HREF);
            }}
            className={`${BTN_BASE} ${callBtn} flex-1 md:flex-initial md:px-8`}
          >
            <Phone className="h-4 w-4" aria-hidden /> Call
          </button>
          <a
            href={SMS_HREF}
            aria-label="Text photos of the damage"
            onClick={() => track("sms_cta_click", { location: "sticky-bar" })}
            className={`${BTN_BASE} ${textBtn} flex-1 md:flex-initial md:px-8`}
          >
            <MessageSquare className="h-4 w-4" aria-hidden /> Text
          </a>
        </div>
      </div>
    </div>
  );
}
