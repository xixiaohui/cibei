import { type ReactNode } from "react";

interface SutraReaderProps {
  children: ReactNode;
}

export function SutraReader({ children }: SutraReaderProps) {
  return (
    <article
      className="sutra-content prose prose-neutral max-w-none
        prose-headings:font-[family-name:var(--font-serif)] prose-headings:font-bold prose-headings:scroll-mt-24
        prose-h2:text-2xl prose-h2:mt-16 prose-h2:mb-6 prose-h2:pb-3 prose-h2:border-b prose-h2:border-border/50
        prose-h3:text-xl prose-h3:mt-10 prose-h3:mb-4
        prose-p:text-lg prose-p:leading-[2.4] prose-p:my-5 prose-p:font-[family-name:var(--font-serif)]
        prose-blockquote:border-l-accent prose-blockquote:bg-muted/30 prose-blockquote:py-1 prose-blockquote:px-4
        prose-blockquote:font-[family-name:var(--font-serif)]
        prose-strong:font-bold prose-strong:text-foreground
        prose-em:italic prose-em:text-muted-foreground
      "
    >
      {children}
    </article>
  );
}
