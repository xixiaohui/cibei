"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function SutraSectionNav() {
  const [state, setState] = useState<{
    prev: string | null;
    next: string | null;
    prevText: string;
    nextText: string;
  }>({ prev: null, next: null, prevText: "", nextText: "" });

  useEffect(() => {
    const headings = Array.from(
      document.querySelectorAll(".sutra-content h2, .sutra-content h3")
    ) as HTMLElement[];

    if (headings.length < 2) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .map((e) => e.target as HTMLElement);

        if (visible.length === 0) return;

        const current = visible[0];
        const idx = headings.indexOf(current);

        setState({
          prev: idx > 0 ? `#${headings[idx - 1].id}` : null,
          next:
            idx < headings.length - 1 ? `#${headings[idx + 1].id}` : null,
          prevText: idx > 0 ? headings[idx - 1].textContent || "" : "",
          nextText:
            idx < headings.length - 1
              ? headings[idx + 1].textContent || ""
              : "",
        });
      },
      { rootMargin: "-80px 0px -80% 0px" }
    );

    headings.forEach((h) => observer.observe(h));
    return () => observer.disconnect();
  }, []);

  return (
    <nav
      className="flex justify-between items-start gap-4 mt-16 pt-8 border-t border-border"
      aria-label="段落导航"
    >
      <div className="flex-1 min-w-0">
        {state.prev && (
          <a
            href={state.prev}
            className="group flex flex-col text-sm hover:text-accent transition-colors"
          >
            <span className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
              <ChevronLeft className="h-3 w-3" />
              上一段
            </span>
            <span className="truncate">{state.prevText}</span>
          </a>
        )}
      </div>
      <div className="flex-1 min-w-0 text-right">
        {state.next && (
          <a
            href={state.next}
            className="group flex flex-col items-end text-sm hover:text-accent transition-colors"
          >
            <span className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
              下一段
              <ChevronRight className="h-3 w-3" />
            </span>
            <span className="truncate">{state.nextText}</span>
          </a>
        )}
      </div>
    </nav>
  );
}
