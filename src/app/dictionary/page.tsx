import { Suspense } from "react";
import { getAllGlossaryTerms } from "@/lib/glossary";
import { GlossaryCard } from "@/components/dictionary/glossary-card";
import { GlossaryIndex } from "@/components/dictionary/glossary-index";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { EmptyState } from "@/components/shared/empty-state";
import { BookOpen } from "lucide-react";
import { generateSeo } from "@/lib/seo";
import type { Metadata } from "next";

export const metadata: Metadata = generateSeo({
  title: "佛学词典",
  description: "查阅佛学术语和名相解释，包含梵文对应和英文翻译。涵盖般若、菩提、空性等核心概念。",
  canonical: "/dictionary",
});

interface DictionaryPageProps {
  searchParams: Promise<{ letter?: string }>;
}

export default async function DictionaryPage({ searchParams }: DictionaryPageProps) {
  const { letter } = await searchParams;
  const terms = await getAllGlossaryTerms(letter);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      <Breadcrumb items={[{ label: "佛学词典" }]} />

      <div className="mb-10">
        <h1 className="text-4xl font-bold tracking-tight mb-3">佛学词典</h1>
        <p className="text-lg text-muted-foreground max-w-2xl">
          探索佛学术语的精确定义。每个词条包含中文释义、梵文原文和英文对应。
        </p>
      </div>

      <Suspense fallback={null}>
        <GlossaryIndex activeLetter={letter} />
      </Suspense>

      {terms.length === 0 ? (
        <EmptyState
          icon={<BookOpen className="h-12 w-12" />}
          title="暂无词条"
          description="该字头下暂无词条，请选择其他字头。"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {terms.map((t) => (
            <GlossaryCard key={t.id} {...t} />
          ))}
        </div>
      )}
    </div>
  );
}
