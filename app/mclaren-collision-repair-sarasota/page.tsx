import type { Metadata } from "next";
import BrandPage from "@/components/brand/BrandPage";
import { getBrand } from "@/components/brand/brands-data";
import { SITE_URL } from "@/lib/site";

const brand = getBrand("mclaren-collision-repair-sarasota")!;

export const metadata: Metadata = {
  title: brand.metaTitle,
  description: brand.metaDescription,
  alternates: { canonical: `${SITE_URL}/mclaren-collision-repair-sarasota` },
  openGraph: { title: brand.metaTitle, description: brand.metaDescription },
};

export default function Page() {
  return <BrandPage brand={brand} />;
}
