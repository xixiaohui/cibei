import { notFound } from "next/navigation";
import Link from "next/link";
import { getStoryBySlug } from "@/lib/stories";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ShareButton } from "@/components/shared/share-button";
import { generateSeo } from "@/lib/seo";
import type { Metadata } from "next";

interface StoryDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: StoryDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const story = await getStoryBySlug(slug);
  if (!story) return { title: "未找到" };

  return generateSeo({
    title: `${story.title} — 佛经故事`,
    description: story.summary.slice(0, 160),
    canonical: `/stories/${slug}`,
    ogType: "article",
  });
}

function estimateReadTime(text: string): number {
  return Math.max(1, Math.ceil(text.replace(/\s/g, "").length / 400));
}

export default async function StoryDetailPage({ params }: StoryDetailPageProps) {
  const { slug } = await params;
  const story = await getStoryBySlug(slug);
  if (!story) notFound();

  const paragraphs = story.content
    .split("\n")
    .map((p) => p.trim())
    .filter(Boolean);
  const [firstParagraph, ...restParagraphs] = paragraphs;
  const readMinutes = estimateReadTime(story.content + story.moral);

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12">
      <Breadcrumb
        items={[
          { label: "佛经故事", href: "/stories" },
          { label: story.title },
        ]}
      />

      {/* ===== Story Header ===== */}
      <header className="mb-12 mt-8">
        {/* Meta row */}
        <div className="flex items-center gap-3 mb-6 flex-wrap">
          <Badge className="text-xs">{story.category}</Badge>
          {story.sourceSutra && (
            <span className="text-sm text-muted-foreground/70">
              出自《{story.sourceSutra}》
            </span>
          )}
          <span className="text-xs text-muted-foreground/50">
            · 阅读约 {readMinutes} 分钟
          </span>
          <div className="ml-auto">
            <ShareButton type="story" slug={slug} />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 font-[family-name:var(--font-serif)] leading-tight">
          {story.title}
        </h1>

        {/* Summary — larger, subtitle style */}
        <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl">
          {story.summary}
        </p>
      </header>

      {/* Decorative divider */}
      <div className="flex items-center gap-4 mb-12">
        <div className="h-px flex-1 bg-border/50" />
        <div className="w-1.5 h-1.5 rounded-full bg-accent/40" />
        <div className="w-1.5 h-1.5 rounded-full bg-accent/30" />
        <div className="w-1.5 h-1.5 rounded-full bg-accent/20" />
        <div className="h-px flex-1 bg-border/50" />
      </div>

      {/* ===== Story Content ===== */}
      <div className="max-w-none">
        {/* First paragraph — drop cap */}
        {firstParagraph && (
          <p className="text-2xl leading-[2.1] my-5 font-[family-name:var(--font-serif)]">
            <span className="float-left text-7xl font-bold leading-[0.85] mr-3 mt-1 text-accent font-[family-name:var(--font-serif)]">
              {firstParagraph.charAt(0)}
            </span>
            {firstParagraph.slice(1)}
          </p>
        )}

        {/* Rest paragraphs */}
        {restParagraphs.map((paragraph, i) => (
          <p key={i} className="text-2xl leading-[2.1] my-5 font-[family-name:var(--font-serif)]">
            {paragraph}
          </p>
        ))}
      </div>

      {/* ===== Moral / Lesson ===== */}
      {story.moral && (
        <>
          <div className="flex items-center gap-4 my-14">
            <div className="h-px flex-1 bg-border/30" />
            <span className="text-xs text-muted-foreground/50 uppercase tracking-[0.2em] shrink-0">
              寓意
            </span>
            <div className="h-px flex-1 bg-border/30" />
          </div>

          <blockquote className="relative border-l-2 border-accent/30 pl-6 py-1 my-0 ml-0">
            <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-accent/30 rounded-full" />
            <div className="prose prose-neutral max-w-none">
              <p className="text-xl leading-[2.0] text-foreground/85 font-[family-name:var(--font-serif)]">
                {story.moral}
              </p>
            </div>
          </blockquote>
        </>
      )}

      {/* ===== Footer Nav ===== */}
      <div className="mt-16 pt-8 border-t border-border/30 flex items-center justify-between">
        <Link
          href="/stories"
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          ← 返回佛经故事
        </Link>
        <span className="text-xs text-muted-foreground/40">
          慈悲空间 · 佛经故事
        </span>
      </div>
    </div>
  );
}
