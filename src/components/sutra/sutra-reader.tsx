import { type ReactNode } from "react";

interface SutraReaderProps {
  children: ReactNode;
}

export function SutraReader({ children }: SutraReaderProps) {
  return (
    <article className="sutra-content prose prose-neutral max-w-none
      prose-headings:font-serif prose-headings:font-bold
      prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-6
      prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-4
      prose-p:my-4 prose-p:leading-loose
      prose-blockquote:border-l-accent prose-blockquote:bg-muted/50 prose-blockquote:py-1 prose-blockquote:px-4
    ">
      {children}
    </article>
  );
}
