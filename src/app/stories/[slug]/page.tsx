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

export default async function StoryDetailPage({ params }: StoryDetailPageProps) {
  const { slug } = await params;
  const story = await getStoryBySlug(slug);
  if (!story) notFound();

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12">
      <Breadcrumb
        items={[
          { label: "佛经故事", href: "/stories" },
          { label: story.title },
        ]}
      />

      {/* Story Header */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-3">
          <Badge>{story.category}</Badge>
          {story.sourceSutra && (
            <span className="text-sm text-muted-foreground">
              出自《{story.sourceSutra}》
            </span>
          )}
          <div className="ml-auto">
            <ShareButton type="story" slug={slug} />
          </div>
        </div>
        <h1 className="text-4xl font-bold tracking-tight mb-3">
          {story.title}
        </h1>
        <p className="text-lg text-muted-foreground">{story.summary}</p>
      </div>

      <Separator className="mb-10" />

      {/* Story Content */}
      <div className="prose prose-neutral max-w-none">
        {story.content.split("\n").map((paragraph, i) =>
          paragraph.trim() ? (
            <p key={i} className="text-lg leading-relaxed mb-4">
              {paragraph}
            </p>
          ) : null
        )}
      </div>

      {/* Moral / Lesson */}
      {story.moral && (
        <>
          <Separator className="my-10" />
          <div className="rounded-lg border border-accent/20 bg-accent-soft/50 p-6">
            <h2 className="text-sm font-semibold text-accent uppercase tracking-wider mb-3">
              故事寓意
            </h2>
            <p className="text-lg leading-relaxed text-foreground">
              {story.moral}
            </p>
          </div>
        </>
      )}

      {/* Back Link */}
      <div className="mt-12">
        <Link
          href="/stories"
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          ← 返回佛经故事
        </Link>
      </div>
    </div>
  );
}
