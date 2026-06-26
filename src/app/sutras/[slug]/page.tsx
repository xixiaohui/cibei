import { notFound } from "next/navigation";
import { readFile } from "fs/promises";
import path from "path";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getSutraBySlug } from "@/lib/sutras";
import { stripFrontmatter, extractHeadings } from "@/lib/mdx";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { SutraToc } from "@/components/sutra/sutra-toc";
import { SutraReader } from "@/components/sutra/sutra-reader";
import { SutraSectionNav } from "@/components/sutra/sutra-section-nav";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ShareButton } from "@/components/shared/share-button";
import { FavoriteButton } from "@/components/shared/favorite-button";
import { isFavorited } from "@/lib/favorites-actions";
import { ExternalLink } from "lucide-react";
import { generateSeo } from "@/lib/seo";
import type { Metadata } from "next";
import type { TocHeading } from "@/lib/mdx";

interface SutraDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: SutraDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
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

function headingId(text: string): string {
  return `s-${text
    .replace(/[^一-鿿\w]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase()}`;
}

export default async function SutraDetailPage({ params }: SutraDetailPageProps) {
  const { slug } = await params;
  if (!/^[a-z0-9-]+$/.test(slug)) notFound();
  const sutra = await getSutraBySlug(slug);
  if (!sutra) notFound();

  const favorited = await isFavorited("sutra", slug);

  // Read MDX and process
  let mdxSource: string | null = null;
  let headings: TocHeading[] = [];
  try {
    const filePath = path.join(process.cwd(), "content", "sutras", `${slug}.mdx`);
    const raw = await readFile(filePath, "utf-8");
    headings = extractHeadings(raw);
    mdxSource = stripFrontmatter(raw);
  } catch {
    // File not found — handled in render
  }

  // Custom components for MDX: add stable IDs to headings
  const mdxComponents = {
    h2: (props: React.HTMLAttributes<HTMLHeadingElement>) => {
      const text = String(props.children || "");
      const id = headingId(text);
      return <h2 id={id} {...props} />;
    },
    h3: (props: React.HTMLAttributes<HTMLHeadingElement>) => {
      const text = String(props.children || "");
      const id = headingId(text);
      return <h3 id={id} {...props} />;
    },
  };

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
          {sutra.translator && <Badge variant="outline">{sutra.translator}译</Badge>}
          <div className="ml-auto flex items-center gap-1">
            <FavoriteButton type="sutra" slug={slug} title={sutra.title} subtitle={sutra.category ?? undefined} initialFavorited={favorited} />
            <ShareButton type="sutra" slug={slug} />
          </div>
        </div>

        {/* External full-text links */}
        {(sutra.cbetaId || sutra.satId) && (
          <div className="flex flex-wrap gap-3 mb-4">
            {sutra.cbetaId && (
              <a
                href={`https://cbetaonline.dila.edu.tw/zh/${sutra.cbetaId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm text-accent hover:underline"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                CBETA 全文
              </a>
            )}
            {sutra.satId && (
              <a
                href={`https://21dzk.l.u-tokyo.ac.jp/SAT/${sutra.satId}.html`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm text-accent hover:underline"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                SAT 全文
              </a>
            )}
          </div>
        )}
        {sutra.summary && (
          <p className="text-muted-foreground max-w-2xl">{sutra.summary}</p>
        )}
      </div>

      <Separator className="mb-10" />

      {/* Content: Sidebar + Main */}
      <div className="flex gap-12">
        {/* Sidebar — TOC (server-rendered, no flash) */}
        <aside className="hidden lg:block w-56 shrink-0">
          <div className="sticky top-24">
            <SutraToc headings={headings} />
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          {mdxSource ? (
            <>
              <SutraReader>
                <MDXRemote source={mdxSource} components={mdxComponents} />
              </SutraReader>
              <SutraSectionNav />
            </>
          ) : (
            <p className="text-muted-foreground">经文内容即将上线。</p>
          )}
        </div>
      </div>
    </div>
  );
}
