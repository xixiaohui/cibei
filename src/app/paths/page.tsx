import Link from "next/link";
import { getAllLearningPaths } from "@/lib/learning-paths";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import { generateSeo } from "@/lib/seo";
import type { Metadata } from "next";

export const metadata: Metadata = generateSeo({
  title: "学习路径",
  description:
    "从入门到深入的佛学课程式学习路径。结构化学习四圣谛、八正道、中观、唯识、禅修等核心教义。",
  canonical: "/paths",
});

export default async function PathsPage() {
  const paths = await getAllLearningPaths();

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-12">
      <Breadcrumb items={[{ label: "学习路径" }]} />

      <header className="mb-16 mt-4">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 font-[family-name:var(--font-serif)]">
          学习路径
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl">
          结构化的佛学课程——从入门到深入，每一步都有清晰的学习指引和阅读推荐。
        </p>
      </header>

      <div className="space-y-6">
        {paths.map((path) => (
          <Link key={path.id} href={`/paths/${path.slug}`}>
            <Card className="hover:border-accent/30 transition-colors group">
              <CardHeader>
                <div className="flex items-start gap-4 sm:gap-6">
                  {/* Icon */}
                  <div className="shrink-0 w-14 h-14 rounded-xl bg-accent/5 flex items-center justify-center text-3xl group-hover:bg-accent/10 transition-colors">
                    {path.icon}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1 flex-wrap">
                      <CardTitle className="text-xl">{path.title}</CardTitle>
                      <Badge variant="secondary" className="text-xs shrink-0">
                        {path.levelLabel}
                      </Badge>
                      <Badge variant="outline" className="text-xs shrink-0">
                        {path.stepCount} 步
                      </Badge>
                    </div>
                    <CardDescription className="text-sm leading-relaxed">
                      {path.description}
                    </CardDescription>
                  </div>

                  {/* Arrow */}
                  <div className="shrink-0 self-center text-muted-foreground/40 group-hover:text-accent transition-colors hidden sm:block">
                    <ArrowRight className="h-5 w-5" />
                  </div>
                </div>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
