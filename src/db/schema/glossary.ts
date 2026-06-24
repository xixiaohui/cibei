import { pgTable, uuid, text, timestamp } from "drizzle-orm/pg-core";

export const glossary = pgTable("glossary", {
  id: uuid("id").primaryKey().defaultRandom(),
  slug: text("slug").unique().notNull(),
  term: text("term").notNull(),
  termEn: text("term_en"),
  termSanskrit: text("term_sanskrit"),
  definition: text("definition").notNull(),
  relatedTerms: text("related_terms").array(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});
