import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Type Ramp — Workshop Cinema × Owner's Manual",
  robots: { index: false, follow: false },
};

const swatches = [
  { name: "ink",      hex: "#0E0F11", note: "Background. Cold near-black." },
  { name: "ink-deep", hex: "#0A0B0D", note: "Atmospheric gradient bottom." },
  { name: "steel",    hex: "#2A2D32", note: "Elevated surface. Cards, panels." },
  { name: "graphite", hex: "#6E727A", note: "Body text on dark. Mid-tone." },
  { name: "bone",     hex: "#C9C4BB", note: "Headline / strong text on dark." },
  { name: "chrome",   hex: "#D4D2CD", note: "Highlight metallic." },
  { name: "ignite",   hex: "#C8281D", note: "THE accent. Brake-light only." },
  { name: "paper",    hex: "#F4F2EE", note: "Light surface for editorial pages." },
];

const motions = [
  { name: "cinema",   token: "1200ms cubic-bezier(0.22, 1, 0.36, 1)",  cls: "ease-cinema" },
  { name: "shutter",  token: "600ms cubic-bezier(0.83, 0, 0.17, 1)",   cls: "ease-shutter" },
  { name: "manual",   token: "420ms cubic-bezier(0.83, 0, 0.17, 1)",   cls: "ease-manual" },
  { name: "quick",    token: "200ms cubic-bezier(0.4, 0, 0.2, 1)",     cls: "ease-quick" },
];

export default function TypeRampPage() {
  return (
    <div className="px-8 py-16 max-w-[1200px] mx-auto space-y-24">
      {/* ─── Header ─────────────────────────────────────────── */}
      <header className="space-y-6 border-b border-graphite/30 pb-12">
        <div className="annotation">SECTION A — DESIGN SYSTEM</div>
        <h1 className="display-xl">Type Ramp</h1>
        <p className="lead max-w-2xl">
          Verifies the Workshop Cinema × Owner&rsquo;s Manual token system.
          Display in Fraunces. Body in Hanken Grotesk. Editorial in Source Serif 4.
          Spec in JetBrains Mono Light.
        </p>
        <hr className="hairline" />
      </header>

      {/* ─── Display ramp ───────────────────────────────────── */}
      <section className="space-y-10">
        <div className="annotation">B — DISPLAY · FRAUNCES ITALIC · OPSZ 144</div>
        <div className="space-y-6">
          <div className="display-xl">Built where it broke.</div>
          <div className="display-lg">Built where it broke.</div>
          <div className="display-md">Built where it broke.</div>
          <div className="display-sm">Built where it broke.</div>
        </div>
        <hr className="hairline" />
        <div className="annotation">B.1 — DISPLAY UPRIGHT (CARDS / NAV)</div>
        <div className="display-md display-upright">LAMBORGHINI · McLAREN · PORSCHE</div>
      </section>

      {/* ─── Editorial body ─────────────────────────────────── */}
      <section className="space-y-6">
        <div className="annotation">C — EDITORIAL · SOURCE SERIF 4</div>
        <div className="editorial max-w-2xl">
          <p>
            Your insurance company is going to push you toward the cheapest shop on
            their list. We&rsquo;re not on that list. Here&rsquo;s what&rsquo;s
            different about how this works.
          </p>
          <p>
            Every flaw is found, documented, and measured before a single panel
            comes off the car. We don&rsquo;t hide the damage under filler. We
            don&rsquo;t paint over what should be replaced. We don&rsquo;t use
            aftermarket parts where the factory specifies original equipment.
          </p>
        </div>
        <hr className="hairline" />
      </section>

      {/* ─── Body / lead ────────────────────────────────────── */}
      <section className="space-y-6">
        <div className="annotation">D — BODY · HANKEN GROTESK</div>
        <p className="lead max-w-2xl">
          Lead paragraph. Used after a display headline to set the scene before
          the editorial body engages.
        </p>
        <p className="max-w-2xl">
          Standard body copy. Hanken Grotesk at 17px / 1.55 line-height. Tabular
          numerics enabled by default for clean spec stacks alongside long-form text.
        </p>
        <p className="text-graphite text-sm max-w-2xl">
          Caption / smaller meta copy in graphite. For metadata, dates, side notes.
        </p>
        <hr className="hairline" />
      </section>

      {/* ─── Spec / mono ───────────────────────────────────── */}
      <section className="space-y-6">
        <div className="annotation">E — SPEC · JETBRAINS MONO LIGHT</div>
        <div className="space-y-2 spec text-base">
          <div>Δ 0.4mm · gap tolerance</div>
          <div>120 Nm · subframe torque</div>
          <div>ΔE &lt; 1.0 · paint match</div>
          <div>0142 hrs · intake → repair</div>
          <div>5 layers · tri-coat clear</div>
        </div>
        <hr className="hairline" />
      </section>

      {/* ─── Color swatches ─────────────────────────────────── */}
      <section className="space-y-6">
        <div className="annotation">F — COLOR SYSTEM</div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {swatches.map((s) => (
            <div key={s.name} className="space-y-2">
              <div
                className="aspect-[4/3] rounded-sm border border-graphite/20"
                style={{ background: s.hex }}
              />
              <div className="space-y-1">
                <div className="font-display italic text-lg text-bone">{s.name}</div>
                <div className="spec text-xs">{s.hex}</div>
                <div className="text-graphite text-xs leading-snug">{s.note}</div>
              </div>
            </div>
          ))}
        </div>
        <hr className="hairline" />
      </section>

      {/* ─── Ignite accent demo ─────────────────────────────── */}
      <section className="space-y-6">
        <div className="annotation">G — IGNITE ACCENT (BRAKE LIGHT) · USE SPARINGLY</div>
        <div className="flex flex-wrap items-center gap-6">
          <button
            type="button"
            className="bg-ignite text-bone px-6 py-3 font-mono text-sm uppercase tracking-[0.18em] hover:opacity-90 transition-opacity"
          >
            Get an estimate
          </button>
          <span className="text-bone text-sm">
            ↑ Primary CTA. The only place ignite appears on a static page.
          </span>
        </div>
        <div className="space-y-2">
          <div className="text-graphite text-sm">Hairline progress indicator (top of long-form pages):</div>
          <div className="h-px bg-ignite w-1/3" />
        </div>
        <hr className="hairline" />
      </section>

      {/* ─── Motion tokens ──────────────────────────────────── */}
      <section className="space-y-6">
        <div className="annotation">H — MOTION TOKENS · HOVER ANY BOX TO TRIGGER</div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {motions.map((m) => (
            <div key={m.name} className="space-y-2">
              <div
                className="aspect-square bg-steel border border-graphite/20 hover:bg-ignite cursor-pointer"
                style={{ transition: `background ${m.token}` }}
              />
              <div className="font-display italic text-base text-bone">{m.name}</div>
              <div className="spec text-xs leading-snug">{m.token}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Footer note ─────────────────────────────────────── */}
      <footer className="border-t border-graphite/30 pt-8 text-center">
        <div className="annotation">END — SECTION A</div>
        <div className="text-graphite text-sm mt-2">
          /type-ramp · noindex · removed before production launch
        </div>
      </footer>
    </div>
  );
}
