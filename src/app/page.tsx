import { Suspense } from "react";
import { HomeHero } from "@/components/home/hero";
import { DailySutra } from "@/components/home/daily-sutra";
import { FeaturedSection } from "@/components/home/featured-section";
import { getAllSutras } from "@/lib/sutras";
import { getAllGlossaryTerms } from "@/lib/glossary";
import { getAllStories } from "@/lib/stories";
import { SutraCard } from "@/components/sutra/sutra-card";
import { GlossaryCard } from "@/components/dictionary/glossary-card";
import { StoryCard } from "@/components/story/story-card";
import { generateSeo } from "@/lib/seo";
import type { Metadata } from "next";

export const metadata: Metadata = generateSeo({
  title: "慈悲空间 — 现代佛学研究与经典学习平台",
  description:
    "深入经藏，智慧如海。慈悲空间是一个现代化佛学研究与学习平台，提供佛经原文阅读、佛学词典、百科知识库、佛经故事等功能。",
  canonical: "/",
});

export default async function HomePage() {
  const [sutraResult, glossaryResult, storyResult] = await Promise.all([
    getAllSutras(undefined, 1, 3),
    getAllGlossaryTerms(undefined, 1, 3),
    getAllStories(undefined, 1, 3),
  ]);

  const displaySutras = sutraResult.items;
  const displayTerms = glossaryResult.items;
  const displayStories = storyResult.items;

  return (
    <>
      <HomeHero />

      <Suspense fallback={null}>
        <DailySutra />
      </Suspense>

      <FeaturedSection
        title="经典库"
        description="浏览大乘佛教核心经典，阅读原文"
        href="/sutras"
        linkLabel="浏览全部经典"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {displaySutras.map((s) => (
            <SutraCard key={s.id} {...s} />
          ))}
        </div>
      </FeaturedSection>

      <FeaturedSection
        title="佛经故事"
        description="从本生、因缘到禅宗公案，在故事中领悟佛法智慧"
        href="/stories"
        linkLabel="浏览全部故事"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {displayStories.map((s) => (
            <StoryCard key={s.id} {...s} />
          ))}
        </div>
      </FeaturedSection>

      <FeaturedSection
        title="佛学词典"
        description="精确的术语解释，含梵文和英文对应"
        href="/dictionary"
        linkLabel="浏览全部词条"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {displayTerms.map((t) => (
            <GlossaryCard key={t.id} {...t} />
          ))}
        </div>
      </FeaturedSection>
    </>
  );
}
