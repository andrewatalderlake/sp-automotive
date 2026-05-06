import type { Metadata } from "next";
import BrandPage from "@/components/brand/BrandPage";
import { getBrand } from "@/components/brand/brands-data";

const brand = getBrand("lamborghini-collision-repair-sarasota")!;

export const metadata: Metadata = {
  title: brand.metaTitle,
  description: brand.metaDescription,
  openGraph: { title: brand.metaTitle, description: brand.metaDescription },
};

export default function Page() {
  return <BrandPage brand={brand} />;
}
