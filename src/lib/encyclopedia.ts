import { db } from "@/db";
import { encyclopedia } from "@/db/schema/encyclopedia";
import { eq } from "drizzle-orm";

export async function getAllEncyclopediaEntries(category?: string) {
  if (category) {
    return db
      .select()
      .from(encyclopedia)
      .where(eq(encyclopedia.category, category))
      .orderBy(encyclopedia.title);
  }
  return db.select().from(encyclopedia).orderBy(encyclopedia.title);
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
