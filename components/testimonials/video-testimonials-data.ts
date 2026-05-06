// Video testimonials. Same gating pattern as testimonials-data.ts —
// `published: false` keeps an entry off the site, an empty published list
// hides the section entirely.
//
// Asset convention (when shooting): 30-second silent clips, 1080x1350 (4:5)
// or 1280x720 (16:9), MP4 (H.264) primary plus WebM (VP9) fallback. Posters
// at the same aspect ratio. Files land in `/public/testimonials/`.

export type VideoTestimonial = {
  id: string;
  name: string;
  vehicle: string;
  repairType: string;
  posterSrc: string;
  mp4Src: string;
  webmSrc?: string;
  /** One-line caption shown beneath the clip. */
  captionText: string;
  /** Aspect ratio class — Tailwind aspect-* utility, e.g., "aspect-[4/5]". */
  aspectClass?: string;
  published: boolean;
};

export const VIDEO_TESTIMONIALS: VideoTestimonial[] = [
  {
    id: "placeholder-1",
    name: "PLACEHOLDER",
    vehicle: "'22 Aventador SVJ",
    repairType: "Front-end collision",
    posterSrc: "/testimonials/placeholder-1.webp",
    mp4Src: "/testimonials/placeholder-1.mp4",
    captionText: "Six weeks. Factory-correct.",
    aspectClass: "aspect-[4/5]",
    published: false,
  },
  {
    id: "placeholder-2",
    name: "PLACEHOLDER",
    vehicle: "'21 720S",
    repairType: "Carbon-tub repair",
    posterSrc: "/testimonials/placeholder-2.webp",
    mp4Src: "/testimonials/placeholder-2.mp4",
    captionText: "Three shops said total. He didn't.",
    aspectClass: "aspect-[4/5]",
    published: false,
  },
  {
    id: "placeholder-3",
    name: "PLACEHOLDER",
    vehicle: "'19 R8 V10",
    repairType: "Tri-coat repaint",
    posterSrc: "/testimonials/placeholder-3.webp",
    mp4Src: "/testimonials/placeholder-3.mp4",
    captionText: "Color match perfect. Booth to booth.",
    aspectClass: "aspect-[4/5]",
    published: false,
  },
];

export const PUBLISHED_VIDEO_TESTIMONIALS: VideoTestimonial[] =
  VIDEO_TESTIMONIALS.filter((t) => t.published);
