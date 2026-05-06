import Image from "next/image";
import { existsSync } from "fs";
import { join } from "path";

// Server component that renders an image if its file exists at build time,
// otherwise a hairline placeholder block with a small label. Lets editorial
// layouts ship structurally complete while real photos are still in
// production. Same pattern as `AboutHero`'s `hasPortrait()` check —
// formalized so any editorial layout can reuse it.

type Props = {
  /** /public-relative path, e.g. "/about/serge-booth.webp". */
  src: string;
  alt: string;
  /** Tailwind aspect-* class. Default 4/5. */
  aspectClass?: string;
  /** Sizes attribute for the underlying Image. */
  sizes?: string;
  /** Label shown on the placeholder until the real photo lands. */
  placeholderLabel?: string;
  /** Extra classes on the wrapper. */
  className?: string;
};

function hasImage(publicPath: string): boolean {
  try {
    const cleanPath = publicPath.replace(/^\//, "");
    return existsSync(join(process.cwd(), "public", cleanPath));
  } catch {
    return false;
  }
}

export default function EditorialImageSlot({
  src,
  alt,
  aspectClass = "aspect-[4/5]",
  sizes = "(max-width: 768px) 100vw, 40vw",
  placeholderLabel = "Photo — pending",
  className = "",
}: Props) {
  const present = hasImage(src);
  return (
    <div
      className={`relative ${aspectClass} border border-white/10 overflow-hidden bg-surface ${className}`}
    >
      {present ? (
        <Image src={src} alt={alt} fill sizes={sizes} className="object-cover" />
      ) : (
        <div className="absolute inset-0 flex items-end justify-center">
          <p className="mb-6 text-[10px] uppercase tracking-[0.3em] text-muted/60">
            {placeholderLabel}
          </p>
        </div>
      )}
    </div>
  );
}
