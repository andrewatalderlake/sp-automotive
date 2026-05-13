import type { Metadata } from "next";
import { notFound } from "next/navigation";
import BuildPage from "@/components/builds/BuildPage";
import { BUILDS, getBuild } from "@/components/builds/builds-data";

type Params = { slug: string };

export async function generateStaticParams(): Promise<Params[]> {
  return BUILDS.map((b) => ({ slug: b.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const build = getBuild(slug);
  if (!build) return {};
  return {
    title: build.metaTitle,
    description: build.metaDescription,
    openGraph: {
      title: build.metaTitle,
      description: build.metaDescription,
      images: [build.kitImage],
    },
  };
}

export default async function Page({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const build = getBuild(slug);
  if (!build) notFound();
  return <BuildPage build={build} />;
}
