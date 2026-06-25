import { notFound } from "next/navigation";
import { readFile } from "fs/promises";
import path from "path";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getSutraBySlug } from "@/lib/sutras";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { SutraToc } from "@/components/sutra/sutra-toc";
import { SutraReader } from "@/components/sutra/sutra-reader";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ShareButton } from "@/components/shared/share-button";
import { generateSeo } from "@/lib/seo";
import type { Metadata } from "next";

interface SutraDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: SutraDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  // Validate slug format — only allow lowercase letters, digits, and hyphens
  if (!/^[a-z0-9-]+$/.test(slug)) return { title: "未找到" };
  const sutra = await getSutraBySlug(slug);
  if (!sutra) return { title: "未找到" };

  return generateSeo({
    title: sutra.title,
    description: sutra.summary || `${sutra.title}原文阅读`,
    canonical: `/sutras/${slug}`,
    ogType: "article",
  });
}

export default async function SutraDetailPage({ params }: SutraDetailPageProps) {
  const { slug } = await params;
  // Validate slug format — only allow lowercase letters, digits, and hyphens
  if (!/^[a-z0-9-]+$/.test(slug)) notFound();
  const sutra = await getSutraBySlug(slug);
  if (!sutra) notFound();

  // Read MDX file content from disk (server component — fs is available)
  let mdxSource: string | null = null;
  try {
    const filePath = path.join(process.cwd(), "content", "sutras", `${slug}.mdx`);
    mdxSource = await readFile(filePath, "utf-8");
  } catch {
    // File not found — handled in render
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      <Breadcrumb
        items={[
          { label: "经典库", href: "/sutras" },
          { label: sutra.title },
        ]}
      />

      {/* Sutra Header */}
      <div className="mb-10">
        <h1 className="text-4xl font-bold tracking-tight mb-4 font-[family-name:var(--font-serif)]">
          {sutra.title}
        </h1>
        {sutra.titleEn && (
          <p className="text-lg text-muted-foreground mb-4">{sutra.titleEn}</p>
        )}
        <div className="flex flex-wrap gap-2 mb-4 items-center">
          {sutra.category && <Badge variant="secondary">{sutra.category}</Badge>}
          {sutra.dynasty && <Badge variant="outline">{sutra.dynasty}</Badge>}
          <div className="ml-auto">
            <ShareButton type="sutra" slug={slug} />
          </div>
          {sutra.translator && <Badge variant="outline">{sutra.translator}译</Badge>}
        </div>
        {sutra.summary && (
          <p className="text-muted-foreground max-w-2xl">{sutra.summary}</p>
        )}
      </div>

      <Separator className="mb-10" />

      {/* Content: Sidebar + Main */}
      <div className="flex gap-12">
        {/* Sidebar — TOC */}
        <aside className="hidden lg:block w-56 shrink-0">
          <div className="sticky top-24">
            <SutraToc />
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          {mdxSource ? (
            <SutraReader>
              <MDXRemote source={mdxSource} />
            </SutraReader>
          ) : (
            <p className="text-muted-foreground">经文内容即将上线。</p>
          )}
        </div>
      </div>
    </div>
  );
}
