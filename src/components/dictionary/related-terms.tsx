import Link from "next/link";
import { Badge } from "@/components/ui/badge";

interface RelatedTermsProps {
  terms: string[];
  allTerms: Array<{ slug: string; term: string }>;
}

export function RelatedTerms({ terms, allTerms }: RelatedTermsProps) {
  if (!terms || terms.length === 0) return null;

  return (
    <div className="mt-8">
      <h3 className="text-sm font-semibold mb-3">相关词条</h3>
      <div className="flex flex-wrap gap-2">
        {terms.map((t) => {
          const match = allTerms.find((at) => at.term === t);
          if (match) {
            return (
              <Link key={t} href={`/dictionary/${match.slug}`}>
                <Badge variant="secondary" className="hover:bg-accent-soft transition-colors cursor-pointer">
                  {t}
                </Badge>
              </Link>
            );
          }
          return (
            <Badge key={t} variant="outline">
              {t}
            </Badge>
          );
        })}
      </div>
    </div>
  );
}
