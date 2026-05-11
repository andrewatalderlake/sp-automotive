import Image from "next/image";
import Surface from "@/components/ui/Surface";

const pairs = [
  { id: 1, caption: "Lamborghini Huracán — front-end collision" },
  { id: 2, caption: "McLaren 720S — rear quarter rebuild" },
  { id: 3, caption: "Audi R8 — full repaint to spec" },
  { id: 4, caption: "BMW M4 — frame correction" },
];

// Supporting tiles — single-frame work shots that aren't strict
// before/after pairs. Sit below the pair grid so the page reads
// "documented restorations + selected work-in-progress / finished
// detail" without forcing every entry into a two-image layout.
const singles = [
  {
    src: "/sections/ch06-urus-stripped.jpg",
    alt: "Black Lamborghini Urus mid-restoration in SP Automotive's hex-neon detail bay, Sarasota",
    caption: "Urus — mid-restoration teardown",
  },
  {
    src: "/sections/ch06-gt4-pristine.jpg",
    alt: "White Porsche Cayman GT4 in SP Automotive's detail bay, Sarasota",
    caption: "Cayman GT4 — detail finish",
  },
  {
    src: "/sections/ch06-gt4-bay.jpg",
    alt: "White Porsche Cayman GT4 in SP Automotive's daylight workshop bay, Sarasota",
    caption: "Daylight bay",
  },
];

// Standalone gallery body — rendered on its own /gallery route, no longer
// part of the home-page chapter flow. The chapter-number mark has been
// dropped; the eyebrow + display headline now function as the page's
// title block. Top padding clears the floating nav comfortably.
export default function BeforeAfterGallery() {
  return (
    <section className="relative px-6 md:px-10 pt-32 pb-20 md:pt-40 md:pb-28">
      <div className="relative z-10 mb-8 md:mb-10">
        <p className="eyebrow">/ Selected work</p>
      </div>
      <Surface
        variant="glass"
        className="relative z-10 max-w-7xl mx-auto rounded-2xl py-12 px-6 md:py-16 md:px-10"
      >
        <h2 className="display-lg mb-8 md:mb-10">
          What came back better than new.
        </h2>

        {/* Featured composite — single frame already shows wrecked + restored
            side-by-side, so it gets a full-width hero slot above the pair grid
            instead of being split into two tiles. */}
        <figure className="mb-12 md:mb-16">
          <div className="relative aspect-[16/9] border border-white/10">
            <Image
              src="/sections/ch06-urus-pair.jpg"
              alt="Black Lamborghini Urus collision-to-restored pair outside SP Automotive's Sarasota shop"
              fill
              preload
              className="object-cover"
              style={{ objectPosition: "center 65%" }}
              sizes="(max-width: 1280px) 100vw, 1200px"
            />
          </div>
          <figcaption className="mt-4 text-sm text-graphite">
            Lamborghini Urus — collision to restored, side by side
          </figcaption>
        </figure>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {pairs.map((p) => (
            <figure key={p.id}>
              <div className="grid grid-cols-[1fr_auto_1fr] gap-4 items-stretch">
                <div className="relative aspect-[4/3] border border-white/10 hover:border-bone transition-colors">
                  <Image
                    src={`/before-after/0${p.id}-before.jpg`}
                    alt={`${p.caption} — before repair`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
                <div aria-hidden className="flex items-center justify-center text-bone font-display text-lg">VS</div>
                <div className="relative aspect-[4/3] border border-white/10 hover:border-bone transition-colors">
                  <Image
                    src={`/before-after/0${p.id}-after.jpg`}
                    alt={`${p.caption} — after repair`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
              </div>
              <figcaption className="mt-4 text-sm text-graphite">{p.caption}</figcaption>
            </figure>
          ))}
        </div>

        {/* Supporting tiles — single-frame shop shots for additional
            visual variety without forcing pair structure. */}
        <div className="mt-12 md:mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {singles.map((s) => (
            <figure key={s.src}>
              <div className="relative aspect-[3/4] border border-white/10 hover:border-bone transition-colors">
                <Image
                  src={s.src}
                  alt={s.alt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
              </div>
              <figcaption className="mt-4 text-sm text-graphite">{s.caption}</figcaption>
            </figure>
          ))}
        </div>
      </Surface>
    </section>
  );
}
