import { notFound } from "next/navigation";
import Link from "next/link";
import { getLearningPathBySlug, getPathSteps } from "@/lib/learning-paths";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ProseReader } from "@/components/shared/prose-reader";
import { CheckCircle2, BookOpen, FileText } from "lucide-react";
import { generateSeo } from "@/lib/seo";
import type { Metadata } from "next";

interface PathDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PathDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const path = await getLearningPathBySlug(slug);
  if (!path) return { title: "未找到" };
  return generateSeo({
    title: `${path.title} — 学习路径`,
    description: path.description.slice(0, 160),
    canonical: `/paths/${slug}`,
  });
}

export default async function PathDetailPage({ params }: PathDetailPageProps) {
  const { slug } = await params;
  const path = await getLearningPathBySlug(slug);
  if (!path) notFound();

  const steps = await getPathSteps(path.id);

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12">
      <Breadcrumb
        items={[
          { label: "学习路径", href: "/paths" },
          { label: path.title },
        ]}
      />

      {/* Header */}
      <header className="mb-12 mt-4">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-4xl">{path.icon}</span>
          <Badge variant="secondary">{path.levelLabel}</Badge>
          <span className="text-sm text-muted-foreground">
            {path.stepCount} 个学习步骤
          </span>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 font-[family-name:var(--font-serif)]">
          {path.title}
        </h1>
        <p className="text-lg text-muted-foreground">{path.description}</p>
      </header>

      <Separator className="mb-12" />

      {/* Steps */}
      <div className="space-y-12">
        {steps.map((step) => (
          <section key={step.id} className="relative pl-10">
            {/* Step number indicator */}
            <div className="absolute left-0 top-1 w-7 h-7 rounded-full bg-accent/10 flex items-center justify-center">
              <span className="text-xs font-bold text-accent tabular-nums">
                {step.stepNumber}
              </span>
            </div>

            <h2 className="text-2xl font-bold mb-3 font-[family-name:var(--font-serif)]">
              {step.title}
            </h2>

            <ProseReader>
              <p>{step.description}</p>
            </ProseReader>

            {/* Guidance */}
            {step.guidance && (
              <div className="mt-4 p-4 rounded-lg bg-muted/50 border border-border/50">
                <p className="text-sm text-muted-foreground flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-accent mt-0.5 shrink-0" />
                  <span>{step.guidance}</span>
                </p>
              </div>
            )}

            {/* Related links */}
            {(step.relatedSutraSlugs?.length ||
              step.relatedTermSlugs?.length) && (
              <div className="mt-4 flex flex-wrap gap-4 text-sm">
                {step.relatedSutraSlugs?.length ? (
                  <span className="inline-flex items-center gap-1 text-muted-foreground">
                    <BookOpen className="h-3.5 w-3.5" />
                    相关经典：
                    {step.relatedSutraSlugs.map((s, i) => (
                      <span key={s}>
                        <Link
                          href={`/sutras/${s}`}
                          className="text-accent hover:underline"
                        >
                          第{i + 1}部
                        </Link>
                        {i < step.relatedSutraSlugs!.length - 1 && "、"}
                      </span>
                    ))}
                  </span>
                ) : null}
                {step.relatedTermSlugs?.length ? (
                  <span className="inline-flex items-center gap-1 text-muted-foreground">
                    <FileText className="h-3.5 w-3.5" />
                    相关术语：
                    {step.relatedTermSlugs.map((t, i) => (
                      <span key={t}>
                        <Link
                          href={`/dictionary/${t}`}
                          className="text-accent hover:underline"
                        >
                          第{i + 1}个
                        </Link>
                        {i < step.relatedTermSlugs!.length - 1 && "、"}
                      </span>
                    ))}
                  </span>
                ) : null}
              </div>
            )}
          </section>
        ))}
      </div>

      {/* Back */}
      <div className="mt-16 pt-8 border-t border-border/30">
        <Link
          href="/paths"
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          ← 返回学习路径
        </Link>
      </div>
    </div>
  );
}
