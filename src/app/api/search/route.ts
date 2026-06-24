import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { sutras } from "@/db/schema/sutras";
import { glossary } from "@/db/schema/glossary";
import { encyclopedia } from "@/db/schema/encyclopedia";
import { sql, or, ilike } from "drizzle-orm";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q")?.trim();
  const type = searchParams.get("type"); // "sutras" | "glossary" | "encyclopedia" | undefined (all)

  if (!q) {
    return NextResponse.json({ results: [], total: 0 });
  }

  const results: Array<{
    type: string;
    slug: string;
    title: string;
    excerpt: string;
    category?: string | null;
  }> = [];

  if (!type || type === "sutras") {
    const sutraResults = await db
      .select({
        slug: sutras.slug,
        title: sutras.title,
        excerpt: sutras.summary,
        category: sutras.category,
      })
      .from(sutras)
      .where(
        or(
          ilike(sutras.title, `%${q}%`),
          sql`${sutras.summary} ILIKE ${`%${q}%`}`,
        )
      )
      .limit(10);

    results.push(
      ...sutraResults.map((s) => ({
        type: "sutra" as const,
        slug: s.slug,
        title: s.title,
        excerpt: s.excerpt ?? "",
        category: s.category,
      }))
    );
  }

  if (!type || type === "glossary") {
    const glossaryResults = await db
      .select({
        slug: glossary.slug,
        title: glossary.term,
        excerpt: glossary.definition,
        category: sql<string | null>`NULL`,
      })
      .from(glossary)
      .where(
        or(
          ilike(glossary.term, `%${q}%`),
          ilike(glossary.definition, `%${q}%`),
        )
      )
      .limit(10);

    results.push(
      ...glossaryResults.map((g) => ({
        type: "glossary" as const,
        slug: g.slug,
        title: g.title,
        excerpt: g.excerpt.slice(0, 200),
        category: null,
      }))
    );
  }

  if (!type || type === "encyclopedia") {
    const encyclopediaResults = await db
      .select({
        slug: encyclopedia.slug,
        title: encyclopedia.title,
        excerpt: encyclopedia.content,
        category: encyclopedia.category,
      })
      .from(encyclopedia)
      .where(
        or(
          ilike(encyclopedia.title, `%${q}%`),
          ilike(encyclopedia.content, `%${q}%`),
        )
      )
      .limit(10);

    results.push(
      ...encyclopediaResults.map((e) => ({
        type: "encyclopedia" as const,
        slug: e.slug,
        title: e.title,
        excerpt: e.excerpt.slice(0, 200),
        category: e.category,
      }))
    );
  }

  return NextResponse.json({ results, total: results.length });
}
