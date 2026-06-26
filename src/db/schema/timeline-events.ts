import { pgTable, uuid, text, integer, timestamp } from "drizzle-orm/pg-core";

export const timelineEvents = pgTable("timeline_events", {
  id: uuid("id").primaryKey().defaultRandom(),
  slug: text("slug").unique().notNull(),
  year: integer("year").notNull(),
  yearDisplay: text("year_display").notNull(), // e.g. "约 公元前 483 年" or "645 年"
  title: text("title").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(), // 人物 / 经典译出 / 宗派创立 / 历史事件 / 圣地
  location: text("location"), // optional geographic location
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});
