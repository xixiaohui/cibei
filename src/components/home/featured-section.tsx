import { type ReactNode } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface FeaturedSectionProps {
  title: string;
  description: string;
  href: string;
  linkLabel: string;
  children: ReactNode;
}

export function FeaturedSection({
  title,
  description,
  href,
  linkLabel,
  children,
}: FeaturedSectionProps) {
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 border-t border-border">
      <div className="flex items-end justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">{title}</h2>
          <p className="text-muted-foreground mt-2">{description}</p>
        </div>
        <Link
          href={href}
          className="hidden sm:flex items-center gap-1 text-sm font-medium text-accent hover:underline"
        >
          {linkLabel}
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
      {children}
      <Link
        href={href}
        className="sm:hidden flex items-center gap-1 text-sm font-medium text-accent hover:underline mt-4"
      >
        {linkLabel}
        <ArrowRight className="h-4 w-4" />
      </Link>
    </section>
  );
}
