import { pgTable, uuid, text, timestamp } from "drizzle-orm/pg-core";

export const encyclopedia = pgTable("encyclopedia", {
  id: uuid("id").primaryKey().defaultRandom(),
  slug: text("slug").unique().notNull(),
  title: text("title").notNull(),
  category: text("category"),
  content: text("content").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});
