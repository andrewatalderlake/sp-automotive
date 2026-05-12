"use client";
import { useEffect, useRef, useState, MouseEvent } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import PhoneCTA from "@/components/ui/PhoneCTA";

// Gallery sits second-from-right so Contact remains the rightmost
// CTA-weight link. The selected-work proof formerly lived as a section
// on the home page (anchored from a "/#work" link); it now has its own
// route at /gallery.
const links = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/faq", label: "FAQ" },
  { href: "/gallery", label: "Gallery" },
  { href: "/contact", label: "Contact" },
];

export default function Navigation() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const openButtonRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  // Anchor hrefs (e.g. /#work) are not "active" destinations — they scroll
  // within the home page. For path hrefs, mark active when the pathname
  // matches exactly or is a sub-route (e.g. /explainers/adas could mark
  // /process active in future, but for now the link list is flat).
  function isActive(href: string): boolean {
    if (href.includes("#")) return false;
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(href + "/");
  }

  // Mobile dialog a11y: when open, lock body scroll, trap Tab/Shift+Tab
  // inside the dialog, close on Escape, and restore focus to whatever
  // had focus before the dialog opened (typically the hamburger button).
  useEffect(() => {
    if (!open) return;
    const dialog = dialogRef.current;
    if (!dialog) return;
    // Capture the trigger inside the effect so the cleanup uses the value
    // observed at open-time, not at unmount-time.
    const openButton = openButtonRef.current;

    const previouslyFocused = document.activeElement as HTMLElement | null;

    // iOS Safari ignores `overflow: hidden` on <body> for touch scrolling.
    // The reliable cross-browser scroll lock is to fix the body in place at
    // the negative of the current scroll offset, then restore that offset
    // on close. Capture every style we mutate so cleanup is exact and
    // doesn't stomp on app-set values.
    const scrollY = window.scrollY;
    const body = document.body;
    const prev = {
      position: body.style.position,
      top: body.style.top,
      left: body.style.left,
      right: body.style.right,
      width: body.style.width,
    };
    body.style.position = "fixed";
    body.style.top = `-${scrollY}px`;
    body.style.left = "0";
    body.style.right = "0";
    body.style.width = "100%";

    const focusables = Array.from(
      dialog.querySelectorAll<HTMLElement>(
        'a, button, [tabindex]:not([tabindex="-1"]), input, select, textarea',
      ),
    );
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    first?.focus();

    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.preventDefault();
        setOpen(false);
        return;
      }
      if (e.key !== "Tab" || focusables.length === 0) return;
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", onKey);

    return () => {
      body.style.position = prev.position;
      body.style.top = prev.top;
      body.style.left = prev.left;
      body.style.right = prev.right;
      body.style.width = prev.width;
      // `behavior: "instant"` is required because globals.css sets
      // `html { scroll-behavior: smooth }`. Without it the page would
      // snap to top (as `position: fixed` clears) and then animate back
      // down on every dialog close.
      window.scrollTo({ top: scrollY, behavior: "instant" });
      document.removeEventListener("keydown", onKey);
      if (previouslyFocused && document.contains(previouslyFocused)) {
        previouslyFocused.focus();
      } else {
        openButton?.focus();
      }
    };
  }, [open]);

  // Anchor links: native scrollIntoView (smooth via CSS scroll-behavior).
  // Off-home anchor: navigate to /#id; Next.js handles the hash scroll.
  //
  // Important: when the dialog is open, <body> is `position: fixed` for
  // the iOS-safe scroll lock. `scrollIntoView` is a no-op against a fixed
  // body, and the dialog-close effect cleanup will then run
  // `window.scrollTo({ top: scrollY })` and bounce the user back to the
  // pre-open offset. Defer the scroll/route call to a macrotask so it
  // runs *after* React commits `open: false` and the cleanup restores
  // body flow + scroll position.
  function handleClick(href: string) {
    return (e: MouseEvent) => {
      const isAnchor = href.includes("#");
      const onHome = pathname === "/";

      if (isAnchor) e.preventDefault();
      setOpen(false);

      if (isAnchor && onHome) {
        const id = href.split("#")[1];
        setTimeout(() => {
          const target = id ? document.getElementById(id) : null;
          target?.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 0);
      } else if (isAnchor && !onHome) {
        setTimeout(() => router.push(href), 0);
      }
    };
  }

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50 px-6 md:px-10 pt-5">
      <nav className="flex items-center justify-between gap-4">
        <Link
          href="/"
          aria-label="SP Automotive home"
          className="pointer-events-auto flex items-center"
        >
          <Image
            src="/logos/sp-mark.png"
            alt="SP Automotive"
            width={654}
            height={241}
            // `preload` replaces deprecated `priority` in Next 16+; above-the-fold on every page.
            preload
            className="h-10 w-auto invert"
          />
        </Link>

        {/* Desktop floating pill — nav links + phone CTA, top-right */}
        <div className="pointer-events-auto hidden md:flex items-center gap-5 rounded-full border border-white/10 bg-black/40 backdrop-blur-md px-6 py-2.5 shadow-[0_8px_24px_-12px_rgba(0,0,0,0.5)]">
          <ul className="flex items-center gap-5">
            {links.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  onClick={handleClick(l.href)}
                  aria-current={isActive(l.href) ? "page" : undefined}
                  className="link-underline text-xs uppercase tracking-[0.18em] text-bone hover:text-bone transition-colors"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
          <span aria-hidden className="h-4 w-px bg-white/15" />
          <PhoneCTA location="nav" />
        </div>

        {/* Mobile floating pill — menu button, top-right */}
        <button
          ref={openButtonRef}
          type="button"
          className="pointer-events-auto md:hidden inline-flex items-center justify-center rounded-full border border-white/10 bg-black/40 backdrop-blur-md text-bone p-3"
          onClick={() => setOpen(true)}
          aria-label="Open menu"
          aria-expanded={open}
        >
          <Menu className="h-5 w-5" aria-hidden />
        </button>
      </nav>

      {open && (
        <div ref={dialogRef} className="fixed inset-0 z-50 bg-ink flex flex-col" role="dialog" aria-modal="true" aria-label="Menu">
          <div className="flex justify-end p-3">
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close menu"
              className="text-bone p-3 inline-flex items-center justify-center"
            >
              <X className="h-7 w-7" aria-hidden />
            </button>
          </div>
          <ul className="flex flex-col items-center gap-8 mt-16">
            {links.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  onClick={handleClick(l.href)}
                  aria-current={isActive(l.href) ? "page" : undefined}
                  className="link-underline font-display text-3xl text-bone inline-block py-2"
                >
                  {l.label}
                </Link>
              </li>
            ))}
            <li className="mt-8"><PhoneCTA location="nav-mobile" /></li>
          </ul>
        </div>
      )}
    </header>
  );
}
