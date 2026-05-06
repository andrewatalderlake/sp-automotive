import type { Brand } from "./brands-data";

export default function BrandServices({ brand }: { brand: Brand }) {
  return (
    <section className="bg-bg px-6 md:px-10 py-24 md:py-32 border-t border-divider">
      <div className="max-w-6xl mx-auto">
        <p className="eyebrow">What we do for {brand.name}</p>
        <h2 className="mt-4 display-md">
          Six capabilities most shops won&apos;t budget for.
        </h2>

        <div className="mt-14 grid grid-cols-1 md:grid-cols-2 gap-6">
          {brand.specialties.map((s, i) => (
            <article
              key={i}
              className="border border-white/10 hover:border-accent transition-colors p-8"
            >
              <p className="text-[10px] uppercase tracking-[0.3em] text-muted">
                Capability {String(i + 1).padStart(2, "0")}
              </p>
              <h3 className="mt-3 font-display text-2xl md:text-3xl text-accent tracking-wide leading-tight">
                {s.title}
              </h3>
              <p className="mt-4 text-text/85 max-w-[60ch]">{s.copy}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
