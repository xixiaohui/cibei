import { db } from "./index";
import { sutras } from "./schema/sutras";
import { glossary } from "./schema/glossary";
import { encyclopedia } from "./schema/encyclopedia";
import { stories } from "./schema/stories";
import { sutraData } from "./seed/sutras";
import { glossaryData } from "./seed/glossary";
import { encyclopediaData } from "./seed/encyclopedia";
import { storyData } from "./seed/stories";

async function seed() {
  console.log("🌱 Seeding database...");

  // Seed sutras
  for (const s of sutraData) {
    await db.insert(sutras).values(s).onConflictDoNothing();
  }
  console.log(`  ✓ Inserted ${sutraData.length} sutras`);

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

  console.log("✅ Seed complete!");
  process.exit(0);
}

seed().catch((e) => {
  console.error("Seed failed:", e);
  process.exit(1);
});
