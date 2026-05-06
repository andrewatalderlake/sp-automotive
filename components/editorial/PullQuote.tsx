import type { ReactNode } from "react";

// Magazine-style pull-quote. Hairline accent rule on the left, display face,
// optional attribution beneath in eyebrow type.
//
// Use sparingly — one per long-read. The first PullQuote on /about is the
// "factory-spec process / one signature" thesis line. Adding a second usually
// means the prose around it isn't earning its weight.

type Props = {
  children: ReactNode;
  attribution?: string;
  className?: string;
};

export default function PullQuote({ children, attribution, className = "" }: Props) {
  return (
    <figure className={`my-12 md:my-16 border-l border-accent pl-6 md:pl-8 max-w-[40ch] ${className}`}>
      <blockquote className="font-display text-3xl md:text-4xl text-accent leading-[1.05] tracking-[-0.01em]">
        {children}
      </blockquote>
      {attribution && (
        <figcaption className="mt-5 text-[10px] uppercase tracking-[0.3em] text-muted">
          {attribution}
        </figcaption>
      )}
    </figure>
  );
}
