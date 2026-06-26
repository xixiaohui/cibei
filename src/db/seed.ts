import { db } from "./index";
import { sutras } from "./schema/sutras";
import { glossary } from "./schema/glossary";
import { encyclopedia } from "./schema/encyclopedia";
import { stories } from "./schema/stories";
import { timelineEvents } from "./schema/timeline-events";
import { learningPaths, pathSteps } from "./schema/learning-paths";
import { sutraData } from "./seed/sutras";
import { glossaryData } from "./seed/glossary";
import { encyclopediaData } from "./seed/encyclopedia";
import { storyData } from "./seed/stories";
import { timelineData } from "./seed/timeline";
import { learningPathData, pathStepData } from "./seed/learning-paths";

async function seed() {
  console.log("🌱 Seeding database...");

  // Seed sutras — delete + re-insert to update all fields including cbeta_id/sat_id
  await db.delete(sutras);
  for (const s of sutraData) {
    await db.insert(sutras).values(s);
  }
  console.log(`  ✓ Seeded ${sutraData.length} sutras`);

  // Seed glossary
  for (const g of glossaryData) {
    await db.insert(glossary).values(g).onConflictDoNothing();
  }
  console.log(`  ✓ Inserted ${glossaryData.length} glossary terms`);

  // Seed encyclopedia
  for (const e of encyclopediaData) {
    await db.insert(encyclopedia).values(e).onConflictDoNothing();
  }
  console.log(`  ✓ Inserted ${encyclopediaData.length} encyclopedia entries`);

  // Seed stories
  for (const s of storyData) {
    await db.insert(stories).values(s).onConflictDoNothing();
  }
  console.log(`  ✓ Inserted ${storyData.length} stories`);

  // Seed timeline events
  for (const e of timelineData) {
    await db.insert(timelineEvents).values(e).onConflictDoNothing();
  }
  console.log(`  ✓ Inserted ${timelineData.length} timeline events`);

  // Seed learning paths + steps (with dynamic UUID resolution)
  const slugToId: Record<string, string> = {};
  for (const p of learningPathData) {
    const [inserted] = await db
      .insert(learningPaths)
      .values(p)
      .onConflictDoUpdate({ target: learningPaths.slug, set: { title: p.title } })
      .returning({ id: learningPaths.id });
    slugToId[p.slug] = inserted.id;
  }
  console.log(`  ✓ Seeded ${learningPathData.length} learning paths`);

  let stepCount = 0;
  for (const s of pathStepData) {
    // Resolve pathId from slug placeholder
    const actualPathId = slugToId[s.pathId.replace("REPLACE_", "")];
    if (!actualPathId) continue;
    await db
      .insert(pathSteps)
      .values({ ...s, pathId: actualPathId })
      .onConflictDoNothing();
    stepCount++;
  }
  console.log(`  ✓ Inserted ${stepCount} path steps`);

  console.log("✅ Seed complete!");
  process.exit(0);
}

seed().catch((e) => {
  console.error("Seed failed:", e);
  process.exit(1);
});
