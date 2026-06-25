import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface StoryCardProps {
  slug: string;
  title: string;
  category: string;
  sourceSutra: string | null;
  summary: string;
}

export function StoryCard({ slug, title, category, sourceSutra, summary }: StoryCardProps) {
  return (
    <Link href={`/stories/${slug}`}>
      <Card className="h-full hover:border-accent/30 transition-colors">
        <CardHeader>
          <div className="flex items-start justify-between gap-2 mb-1">
            <CardTitle className="text-lg leading-snug">{title}</CardTitle>
            <Badge variant="secondary" className="shrink-0">
              {category}
            </Badge>
          </div>
          {sourceSutra && (
            <p className="text-xs text-muted-foreground">出自《{sourceSutra}》</p>
          )}
          <CardDescription className="line-clamp-3 text-sm">
            {summary}
          </CardDescription>
        </CardHeader>
      </Card>
    </Link>
  );
}
