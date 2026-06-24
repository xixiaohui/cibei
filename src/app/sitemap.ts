import { getAllSutras } from "@/lib/sutras";
import { getAllGlossaryTerms } from "@/lib/glossary";
import { getAllEncyclopediaEntries } from "@/lib/encyclopedia";
import type { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://cebei.space";

  const [sutras, terms, entries] = await Promise.all([
    getAllSutras(),
    getAllGlossaryTerms(),
    getAllEncyclopediaEntries(),
  ]);

  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: `${baseUrl}/sutras`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/dictionary`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/encyclopedia`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/search`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.5 },
  ];

  const sutraPages: MetadataRoute.Sitemap = sutras.map((s) => ({
    url: `${baseUrl}/sutras/${s.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const glossaryPages: MetadataRoute.Sitemap = terms.map((t) => ({
    url: `${baseUrl}/dictionary/${t.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const encyclopediaPages: MetadataRoute.Sitemap = entries.map((e) => ({
    url: `${baseUrl}/encyclopedia/${e.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...staticPages, ...sutraPages, ...glossaryPages, ...encyclopediaPages];
}
