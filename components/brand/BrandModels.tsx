import type { Brand } from "./brands-data";
import Magnetic from "@/components/effects/Magnetic";

export default function BrandModels({ brand }: { brand: Brand }) {
  return (
    <section className="bg-bg px-6 md:px-10 py-24 md:py-32 border-t border-divider">
      <div className="max-w-6xl mx-auto">
        <p className="eyebrow">Models we work on</p>
        <h2 className="mt-4 display-md">
          {brand.name}&rsquo;s full lineup. Most years.
        </h2>

        <ul className="mt-12 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {brand.models.map((m) => (
            <li key={m}>
              <Magnetic radius={60} strength={0.18} display="block" className="w-full">
                <div
                  data-cursor="Open"
                  className="border border-white/10 px-4 py-3 text-sm text-text/90 hover:border-accent hover:text-accent transition-colors"
                >
                  {m}
                </div>
              </Magnetic>
            </li>
          ))}
        </ul>

        <p className="mt-8 text-sm text-muted max-w-md">
          Don&apos;t see your model? Call. We&apos;ve worked on cars older than this list.
        </p>
      </div>
    </section>
  );
}
