"use client";

const BRANDS = [
  "Lamborghini",
  "McLaren",
  "Audi R8",
  "BMW M",
  "Ferrari",
  "Porsche",
  "Mercedes-AMG",
  "Aston Martin",
];

// Slim brand-marquee strip. Hidden from screen readers (a screen-reader visible
// summary lives in the heading + alt brand-list below). Marquee animation
// pauses for prefers-reduced-motion users.

export default function ShowroomSection() {
  const items = [...BRANDS, ...BRANDS];

  return (
    <section className="relative py-12 md:py-16 bg-black/40 border-y border-divider overflow-hidden" aria-label="Brands we work on">
      <div className="px-6 md:px-10 mb-6 md:mb-8 flex items-baseline justify-between max-w-7xl mx-auto">
        <p className="eyebrow">02 / We work on</p>
        <p className="eyebrow opacity-70 hidden md:block">
          and the cars older than this list
        </p>
      </div>

      {/* Screen-reader text alternative — list visible to assistive tech only */}
      <ul className="sr-only">
        {BRANDS.map((b) => <li key={b}>{b}</li>)}
      </ul>

      <div aria-hidden className="relative">
        <div
          className="showroom-marquee-track flex whitespace-nowrap items-center"
          style={{ width: "max-content" }}
        >
          {items.map((b, i) => (
            <div
              key={i}
              className="flex items-center px-8 md:px-12 text-3xl md:text-6xl font-display tracking-wide text-accent uppercase"
            >
              <span>{b}</span>
              <span className="ml-8 md:ml-12 text-muted/60">·</span>
            </div>
          ))}
        </div>
        <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-black/80 to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-black/80 to-transparent" />
      </div>
      <style>{`
        @keyframes showroom-marquee {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        .showroom-marquee-track {
          animation: showroom-marquee 40s linear infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .showroom-marquee-track {
            animation: none;
            transform: translateX(0);
          }
        }
      `}</style>
    </section>
  );
}
