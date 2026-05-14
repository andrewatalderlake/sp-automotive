import Image from "next/image";
import Link from "next/link";
import AmbientVideo from "@/components/effects/AmbientVideo";
import PhoneCTA from "@/components/ui/PhoneCTA";
import SmsCTA from "@/components/ui/SmsCTA";
import Surface from "@/components/ui/Surface";
import { CITY, REGION, HOURS_LABEL, BY_APPOINTMENT } from "@/lib/site";

export default function Footer() {
  // Surface glass scrim sits on top of the autoplay ambient video,
  // keeping footer copy legible while the loop plays behind.
  return (
    <footer className="relative overflow-hidden px-6 md:px-10 py-16">
      {/* Ambient autoplay loop behind the footer card. AmbientVideo
          swaps to a static poster for prefers-reduced-motion users. */}
      <AmbientVideo
        src="/footer-ambient.mp4"
        poster="/footer-ambient-poster.jpg"
      />
      {/* Dark scrim over the ambient red footage. Without it, the entire
          footer reads as a saturated red flood — which competes with the
          ignite token's "brake-light reserved" rule (primary CTAs, focus
          rings, selection). At bg-ink/75 the footage reads as warm
          atmosphere rather than a saturated wash, restoring ignite's
          single-allocation discipline site-wide. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-ink/75"
      />
      <Surface variant="glass" className="relative z-10 max-w-7xl mx-auto rounded-2xl py-12 px-6 md:px-10 grid grid-cols-1 md:grid-cols-3 gap-12">
        <div>
          <Image
            src="/logos/sp-mark.png"
            alt="SP Automotive Collision &amp; Repair"
            width={654}
            height={241}
            className="h-16 w-auto invert"
          />
          <p className="mt-3 text-graphite text-sm">{CITY}, {REGION}</p>
          <p className="mt-1 text-graphite text-xs">Exotic collision &amp; restoration</p>
        </div>

        <div className="flex flex-col items-start md:items-center gap-3">
          <div className="flex flex-wrap items-center gap-3">
            <PhoneCTA location="footer" />
            <SmsCTA location="footer" />
          </div>
          <p className="text-graphite text-xs uppercase tracking-[0.22em]">
            {BY_APPOINTMENT ? "By appointment only" : "Walk-ins welcome"} <span className="text-bone">·</span> {HOURS_LABEL}
          </p>
        </div>

        {/* Mobile-only min-h-[44px] on each link to meet the 44pt touch-target
            rule — desktop reverts to natural inline-like line-height via
            `md:block md:min-h-0` on the link className. Audit P1-b (2026-05-14). */}
        <nav aria-label="Footer" className="flex flex-col gap-3 md:gap-2 text-sm text-graphite md:items-end">
          <Link href="/about" className="link-underline flex md:block items-center min-h-[44px] md:min-h-0 hover:text-bone transition-colors">About Serge</Link>
          <Link href="/faq" className="link-underline flex md:block items-center min-h-[44px] md:min-h-0 hover:text-bone transition-colors">FAQ</Link>
          <Link href="/estimate" className="link-underline flex md:block items-center min-h-[44px] md:min-h-0 hover:text-bone transition-colors">Send 3 photos</Link>
          <Link href="/contact" className="link-underline flex md:block items-center min-h-[44px] md:min-h-0 hover:text-bone transition-colors">Contact</Link>
          <Link href="/lamborghini-collision-repair-sarasota" className="link-underline flex md:block items-center min-h-[44px] md:min-h-0 hover:text-bone transition-colors">Lamborghini</Link>
          <Link href="/mclaren-collision-repair-sarasota" className="link-underline flex md:block items-center min-h-[44px] md:min-h-0 hover:text-bone transition-colors">McLaren</Link>
          <Link href="/audi-r8-collision-repair-sarasota" className="link-underline flex md:block items-center min-h-[44px] md:min-h-0 hover:text-bone transition-colors">Audi R8</Link>
          <Link href="/bmw-m-collision-repair-sarasota" className="link-underline flex md:block items-center min-h-[44px] md:min-h-0 hover:text-bone transition-colors">BMW M</Link>
          <Link href="/ferrari-collision-repair-sarasota" className="link-underline flex md:block items-center min-h-[44px] md:min-h-0 hover:text-bone transition-colors">Ferrari</Link>
          <Link href="/porsche-collision-repair-sarasota" className="link-underline flex md:block items-center min-h-[44px] md:min-h-0 hover:text-bone transition-colors">Porsche</Link>
          <span className="mt-2 eyebrow !text-[10px]">Explainers</span>
          <Link href="/explainers/adas" className="link-underline flex md:block items-center min-h-[44px] md:min-h-0 hover:text-bone transition-colors">ADAS recalibration</Link>
          <Link href="/explainers/paint-match" className="link-underline flex md:block items-center min-h-[44px] md:min-h-0 hover:text-bone transition-colors">Paint match</Link>
          <Link href="/explainers/oem-parts" className="link-underline flex md:block items-center min-h-[44px] md:min-h-0 hover:text-bone transition-colors">OEM parts</Link>
        </nav>
      </Surface>
    </footer>
  );
}
