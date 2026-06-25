import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink } from "lucide-react";
import type { Sutra } from "@/db/schema/sutras";

type SutraCardProps = Pick<
  Sutra,
  "slug" | "title" | "dynasty" | "translator" | "summary" | "category" | "cbetaId"
>;

export function SutraCard({
  slug,
  title,
  dynasty,
  translator,
  summary,
  category,
  cbetaId,
}: SutraCardProps) {
  return (
    <Link href={`/sutras/${slug}`}>
      <Card className="h-full hover:border-accent/30 transition-colors">
        <CardHeader>
          <div className="flex items-start justify-between gap-2 mb-1">
            <CardTitle className="text-lg leading-snug">{title}</CardTitle>
            <div className="flex items-center gap-1.5 shrink-0">
              {cbetaId && (
                <span className="inline-flex items-center gap-0.5 text-[10px] text-accent bg-accent-soft rounded-full px-1.5 py-0.5">
                  <ExternalLink className="h-2.5 w-2.5" />
                  全文
                </span>
              )}
              {category && (
                <Badge variant="secondary" className="text-xs">
                  {category}
                </Badge>
              )}
            </div>
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
