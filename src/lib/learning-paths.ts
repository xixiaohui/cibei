import { db } from "@/db";
import { learningPaths, pathSteps } from "@/db/schema/learning-paths";
import { eq, asc } from "drizzle-orm";

export async function getAllLearningPaths() {
  return db.select().from(learningPaths).orderBy(asc(learningPaths.level), asc(learningPaths.stepCount));
}

export async function getLearningPathBySlug(slug: string) {
  const result = await db
    .select()
    .from(learningPaths)
    .where(eq(learningPaths.slug, slug))
    .limit(1);
  return result[0] ?? null;
}

export async function getPathSteps(pathId: string) {
  const rows = await db
    .select()
    .from(pathSteps)
    .where(eq(pathSteps.pathId, pathId))
    .orderBy(asc(pathSteps.stepNumber));

  // Deduplicate by stepNumber in case seed was run multiple times.
  const seen = new Set<number>();
  return rows.filter((s) => {
    if (seen.has(s.stepNumber)) return false;
    seen.add(s.stepNumber);
    return true;
  });
}
