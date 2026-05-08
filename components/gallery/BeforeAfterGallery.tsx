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

// Free-floating chapter mark + glass-tab gallery, matching the homepage
// chapter pattern (AboutStrip / FinalCTA). The id="work" stays on the
// outer <section> so the navbar's /#work anchor lands here.
export default function BeforeAfterGallery() {
  return (
    <section id="work" className="relative px-6 md:px-10 py-32 scroll-mt-32">
      <div className="relative z-10 mb-16">
        <div className="font-display text-bone leading-none tracking-[-0.02em] text-3xl md:text-5xl">
          05
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
      </Surface>
    </section>
  );
}
