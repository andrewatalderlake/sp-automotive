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

export default function BeforeAfterGallery() {
  return (
    <section id="work" className="relative px-6 md:px-10 py-32">
      <Surface variant="solid" className="max-w-7xl mx-auto rounded-md py-20 px-6 md:px-10">
        <p className="eyebrow">04 / The Work</p>
        <h2 className="mt-4 display-lg mb-16">
          <RevealWords>What came back better than new.</RevealWords>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {pairs.map((p) => (
            <Magnetic key={p.id} radius={120} strength={0.12} display="block" className="w-full">
              <figure data-cursor="View">
                <div className="grid grid-cols-[1fr_auto_1fr] gap-4 items-stretch">
                  <div className="relative aspect-[4/3] border border-white/10 hover:border-accent transition-colors">
                    <Image
                      src={`/before-after/0${p.id}-before.jpg`}
                      alt={`${p.caption} — before repair`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  </div>
                  <div aria-hidden className="flex items-center justify-center text-accent font-display text-lg">VS</div>
                  <div className="relative aspect-[4/3] border border-white/10 hover:border-accent transition-colors">
                    <Image
                      src={`/before-after/0${p.id}-after.jpg`}
                      alt={`${p.caption} — after repair`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  </div>
                </div>
                <figcaption className="mt-4 text-sm text-muted">{p.caption}</figcaption>
              </figure>
            </Magnetic>
          ))}
        </div>
      </Surface>
    </section>
  );
}
