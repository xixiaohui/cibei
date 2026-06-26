import { notFound } from "next/navigation";
import { getEncyclopediaBySlug } from "@/lib/encyclopedia";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ProseReader } from "@/components/shared/prose-reader";
import { FavoriteButton } from "@/components/shared/favorite-button";
import { ShareButton } from "@/components/shared/share-button";
import { isFavorited } from "@/lib/favorites-actions";
import { generateSeo } from "@/lib/seo";
import type { Metadata } from "next";

interface EncyclopediaDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: EncyclopediaDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const entry = await getEncyclopediaBySlug(slug);
  if (!entry) return { title: "未找到" };

  return generateSeo({
    title: `${entry.title} — 佛学百科`,
    description: entry.content.slice(0, 160),
    canonical: `/encyclopedia/${slug}`,
    ogType: "article",
  });
}

export default async function EncyclopediaDetailPage({ params }: EncyclopediaDetailPageProps) {
  const { slug } = await params;
  const entry = await getEncyclopediaBySlug(slug);
  if (!entry) notFound();

  const favorited = await isFavorited("encyclopedia", slug);

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12">
      <Breadcrumb
        items={[
          { label: "佛学百科", href: "/encyclopedia" },
          { label: entry.title },
        ]}
      />

      {/* Entry Header */}
      <div className="mb-10">
        <div className="flex items-start justify-between gap-4 mb-3 flex-wrap">
          <h1 className="text-4xl font-bold tracking-tight">
            {entry.title}
          </h1>
          <FavoriteButton type="encyclopedia" slug={slug} title={entry.title} subtitle={entry.category ?? undefined} initialFavorited={favorited} />
            <ShareButton type="encyclopedia" slug={slug} />
        </div>
        {entry.category && (
          <Badge variant="secondary">{entry.category}</Badge>
        )}
      </div>

      <Separator className="mb-10" />

      {/* Content */}
      <ProseReader>
        {entry.content.split("\n").map((paragraph, i) =>
          paragraph.trim() ? <p key={i}>{paragraph}</p> : null
        )}
      </ProseReader>
    </div>
  );
}
