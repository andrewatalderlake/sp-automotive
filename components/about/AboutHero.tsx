import Image from "next/image";
import { existsSync } from "fs";
import { join } from "path";
import PhoneCTA from "@/components/ui/PhoneCTA";
import SmsCTA from "@/components/ui/SmsCTA";

const PORTRAIT_PATH = "/about/serge-portrait.webp";

// Server component — checks at build time whether the real portrait file
// exists at /public/about/serge-portrait.webp. If it does, render it. If not,
// render a placeholder block (hairline border + small label) so the page
// composition is correct now and a single file drop ships the real photo
// later with no code change.
function hasPortrait(): boolean {
  try {
    return existsSync(join(process.cwd(), "public", "about", "serge-portrait.webp"));
  } catch {
    return false;
  }
}

export default function AboutHero() {
  const portrait = hasPortrait();

  return (
    <section className="relative bg-bg pt-32 md:pt-40 pb-20 px-6 md:px-10">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-16">
        <div className="md:col-span-7 flex flex-col justify-center">
          <p className="eyebrow">Founder · Sarasota, FL</p>
          <h1 className="mt-5 display-xl">Serge</h1>
          <p className="mt-8 max-w-xl lead">
            The man on every job. The signature on every weld.
            The reason your car comes home looking like the day it left the factory.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <PhoneCTA size="lg" location="about-hero" />
            <SmsCTA location="about-hero" />
          </div>
        </div>

        <div className="md:col-span-5 relative aspect-[4/5] md:aspect-auto md:min-h-[540px] border border-white/10 overflow-hidden">
          {portrait ? (
            <Image
              src={PORTRAIT_PATH}
              alt="Serge, founder of SP Automotive"
              fill
              priority
              sizes="(max-width: 768px) 100vw, 40vw"
              className="object-cover"
            />
          ) : (
            <div className="absolute inset-0 flex items-end justify-center bg-surface">
              <p className="mb-6 text-[10px] uppercase tracking-[0.3em] text-muted/60">
                Portrait — pending
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
