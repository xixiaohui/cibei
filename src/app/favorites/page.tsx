import Link from "next/link";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { getUserFavorites } from "@/lib/favorites-actions";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { EmptyState } from "@/components/shared/empty-state";
import { RemoveFavoriteButton } from "@/components/shared/remove-favorite-button";
import { Heart, BookOpen, FileText, ScrollText } from "lucide-react";
import { generateSeo } from "@/lib/seo";
import type { Metadata } from "next";

export const metadata: Metadata = generateSeo({
  title: "我的收藏",
  description: "收藏的经典、词条和故事，构建你的个人佛学图书馆。",
  canonical: "/favorites",
});

const TYPE_CONFIG: Record<string, { label: string; icon: typeof Heart; href: (slug: string) => string }> = {
  sutra: { label: "经典", icon: BookOpen, href: (s) => `/sutras/${s}` },
  glossary: { label: "词条", icon: FileText, href: (s) => `/dictionary/${s}` },
  story: { label: "故事", icon: ScrollText, href: (s) => `/stories/${s}` },
  encyclopedia: { label: "百科", icon: BookOpen, href: (s) => `/encyclopedia/${s}` },
};

export default async function FavoritesPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) redirect("/auth/login");

  const items = await getUserFavorites();

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
      <Breadcrumb items={[{ label: "我的收藏" }]} />

      <header className="mb-10 mt-4">
        <h1 className="text-4xl font-bold tracking-tight mb-3 font-[family-name:var(--font-serif)]">
          我的收藏
        </h1>
        <p className="text-muted-foreground">
          收藏的经典、词条和故事，构建你的个人佛学图书馆。
        </p>
      </header>

      {items.length === 0 ? (
        <EmptyState
          icon={<Heart className="h-12 w-12" />}
          title="暂无收藏"
          description="在经典、词典或故事详情页点击「收藏」按钮，即可加入你的个人图书馆。"
        />
      ) : (
        <div className="space-y-2">
          {items.map((item) => {
            const config = TYPE_CONFIG[item.type];
            const Icon = config?.icon ?? FileText;
            return (
              <div key={item.id} className="flex items-stretch gap-0">
                <Link
                  href={config?.href(item.slug) ?? "#"}
                  className="flex-1 min-w-0"
                >
                  <Card className="hover:border-accent/30 transition-colors h-full">
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <Icon className="h-4 w-4 text-muted-foreground shrink-0" />
                        <Badge variant="secondary" className="text-xs shrink-0">
                          {config?.label ?? item.type}
                        </Badge>
                        <CardTitle className="text-base leading-snug">
                          {item.title}
                        </CardTitle>
                        {item.subtitle && (
                          <CardDescription className="text-xs shrink-0">
                            {item.subtitle}
                          </CardDescription>
                        )}
                      </div>
                    </CardHeader>
                  </Card>
                </Link>
                <div className="flex items-center pl-1">
                  <RemoveFavoriteButton id={item.id} />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
