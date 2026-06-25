import { db } from "@/db";
import { encyclopedia } from "@/db/schema/encyclopedia";
import { eq, count } from "drizzle-orm";
import { type PaginatedResult, DEFAULT_PAGE_SIZE } from "@/lib/pagination";

export async function getAllEncyclopediaEntries(
  category?: string,
  page = 1,
  pageSize = DEFAULT_PAGE_SIZE
): Promise<PaginatedResult<typeof encyclopedia.$inferSelect>> {
  const where = category ? eq(encyclopedia.category, category) : undefined;

  const [{ value: total }] = await db
    .select({ value: count() })
    .from(encyclopedia)
    .where(where);

  const items = await db
    .select()
    .from(encyclopedia)
    .where(where)
    .orderBy(encyclopedia.title)
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

export async function getEncyclopediaBySlug(slug: string) {
  const result = await db
    .select()
    .from(encyclopedia)
    .where(eq(encyclopedia.slug, slug))
    .limit(1);
  return result[0] ?? null;
}

export async function getEncyclopediaCategories() {
  const result = await db
    .selectDistinct({ category: encyclopedia.category })
    .from(encyclopedia);
  return result.map((r) => r.category).filter(Boolean) as string[];
}
