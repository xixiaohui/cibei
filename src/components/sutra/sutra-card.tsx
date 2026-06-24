import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Sutra } from "@/db/schema/sutras";

type SutraCardProps = Pick<Sutra, "slug" | "title" | "dynasty" | "translator" | "summary" | "category">;

export function SutraCard({ slug, title, dynasty, translator, summary, category }: SutraCardProps) {
  return (
    <Link href={`/sutras/${slug}`}>
      <Card className="h-full hover:border-accent/30 transition-colors">
        <CardHeader>
          <div className="flex items-start justify-between gap-2">
            <CardTitle className="text-lg leading-snug">{title}</CardTitle>
            {category && (
              <Badge variant="secondary" className="shrink-0 text-xs">
                {category}
              </Badge>
            )}
          </div>
          <CardDescription className="line-clamp-2 text-sm">
            {dynasty && translator ? `${dynasty} · ${translator}译` : summary}
          </CardDescription>
          {summary && (
            <p className="text-sm text-muted-foreground line-clamp-2 mt-2">
              {summary}
            </p>
          )}
        </CardHeader>
      </Card>
    </Link>
  );
}
