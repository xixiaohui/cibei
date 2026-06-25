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
      <Card className="h-full hover:border-accent/30 transition-colors relative">
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
          {/* CBETA indicator */}
          {cbetaId && (
            <div className="absolute bottom-3 right-3">
              <span className="inline-flex items-center gap-1 text-[10px] text-accent/60 bg-accent/5 rounded-full px-2 py-0.5">
                <ExternalLink className="h-2.5 w-2.5" />
                全文
              </span>
            </div>
          )}
        </CardHeader>
      </Card>
    </Link>
  );
}
