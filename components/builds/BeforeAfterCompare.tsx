import Image from "next/image";
import { cn } from "@/lib/utils";

// Static before/after comparison. Two 16:9 `<Image fill>` cells laid out
// in a CSS grid — side-by-side at ≥768px, stacked vertically below. Each
// cell carries an overlay pill label in the top-left. Labels are generic
// ("Stock" / "With body kit") because the specific kit brand (1016,
// Mansory, Brabus, etc.) already shows up in the page title, the
// carousel-card description on the homepage, and the spec block below
// the comparison.

type Props = {
  stockImage: string;
  kitImage: string;
  /** Alt text. Used for both images. */
  alt: string;
  className?: string;
};

export function BeforeAfterCompare({
  stockImage,
  kitImage,
  alt,
  className,
}: Props) {
  return (
    <div
      className={cn("grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6", className)}
    >
      <FrameImage src={stockImage} alt={`${alt} — stock`} label="Stock" />
      <FrameImage
        src={kitImage}
        alt={`${alt} — with body kit`}
        label="With body kit"
        accent
      />
    </div>
  );
}

function FrameImage({
  src,
  alt,
  label,
  accent,
}: {
  src: string;
  alt: string;
  label: string;
  accent?: boolean;
}) {
  return (
    <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl bg-ink-deep ring-1 ring-bone/10 shadow-xl">
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 768px) 100vw, 50vw"
        className="object-cover"
        priority
        draggable={false}
      />
      <span
        className={cn(
          "absolute left-4 top-4 rounded-full px-3 py-1 text-xs uppercase tracking-[0.18em] text-bone backdrop-blur",
          accent ? "bg-ignite/80" : "bg-ink/70",
        )}
      >
        {label}
      </span>
    </div>
  );
}

export default BeforeAfterCompare;
