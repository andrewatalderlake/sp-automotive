import type { Metadata } from "next";
import BeforeAfterGallery from "@/components/gallery/BeforeAfterGallery";
import FinalCTA from "@/components/cta/FinalCTA";

export const metadata: Metadata = {
  title: "Gallery",
  description:
    "Selected restorations from SP Automotive's Sarasota shop — collision teardowns, factory-spec returns, and the work that came back better than new.",
};

export default function GalleryPage() {
  return (
    <>
      <BeforeAfterGallery />
      <FinalCTA />
    </>
  );
}
