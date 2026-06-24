"use client";

import { useEffect, useState } from "react";

interface TocItem {
  id: string;
  text: string;
  level: number;
}

export function SutraToc() {
  const [items, setItems] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    // Extract headings from the rendered sutra content
    const headings = document.querySelectorAll(".sutra-content h2, .sutra-content h3");
    const toc: TocItem[] = [];
    headings.forEach((h, i) => {
      const id = `section-${i}`;
      h.id = id;
      toc.push({
        id,
        text: h.textContent || "",
        level: h.tagName === "H2" ? 2 : 3,
      });
    });
    setItems(toc);

    // IntersectionObserver for active heading
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
            break;
          }
        }
      },
      { rootMargin: "-80px 0px -80% 0px" }
    );

    headings.forEach((h) => observer.observe(h));
    return () => observer.disconnect();
  }, []);

  if (items.length === 0) return null;

  return (
    <nav className="text-sm" aria-label="目录导航">
      <h4 className="font-semibold mb-3 text-foreground">目录</h4>
      <ul className="space-y-1.5">
        {items.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              className={`block py-1 transition-colors hover:text-accent ${
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
