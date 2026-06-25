import { db } from "@/db";
import { glossary } from "@/db/schema/glossary";
import { eq, ilike, count } from "drizzle-orm";
import { type PaginatedResult, DEFAULT_PAGE_SIZE } from "@/lib/pagination";

export async function getAllGlossaryTerms(
  letter?: string,
  page = 1,
  pageSize = DEFAULT_PAGE_SIZE
): Promise<PaginatedResult<typeof glossary.$inferSelect>> {
  const where = letter ? ilike(glossary.term, `${letter}%`) : undefined;

  const [{ value: total }] = await db
    .select({ value: count() })
    .from(glossary)
    .where(where);

  const items = await db
    .select()
    .from(glossary)
    .where(where)
    .orderBy(glossary.term)
    .limit(pageSize)
    .offset((page - 1) * pageSize);

  return {
    items,
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  };
}

export async function getGlossaryBySlug(slug: string) {
  const result = await db
    .select()
    .from(glossary)
    .where(eq(glossary.slug, slug))
    .limit(1);
  return result[0] ?? null;
}
