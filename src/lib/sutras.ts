import { db } from "@/db";
import { sutras } from "@/db/schema/sutras";
import { eq, sql } from "drizzle-orm";

export async function getAllSutras(category?: string) {
  if (category) {
    return db.select().from(sutras).where(eq(sutras.category, category)).orderBy(sutras.title);
  }
  return db.select().from(sutras).orderBy(sutras.title);
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
