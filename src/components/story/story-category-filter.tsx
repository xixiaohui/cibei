"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Badge } from "@/components/ui/badge";

interface StoryCategoryFilterProps {
  categories: string[];
  activeCategory?: string;
}

export function StoryCategoryFilter({ categories, activeCategory }: StoryCategoryFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function setCategory(cat: string | null) {
    const params = new URLSearchParams(searchParams.toString());
    if (cat) {
      params.set("category", cat);
    } else {
      params.delete("category");
    }
    router.push(`/stories?${params.toString()}`);
  }

  return (
    <div className="flex flex-wrap gap-2 mb-8">
      <Badge
        variant={!activeCategory ? "default" : "outline"}
        className="cursor-pointer"
        onClick={() => setCategory(null)}
      >
        全部
      </Badge>
      {categories.map((cat) => (
        <Badge
          key={cat}
          variant={activeCategory === cat ? "default" : "outline"}
          className="cursor-pointer"
          onClick={() => setCategory(cat)}
        >
          {cat}
        </Badge>
      ))}
    </div>
  );
}
