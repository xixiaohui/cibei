import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface EncyclopediaCardProps {
  slug: string;
  title: string;
  category: string | null;
  content: string;
}

export function EncyclopediaCard({ slug, title, category, content }: EncyclopediaCardProps) {
  return (
    <Link href={`/encyclopedia/${slug}`}>
      <Card className="h-full hover:border-accent/30 transition-colors">
        <CardHeader>
          <div className="flex items-start justify-between gap-2">
            <CardTitle className="text-lg leading-snug">{title}</CardTitle>
            {category && (
              <Badge variant="secondary" className="shrink-0">
                {category}
              </Badge>
            )}
          </div>
          <CardDescription className="line-clamp-3 text-sm">
            {content}
          </CardDescription>
        </CardHeader>
      </Card>
    </Link>
  );
}
