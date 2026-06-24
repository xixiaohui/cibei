"use client";

import { useRouter, useSearchParams } from "next/navigation";

// Chinese doesn't have A-Z — use common initial characters
const INDEX_LETTERS = [
  "般", "菩", "空", "缘", "涅", "禅", "法", "佛", "无", "如",
];

export function GlossaryIndex({ activeLetter }: { activeLetter?: string }) {
  const router = useRouter();

  function setLetter(letter: string | null) {
    const params = new URLSearchParams();
    if (letter) params.set("letter", letter);
    router.push(`/dictionary?${params.toString()}`);
  }

  return (
    <div className="flex flex-wrap gap-1.5 mb-8">
      <button
        onClick={() => setLetter(null)}
        className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
          !activeLetter
            ? "bg-foreground text-background"
            : "bg-muted hover:bg-muted-foreground/20"
        }`}
      >
        全部
      </button>
      {INDEX_LETTERS.map((letter) => (
        <button
          key={letter}
          onClick={() => setLetter(letter)}
          className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
            activeLetter === letter
              ? "bg-foreground text-background"
              : "bg-muted hover:bg-muted-foreground/20"
          }`}
        >
          {letter}
        </button>
      ))}
    </div>
  );
}
