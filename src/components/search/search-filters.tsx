"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Badge } from "@/components/ui/badge";

const FILTERS = [
  { key: "all", label: "全部" },
  { key: "sutras", label: "经典" },
  { key: "glossary", label: "词典" },
  { key: "encyclopedia", label: "百科" },
] as const;

export function SearchFilters({ activeType }: { activeType?: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const q = searchParams.get("q") || "";

  function setType(type: string | null) {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (type && type !== "all") params.set("type", type);
    router.push(`/search?${params.toString()}`);
  }

  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {FILTERS.map((f) => {
        const isActive =
          f.key === "all" ? !activeType : activeType === f.key;
        return (
          <Badge
            key={f.key}
            variant={isActive ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => setType(f.key)}
          >
            {f.label}
          </Badge>
        );
      })}
    </div>
  );
}
