"use client";

import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState, type FormEvent } from "react";

export function SearchBar() {
  const [q, setQ] = useState("");
  const router = useRouter();

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (q.trim()) {
      router.push(`/search?q=${encodeURIComponent(q.trim())}`);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="relative w-full max-w-sm">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        type="search"
        placeholder="搜索经典、术语、百科..."
        value={q}
        onChange={(e) => setQ(e.target.value)}
        className="pl-10"
      />
    </form>
  );
}
