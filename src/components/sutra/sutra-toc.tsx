"use client";

import { useEffect, useState } from "react";
import type { TocHeading } from "@/lib/mdx";

interface SutraTocProps {
  headings: TocHeading[];
}

export function SutraToc({ headings }: SutraTocProps) {
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    const elements = document.querySelectorAll(
      ".sutra-content h2, .sutra-content h3"
    );

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const el = entry.target as HTMLElement;
            setActiveId(el.id);
            break;
          }
        }
      },
      { rootMargin: "-80px 0px -80% 0px" }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  if (headings.length === 0) return null;

  return (
    <nav className="text-sm" aria-label="目录导航">
      <h4 className="font-semibold mb-3 text-foreground">目录</h4>
      <ul className="space-y-1">
        {headings.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              className={`block py-1.5 transition-colors hover:text-accent leading-snug ${
                item.level === 3 ? "pl-3" : ""
              } ${
                activeId === item.id
                  ? "text-accent font-medium"
                  : "text-muted-foreground"
              }`}
            >
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
