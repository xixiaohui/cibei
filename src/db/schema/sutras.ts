import { pgTable, uuid, text, timestamp } from "drizzle-orm/pg-core";

export const sutras = pgTable("sutras", {
  id: uuid("id").primaryKey().defaultRandom(),
  slug: text("slug").unique().notNull(),
  title: text("title").notNull(),
  titleEn: text("title_en"),
  dynasty: text("dynasty"),
  translator: text("translator"),
  summary: text("summary"),
  category: text("category"),
  cbetaId: text("cbeta_id"),
  satId: text("sat_id"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

export type Sutra = typeof sutras.$inferSelect;
