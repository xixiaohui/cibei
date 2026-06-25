import { type ReactNode } from "react";

interface ProseReaderProps {
  children: ReactNode;
  /** "default" = text-lg (18px), "large" = text-xl (20px) for story reading */
  size?: "default" | "large";
}

const sizeClasses = {
  default: "prose-p:text-lg prose-p:leading-[2.4]",
  large: "prose-p:text-2xl prose-p:leading-[2.1]",
};

/**
 * Shared prose reader for detail pages.
 * Serif paragraphs, generous line-height, styled headings.
 */
export function ProseReader({ children, size = "default" }: ProseReaderProps) {
  return (
    <div
      className={`prose prose-neutral max-w-none
        prose-headings:font-[family-name:var(--font-serif)] prose-headings:font-bold prose-headings:scroll-mt-24
        prose-h2:text-2xl prose-h2:mt-16 prose-h2:mb-6 prose-h2:pb-3 prose-h2:border-b prose-h2:border-border/50
        prose-h3:text-xl prose-h3:mt-10 prose-h3:mb-4
        ${sizeClasses[size]}
        prose-p:my-5 prose-p:font-[family-name:var(--font-serif)]
        prose-blockquote:border-l-accent prose-blockquote:bg-muted/30 prose-blockquote:py-1 prose-blockquote:px-4
        prose-blockquote:font-[family-name:var(--font-serif)]
        prose-strong:font-bold prose-strong:text-foreground
      `}
    >
      {children}
    </div>
  );
}
