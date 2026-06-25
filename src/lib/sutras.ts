import { db } from "@/db";
import { sutras } from "@/db/schema/sutras";
import { eq, sql, count, and, isNotNull } from "drizzle-orm";
import { type PaginatedResult, DEFAULT_PAGE_SIZE } from "@/lib/pagination";

export async function getAllSutras(
  category?: string,
  page = 1,
  pageSize = DEFAULT_PAGE_SIZE,
  hasExternal?: boolean
): Promise<PaginatedResult<typeof sutras.$inferSelect>> {
  const conditions = [];
  if (category) conditions.push(eq(sutras.category, category));
  if (hasExternal) conditions.push(isNotNull(sutras.cbetaId));
  const where = conditions.length > 0 ? and(...conditions) : undefined;

  const [{ value: total }] = await db
    .select({ value: count() })
    .from(sutras)
    .where(where);

  const items = await db
    .select()
    .from(sutras)
    .where(where)
    .orderBy(sutras.title)
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

export async function getSutraBySlug(slug: string) {
  const result = await db
    .select()
    .from(sutras)
    .where(eq(sutras.slug, slug))
    .limit(1);
  return result[0] ?? null;
}

export async function getSutraCategories() {
  const result = await db
    .selectDistinct({ category: sutras.category })
    .from(sutras)
    .where(sql`${sutras.category} IS NOT NULL`);
  return result.map((r) => r.category).filter(Boolean) as string[];
}
