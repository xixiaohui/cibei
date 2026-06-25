import { notFound } from "next/navigation";
import { getEncyclopediaBySlug } from "@/lib/encyclopedia";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ShareButton } from "@/components/shared/share-button";
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
          <ShareButton type="encyclopedia" slug={slug} />
        </div>
        {entry.category && (
          <Badge variant="secondary">{entry.category}</Badge>
        )}
      </div>

      <Separator className="mb-10" />

      {/* Content */}
      <div className="prose prose-neutral max-w-none">
        {entry.content.split("\n").map((paragraph, i) => (
          paragraph.trim() ? (
            <p key={i} className="text-lg leading-relaxed mb-4">{paragraph}</p>
          ) : null
        ))}
      </div>
    </div>
  );
}
