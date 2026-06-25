import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

interface GlossaryCardProps {
  slug: string;
  term: string;
  termEn?: string | null;
  termSanskrit?: string | null;
  definition: string;
}

export function GlossaryCard({ slug, term, termEn, termSanskrit, definition }: GlossaryCardProps) {
  return (
    <Link href={`/dictionary/${slug}`}>
      <Card className="h-full hover:border-accent/30 transition-colors">
        <CardHeader>
          <div className="flex items-baseline gap-2 flex-wrap">
            <CardTitle className="text-lg md:text-xl font-[family-name:var(--font-serif)]">{term}</CardTitle>
            {termSanskrit && (
              <span className="text-sm text-muted-foreground">{termSanskrit}</span>
            )}
          </div>
          {termEn && (
            <CardDescription className="text-sm">{termEn}</CardDescription>
          )}
          <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
            {definition}
          </p>
        </CardHeader>
      </Card>
    </Link>
  );
}
