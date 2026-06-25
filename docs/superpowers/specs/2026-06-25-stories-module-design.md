# Stories Module Design

## Overview

Add Buddhist Sutra Stories (`/stories`) module to Cibei Space. Pure database mode (like encyclopedia), no MDX files.

## Database

### Table: `stories`

| Column | Type | Notes |
|---|---|---|
| id | uuid | PK, defaultRandom |
| slug | text | unique, URL-safe |
| title | text | Chinese title |
| title_en | text | English title |
| category | text | 本生故事 / 因缘故事 / 譬喻故事 / 禅宗公案 / 佛陀传记 |
| source_sutra | text | Source sutra name |
| summary | text | Short summary |
| content | text | Full story body |
| moral | text | Moral/lesson |
| image_url | text | Optional illustration |
| created_at | timestamptz | defaultNow |

## Data Layer

**`src/db/schema/stories.ts`** — Drizzle table + TypeScript types
**`src/db/schema/index.ts`** — add re-export

**`src/lib/stories.ts`** — three functions:
- `getAllStories(category?)` — list with optional category filter
- `getStoryBySlug(slug)` — single story
- `getStoryCategories()` — distinct categories with counts

## Routes

| Route | Component | Type |
|---|---|---|
| `/stories` | `page.tsx` | Server — grid of StoryCards + StoryCategoryFilter |
| `/stories/[slug]` | `page.tsx` | Server — full story with moral highlight + source link |

## Components

| Component | Type | Purpose |
|---|---|---|
| `story-card.tsx` | Server | Card: title, category badge, source, summary |
| `story-category-filter.tsx` | Client | Category filter via URL searchParams |

## Seed Data

28 stories in `src/db/seed.ts` across all 5 categories. Add to existing seed script.

## Migration

Run `db:generate` to create migration, then `db:push` or use seed.

## DEV.md

Add 20 more story examples to the existing 8, total 28.

## Files to Create/Modify

| Action | File |
|---|---|
| Create | `src/db/schema/stories.ts` |
| Modify | `src/db/schema/index.ts` |
| Create | `src/lib/stories.ts` |
| Create | `src/app/stories/page.tsx` |
| Create | `src/app/stories/[slug]/page.tsx` |
| Create | `src/components/story/story-card.tsx` |
| Create | `src/components/story/story-category-filter.tsx` |
| Modify | `src/db/seed.ts` |
| Modify | `DEV.md` |
| Create | `drizzle/0002_add_stories.sql` (via db:generate) |
