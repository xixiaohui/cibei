import { db } from "@/db";
import { glossary } from "@/db/schema/glossary";
import { eq, ilike } from "drizzle-orm";

export async function getAllGlossaryTerms(letter?: string) {
  if (letter) {
    return db
      .select()
      .from(glossary)
      .where(ilike(glossary.term, `${letter}%`))
      .orderBy(glossary.term);
  }
  return db.select().from(glossary).orderBy(glossary.term);
}

export async function getGlossaryBySlug(slug: string) {
  const result = await db
    .select()
    .from(glossary)
    .where(eq(glossary.slug, slug))
    .limit(1);
  return result[0] ?? null;
}
