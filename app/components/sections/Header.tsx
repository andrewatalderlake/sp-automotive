/**
 * Top-of-page header: logo (left), nav links (center, hidden on mobile),
 * estimate CTA (right). Server component — zero JS.
 *
 * Background is transparent so the page-wide scroll video shows through.
 * Text is white-on-video, with the global vignette overlay providing the
 * top-of-page darkening that keeps it readable on any frame. Border softened
 * to white-on-transparent for the same reason.
 */
export function Header() {
  return (
    <header className="relative z-10 flex h-20 shrink-0 items-center justify-between border-b border-white/10 px-6 sm:px-10 lg:px-16">
      <a
        href="#top"
        className="text-base font-bold tracking-[0.18em] text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cool-blue sm:text-lg"
      >
        SP AUTOMOTIVE
      </a>

      <nav aria-label="Primary" className="hidden items-center gap-8 lg:flex">
        {[
          { label: "Services", href: "#services" },
          { label: "Our Process", href: "#process" },
          { label: "About", href: "#about" },
          { label: "Contact", href: "#contact" },
        ].map((link) => (
          <a
            key={link.href}
            href={link.href}
            className="text-sm font-medium text-white/80 transition-colors hover:text-white focus-visible:underline focus-visible:outline-none"
          >
            {link.label}
          </a>
        ))}
      </nav>

      <a
        href="#estimate"
        className="rounded-md bg-white px-5 py-2.5 text-sm font-medium text-black transition-colors hover:bg-white/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cool-blue"
      >
        Get an Estimate
      </a>
    </header>
  );
}
