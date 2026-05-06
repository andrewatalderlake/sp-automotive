import type { ReactNode } from "react";

// 12-column asymmetric grid for editorial layouts (/about, /faq, explainers).
// Children declare their position via <EditorialItem start={N} span={M}>.
// Mobile collapses to single column — the start/span rules only apply on md+.
//
// Tailwind classes are mapped statically (not template-string interpolated)
// so JIT picks them up correctly. The mappings cover the column positions
// the editorial layouts actually use; add to the maps if a new layout needs
// a position not listed.

type GridProps = {
  children: ReactNode;
  className?: string;
  /** Vertical rhythm — sets gap-y. Default: "default" (gap-y-12 md:gap-y-20). */
  rhythm?: "tight" | "default" | "loose";
};

export function EditorialGrid({ children, className = "", rhythm = "default" }: GridProps) {
  const rhythmCls = {
    tight: "gap-y-8 md:gap-y-12",
    default: "gap-y-12 md:gap-y-20",
    loose: "gap-y-16 md:gap-y-28",
  }[rhythm];

  return (
    <div
      className={`grid grid-cols-1 md:grid-cols-12 gap-x-6 md:gap-x-10 ${rhythmCls} ${className}`}
    >
      {children}
    </div>
  );
}

const startClasses: Record<number, string> = {
  1: "md:col-start-1",
  2: "md:col-start-2",
  3: "md:col-start-3",
  4: "md:col-start-4",
  5: "md:col-start-5",
  6: "md:col-start-6",
  7: "md:col-start-7",
  8: "md:col-start-8",
  9: "md:col-start-9",
  10: "md:col-start-10",
};

const spanClasses: Record<number, string> = {
  3: "md:col-span-3",
  4: "md:col-span-4",
  5: "md:col-span-5",
  6: "md:col-span-6",
  7: "md:col-span-7",
  8: "md:col-span-8",
  9: "md:col-span-9",
  10: "md:col-span-10",
  12: "md:col-span-12",
};

type ItemProps = {
  children: ReactNode;
  /** 1-based column to start at on md+. */
  start?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
  /** Number of columns to occupy on md+. Default 12 (full width). */
  span?: 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 12;
  className?: string;
};

export function EditorialItem({ children, start, span = 12, className = "" }: ItemProps) {
  const startCls = start ? startClasses[start] : "";
  const spanCls = spanClasses[span] ?? "md:col-span-12";
  return <div className={`${startCls} ${spanCls} ${className}`}>{children}</div>;
}
