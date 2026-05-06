"use client";
import { useState, MouseEvent } from "react";
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
    <header className="fixed inset-x-0 top-0 z-50 bg-bg border-b border-divider">
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
                className="link-underline text-sm uppercase tracking-[0.18em] text-text hover:text-accent transition-colors"
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
        <div className="flex-1 flex justify-end items-center">
          <div className="hidden md:block"><PhoneCTA location="nav" /></div>
          <button
            type="button"
            className="md:hidden text-accent p-3 -mr-3 inline-flex items-center justify-center"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
            aria-expanded={open}
          >
            <Menu className="h-6 w-6" aria-hidden />
          </button>
        </div>
      </nav>

      {open && (
        <div className="fixed inset-0 z-50 bg-bg flex flex-col" role="dialog" aria-modal="true" aria-label="Menu">
          <div className="flex justify-end p-3">
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close menu"
              className="text-accent p-3 inline-flex items-center justify-center"
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
                  className="font-display text-3xl text-text inline-block py-2"
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
