import Image from "next/image";
import Link from "next/link";
import PhoneCTA from "@/components/ui/PhoneCTA";
import SmsCTA from "@/components/ui/SmsCTA";
import Surface from "@/components/ui/Surface";
import { CITY, REGION, HOURS_LABEL, BY_APPOINTMENT } from "@/lib/site";

export default function Footer() {
  // Surface scrim keeps footer copy legible on the home route where the
  // page-wide PageScrubVideo can be playing a bright frame behind the
  // viewport. On other routes the html gradient already provides a dark
  // backdrop; the scrim is a near-imperceptible extra darken there.
  return (
    <footer className="relative px-6 md:px-10 py-16">
      <Surface variant="glass" className="max-w-7xl mx-auto rounded-2xl py-12 px-6 md:px-10 grid grid-cols-1 md:grid-cols-3 gap-12">
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

        <nav aria-label="Footer" className="flex flex-col gap-2 text-sm text-graphite md:items-end">
          <Link href="/about" className="link-underline hover:text-bone transition-colors">About Serge</Link>
          <Link href="/process" className="link-underline hover:text-bone transition-colors">Process</Link>
          <Link href="/faq" className="link-underline hover:text-bone transition-colors">FAQ</Link>
          <Link href="/estimate" className="link-underline hover:text-bone transition-colors">Send 3 photos</Link>
          <Link href="/contact" className="link-underline hover:text-bone transition-colors">Contact</Link>
          <Link href="/lamborghini-collision-repair-sarasota" className="link-underline hover:text-bone transition-colors">Lamborghini</Link>
          <Link href="/mclaren-collision-repair-sarasota" className="link-underline hover:text-bone transition-colors">McLaren</Link>
          <Link href="/audi-r8-collision-repair-sarasota" className="link-underline hover:text-bone transition-colors">Audi R8</Link>
          <Link href="/bmw-m-collision-repair-sarasota" className="link-underline hover:text-bone transition-colors">BMW M</Link>
          <Link href="/ferrari-collision-repair-sarasota" className="link-underline hover:text-bone transition-colors">Ferrari</Link>
          <Link href="/porsche-collision-repair-sarasota" className="link-underline hover:text-bone transition-colors">Porsche</Link>
          <span className="mt-2 eyebrow !text-[10px]">Explainers</span>
          <Link href="/explainers/adas" className="link-underline hover:text-bone transition-colors">ADAS recalibration</Link>
          <Link href="/explainers/paint-match" className="link-underline hover:text-bone transition-colors">Paint match</Link>
          <Link href="/explainers/oem-parts" className="link-underline hover:text-bone transition-colors">OEM parts</Link>
        </nav>
      </Surface>
    </footer>
  );
}
