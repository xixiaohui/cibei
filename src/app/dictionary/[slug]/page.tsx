import { notFound } from "next/navigation";
import { getGlossaryBySlug, getAllGlossaryTerms } from "@/lib/glossary";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { RelatedTerms } from "@/components/dictionary/related-terms";
import { Separator } from "@/components/ui/separator";
import { ShareButton } from "@/components/shared/share-button";
import { generateSeo } from "@/lib/seo";
import type { Metadata } from "next";

interface GlossaryDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: GlossaryDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const term = await getGlossaryBySlug(slug);
  if (!term) return { title: "未找到" };

  return generateSeo({
    title: `${term.term} — 佛学词典`,
    description: term.definition.slice(0, 160),
    canonical: `/dictionary/${slug}`,
  });
}

export default async function GlossaryDetailPage({ params }: GlossaryDetailPageProps) {
  const { slug } = await params;
  const term = await getGlossaryBySlug(slug);
  if (!term) notFound();

  // Get all terms for related-terms resolution (fetch all via large pageSize)
  const { items: allTerms } = await getAllGlossaryTerms(undefined, 1, 10000);

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12">
      <Breadcrumb
        items={[
          { label: "佛学词典", href: "/dictionary" },
          { label: term.term },
        ]}
      />

      {/* Term Header */}
      <div className="mb-10">
        <div className="flex items-start justify-between gap-4 mb-3 flex-wrap">
          <h1 className="text-4xl font-bold font-[family-name:var(--font-serif)]">
            {term.term}
          </h1>
          <ShareButton type="dictionary" slug={slug} />
        </div>
        <div className="flex flex-wrap items-baseline gap-3 text-muted-foreground">
          {term.termSanskrit && (
            <span className="text-lg">{term.termSanskrit}</span>
          )}
          {term.termEn && <span className="text-sm">{term.termEn}</span>}
        </div>
      </div>

      <Separator className="mb-10" />

      {/* Definition */}
      <div className="prose prose-neutral max-w-none">
        <p className="text-lg leading-relaxed">{term.definition}</p>
      </div>

      {/* Related Terms */}
      <RelatedTerms
        terms={term.relatedTerms || []}
        allTerms={allTerms.map((t) => ({ slug: t.slug, term: t.term }))}
      />
    </div>
  );
}
