import { Suspense } from "react";
import { getAllSutras, getSutraCategories } from "@/lib/sutras";
import { SutraCard } from "@/components/sutra/sutra-card";
import { SutraCategoryFilter } from "@/components/sutra/sutra-category-filter";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { EmptyState } from "@/components/shared/empty-state";
import { BookOpen } from "lucide-react";
import type { Metadata } from "next";
import { generateSeo } from "@/lib/seo";

export const metadata: Metadata = generateSeo({
  title: "经典库",
  description: "浏览和阅读大乘佛教经典原文，包括金刚经、心经、法华经等核心佛经。支持按分类和朝代筛选。",
  canonical: "/sutras",
});

interface SutrasPageProps {
  searchParams: Promise<{ category?: string }>;
}

export default async function SutrasPage({ searchParams }: SutrasPageProps) {
  const { category } = await searchParams;
  const [sutras, categories] = await Promise.all([
    getAllSutras(category),
    getSutraCategories(),
  ]);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      <Breadcrumb items={[{ label: "经典库" }]} />

      <div className="mb-10">
        <h1 className="text-4xl font-bold tracking-tight mb-3">经典库</h1>
        <p className="text-lg text-muted-foreground max-w-2xl">
          深入经藏，智慧如海。浏览大乘佛教核心经典，阅读原文，对比版本。
        </p>
      </div>

      <Suspense fallback={null}>
        <SutraCategoryFilter categories={categories} activeCategory={category} />
      </Suspense>

      {sutras.length === 0 ? (
        <EmptyState
          icon={<BookOpen className="h-12 w-12" />}
          title="暂无经典"
          description="该分类下暂无经典，请选择其他分类。"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sutras.map((s) => (
            <SutraCard key={s.id} {...s} />
          ))}
        </div>
      )}
    </div>
  );
}
