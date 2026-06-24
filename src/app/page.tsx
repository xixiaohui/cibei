import { Suspense } from "react";
import { HomeHero } from "@/components/home/hero";
import { DailySutra } from "@/components/home/daily-sutra";
import { FeaturedSection } from "@/components/home/featured-section";
import { getAllSutras } from "@/lib/sutras";
import { getAllGlossaryTerms } from "@/lib/glossary";
import { SutraCard } from "@/components/sutra/sutra-card";
import { GlossaryCard } from "@/components/dictionary/glossary-card";
import { generateSeo } from "@/lib/seo";
import type { Metadata } from "next";

export const metadata: Metadata = generateSeo({
  title: "慈悲空间 — 现代佛学研究与经典学习平台",
  description:
    "深入经藏，智慧如海。慈悲空间是一个现代化佛学研究与学习平台，提供佛经原文阅读、佛学词典、百科知识库等功能。",
  canonical: "/",
});

export default async function HomePage() {
  const [latestSutras, featuredTerms] = await Promise.all([
    getAllSutras(),
    getAllGlossaryTerms(),
  ]);

  // Show first 3 sutras and first 3 glossary terms
  const displaySutras = latestSutras.slice(0, 3);
  const displayTerms = featuredTerms.slice(0, 3);

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
