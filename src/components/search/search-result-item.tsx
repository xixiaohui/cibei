import Link from "next/link";
import { Badge } from "@/components/ui/badge";

const TYPE_LABELS: Record<string, string> = {
  sutra: "经典",
  glossary: "词典",
  encyclopedia: "百科",
};

const TYPE_HREFS: Record<string, (slug: string) => string> = {
  sutra: (s) => `/sutras/${s}`,
  glossary: (s) => `/dictionary/${s}`,
  encyclopedia: (s) => `/encyclopedia/${s}`,
};

interface SearchResultItemProps {
  type: string;
  slug: string;
  title: string;
  excerpt: string;
  category?: string | null;
}

export function SearchResultItem({ type, slug, title, excerpt, category }: SearchResultItemProps) {
  return (
    <Link
      href={TYPE_HREFS[type]?.(slug) ?? "#"}
      className="block p-6 rounded-lg border border-border hover:border-accent/30 transition-colors"
    >
      <div className="flex items-center gap-2 mb-2">
        <Badge variant="outline" className="text-xs">
          {TYPE_LABELS[type] ?? type}
        </Badge>
        {category && (
          <Badge variant="secondary" className="text-xs">
            {category}
          </Badge>
        )}
      </div>
      <h3 className="text-lg font-semibold mb-1">{title}</h3>
      <p className="text-sm text-muted-foreground line-clamp-2">{excerpt}</p>
    </Link>
  );
}
