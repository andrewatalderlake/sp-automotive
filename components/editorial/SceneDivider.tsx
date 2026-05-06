import Image from "next/image";

// Full-bleed scene cut for between long-read sections. Used on /process to
// separate adjacent ProcessBeats into chapters. The image is full-bleed; a
// dark gradient at the bottom anchors the index, eyebrow, and one-line
// caption.
//
// Source images are the existing public/hero-frames/ WebPs — they double as
// the home page hero scroll-sequence so the visual leitmotif carries
// across pages.

type Props = {
  /** Two-digit chapter number, displayed in mono. */
  index: string;
  /** Eyebrow above the caption — short, uppercase. */
  eyebrow: string;
  /** One-line caption — keep under ~10 words. */
  caption: string;
  /** Image path under /public. */
  imageSrc: string;
  /** Decorative by default. Pass alt text only when the image carries meaning the caption doesn't. */
  imageAlt?: string;
  /** Optional priority hint for above-the-fold use. */
  priority?: boolean;
};

export default function SceneDivider({
  index,
  eyebrow,
  caption,
  imageSrc,
  imageAlt = "",
  priority = false,
}: Props) {
  return (
    <section className="relative h-[60vh] md:h-[80vh] w-full overflow-hidden bg-bg border-t border-divider">
      <Image
        src={imageSrc}
        alt={imageAlt}
        fill
        priority={priority}
        sizes="100vw"
        className="object-cover"
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/15 to-black/85"
      />
      <div className="relative z-10 h-full flex flex-col justify-end items-start px-6 md:px-10 pb-14 md:pb-20 max-w-7xl mx-auto w-full">
        <p className="spec text-xs text-accent">{index}</p>
        <p className="mt-3 text-[10px] uppercase tracking-[0.3em] text-accent/85">
          {eyebrow}
        </p>
        <h3 className="mt-4 font-display text-3xl md:text-5xl text-accent leading-[1.05] max-w-3xl">
          {caption}
        </h3>
      </div>
    </section>
  );
}
