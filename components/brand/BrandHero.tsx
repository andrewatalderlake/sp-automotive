import Link from "next/link";
import PhoneCTA from "@/components/ui/PhoneCTA";
import SmsCTA from "@/components/ui/SmsCTA";
import type { Brand } from "./brands-data";

export default function BrandHero({ brand }: { brand: Brand }) {
  return (
    <section className="relative bg-bg pt-32 md:pt-44 pb-20 md:pb-28 px-6 md:px-10">
      <div className="max-w-6xl mx-auto">
        <p className="eyebrow">{brand.eyebrow}</p>
        <h1 className="mt-5 display-lg">{brand.headline}</h1>
        <p className="mt-8 max-w-3xl lead">{brand.intro}</p>
        <div className="mt-10 flex flex-wrap items-center gap-4">
          <PhoneCTA size="lg" location="brand-hero" />
          <SmsCTA location="brand-hero" />
        </div>
        <p className="mt-5 text-xs uppercase tracking-[0.22em] text-muted">
          Or{" "}
          <Link
            href="/estimate"
            className="link-underline text-text hover:text-accent transition-colors"
          >
            send 3 photos for a callback
          </Link>
        </p>
      </div>
    </section>
  );
}
