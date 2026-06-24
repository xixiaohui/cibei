import { Suspense } from "react";
import { getAllEncyclopediaEntries, getEncyclopediaCategories } from "@/lib/encyclopedia";
import { EncyclopediaCard } from "@/components/encyclopedia/encyclopedia-card";
import { CategoryNav } from "@/components/encyclopedia/category-nav";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { EmptyState } from "@/components/shared/empty-state";
import { Library } from "lucide-react";
import { generateSeo } from "@/lib/seo";
import type { Metadata } from "next";

export const metadata: Metadata = generateSeo({
  title: "佛学百科",
  description: "探索佛学知识百科——涵盖人物、宗派、经典和历史事件。从龙树到玄奘，从天台宗到禅宗。",
  canonical: "/encyclopedia",
});

interface EncyclopediaPageProps {
  searchParams: Promise<{ category?: string }>;
}

export default async function EncyclopediaPage({ searchParams }: EncyclopediaPageProps) {
  const { category } = await searchParams;
  const [entries, categories] = await Promise.all([
    getAllEncyclopediaEntries(category),
    getEncyclopediaCategories(),
  ]);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      <Breadcrumb items={[{ label: "佛学百科" }]} />

      <div className="mb-10">
        <h1 className="text-4xl font-bold tracking-tight mb-3">佛学百科</h1>
        <p className="text-lg text-muted-foreground max-w-2xl">
          探索佛学的广阔世界——从历史人物到宗派传承，从经典要义到历史事件。
        </p>
      </div>

      <Suspense fallback={null}>
        <CategoryNav categories={categories} activeCategory={category} />
      </Suspense>

      {entries.length === 0 ? (
        <EmptyState
          icon={<Library className="h-12 w-12" />}
          title="暂无条目"
          description="该分类下暂无条目，请选择其他分类。"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {entries.map((e) => (
            <EncyclopediaCard key={e.id} {...e} />
          ))}
        </div>
      )}
    </div>
  );
}
