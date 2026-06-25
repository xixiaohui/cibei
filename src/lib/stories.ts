import { db } from "@/db";
import { stories } from "@/db/schema/stories";
import { eq, count } from "drizzle-orm";
import { type PaginatedResult, DEFAULT_PAGE_SIZE } from "@/lib/pagination";

export async function getAllStories(
  category?: string,
  page = 1,
  pageSize = DEFAULT_PAGE_SIZE
): Promise<PaginatedResult<typeof stories.$inferSelect>> {
  const where = category ? eq(stories.category, category) : undefined;

  const [{ value: total }] = await db
    .select({ value: count() })
    .from(stories)
    .where(where);

  const items = await db
    .select()
    .from(stories)
    .where(where)
    .orderBy(stories.title)
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

export async function getStoryBySlug(slug: string) {
  const result = await db
    .select()
    .from(stories)
    .where(eq(stories.slug, slug))
    .limit(1);
  return result[0] ?? null;
}

export async function getStoryCategories() {
  const result = await db
    .selectDistinct({ category: stories.category })
    .from(stories);
  return result.map((r) => r.category).filter(Boolean) as string[];
}
