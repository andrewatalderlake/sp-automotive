"use client";
import { useEffect, useRef, useState, MouseEvent } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import PhoneCTA from "@/components/ui/PhoneCTA";

const links = [
  { href: "/", label: "Home" },
  { href: "/process", label: "Process" },
  { href: "/#work", label: "Work" },
  { href: "/about", label: "About" },
  { href: "/faq", label: "FAQ" },
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
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

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
      document.body.style.overflow = prevOverflow;
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
  function handleClick(href: string) {
    return (e: MouseEvent) => {
      setOpen(false);
      const isAnchor = href.includes("#");
      const onHome = pathname === "/";

      if (isAnchor && onHome) {
        e.preventDefault();
        const id = href.split("#")[1];
        const target = id ? document.getElementById(id) : null;
        if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
      } else if (isAnchor && !onHome) {
        e.preventDefault();
        router.push(href);
      }
    };
  }

  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-ink border-b border-divider">
      <nav className="flex items-center px-6 md:px-10 h-20">
        <div className="flex-1 flex justify-start">
          <Link href="/" aria-label="SP Automotive home" className="flex items-center">
            <Image
              src="/logos/sp-mark.png"
              alt="SP Automotive"
              width={654}
              height={241}
              priority
              className="h-12 w-auto invert"
            />
          </Link>
        </div>
        <ul className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                onClick={handleClick(l.href)}
                aria-current={isActive(l.href) ? "page" : undefined}
                className="link-underline text-sm uppercase tracking-[0.18em] text-bone hover:text-bone transition-colors"
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
        <div className="flex-1 flex justify-end items-center">
          <div className="hidden md:block"><PhoneCTA location="nav" /></div>
          <button
            ref={openButtonRef}
            type="button"
            className="md:hidden text-bone p-3 -mr-3 inline-flex items-center justify-center"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
            aria-expanded={open}
          >
            <Menu className="h-6 w-6" aria-hidden />
          </button>
        </div>
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
