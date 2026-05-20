"use client";
import { useMemo, useRef, useState } from "react";
import type { ColorSwatch, ColorFamily } from "./colors-data";

type FilterKey = "all" | ColorFamily;

const FILTERS: Array<{ key: FilterKey; label: string }> = [
  { key: "all", label: "All" },
  { key: "tri-coat", label: "Tri-coats" },
  { key: "pearl", label: "Pearls" },
  { key: "metallic", label: "Metallics" },
  { key: "single-stage", label: "Single-stage" },
  { key: "matte", label: "Matte" },
];

const FAMILY_LABEL: Record<ColorFamily, string> = {
  "tri-coat": "Tri-coat",
  pearl: "Pearl",
  metallic: "Metallic",
  "single-stage": "Single-stage",
  matte: "Matte / satin",
};

// Interactive paint-color library. The chip wall is the focal interaction
// — tap a swatch to see the manufacturer code, variant count, family, and
// the one-line technical note for that color.
//
// Layout: at lg+, splits into a left chip wall and a right sticky detail
// column so visitors can browse without losing the active card. At smaller
// widths the layout stacks; tapping a chip smooth-scrolls the detail panel
// into view (respects prefers-reduced-motion).
//
// Each chip carries a hidden .spec code label that fades in on hover/focus
// and stays visible when the chip is active — turns the wall from "color
// picker" into "catalog of working factory codes" without crowding at rest.
export default function ColorSwatchLibrary({
  colors,
}: {
  colors: ColorSwatch[];
}) {
  const [filter, setFilter] = useState<FilterKey>("all");

  const visible = useMemo(
    () =>
      filter === "all" ? colors : colors.filter((c) => c.family === filter),
    [filter, colors],
  );

  const [activeCode, setActiveCode] = useState<string>(colors[0]?.code ?? "");
  const active =
    visible.find((c) => c.code === activeCode) ?? visible[0] ?? null;

  const detailRef = useRef<HTMLDivElement>(null);

  function selectFilter(f: FilterKey) {
    setFilter(f);
    const next =
      f === "all" ? colors : colors.filter((c) => c.family === f);
    if (!next.some((c) => c.code === activeCode) && next[0]) {
      setActiveCode(next[0].code);
    }
  }

  function selectChip(code: string) {
    setActiveCode(code);
    // Smooth-scroll the detail card into view on viewports where it's
    // below the chip grid (mobile / md). At lg+ the detail is in a sticky
    // sibling column already in view, so `block: 'nearest'` is a no-op.
    if (typeof window === "undefined") return;
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    detailRef.current?.scrollIntoView({
      behavior: reduced ? "auto" : "smooth",
      block: "nearest",
    });
  }

  return (
    <div>
      {/* Filter pills */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="spec text-graphite mr-2">// Filter</span>
        {FILTERS.map((f) => {
          const isActive = filter === f.key;
          return (
            <button
              key={f.key}
              type="button"
              onClick={() => selectFilter(f.key)}
              aria-pressed={isActive}
              className={`spec text-[10px] uppercase tracking-[0.18em] px-3 py-1.5 rounded-full border transition-colors ${
                isActive
                  ? "bg-bone/10 border-bone/30 text-bone"
                  : "border-hairline text-graphite hover:text-bone hover:border-bone/25"
              }`}
            >
              {f.label}
            </button>
          );
        })}
        <span className="spec text-graphite tabular-nums ml-auto whitespace-nowrap">
          {visible.length} / {colors.length}
        </span>
      </div>

      {/* Two-column layout at lg+: chip wall left, sticky detail right.
          Single-column stack at smaller widths with the detail panel below
          the wall. */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-10 lg:gap-12">
        {/* Left column: chip grid + optional empty-state annotation
            for sparse filter results. */}
        <div>
        {/* Chip grid */}
        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-7 lg:grid-cols-6 gap-3">
          {visible.map((c) => {
            const isActive = active?.code === c.code;
            return (
              <button
                key={c.code}
                type="button"
                onClick={() => selectChip(c.code)}
                aria-label={`${c.manufacturer} ${c.name} (${c.code}) — ${FAMILY_LABEL[c.family]}`}
                aria-pressed={isActive}
                className={`group relative aspect-square overflow-hidden rounded-md transition-transform duration-200 motion-safe:hover:scale-[1.05] chip--${c.family} ${
                  isActive
                    ? "ring-2 ring-bone/85 ring-offset-2 ring-offset-ink-deep scale-[1.06] z-10"
                    : "ring-1 ring-bone/10 hover:ring-bone/40"
                }`}
                style={
                  {
                    "--chip-color": c.hex,
                    // Active chip casts a faint colored glow downward —
                    // visually anchors the selection without losing the
                    // catalog feel.
                    boxShadow: isActive
                      ? `0 14px 32px -6px ${c.hex}AA, 0 4px 12px -2px ${c.hex}55`
                      : undefined,
                  } as React.CSSProperties
                }
              >
                {/* Factory code label. Hidden at rest so the wall reads as
                    pure color; appears on hover/focus and stays on for the
                    active chip. Dark backdrop pill keeps it readable against
                    any chip color. */}
                <span
                  className={`pointer-events-none absolute bottom-1 left-1 spec text-[9px] uppercase tracking-[0.12em] text-bone/90 bg-ink/65 backdrop-blur-[2px] px-1.5 py-[1px] rounded-sm transition-opacity duration-150 ${
                    isActive
                      ? "opacity-100"
                      : "opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100"
                  }`}
                >
                  {c.code}
                </span>
                {/* Active-state notch — small bone triangle pointing
                    downward from the chip's bottom edge, into the gutter.
                    Reads as "this chip is selected, look down." On lg+
                    the sticky right column already covers wayfinding, but
                    the notch keeps the active state visually emphatic. */}
                {isActive && (
                  <span
                    aria-hidden
                    className="absolute left-1/2 -bottom-[7px] -translate-x-1/2 h-0 w-0 border-l-[6px] border-r-[6px] border-t-[7px] border-l-transparent border-r-transparent border-t-bone/85"
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Empty-state annotation for the matte filter. Matte runs three
            entries on a six-col grid, leaving the rest of the column
            unused — fill that space with a value statement instead. */}
        {filter === "matte" && (
          <div className="mt-10 border-t border-hairline pt-8">
            <p className="eyebrow text-graphite">// On matte</p>
            <p className="mt-3 max-w-lg text-bone/80 text-sm leading-relaxed">
              Matte programs available on request. Same documentation
              discipline as gloss work &mdash; variant tested, film-thickness
              verified, per-coat photo record. Designo, Magno, and PTS satin
              commissions all in scope.
            </p>
          </div>
        )}
        </div>

        {/* Detail panel — sticky on lg+ so it follows the user down the
            chip wall. aria-live announces the swap for screen readers. */}
        <div
          ref={detailRef}
          aria-live="polite"
          className="lg:sticky lg:top-24 lg:self-start"
        >
          {active && (
            <div className="flex flex-col gap-5 border-t lg:border-t-0 border-hairline pt-10 lg:pt-0">
              <div
                className={`aspect-square w-full rounded ring-1 ring-bone/15 shadow-[0_24px_60px_-30px_rgba(0,0,0,0.6)] chip--${active.family}`}
                style={
                  { "--chip-color": active.hex } as React.CSSProperties
                }
                role="img"
                aria-label={`${active.name} swatch — ${FAMILY_LABEL[active.family]}`}
              />
              <div className="flex flex-col gap-3">
                <p className="spec text-graphite tabular-nums">
                  {active.manufacturer} · {active.code}
                </p>
                <h3 className="font-display uppercase tracking-[0.04em] text-bone text-2xl md:text-3xl leading-none">
                  {active.name}
                </h3>
                <div className="flex flex-wrap items-center gap-x-5 gap-y-2 spec text-bone/60">
                  <span>{FAMILY_LABEL[active.family]}</span>
                  <span aria-hidden className="h-3 w-px bg-bone/15" />
                  <span>
                    <span className="text-bone/85 tabular-nums">
                      {active.variants}
                    </span>{" "}
                    factory variants
                  </span>
                </div>
                <p className="mt-2 text-bone/80 text-sm leading-relaxed">
                  {active.note}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
