import Image from "next/image";
import RevealWords from "@/components/effects/RevealWords";
import Magnetic from "@/components/effects/Magnetic";
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

// Free-floating chapter mark + glass-tab gallery, matching the homepage
// chapter pattern (AboutStrip / FinalCTA). The id="work" stays on the
// outer <section> so the navbar's /#work anchor lands here.
export default function BeforeAfterGallery() {
  return (
    <section id="work" className="relative px-6 md:px-10 py-32 scroll-mt-32">
      <div className="relative z-10 mb-16">
        <div className="font-display text-bone leading-none tracking-[-0.02em] text-3xl md:text-5xl">
          06
        </div>
        <p className="eyebrow mt-2">/ Selected work</p>
      </div>
      <Surface
        variant="glass"
        className="relative z-10 max-w-7xl mx-auto rounded-2xl py-12 px-6 md:py-16 md:px-10"
      >
        <h2 className="display-lg mb-12 md:mb-16">
          <RevealWords>What came back better than new.</RevealWords>
        </h2>

        {/* Featured composite — single frame already shows wrecked + restored
            side-by-side, so it gets a full-width hero slot above the pair grid
            instead of being split into two tiles. */}
        <figure data-cursor="View" className="mb-12 md:mb-16">
          <div className="relative aspect-[16/9] border border-white/10">
            <Image
              src="/sections/ch06-urus-pair.jpg"
              alt="Black Lamborghini Urus collision-to-restored pair outside SP Automotive's Sarasota shop"
              fill
              className="object-cover"
              sizes="(max-width: 1280px) 100vw, 1200px"
            />
          </div>
          <figcaption className="mt-4 text-sm text-graphite">
            Lamborghini Urus — collision to restored, side by side
          </figcaption>
        </figure>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {pairs.map((p) => (
            <Magnetic key={p.id} radius={120} strength={0.12} display="block" className="w-full">
              <figure data-cursor="View">
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
            </Magnetic>
          ))}
        </div>

        {/* Supporting tiles — single-frame shop shots for additional
            visual variety without forcing pair structure. */}
        <div className="mt-12 md:mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {singles.map((s) => (
            <Magnetic key={s.src} radius={120} strength={0.1} display="block" className="w-full">
              <figure data-cursor="View">
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
            </Magnetic>
          ))}
        </div>
      </Surface>
    </section>
  );
}
