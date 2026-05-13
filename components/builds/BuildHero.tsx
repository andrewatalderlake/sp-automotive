import type { Build } from "./builds-data";

export default function BuildHero({ build }: { build: Build }) {
  return (
    <section className="relative bg-ink pt-32 md:pt-40 pb-12 md:pb-16 px-6 md:px-10">
      <div className="max-w-6xl mx-auto">
        <p className="eyebrow">{build.eyebrow}</p>
        <h1 className="mt-5 display-lg">{build.title}</h1>
        <p className="mt-3 font-mono text-sm uppercase tracking-[0.22em] text-ignite">
          {build.kit}
        </p>
        <p className="mt-8 max-w-3xl lead">{build.description}</p>
      </div>
    </section>
  );
}
