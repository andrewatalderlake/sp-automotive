"use client";
import { BEATS } from "@/lib/process-narrative";
import ProcessBeat from "./ProcessBeat";
import ProcessNarrativeMobile from "./ProcessNarrativeMobile";
import CraftCanvas from "./CraftCanvas";
import SceneDivider from "@/components/editorial/SceneDivider";
import { useMediaQuery } from "@/lib/hooks/useMediaQuery";

// Beat 1 ("Disassembly") is followed by the WebGL CraftCanvas — that piece
// IS the chapter cut for the 1→2 transition. The other four transitions
// get full-bleed SceneDividers using the home page hero-frames in
// narrative order. The cinematic leitmotif from the home hero recurs
// here as graduated scene cuts.

type Insertion =
  | { kind: "canvas" }
  | {
      kind: "divider";
      index: string;
      eyebrow: string;
      caption: string;
      imageSrc: string;
      imageAlt?: string;
    };

// Keyed by the beat index AFTER which to insert.
const INSERTIONS: Record<number, Insertion> = {
  0: {
    kind: "divider",
    index: "I.",
    eyebrow: "Before the strip",
    caption: "The car comes in the way it left.",
    imageSrc: "/hero-frames/01-wreck.webp",
  },
  1: { kind: "canvas" },
  2: {
    kind: "divider",
    index: "II.",
    eyebrow: "Damage diagnosed",
    caption: "What disassembly revealed, the booth will erase.",
    imageSrc: "/hero-frames/03-damaged-panel.webp",
  },
  3: {
    kind: "divider",
    index: "III.",
    eyebrow: "Booth complete",
    caption: "Layered to factory depth. Same gloss. Same primer line.",
    imageSrc: "/hero-frames/04-painted-panel.webp",
  },
  4: {
    kind: "divider",
    index: "IV.",
    eyebrow: "Reassembled",
    caption: "Torque-spec, gap-measured, signed.",
    imageSrc: "/hero-frames/06-reveal.webp",
  },
};

export default function ProcessNarrative({ as: Heading = "h1" }: { as?: "h1" | "h2" } = {}) {
  const reduced = useMediaQuery("(prefers-reduced-motion: reduce)");
  // Server snapshot is `true` so SSR (and the first client render before
  // hydration) renders the mobile shell as a safe default — matches the
  // previous behavior, swaps to desktop after hydration on wide viewports.
  const isMobile = useMediaQuery("(max-width: 767px)", true);

  if (reduced || isMobile) {
    return <ProcessNarrativeMobile as={Heading} />;
  }

  return (
    <section id="process" className="bg-bg">
      <div className="px-6 md:px-10 pt-32 pb-0 text-center max-w-5xl mx-auto">
        <Heading className="display-lg uppercase">The Process</Heading>
        <p className="mt-3 lead text-muted">Six steps. One signature.</p>
      </div>
      {BEATS.flatMap((b, i) => {
        const items: React.ReactNode[] = [<ProcessBeat key={b.id} beat={b} />];
        const insert = INSERTIONS[i];
        if (insert?.kind === "canvas") {
          items.push(<CraftCanvas key="craft-canvas" />);
        } else if (insert?.kind === "divider") {
          items.push(
            <SceneDivider
              key={`divider-${i}`}
              index={insert.index}
              eyebrow={insert.eyebrow}
              caption={insert.caption}
              imageSrc={insert.imageSrc}
              imageAlt={insert.imageAlt}
            />,
          );
        }
        return items;
      })}
    </section>
  );
}
