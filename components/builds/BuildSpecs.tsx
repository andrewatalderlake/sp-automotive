import type { Build } from "./builds-data";

export default function BuildSpecs({ build }: { build: Build }) {
  return (
    <section className="bg-ink px-6 md:px-10 py-16 md:py-24">
      <div className="max-w-5xl mx-auto">
        <p className="eyebrow mb-8">/ Spec</p>
        <dl className="grid grid-cols-1 gap-x-12 gap-y-6 md:grid-cols-2">
          {build.specs.map((spec) => (
            <div
              key={spec.label}
              className="flex flex-col border-t border-bone/15 pt-4"
            >
              <dt className="font-mono text-xs uppercase tracking-[0.22em] text-graphite">
                {spec.label}
              </dt>
              <dd className="mt-2 text-bone">{spec.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
