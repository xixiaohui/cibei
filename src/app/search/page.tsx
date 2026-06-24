import { Suspense } from "react";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { SearchResultItem } from "@/components/search/search-result-item";
import { SearchFilters } from "@/components/search/search-filters";
import { EmptyState } from "@/components/shared/empty-state";
import { Search } from "lucide-react";
import { generateSeo } from "@/lib/seo";
import type { Metadata } from "next";

export const metadata: Metadata = generateSeo({
  title: "搜索",
  description: "搜索慈悲空间的经典、词典和百科内容。",
  canonical: "/search",
});

interface SearchResult {
  type: string;
  slug: string;
  title: string;
  excerpt: string;
  category?: string | null;
}

interface SearchPageProps {
  searchParams: Promise<{ q?: string; type?: string }>;
}

async function SearchResults({ q, type }: { q: string; type?: string }) {
  const params = new URLSearchParams({ q });
  if (type) params.set("type", type);

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  let results: SearchResult[] = [];
  let error: string | null = null;

  try {
    const res = await fetch(`${baseUrl}/api/search?${params.toString()}`, {
      cache: "no-store",
    });
    const data = await res.json();
    results = data.results;
  } catch {
    error = "搜索服务暂不可用，请稍后再试。";
  }

  if (error) {
    return (
      <EmptyState
        icon={<Search className="h-12 w-12" />}
        title="搜索出错"
        description={error}
      />
    );
  }

  if (results.length === 0) {
    return (
      <EmptyState
        icon={<Search className="h-12 w-12" />}
        title="未找到结果"
        description={`未找到与 "${q}" 相关的内容，请尝试其他关键词。`}
      />
    );
  }

  return (
    <div className="space-y-4">
      {results.map((r, i) => (
        <SearchResultItem key={`${r.type}-${r.slug}-${i}`} {...r} />
      ))}
    </div>
  );
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q, type } = await searchParams;

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12">
      <Breadcrumb items={[{ label: "搜索" }]} />

      <div className="mb-10">
        <h1 className="text-4xl font-bold tracking-tight mb-3">搜索</h1>
        {q && (
          <p className="text-lg text-muted-foreground">
            关于 "<span className="font-medium text-foreground">{q}</span>" 的搜索结果
          </p>
        )}
      </div>

      {!q ? (
        <EmptyState
          icon={<Search className="h-12 w-12" />}
          title="输入关键词开始搜索"
          description="通过顶部搜索框搜索经典、术语和百科内容。"
        />
      ) : (
        <>
          <Suspense fallback={null}>
            <SearchFilters activeType={type} />
          </Suspense>
          <Suspense fallback={<p className="text-muted-foreground">搜索中...</p>}>
            <SearchResults q={q} type={type} />
          </Suspense>
        </>
      )}
    </div>
  );
}
