import { Suspense } from "react";
import { getAllStories, getStoryCategories } from "@/lib/stories";
import { StoryCard } from "@/components/story/story-card";
import { StoryCategoryFilter } from "@/components/story/story-category-filter";
import { Pagination } from "@/components/shared/pagination";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { EmptyState } from "@/components/shared/empty-state";
import { BookOpen } from "lucide-react";
import { DEFAULT_PAGE_SIZE } from "@/lib/pagination";
import { generateSeo } from "@/lib/seo";
import type { Metadata } from "next";

export const metadata: Metadata = generateSeo({
  title: "佛经故事",
  description: "探索佛教经典中的智慧故事——本生故事、因缘故事、譬喻故事、禅宗公案，以生动的方式理解佛法智慧。",
  canonical: "/stories",
});

interface StoriesPageProps {
  searchParams: Promise<{ category?: string; page?: string; pageSize?: string }>;
}

export default async function StoriesPage({ searchParams }: StoriesPageProps) {
  const { category, page: pageStr, pageSize: pageSizeStr } = await searchParams;
  const page = Math.max(1, parseInt(pageStr || "1", 10) || 1);
  const pageSize = parseInt(pageSizeStr || String(DEFAULT_PAGE_SIZE), 10) || DEFAULT_PAGE_SIZE;
  const [result, categories] = await Promise.all([
    getAllStories(category, page, pageSize),
    getStoryCategories(),
  ]);
  const { items: storiesList, total, totalPages } = result;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      <Breadcrumb items={[{ label: "佛经故事" }]} />

      <div className="mb-10">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">佛经故事</h1>
        <p className="text-lg text-muted-foreground max-w-2xl">
          佛教经典中蕴含着大量富有哲理和教育意义的故事。通过生动的叙事，领悟佛法智慧。
        </p>
      </div>

      <Suspense fallback={null}>
        <StoryCategoryFilter categories={categories} activeCategory={category} />
      </Suspense>

      {storiesList.length === 0 ? (
        <EmptyState
          icon={<BookOpen className="h-12 w-12" />}
          title="暂无故事"
          description="该分类下暂无故事，请选择其他分类。"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {storiesList.map((s) => (
            <StoryCard key={s.id} {...s} />
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <Pagination page={page} pageSize={pageSize} totalPages={totalPages} total={total} />
      )}
    </div>
  );
}
