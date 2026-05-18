import type { Brand } from "./brands-data";

export default function BrandModels({ brand }: { brand: Brand }) {
  return (
    <section className="bg-ink px-6 md:px-10 py-24 md:py-32 border-t border-divider">
      <div className="max-w-6xl mx-auto">
        <p className="eyebrow">Models we work on</p>
        <h2 className="mt-4 display-md">
          {brand.name}&rsquo;s full lineup. Most years.
        </h2>

        <ul className="mt-12 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {brand.models.map((m) => (
            <li key={m}>
              <div
                className="w-full border border-white/10 px-4 py-3 text-sm text-bone/90 hover:border-bone hover:text-bone transition-colors"
              >
                {m}
              </div>
            </li>
          ))}
        </ul>

        <p className="mt-8 text-sm text-bone/85 max-w-md">
          Don&apos;t see your model? Call. We&apos;ve worked on cars older than this list.
        </p>
      </div>
    </section>
  );
}
