# Cebei Space Phase 1 — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the Cebei Space Phase 1 MVP — a modern Buddhist studies knowledge base with sutra library, dictionary, encyclopedia, full-text search, and minimal authentication.

**Architecture:** Next.js 16 App Router with MDX-rendered sutra content and PostgreSQL-backed structured data via Drizzle ORM. Better Auth for email authentication. Tailwind CSS + shadcn/ui for Apple Design Award-style reading-focused UI. Deployed to Vercel with remote PostgreSQL.

**Tech Stack:** Next.js 16 (App Router), TypeScript 5.x, Tailwind CSS 4.x, shadcn/ui, MDX v3, Drizzle ORM, PostgreSQL 17, Better Auth, Vercel

## Global Constraints

- Color palette: Black, White, Warm Gray, Gold Accent — NO other colors
- Design: Minimal, elegant, quiet, reading-focused, large typography, generous white space
- NO flashy animations, excessive colors, religious icon overload
- Every page must have: `title`, `description`, `canonical`, Open Graph, schema.org structured data
- Content policy: academic/study focus only — NO religious attacks, sectarian attacks, political content, superstition, fortune-telling
- All copy in Chinese (Simplified), with English for technical/SEO fields
- Database connection via `DATABASE_URL` environment variable (remote PostgreSQL)
- Phase 1 scope: homepage, sutra library, dictionary, encyclopedia, search, minimal login ONLY

---

### Task 1: Scaffold Next.js 16 Project

**Files:**
- Create: `package.json`, `tsconfig.json`, `next.config.ts`, `postcss.config.mjs`, `.env.local`, `src/app/globals.css`, `src/app/layout.tsx` (placeholder), `src/app/page.tsx` (placeholder), `.gitignore` (if not exists)

**Interfaces:**
- Consumes: nothing (greenfield)
- Produces: runnable Next.js dev server at `localhost:3000`

- [ ] **Step 1: Initialize Next.js 16 with TypeScript and Tailwind**

```bash
cd e:/workspace/claw/cibei
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --use-pnpm --no-turbopack
```

- [ ] **Step 2: Verify the scaffold runs**

```bash
pnpm dev
```

Expected: Next.js dev server starts on `http://localhost:3000`, shows default Next.js welcome page.

- [ ] **Step 3: Set up environment variables**

Create `.env.local`:

```
DATABASE_URL=postgres://user:password@host:5432/dbname
BETTER_AUTH_SECRET=your-secret-here
BETTER_AUTH_URL=http://localhost:3000
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

- [ ] **Step 4: Install additional core dependencies**

```bash
pnpm add drizzle-orm postgres drizzle-kit better-auth lucide-react @mdx-js/mdx @mdx-js/react @next/mdx next-mdx-remote
pnpm add -D @types/node
```

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "chore: scaffold Next.js 16 project with TypeScript and Tailwind"
```

---

### Task 2: Configure Tailwind, shadcn/ui, and Design Tokens

**Files:**
- Create: `components/ui/` (via shadcn init), `tailwind.config.ts` (update), `src/app/globals.css` (update)
- Create: `src/lib/design.ts`

**Interfaces:**
- Consumes: scaffolded Next.js project from Task 1
- Produces: `src/lib/design.ts` with color/font tokens, ready-to-use shadcn/ui

- [ ] **Step 1: Initialize shadcn/ui**

```bash
npx shadcn@latest init
```

When prompted:
- Style: New York
- Base color: Neutral
- CSS variables: Yes

- [ ] **Step 2: Add shadcn/ui components needed for Phase 1**

```bash
npx shadcn@latest add button input card dialog dropdown-menu badge separator skeleton
```

- [ ] **Step 3: Write design tokens**

Create `src/lib/design.ts`:

```typescript
export const colors = {
  background: "#ffffff",
  foreground: "#171717",
  muted: "#f5f5f4",
  "muted-foreground": "#78716c",
  border: "#e7e5e4",
  accent: "#b8860b",       // Dark goldenrod — the ONLY accent color
  "accent-soft": "#fef3c7", // Light gold background
} as const;

export const typography = {
  fontSans: "var(--font-sans)",
  fontSerif: "var(--font-serif)",
  // Reading-optimized sizes
  textBase: "text-lg",
  textLg: "text-xl",
  textXl: "text-2xl",
  heading1: "text-4xl font-bold tracking-tight",
  heading2: "text-3xl font-semibold tracking-tight",
  heading3: "text-2xl font-semibold",
  body: "text-lg leading-relaxed",
  bodySmall: "text-base leading-relaxed",
  caption: "text-sm text-muted-foreground",
} as const;
```

- [ ] **Step 4: Update globals.css with design tokens**

Edit `src/app/globals.css`:

```css
@import "tailwindcss";

@theme {
  --color-background: #ffffff;
  --color-foreground: #171717;
  --color-muted: #f5f5f4;
  --color-muted-foreground: #78716c;
  --color-border: #e7e5e4;
  --color-accent: #b8860b;
  --color-accent-soft: #fef3c7;
  --font-sans: "Inter", ui-sans-serif, system-ui, sans-serif;
  --font-serif: "Noto Serif SC", "Source Han Serif SC", ui-serif, Georgia, serif;
}

/* Reading-optimized base styles */
body {
  font-family: var(--font-sans);
  color: var(--color-foreground);
  background: var(--color-background);
  -webkit-font-smoothing: antialiased;
}

/* Serif for sutra content */
.sutra-content {
  font-family: var(--font-serif);
  font-size: 1.2rem;
  line-height: 2;
}
```

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "chore: configure shadcn/ui, design tokens, and reading-optimized typography"
```

---

### Task 3: Set Up Drizzle ORM with Database Schema

**Files:**
- Create: `src/db/index.ts`, `src/db/schema/users.ts`, `src/db/schema/sutras.ts`, `src/db/schema/glossary.ts`, `src/db/schema/encyclopedia.ts`, `src/db/schema/index.ts`
- Create: `drizzle.config.ts`

**Interfaces:**
- Consumes: `DATABASE_URL` from `.env.local`
- Produces: `db` (Drizzle client), schema exports: `users`, `sutras`, `glossary`, `encyclopedia` with full type safety

- [ ] **Step 1: Write drizzle.config.ts**

```typescript
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/db/schema/index.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
```

- [ ] **Step 2: Write users schema**

Create `src/db/schema/users.ts`:

```typescript
import { pgTable, uuid, text, timestamp } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").unique().notNull(),
  name: text("name"),
  avatarUrl: text("avatar_url"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});
```

- [ ] **Step 3: Write sutras schema**

Create `src/db/schema/sutras.ts`:

```typescript
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
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});
```

- [ ] **Step 4: Write glossary schema**

Create `src/db/schema/glossary.ts`:

```typescript
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
```

- [ ] **Step 5: Write encyclopedia schema**

Create `src/db/schema/encyclopedia.ts`:

```typescript
import { pgTable, uuid, text, timestamp } from "drizzle-orm/pg-core";

export const encyclopedia = pgTable("encyclopedia", {
  id: uuid("id").primaryKey().defaultRandom(),
  slug: text("slug").unique().notNull(),
  title: text("title").notNull(),
  category: text("category"),
  content: text("content").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});
```

- [ ] **Step 6: Write schema barrel file**

Create `src/db/schema/index.ts`:

```typescript
export { users } from "./users";
export { sutras } from "./sutras";
export { glossary } from "./glossary";
export { encyclopedia } from "./encyclopedia";
```

- [ ] **Step 7: Write database connection**

Create `src/db/index.ts`:

```typescript
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const connectionString = process.env.DATABASE_URL!;

const client = postgres(connectionString, { prepare: false });
export const db = drizzle(client, { schema });

export type DbClient = typeof db;
```

- [ ] **Step 8: Generate and push migrations**

```bash
pnpm drizzle-kit generate
pnpm drizzle-kit push
```

Expected: Tables created in remote PostgreSQL, no errors.

- [ ] **Step 9: Commit**

```bash
git add -A
git commit -m "feat: add Drizzle ORM with all database schemas"
```

---

### Task 4: Create Database Seed Script

**Files:**
- Create: `src/db/seed.ts`
- Create: `content/sutras/` (placeholder directory)

**Interfaces:**
- Consumes: `db` from Task 3, schema tables
- Produces: populated `sutras`, `glossary`, `encyclopedia` tables with initial data

- [ ] **Step 1: Write seed script**

Create `src/db/seed.ts`:

```typescript
import { db } from "./index";
import { sutras } from "./schema/sutras";
import { glossary } from "./schema/glossary";
import { encyclopedia } from "./schema/encyclopedia";

async function seed() {
  console.log("🌱 Seeding database...");

  // Seed sutras (metadata matching MDX files)
  const sutraData = [
    {
      slug: "diamond-sutra",
      title: "金刚般若波罗蜜经",
      titleEn: "Diamond Sutra",
      dynasty: "唐",
      translator: "鸠摩罗什",
      summary: "《金刚经》是大乘佛教般若部重要经典，主要阐述'空'的智慧，强调不应执着于任何相状，以般若智慧照见诸法实相。",
      category: "般若部",
    },
    {
      slug: "heart-sutra",
      title: "般若波罗蜜多心经",
      titleEn: "Heart Sutra",
      dynasty: "唐",
      translator: "玄奘",
      summary: "《心经》是般若经的精要，以'照见五蕴皆空'为核心，是流传最广的佛经之一。",
      category: "般若部",
    },
    {
      slug: "lotus-sutra",
      title: "妙法莲华经",
      titleEn: "Lotus Sutra",
      dynasty: "姚秦",
      translator: "鸠摩罗什",
      summary: "《法华经》是大乘佛教的重要经典，主张一切众生皆可成佛，开权显实、会三归一。",
      category: "法华部",
    },
    {
      slug: "amitabha-sutra",
      title: "佛说阿弥陀经",
      titleEn: "Amitabha Sutra",
      dynasty: "姚秦",
      translator: "鸠摩罗什",
      summary: "《阿弥陀经》是净土宗根本经典之一，宣说西方极乐世界的殊胜庄严。",
      category: "净土部",
    },
    {
      slug: "shurangama-sutra",
      title: "大佛顶首楞严经",
      titleEn: "Shurangama Sutra",
      dynasty: "唐",
      translator: "般剌密谛",
      summary: "《楞严经》详细阐述如来藏思想与修行方法，被誉为'开悟的楞严'。",
      category: "密教部",
    },
    {
      slug: "avatamsaka-sutra",
      title: "大方广佛华严经",
      titleEn: "Avatamsaka Sutra",
      dynasty: "唐",
      translator: "实叉难陀",
      summary: "《华严经》是华严宗的根本经典，阐述法界缘起、事事无碍的圆融思想。",
      category: "华严部",
    },
    {
      slug: "platform-sutra",
      title: "六祖大师法宝坛经",
      titleEn: "Platform Sutra",
      dynasty: "唐",
      translator: "法海（集记）",
      summary: "《六祖坛经》是禅宗六祖惠能大师的言行录，是唯一被尊为'经'的中国佛教著作。",
      category: "禅宗部",
    },
    {
      slug: "vimalakirti-sutra",
      title: "维摩诘所说经",
      titleEn: "Vimalakirti Sutra",
      dynasty: "姚秦",
      translator: "鸠摩罗什",
      summary: "《维摩诘经》以在家居士维摩诘为主角，阐扬大乘佛教的不二法门。",
      category: "经集部",
    },
  ];

  for (const s of sutraData) {
    await db.insert(sutras).values(s).onConflictDoNothing();
  }
  console.log(`  ✓ Inserted ${sutraData.length} sutras`);

  // Seed glossary (core Buddhist terms)
  const glossaryData = [
    {
      slug: "prajna",
      term: "般若",
      termEn: "Prajñā",
      termSanskrit: "प्रज्ञा",
      definition: "般若意为'智慧'，特指能够通达诸法实相、超越世俗认识的究竟智慧。不同于世间的聪明才智，般若智慧能够照见诸法空性，断除无明烦恼。",
      relatedTerms: ["空性", "菩提", "六度"],
    },
    {
      slug: "bodhi",
      term: "菩提",
      termEn: "Bodhi",
      termSanskrit: "बोधि",
      definition: "菩提意为'觉悟'或'觉智'，指对真理的觉悟。佛陀就是'觉悟者'的意思。菩提心即发愿成佛、利益众生的心。",
      relatedTerms: ["般若", "涅槃", "佛"],
    },
    {
      slug: "shunyata",
      term: "空性",
      termEn: "Śūnyatā",
      termSanskrit: "शून्यता",
      definition: "空性是大乘佛教的核心概念，指一切法没有固定不变的实体性（自性）。'空'不是虚无，而是指事物缘起而有的存在方式——没有独立、不变、主宰的自性。",
      relatedTerms: ["缘起", "般若", "中观"],
    },
    {
      slug: "pratityasamutpada",
      term: "缘起",
      termEn: "Pratītyasamutpāda",
      termSanskrit: "प्रतीत्यसमुत्पाद",
      definition: "缘起是佛教的根本教义，指一切事物都是因缘和合而生，没有独立自存的事物。'此有故彼有，此生故彼生；此无故彼无，此灭故彼灭。'",
      relatedTerms: ["空性", "因果", "十二因缘"],
    },
    {
      slug: "nirvana",
      term: "涅槃",
      termEn: "Nirvāṇa",
      termSanskrit: "निर्वाण",
      definition: "涅槃意为'寂灭'或'圆寂'，是佛教修行的最高目标——烦恼的彻底止息、生死轮回的终结。不是断灭，而是超越一切二元对立的寂静安乐。",
      relatedTerms: ["菩提", "解脱", "轮回"],
    },
  ];

  for (const g of glossaryData) {
    await db.insert(glossary).values(g).onConflictDoNothing();
  }
  console.log(`  ✓ Inserted ${glossaryData.length} glossary terms`);

  // Seed encyclopedia (key figures and schools)
  const encyclopediaData = [
    {
      slug: "nagarjuna",
      title: "龙树",
      category: "人物",
      content: "龙树（Nāgārjuna，约150-250年）是大乘佛教中观学派的开创者，被尊为'八宗共祖'。他的代表作《中论》系统阐述了'缘起性空'的中观思想，对大乘佛教的发展产生了深远影响。主要著作包括《中论》《十二门论》《大智度论》等。",
    },
    {
      slug: "xuanzang",
      title: "玄奘",
      category: "人物",
      content: "玄奘（602-664年）是唐代著名高僧、翻译家，中国佛教四大译经家之一。他于贞观年间西行求法，历经艰险到达印度那烂陀寺，学习多年后携带大量梵文经典回国。归国后翻译佛经75部1335卷，并著有《大唐西域记》。",
    },
    {
      slug: "tientai",
      title: "天台宗",
      category: "宗派",
      content: "天台宗是中国佛教最早的宗派之一，由智顗大师（538-597年）创立。以《法华经》为根本经典，提出'五时八教'的判教体系，以及'一心三观'、'一念三千'等核心教义。天台宗对汉传佛教各宗派都有深远影响。",
    },
    {
      slug: "chan",
      title: "禅宗",
      category: "宗派",
      content: "禅宗是中国化佛教最具代表性的宗派，主张'不立文字，教外别传，直指人心，见性成佛'。由达摩祖师传入中国，至六祖惠能而大盛。禅宗强调直接体验和顿悟，对中国的哲学、文学、艺术产生了深远影响。",
    },
  ];

  for (const e of encyclopediaData) {
    await db.insert(encyclopedia).values(e).onConflictDoNothing();
  }
  console.log(`  ✓ Inserted ${encyclopediaData.length} encyclopedia entries`);

  console.log("✅ Seed complete!");
  process.exit(0);
}

seed().catch((e) => {
  console.error("Seed failed:", e);
  process.exit(1);
});
```

- [ ] **Step 2: Add seed script to package.json**

Edit `package.json`, add to `scripts`:

```json
"db:seed": "tsx src/db/seed.ts",
"db:generate": "drizzle-kit generate",
"db:push": "drizzle-kit push"
```

- [ ] **Step 3: Install tsx and run seed**

```bash
pnpm add -D tsx
pnpm db:seed
```

Expected: "✅ Seed complete!" with all counts.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: add database seed script with initial sutras, glossary, and encyclopedia data"
```

---

### Task 5: Set Up Better Auth

**Files:**
- Create: `src/lib/auth.ts`, `src/app/api/auth/[...all]/route.ts`
- Create: `src/lib/auth-client.ts`

**Interfaces:**
- Consumes: `users` table from Task 3, `BETTER_AUTH_SECRET` from `.env.local`
- Produces: `auth` server handler, `authClient` for client-side auth hooks

- [ ] **Step 1: Write Better Auth server config**

Create `src/lib/auth.ts`:

```typescript
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db";
import * as schema from "@/db/schema";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema,
  }),
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    // Reserved for Phase 2+, none in Phase 1
  },
});
```

- [ ] **Step 2: Write API route handler**

Create `src/app/api/auth/[...all]/route.ts`:

```typescript
import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";

export const { POST, GET } = toNextJsHandler(auth);
```

- [ ] **Step 3: Write client-side auth helper**

Create `src/lib/auth-client.ts`:

```typescript
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL!,
});

export const { signIn, signUp, signOut, useSession } = authClient;
```

- [ ] **Step 4: Verify auth migration is applied**

```bash
pnpm db:push
```

Expected: Better Auth creates its required tables in PostgreSQL.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: set up Better Auth with email/password authentication"
```

---

### Task 6: Build Global Layout (Header, Footer, Root Layout)

**Files:**
- Create: `components/layout/header.tsx`, `components/layout/footer.tsx`, `components/layout/search-bar.tsx`
- Modify: `src/app/layout.tsx`

**Interfaces:**
- Consumes: shadcn/ui components from Task 2, `authClient` from Task 5
- Produces: `<Header />`, `<Footer />`, `<SearchBar />` used by root layout

- [ ] **Step 1: Write SearchBar component**

Create `components/layout/search-bar.tsx`:

```typescript
"use client";

import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState, type FormEvent } from "react";

export function SearchBar() {
  const [q, setQ] = useState("");
  const router = useRouter();

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (q.trim()) {
      router.push(`/search?q=${encodeURIComponent(q.trim())}`);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="relative w-full max-w-sm">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        type="search"
        placeholder="搜索经典、术语、百科..."
        value={q}
        onChange={(e) => setQ(e.target.value)}
        className="pl-10"
      />
    </form>
  );
}
```

- [ ] **Step 2: Write Header component**

Create `components/layout/header.tsx`:

```typescript
import Link from "next/link";
import { BookOpen } from "lucide-react";
import { SearchBar } from "./search-bar";
import { Button } from "@/components/ui/button";

const NAV_ITEMS = [
  { href: "/sutras", label: "经典库" },
  { href: "/dictionary", label: "词典" },
  { href: "/encyclopedia", label: "百科" },
] as const;

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <BookOpen className="h-6 w-6 text-accent" />
          <span className="text-xl font-semibold tracking-tight">慈悲空间</span>
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-md"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Search + Auth */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:block">
            <SearchBar />
          </div>
          <Link href="/auth/login">
            <Button variant="ghost" size="sm">
              登录
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
```

- [ ] **Step 3: Write Footer component**

Create `components/layout/footer.tsx`:

```typescript
import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-border mt-auto">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-sm font-semibold mb-3">慈悲空间</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              深入经藏，智慧如海。<br />
              现代佛学研究与经典学习平台。
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold mb-3">探索</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/sutras" className="hover:text-foreground transition-colors">经典库</Link></li>
              <li><Link href="/dictionary" className="hover:text-foreground transition-colors">佛学词典</Link></li>
              <li><Link href="/encyclopedia" className="hover:text-foreground transition-colors">百科</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold mb-3">关于</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              本站内容仅供学术研究与学习参考，不替代法师指导与宗教实践。
            </p>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-border text-center text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} 慈悲空间 Cebei Space. 仅限学术研究与学习用途。
        </div>
      </div>
    </footer>
  );
}
```

- [ ] **Step 4: Update root layout**

Edit `src/app/layout.tsx`:

```typescript
import type { Metadata } from "next";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "慈悲空间 — 现代佛学研究与经典学习平台",
    template: "%s | 慈悲空间",
  },
  description:
    "深入经藏，智慧如海。慈悲空间是一个现代化佛学研究与学习平台，提供佛经原文阅读、佛学词典、百科知识库等功能。",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://cebei.space"),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-Hans">
      <body className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
```

- [ ] **Step 5: Verify the layout renders**

```bash
pnpm dev
```

Expected: Navigate to `http://localhost:3000` — see header with logo, nav, search bar, login button, footer.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: add global layout with header, footer, and search bar"
```

---

### Task 7: Build SEO Utility and Shared Components

**Files:**
- Create: `src/lib/seo.ts`, `components/shared/seo-head.tsx`, `components/shared/breadcrumb.tsx`, `components/shared/empty-state.tsx`

**Interfaces:**
- Consumes: nothing external
- Produces: `seoHead()` helper, `<Breadcrumb />`, `<EmptyState />`

- [ ] **Step 1: Write SEO helper**

Create `src/lib/seo.ts`:

```typescript
export interface SeoProps {
  title: string;
  description: string;
  canonical: string;
  ogType?: "website" | "article";
  schema?: Record<string, unknown>;
}

export function generateSeo({
  title,
  description,
  canonical,
  ogType = "website",
  schema,
}: SeoProps) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://cebei.space";

  return {
    title,
    description,
    alternates: { canonical: `${baseUrl}${canonical}` },
    openGraph: {
      title,
      description,
      url: `${baseUrl}${canonical}`,
      siteName: "慈悲空间",
      locale: "zh_Hans",
      type: ogType,
    },
    ...(schema && {
      other: {
        "schema:org": JSON.stringify(schema),
      },
    }),
  };
}
```

- [ ] **Step 2: Write Breadcrumb component**

Create `components/shared/breadcrumb.tsx`:

```typescript
import Link from "next/link";
import { ChevronRight } from "lucide-react";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export function Breadcrumb({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav aria-label="面包屑导航" className="mb-8">
      <ol className="flex items-center gap-1 text-sm text-muted-foreground">
        <li>
          <Link href="/" className="hover:text-foreground transition-colors">
            首页
          </Link>
        </li>
        {items.map((item, i) => (
          <li key={i} className="flex items-center gap-1">
            <ChevronRight className="h-3.5 w-3.5" />
            {item.href ? (
              <Link href={item.href} className="hover:text-foreground transition-colors">
                {item.label}
              </Link>
            ) : (
              <span className="text-foreground font-medium">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
```

- [ ] **Step 3: Write EmptyState component**

Create `components/shared/empty-state.tsx`:

```typescript
import { type ReactNode } from "react";

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  children?: ReactNode;
}

export function EmptyState({ icon, title, description, children }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      {icon && <div className="mb-4 text-muted-foreground">{icon}</div>}
      <h3 className="text-lg font-medium mb-2">{title}</h3>
      {description && (
        <p className="text-sm text-muted-foreground max-w-md mb-4">{description}</p>
      )}
      {children}
    </div>
  );
}
```

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: add SEO helper, breadcrumb, and empty-state shared components"
```

---

### Task 8: Build Sutra List Page

**Files:**
- Create: `src/app/sutras/page.tsx`, `components/sutra/sutra-card.tsx`, `components/sutra/sutra-category-filter.tsx`
- Create: `src/lib/sutras.ts`

**Interfaces:**
- Consumes: `db` from Task 3, `sutras` schema
- Produces: `/sutras` page with category filtering and card grid

- [ ] **Step 1: Write sutras data access layer**

Create `src/lib/sutras.ts`:

```typescript
import { db } from "@/db";
import { sutras } from "@/db/schema/sutras";
import { eq, ilike, sql } from "drizzle-orm";

export async function getAllSutras(category?: string) {
  if (category) {
    return db.select().from(sutras).where(eq(sutras.category, category)).orderBy(sutras.title);
  }
  return db.select().from(sutras).orderBy(sutras.title);
}

export async function getSutraBySlug(slug: string) {
  const result = await db
    .select()
    .from(sutras)
    .where(eq(sutras.slug, slug))
    .limit(1);
  return result[0] ?? null;
}

export async function getSutraCategories() {
  const result = await db
    .selectDistinct({ category: sutras.category })
    .from(sutras)
    .where(sql`${sutras.category} IS NOT NULL`);
  return result.map((r) => r.category).filter(Boolean) as string[];
}
```

- [ ] **Step 2: Write SutraCard component**

Create `components/sutra/sutra-card.tsx`:

```typescript
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Sutra } from "@/db/schema/sutras";

type SutraCardProps = Pick<Sutra, "slug" | "title" | "dynasty" | "translator" | "summary" | "category">;

export function SutraCard({ slug, title, dynasty, translator, summary, category }: SutraCardProps) {
  return (
    <Link href={`/sutras/${slug}`}>
      <Card className="h-full hover:border-accent/30 transition-colors">
        <CardHeader>
          <div className="flex items-start justify-between gap-2">
            <CardTitle className="text-lg leading-snug">{title}</CardTitle>
            {category && (
              <Badge variant="secondary" className="shrink-0 text-xs">
                {category}
              </Badge>
            )}
          </div>
          <CardDescription className="line-clamp-2 text-sm">
            {dynasty && translator ? `${dynasty} · ${translator}译` : summary}
          </CardDescription>
          {summary && (
            <p className="text-sm text-muted-foreground line-clamp-2 mt-2">
              {summary}
            </p>
          )}
        </CardHeader>
      </Card>
    </Link>
  );
}
```

- [ ] **Step 3: Write CategoryFilter component**

Create `components/sutra/sutra-category-filter.tsx`:

```typescript
"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Badge } from "@/components/ui/badge";

interface CategoryFilterProps {
  categories: string[];
  activeCategory?: string;
}

export function SutraCategoryFilter({ categories, activeCategory }: CategoryFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function setCategory(cat: string | null) {
    const params = new URLSearchParams(searchParams.toString());
    if (cat) {
      params.set("category", cat);
    } else {
      params.delete("category");
    }
    router.push(`/sutras?${params.toString()}`);
  }

  return (
    <div className="flex flex-wrap gap-2 mb-8">
      <Badge
        variant={!activeCategory ? "default" : "outline"}
        className="cursor-pointer"
        onClick={() => setCategory(null)}
      >
        全部
      </Badge>
      {categories.map((cat) => (
        <Badge
          key={cat}
          variant={activeCategory === cat ? "default" : "outline"}
          className="cursor-pointer"
          onClick={() => setCategory(cat)}
        >
          {cat}
        </Badge>
      ))}
    </div>
  );
}
```

- [ ] **Step 4: Write sutras list page**

Create `src/app/sutras/page.tsx`:

```typescript
import { Suspense } from "react";
import { getAllSutras, getSutraCategories } from "@/lib/sutras";
import { SutraCard } from "@/components/sutra/sutra-card";
import { SutraCategoryFilter } from "@/components/sutra/sutra-category-filter";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { EmptyState } from "@/components/shared/empty-state";
import { BookOpen } from "lucide-react";
import type { Metadata } from "next";
import { generateSeo } from "@/lib/seo";

export const metadata: Metadata = generateSeo({
  title: "经典库",
  description: "浏览和阅读大乘佛教经典原文，包括金刚经、心经、法华经等核心佛经。支持按分类和朝代筛选。",
  canonical: "/sutras",
});

interface SutrasPageProps {
  searchParams: Promise<{ category?: string }>;
}

export default async function SutrasPage({ searchParams }: SutrasPageProps) {
  const { category } = await searchParams;
  const [sutras, categories] = await Promise.all([
    getAllSutras(category),
    getSutraCategories(),
  ]);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      <Breadcrumb items={[{ label: "经典库" }]} />

      <div className="mb-10">
        <h1 className="text-4xl font-bold tracking-tight mb-3">经典库</h1>
        <p className="text-lg text-muted-foreground max-w-2xl">
          深入经藏，智慧如海。浏览大乘佛教核心经典，阅读原文，对比版本。
        </p>
      </div>

      <Suspense fallback={null}>
        <SutraCategoryFilter categories={categories} activeCategory={category} />
      </Suspense>

      {sutras.length === 0 ? (
        <EmptyState
          icon={<BookOpen className="h-12 w-12" />}
          title="暂无经典"
          description="该分类下暂无经典，请选择其他分类。"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sutras.map((s) => (
            <SutraCard key={s.id} {...s} />
          ))}
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: add sutra library list page with category filtering"
```

---

### Task 9: Build Sutra Detail Page (MDX Reader)

**Files:**
- Create: `src/app/sutras/[slug]/page.tsx`, `components/sutra/sutra-reader.tsx`, `components/sutra/sutra-toc.tsx`
- Create: `content/sutras/diamond-sutra.mdx` (first MDX file as template)

**Interfaces:**
- Consumes: `getSutraBySlug` from Task 8, MDX files from `content/sutras/`
- Produces: `/sutras/[slug]` page with MDX-rendered sutra body, sidebar TOC

- [ ] **Step 1: Write SutraReader component**

Create `components/sutra/sutra-reader.tsx`:

```typescript
import { type ReactNode } from "react";

interface SutraReaderProps {
  children: ReactNode;
}

export function SutraReader({ children }: SutraReaderProps) {
  return (
    <article className="sutra-content prose prose-neutral max-w-none
      prose-headings:font-serif prose-headings:font-bold
      prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-6
      prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-4
      prose-p:my-4 prose-p:leading-loose
      prose-blockquote:border-l-accent prose-blockquote:bg-muted/50 prose-blockquote:py-1 prose-blockquote:px-4
    ">
      {children}
    </article>
  );
}
```

- [ ] **Step 2: Write SutraTOC (table of contents) component**

Create `components/sutra/sutra-toc.tsx`:

```typescript
"use client";

import { useEffect, useState } from "react";

interface TocItem {
  id: string;
  text: string;
  level: number;
}

export function SutraToc() {
  const [items, setItems] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    // Extract headings from the rendered sutra content
    const headings = document.querySelectorAll(".sutra-content h2, .sutra-content h3");
    const toc: TocItem[] = [];
    headings.forEach((h, i) => {
      const id = `section-${i}`;
      h.id = id;
      toc.push({
        id,
        text: h.textContent || "",
        level: h.tagName === "H2" ? 2 : 3,
      });
    });
    setItems(toc);

    // IntersectionObserver for active heading
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
            break;
          }
        }
      },
      { rootMargin: "-80px 0px -80% 0px" }
    );

    headings.forEach((h) => observer.observe(h));
    return () => observer.disconnect();
  }, []);

  if (items.length === 0) return null;

  return (
    <nav className="text-sm" aria-label="目录导航">
      <h4 className="font-semibold mb-3 text-foreground">目录</h4>
      <ul className="space-y-1.5">
        {items.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              className={`block py-1 transition-colors hover:text-accent ${
                item.level === 3 ? "pl-3" : ""
              } ${
                activeId === item.id
                  ? "text-accent font-medium"
                  : "text-muted-foreground"
              }`}
            >
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
```

- [ ] **Step 3: Write the first MDX sutra (diamond-sutra.mdx)**

Create `content/sutras/diamond-sutra.mdx`:

```mdx
---
slug: diamond-sutra
title: 金刚般若波罗蜜经
category: 般若部
dynasty: 唐
translator: 鸠摩罗什
---

## 第一品 法会因由分

如是我闻。一时，佛在舍卫国祇树给孤独园，与大比丘众千二百五十人俱。

尔时，世尊食时，着衣持钵，入舍卫大城乞食。于其城中次第乞已，还至本处。饭食讫，收衣钵，洗足已，敷座而坐。

## 第二品 善现启请分

时，长老须菩提在大众中，即从座起，偏袒右肩，右膝着地，合掌恭敬而白佛言：

"希有世尊！如来善护念诸菩萨，善付嘱诸菩萨。世尊，善男子、善女人发阿耨多罗三藐三菩提心，云何应住？云何降伏其心？"

佛言："善哉，善哉。须菩提，如汝所说，如来善护念诸菩萨，善付嘱诸菩萨。汝今谛听，当为汝说。善男子、善女人发阿耨多罗三藐三菩提心，应如是住，如是降伏其心。"

"唯然世尊，愿乐欲闻。"

## 第三品 大乘正宗分

佛告须菩提："诸菩萨摩诃萨应如是降伏其心：所有一切众生之类——若卵生、若胎生、若湿生、若化生、若有色、若无色、若有想、若无想、若非有想非无想，我皆令入无余涅槃而灭度之。如是灭度无量无数无边众生，实无众生得灭度者。何以故？须菩提，若菩萨有我相、人相、众生相、寿者相，即非菩萨。"
```

- [ ] **Step 4: Write sutra detail page**

Create `src/app/sutras/[slug]/page.tsx`:

```typescript
import { notFound } from "next/navigation";
import { readFile } from "fs/promises";
import path from "path";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getSutraBySlug } from "@/lib/sutras";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { SutraToc } from "@/components/sutra/sutra-toc";
import { SutraReader } from "@/components/sutra/sutra-reader";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { generateSeo } from "@/lib/seo";
import type { Metadata } from "next";

interface SutraDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: SutraDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const sutra = await getSutraBySlug(slug);
  if (!sutra) return { title: "未找到" };

  return generateSeo({
    title: sutra.title,
    description: sutra.summary || `${sutra.title}原文阅读`,
    canonical: `/sutras/${slug}`,
    ogType: "article",
  });
}

export default async function SutraDetailPage({ params }: SutraDetailPageProps) {
  const { slug } = await params;
  const sutra = await getSutraBySlug(slug);
  if (!sutra) notFound();

  // Read MDX file content from disk (server component — fs is available)
  let mdxSource: string | null = null;
  try {
    const filePath = path.join(process.cwd(), "content", "sutras", `${slug}.mdx`);
    mdxSource = await readFile(filePath, "utf-8");
  } catch {
    // File not found — handled in render
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      <Breadcrumb
        items={[
          { label: "经典库", href: "/sutras" },
          { label: sutra.title },
        ]}
      />

      {/* Sutra Header */}
      <div className="mb-10">
        <h1 className="text-4xl font-bold tracking-tight mb-4 font-[family-name:var(--font-serif)]">
          {sutra.title}
        </h1>
        {sutra.titleEn && (
          <p className="text-lg text-muted-foreground mb-4">{sutra.titleEn}</p>
        )}
        <div className="flex flex-wrap gap-2 mb-4">
          {sutra.category && <Badge variant="secondary">{sutra.category}</Badge>}
          {sutra.dynasty && <Badge variant="outline">{sutra.dynasty}</Badge>}
          {sutra.translator && <Badge variant="outline">{sutra.translator}译</Badge>}
        </div>
        {sutra.summary && (
          <p className="text-muted-foreground max-w-2xl">{sutra.summary}</p>
        )}
      </div>

      <Separator className="mb-10" />

      {/* Content: Sidebar + Main */}
      <div className="flex gap-12">
        {/* Sidebar — TOC */}
        <aside className="hidden lg:block w-56 shrink-0">
          <div className="sticky top-24">
            <SutraToc />
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          {mdxSource ? (
            <SutraReader>
              <MDXRemote source={mdxSource} />
            </SutraReader>
          ) : (
            <p className="text-muted-foreground">经文内容即将上线。</p>
          )}
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 5: Configure MDX in next.config.ts**

Update `next.config.ts`:

```typescript
import type { NextConfig } from "next";
import createMDX from "@next/mdx";

const nextConfig: NextConfig = {
  pageExtensions: ["ts", "tsx", "js", "jsx", "md", "mdx"],
};

const withMDX = createMDX({
  extension: /\.mdx?$/,
});

export default withMDX(nextConfig);
```

- [ ] **Step 6: Verify sutra detail page renders**

```bash
pnpm dev
```

Navigate to `http://localhost:3000/sutras/diamond-sutra`. Expected: Sutra header with metadata, MDX content rendered with headings.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat: add sutra detail page with MDX reader and table of contents"
```

---

### Task 10: Build Dictionary List Page

**Files:**
- Create: `src/app/dictionary/page.tsx`, `components/dictionary/glossary-index.tsx`, `components/dictionary/glossary-card.tsx`
- Create: `src/lib/glossary.ts`

**Interfaces:**
- Consumes: `db` from Task 3, `glossary` schema
- Produces: `/dictionary` page with A-Z index and term cards

- [ ] **Step 1: Write glossary data access layer**

Create `src/lib/glossary.ts`:

```typescript
import { db } from "@/db";
import { glossary } from "@/db/schema/glossary";
import { eq, ilike, sql } from "drizzle-orm";

export async function getAllGlossaryTerms(letter?: string) {
  let query = db.select().from(glossary).orderBy(glossary.term);
  if (letter) {
    query = query.where(ilike(glossary.term, `${letter}%`));
  }
  return query;
}

export async function getGlossaryBySlug(slug: string) {
  const result = await db
    .select()
    .from(glossary)
    .where(eq(glossary.slug, slug))
    .limit(1);
  return result[0] ?? null;
}
```

- [ ] **Step 2: Write GlossaryIndex component**

Create `components/dictionary/glossary-index.tsx`:

```typescript
"use client";

import { useRouter, useSearchParams } from "next/navigation";

// Chinese doesn't have A-Z — use common initial characters
const INDEX_LETTERS = [
  "般", "菩", "空", "缘", "涅", "禅", "法", "佛", "无", "如",
];

export function GlossaryIndex({ activeLetter }: { activeLetter?: string }) {
  const router = useRouter();

  function setLetter(letter: string | null) {
    const params = new URLSearchParams();
    if (letter) params.set("letter", letter);
    router.push(`/dictionary?${params.toString()}`);
  }

  return (
    <div className="flex flex-wrap gap-1.5 mb-8">
      <button
        onClick={() => setLetter(null)}
        className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
          !activeLetter
            ? "bg-foreground text-background"
            : "bg-muted hover:bg-muted-foreground/20"
        }`}
      >
        全部
      </button>
      {INDEX_LETTERS.map((letter) => (
        <button
          key={letter}
          onClick={() => setLetter(letter)}
          className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
            activeLetter === letter
              ? "bg-foreground text-background"
              : "bg-muted hover:bg-muted-foreground/20"
          }`}
        >
          {letter}
        </button>
      ))}
    </div>
  );
}
```

- [ ] **Step 3: Write GlossaryCard component**

Create `components/dictionary/glossary-card.tsx`:

```typescript
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

interface GlossaryCardProps {
  slug: string;
  term: string;
  termEn?: string | null;
  termSanskrit?: string | null;
  definition: string;
}

export function GlossaryCard({ slug, term, termEn, termSanskrit, definition }: GlossaryCardProps) {
  return (
    <Link href={`/dictionary/${slug}`}>
      <Card className="h-full hover:border-accent/30 transition-colors">
        <CardHeader>
          <div className="flex items-baseline gap-2">
            <CardTitle className="text-2xl font-serif">{term}</CardTitle>
            {termSanskrit && (
              <span className="text-sm text-muted-foreground">{termSanskrit}</span>
            )}
          </div>
          {termEn && (
            <CardDescription className="text-sm">{termEn}</CardDescription>
          )}
          <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
            {definition}
          </p>
        </CardHeader>
      </Card>
    </Link>
  );
}
```

- [ ] **Step 4: Write dictionary list page**

Create `src/app/dictionary/page.tsx`:

```typescript
import { Suspense } from "react";
import { getAllGlossaryTerms } from "@/lib/glossary";
import { GlossaryCard } from "@/components/dictionary/glossary-card";
import { GlossaryIndex } from "@/components/dictionary/glossary-index";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { EmptyState } from "@/components/shared/empty-state";
import { BookOpen } from "lucide-react";
import { generateSeo } from "@/lib/seo";
import type { Metadata } from "next";

export const metadata: Metadata = generateSeo({
  title: "佛学词典",
  description: "查阅佛学术语和名相解释，包含梵文对应和英文翻译。涵盖般若、菩提、空性等核心概念。",
  canonical: "/dictionary",
});

interface DictionaryPageProps {
  searchParams: Promise<{ letter?: string }>;
}

export default async function DictionaryPage({ searchParams }: DictionaryPageProps) {
  const { letter } = await searchParams;
  const terms = await getAllGlossaryTerms(letter);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      <Breadcrumb items={[{ label: "佛学词典" }]} />

      <div className="mb-10">
        <h1 className="text-4xl font-bold tracking-tight mb-3">佛学词典</h1>
        <p className="text-lg text-muted-foreground max-w-2xl">
          探索佛学术语的精确定义。每个词条包含中文释义、梵文原文和英文对应。
        </p>
      </div>

      <Suspense fallback={null}>
        <GlossaryIndex activeLetter={letter} />
      </Suspense>

      {terms.length === 0 ? (
        <EmptyState
          icon={<BookOpen className="h-12 w-12" />}
          title="暂无词条"
          description="该字头下暂无词条，请选择其他字头。"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {terms.map((t) => (
            <GlossaryCard key={t.id} {...t} />
          ))}
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: add dictionary list page with character index"
```

---

### Task 11: Build Dictionary Detail Page

**Files:**
- Create: `src/app/dictionary/[slug]/page.tsx`, `components/dictionary/related-terms.tsx`

**Interfaces:**
- Consumes: `getGlossaryBySlug` from Task 10
- Produces: `/dictionary/[slug]` page with full term details

- [ ] **Step 1: Write RelatedTerms component**

Create `components/dictionary/related-terms.tsx`:

```typescript
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

interface RelatedTermsProps {
  terms: string[];
  allTerms: Array<{ slug: string; term: string }>;
}

export function RelatedTerms({ terms, allTerms }: RelatedTermsProps) {
  if (!terms || terms.length === 0) return null;

  return (
    <div className="mt-8">
      <h3 className="text-sm font-semibold mb-3">相关词条</h3>
      <div className="flex flex-wrap gap-2">
        {terms.map((t) => {
          const match = allTerms.find((at) => at.term === t);
          if (match) {
            return (
              <Link key={t} href={`/dictionary/${match.slug}`}>
                <Badge variant="secondary" className="hover:bg-accent-soft transition-colors cursor-pointer">
                  {t}
                </Badge>
              </Link>
            );
          }
          return (
            <Badge key={t} variant="outline">
              {t}
            </Badge>
          );
        })}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Write dictionary detail page**

Create `src/app/dictionary/[slug]/page.tsx`:

```typescript
import { notFound } from "next/navigation";
import { getGlossaryBySlug, getAllGlossaryTerms } from "@/lib/glossary";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { RelatedTerms } from "@/components/dictionary/related-terms";
import { Separator } from "@/components/ui/separator";
import { generateSeo } from "@/lib/seo";
import type { Metadata } from "next";

interface GlossaryDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: GlossaryDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const term = await getGlossaryBySlug(slug);
  if (!term) return { title: "未找到" };

  return generateSeo({
    title: `${term.term} — 佛学词典`,
    description: term.definition.slice(0, 160),
    canonical: `/dictionary/${slug}`,
  });
}

export default async function GlossaryDetailPage({ params }: GlossaryDetailPageProps) {
  const { slug } = await params;
  const term = await getGlossaryBySlug(slug);
  if (!term) notFound();

  // Get all terms for related-terms resolution
  const allTerms = await getAllGlossaryTerms();

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12">
      <Breadcrumb
        items={[
          { label: "佛学词典", href: "/dictionary" },
          { label: term.term },
        ]}
      />

      {/* Term Header */}
      <div className="mb-10">
        <h1 className="text-4xl font-bold font-[family-name:var(--font-serif)] mb-3">
          {term.term}
        </h1>
        <div className="flex flex-wrap items-baseline gap-3 text-muted-foreground">
          {term.termSanskrit && (
            <span className="text-lg">{term.termSanskrit}</span>
          )}
          {term.termEn && <span className="text-sm">{term.termEn}</span>}
        </div>
      </div>

      <Separator className="mb-10" />

      {/* Definition */}
      <div className="prose prose-neutral max-w-none">
        <p className="text-lg leading-relaxed">{term.definition}</p>
      </div>

      {/* Related Terms */}
      <RelatedTerms
        terms={term.relatedTerms || []}
        allTerms={allTerms.map((t) => ({ slug: t.slug, term: t.term }))}
      />
    </div>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "feat: add dictionary detail page with related terms"
```

---

### Task 12: Build Encyclopedia List Page

**Files:**
- Create: `src/app/encyclopedia/page.tsx`, `components/encyclopedia/encyclopedia-card.tsx`, `components/encyclopedia/category-nav.tsx`
- Create: `src/lib/encyclopedia.ts`

**Interfaces:**
- Consumes: `db` from Task 3, `encyclopedia` schema
- Produces: `/encyclopedia` page with category filtering

- [ ] **Step 1: Write encyclopedia data access layer**

Create `src/lib/encyclopedia.ts`:

```typescript
import { db } from "@/db";
import { encyclopedia } from "@/db/schema/encyclopedia";
import { eq } from "drizzle-orm";

export async function getAllEncyclopediaEntries(category?: string) {
  let query = db.select().from(encyclopedia).orderBy(encyclopedia.title);
  if (category) {
    query = query.where(eq(encyclopedia.category, category));
  }
  return query;
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
```

- [ ] **Step 2: Write EncyclopediaCard component**

Create `components/encyclopedia/encyclopedia-card.tsx`:

```typescript
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface EncyclopediaCardProps {
  slug: string;
  title: string;
  category: string | null;
  content: string;
}

export function EncyclopediaCard({ slug, title, category, content }: EncyclopediaCardProps) {
  return (
    <Link href={`/encyclopedia/${slug}`}>
      <Card className="h-full hover:border-accent/30 transition-colors">
        <CardHeader>
          <div className="flex items-start justify-between gap-2">
            <CardTitle className="text-lg leading-snug">{title}</CardTitle>
            {category && (
              <Badge variant="secondary" className="shrink-0">
                {category}
              </Badge>
            )}
          </div>
          <CardDescription className="line-clamp-3 text-sm">
            {content}
          </CardDescription>
        </CardHeader>
      </Card>
    </Link>
  );
}
```

- [ ] **Step 3: Write CategoryNav component**

Create `components/encyclopedia/category-nav.tsx`:

```typescript
"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Badge } from "@/components/ui/badge";

interface CategoryNavProps {
  categories: string[];
  activeCategory?: string;
}

export function CategoryNav({ categories, activeCategory }: CategoryNavProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function setCategory(cat: string | null) {
    const params = new URLSearchParams(searchParams.toString());
    if (cat) {
      params.set("category", cat);
    } else {
      params.delete("category");
    }
    router.push(`/encyclopedia?${params.toString()}`);
  }

  return (
    <div className="flex flex-wrap gap-2 mb-8">
      <Badge
        variant={!activeCategory ? "default" : "outline"}
        className="cursor-pointer"
        onClick={() => setCategory(null)}
      >
        全部
      </Badge>
      {categories.map((cat) => (
        <Badge
          key={cat}
          variant={activeCategory === cat ? "default" : "outline"}
          className="cursor-pointer"
          onClick={() => setCategory(cat)}
        >
          {cat}
        </Badge>
      ))}
    </div>
  );
}
```

- [ ] **Step 4: Write encyclopedia list page**

Create `src/app/encyclopedia/page.tsx`:

```typescript
import { Suspense } from "react";
import { getAllEncyclopediaEntries, getEncyclopediaCategories } from "@/lib/encyclopedia";
import { EncyclopediaCard } from "@/components/encyclopedia/encyclopedia-card";
import { CategoryNav } from "@/components/encyclopedia/category-nav";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { EmptyState } from "@/components/shared/empty-state";
import { Library } from "lucide-react";
import { generateSeo } from "@/lib/seo";
import type { Metadata } from "next";

export const metadata: Metadata = generateSeo({
  title: "佛学百科",
  description: "探索佛学知识百科——涵盖人物、宗派、经典和历史事件。从龙树到玄奘，从天台宗到禅宗。",
  canonical: "/encyclopedia",
});

interface EncyclopediaPageProps {
  searchParams: Promise<{ category?: string }>;
}

export default async function EncyclopediaPage({ searchParams }: EncyclopediaPageProps) {
  const { category } = await searchParams;
  const [entries, categories] = await Promise.all([
    getAllEncyclopediaEntries(category),
    getEncyclopediaCategories(),
  ]);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      <Breadcrumb items={[{ label: "佛学百科" }]} />

      <div className="mb-10">
        <h1 className="text-4xl font-bold tracking-tight mb-3">佛学百科</h1>
        <p className="text-lg text-muted-foreground max-w-2xl">
          探索佛学的广阔世界——从历史人物到宗派传承，从经典要义到历史事件。
        </p>
      </div>

      <Suspense fallback={null}>
        <CategoryNav categories={categories} activeCategory={category} />
      </Suspense>

      {entries.length === 0 ? (
        <EmptyState
          icon={<Library className="h-12 w-12" />}
          title="暂无条目"
          description="该分类下暂无条目，请选择其他分类。"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {entries.map((e) => (
            <EncyclopediaCard key={e.id} {...e} />
          ))}
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: add encyclopedia list page with category navigation"
```

---

### Task 13: Build Encyclopedia Detail Page

**Files:**
- Create: `src/app/encyclopedia/[slug]/page.tsx`

**Interfaces:**
- Consumes: `getEncyclopediaBySlug` from Task 12
- Produces: `/encyclopedia/[slug]` page with full entry content

- [ ] **Step 1: Write encyclopedia detail page**

Create `src/app/encyclopedia/[slug]/page.tsx`:

```typescript
import { notFound } from "next/navigation";
import { getEncyclopediaBySlug } from "@/lib/encyclopedia";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { generateSeo } from "@/lib/seo";
import type { Metadata } from "next";

interface EncyclopediaDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: EncyclopediaDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const entry = await getEncyclopediaBySlug(slug);
  if (!entry) return { title: "未找到" };

  return generateSeo({
    title: `${entry.title} — 佛学百科`,
    description: entry.content.slice(0, 160),
    canonical: `/encyclopedia/${slug}`,
    ogType: "article",
  });
}

export default async function EncyclopediaDetailPage({ params }: EncyclopediaDetailPageProps) {
  const { slug } = await params;
  const entry = await getEncyclopediaBySlug(slug);
  if (!entry) notFound();

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12">
      <Breadcrumb
        items={[
          { label: "佛学百科", href: "/encyclopedia" },
          { label: entry.title },
        ]}
      />

      {/* Entry Header */}
      <div className="mb-10">
        <h1 className="text-4xl font-bold tracking-tight mb-3">
          {entry.title}
        </h1>
        {entry.category && (
          <Badge variant="secondary">{entry.category}</Badge>
        )}
      </div>

      <Separator className="mb-10" />

      {/* Content */}
      <div className="prose prose-neutral max-w-none">
        {entry.content.split("\n").map((paragraph, i) => (
          paragraph.trim() ? (
            <p key={i} className="text-lg leading-relaxed mb-4">{paragraph}</p>
          ) : null
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add -A
git commit -m "feat: add encyclopedia detail page"
```

---

### Task 14: Build Search API

**Files:**
- Create: `src/app/api/search/route.ts`

**Interfaces:**
- Consumes: `db` from Task 3, PostgreSQL FTS indexes from Task 3
- Produces: `GET /api/search?q=...&type=...` returning unified search results

- [ ] **Step 1: Write search API route**

Create `src/app/api/search/route.ts`:

```typescript
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { sutras } from "@/db/schema/sutras";
import { glossary } from "@/db/schema/glossary";
import { encyclopedia } from "@/db/schema/encyclopedia";
import { sql, or, ilike } from "drizzle-orm";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q")?.trim();
  const type = searchParams.get("type"); // "sutras" | "glossary" | "encyclopedia" | undefined (all)

  if (!q) {
    return NextResponse.json({ results: [], total: 0 });
  }

  const results: Array<{
    type: string;
    slug: string;
    title: string;
    excerpt: string;
    category?: string | null;
  }> = [];

  if (!type || type === "sutras") {
    const sutraResults = await db
      .select({
        slug: sutras.slug,
        title: sutras.title,
        excerpt: sutras.summary,
        category: sutras.category,
      })
      .from(sutras)
      .where(
        or(
          ilike(sutras.title, `%${q}%`),
          sql`${sutras.summary} ILIKE ${`%${q}%`}`,
        )
      )
      .limit(10);

    results.push(
      ...sutraResults.map((s) => ({
        type: "sutra" as const,
        slug: s.slug,
        title: s.title,
        excerpt: s.excerpt ?? "",
        category: s.category,
      }))
    );
  }

  if (!type || type === "glossary") {
    const glossaryResults = await db
      .select({
        slug: glossary.slug,
        title: glossary.term,
        excerpt: glossary.definition,
        category: sql<string | null>`NULL`,
      })
      .from(glossary)
      .where(
        or(
          ilike(glossary.term, `%${q}%`),
          ilike(glossary.definition, `%${q}%`),
        )
      )
      .limit(10);

    results.push(
      ...glossaryResults.map((g) => ({
        type: "glossary" as const,
        slug: g.slug,
        title: g.title,
        excerpt: g.excerpt.slice(0, 200),
        category: null,
      }))
    );
  }

  if (!type || type === "encyclopedia") {
    const encyclopediaResults = await db
      .select({
        slug: encyclopedia.slug,
        title: encyclopedia.title,
        excerpt: encyclopedia.content,
        category: encyclopedia.category,
      })
      .from(encyclopedia)
      .where(
        or(
          ilike(encyclopedia.title, `%${q}%`),
          ilike(encyclopedia.content, `%${q}%`),
        )
      )
      .limit(10);

    results.push(
      ...encyclopediaResults.map((e) => ({
        type: "encyclopedia" as const,
        slug: e.slug,
        title: e.title,
        excerpt: e.excerpt.slice(0, 200),
        category: e.category,
      }))
    );
  }

  return NextResponse.json({ results, total: results.length });
}
```

- [ ] **Step 2: Verify search API**

```bash
pnpm dev
```

Test: `curl "http://localhost:3000/api/search?q=般若"`. Expected: JSON response with results from sutras, glossary, and encyclopedia.

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "feat: add search API with cross-entity full-text search"
```

---

### Task 15: Build Search Page

**Files:**
- Create: `src/app/search/page.tsx`, `components/search/search-result-item.tsx`, `components/search/search-filters.tsx`

**Interfaces:**
- Consumes: Search API from Task 14
- Produces: `/search?q=...` page rendering search results

- [ ] **Step 1: Write SearchResultItem component**

Create `components/search/search-result-item.tsx`:

```typescript
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

const TYPE_LABELS: Record<string, string> = {
  sutra: "经典",
  glossary: "词典",
  encyclopedia: "百科",
};

const TYPE_HREFS: Record<string, (slug: string) => string> = {
  sutra: (s) => `/sutras/${s}`,
  glossary: (s) => `/dictionary/${s}`,
  encyclopedia: (s) => `/encyclopedia/${s}`,
};

interface SearchResultItemProps {
  type: string;
  slug: string;
  title: string;
  excerpt: string;
  category?: string | null;
}

export function SearchResultItem({ type, slug, title, excerpt, category }: SearchResultItemProps) {
  return (
    <Link
      href={TYPE_HREFS[type]?.(slug) ?? "#"}
      className="block p-6 rounded-lg border border-border hover:border-accent/30 transition-colors"
    >
      <div className="flex items-center gap-2 mb-2">
        <Badge variant="outline" className="text-xs">
          {TYPE_LABELS[type] ?? type}
        </Badge>
        {category && (
          <Badge variant="secondary" className="text-xs">
            {category}
          </Badge>
        )}
      </div>
      <h3 className="text-lg font-semibold mb-1">{title}</h3>
      <p className="text-sm text-muted-foreground line-clamp-2">{excerpt}</p>
    </Link>
  );
}
```

- [ ] **Step 2: Write SearchFilters component**

Create `components/search/search-filters.tsx`:

```typescript
"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Badge } from "@/components/ui/badge";

const FILTERS = [
  { key: "all", label: "全部" },
  { key: "sutras", label: "经典" },
  { key: "glossary", label: "词典" },
  { key: "encyclopedia", label: "百科" },
] as const;

export function SearchFilters({ activeType }: { activeType?: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const q = searchParams.get("q") || "";

  function setType(type: string | null) {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (type && type !== "all") params.set("type", type);
    router.push(`/search?${params.toString()}`);
  }

  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {FILTERS.map((f) => {
        const isActive =
          f.key === "all" ? !activeType : activeType === f.key;
        return (
          <Badge
            key={f.key}
            variant={isActive ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => setType(f.key)}
          >
            {f.label}
          </Badge>
        );
      })}
    </div>
  );
}
```

- [ ] **Step 3: Write search page**

Create `src/app/search/page.tsx`:

```typescript
import { Suspense } from "react";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { SearchResultItem } from "@/components/search/search-result-item";
import { SearchFilters } from "@/components/search/search-filters";
import { EmptyState } from "@/components/shared/empty-state";
import { Search } from "lucide-react";
import { generateSeo } from "@/lib/seo";
import type { Metadata } from "next";

export const metadata: Metadata = generateSeo({
  title: "搜索",
  description: "搜索慈悲空间的经典、词典和百科内容。",
  canonical: "/search",
});

interface SearchResult {
  type: string;
  slug: string;
  title: string;
  excerpt: string;
  category?: string | null;
}

interface SearchPageProps {
  searchParams: Promise<{ q?: string; type?: string }>;
}

async function SearchResults({ q, type }: { q: string; type?: string }) {
  const params = new URLSearchParams({ q });
  if (type) params.set("type", type);

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  let results: SearchResult[] = [];
  let error: string | null = null;

  try {
    const res = await fetch(`${baseUrl}/api/search?${params.toString()}`, {
      cache: "no-store",
    });
    const data = await res.json();
    results = data.results;
  } catch {
    error = "搜索服务暂不可用，请稍后再试。";
  }

  if (error) {
    return (
      <EmptyState
        icon={<Search className="h-12 w-12" />}
        title="搜索出错"
        description={error}
      />
    );
  }

  if (results.length === 0) {
    return (
      <EmptyState
        icon={<Search className="h-12 w-12" />}
        title="未找到结果"
        description={`未找到与 "${q}" 相关的内容，请尝试其他关键词。`}
      />
    );
  }

  return (
    <div className="space-y-4">
      {results.map((r, i) => (
        <SearchResultItem key={`${r.type}-${r.slug}-${i}`} {...r} />
      ))}
    </div>
  );
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q, type } = await searchParams;

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12">
      <Breadcrumb items={[{ label: "搜索" }]} />

      <div className="mb-10">
        <h1 className="text-4xl font-bold tracking-tight mb-3">搜索</h1>
        {q && (
          <p className="text-lg text-muted-foreground">
            关于 "<span className="font-medium text-foreground">{q}</span>" 的搜索结果
          </p>
        )}
      </div>

      {!q ? (
        <EmptyState
          icon={<Search className="h-12 w-12" />}
          title="输入关键词开始搜索"
          description="通过顶部搜索框搜索经典、术语和百科内容。"
        />
      ) : (
        <>
          <Suspense fallback={null}>
            <SearchFilters activeType={type} />
          </Suspense>
          <Suspense fallback={<p className="text-muted-foreground">搜索中...</p>}>
            <SearchResults q={q} type={type} />
          </Suspense>
        </>
      )}
    </div>
  );
}
```

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: add search page with result filtering"
```

---

### Task 16: Build Homepage

**Files:**
- Modify: `src/app/page.tsx`
- Create: `components/home/hero.tsx`, `components/home/daily-sutra.tsx`, `components/home/featured-section.tsx`

**Interfaces:**
- Consumes: `db` from Task 3 for latest sutras, glossary, encyclopedia
- Produces: `/` homepage with Hero + sections

- [ ] **Step 1: Write Hero component**

Create `components/home/hero.tsx`:

```typescript
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen } from "lucide-react";

export function HomeHero() {
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 md:py-32">
      <div className="max-w-3xl">
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 font-[family-name:var(--font-serif)]">
          慈悲空间
        </h1>
        <p className="text-xl md:text-2xl text-muted-foreground mb-8 leading-relaxed">
          现代佛学研究与经典学习平台
        </p>
        <p className="text-base md:text-lg text-muted-foreground mb-10 max-w-xl leading-relaxed">
          深入经藏，智慧如海。探索大乘佛教经典原文，研习佛学术语，
          了解历史人物与宗派传承。
        </p>
        <div className="flex flex-wrap gap-4">
          <Link href="/sutras">
            <Button size="lg" className="gap-2">
              <BookOpen className="h-5 w-5" />
              开始学习
            </Button>
          </Link>
          <Link href="/sutras">
            <Button variant="outline" size="lg" className="gap-2">
              浏览经典
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Write DailySutra component**

Create `components/home/daily-sutra.tsx`:

```typescript
import Link from "next/link";
import { db } from "@/db";
import { sutras } from "@/db/schema/sutras";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";

export async function DailySutra() {
  // Pick a pseudo-random sutra based on today's date (seeded)
  const today = new Date();
  const dayOfYear = Math.floor(
    (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000
  );

  const allSutras = await db.select().from(sutras).orderBy(sutras.title);
  const dailySutra = allSutras[dayOfYear % allSutras.length];

  if (!dailySutra) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
      <div className="mb-8">
        <h2 className="text-3xl font-bold tracking-tight">今日经典</h2>
        <p className="text-muted-foreground mt-2">每日推荐一部经典，开启你的研读之旅</p>
      </div>
      <Link href={`/sutras/${dailySutra.slug}`}>
        <Card className="hover:border-accent/30 transition-colors">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-2xl font-[family-name:var(--font-serif)]">
                  {dailySutra.title}
                </CardTitle>
                {dailySutra.titleEn && (
                  <CardDescription className="text-base mt-1">
                    {dailySutra.titleEn}
                  </CardDescription>
                )}
              </div>
              <ArrowRight className="h-5 w-5 text-muted-foreground mt-1" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2 mb-3">
              {dailySutra.dynasty && <Badge variant="outline">{dailySutra.dynasty}</Badge>}
              {dailySutra.translator && <Badge variant="outline">{dailySutra.translator}译</Badge>}
            </div>
            {dailySutra.summary && (
              <p className="text-muted-foreground text-sm leading-relaxed">
                {dailySutra.summary}
              </p>
            )}
          </CardContent>
        </Card>
      </Link>
    </section>
  );
}
```

- [ ] **Step 3: Write FeaturedSection component**

Create `components/home/featured-section.tsx`:

```typescript
import { type ReactNode } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface FeaturedSectionProps {
  title: string;
  description: string;
  href: string;
  linkLabel: string;
  children: ReactNode;
}

export function FeaturedSection({
  title,
  description,
  href,
  linkLabel,
  children,
}: FeaturedSectionProps) {
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 border-t border-border">
      <div className="flex items-end justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">{title}</h2>
          <p className="text-muted-foreground mt-2">{description}</p>
        </div>
        <Link
          href={href}
          className="hidden sm:flex items-center gap-1 text-sm font-medium text-accent hover:underline"
        >
          {linkLabel}
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
      {children}
      <Link
        href={href}
        className="sm:hidden flex items-center gap-1 text-sm font-medium text-accent hover:underline mt-4"
      >
        {linkLabel}
        <ArrowRight className="h-4 w-4" />
      </Link>
    </section>
  );
}
```

- [ ] **Step 4: Write homepage**

Edit `src/app/page.tsx`:

```typescript
import { Suspense } from "react";
import { HomeHero } from "@/components/home/hero";
import { DailySutra } from "@/components/home/daily-sutra";
import { FeaturedSection } from "@/components/home/featured-section";
import { getAllSutras } from "@/lib/sutras";
import { getAllGlossaryTerms } from "@/lib/glossary";
import { SutraCard } from "@/components/sutra/sutra-card";
import { GlossaryCard } from "@/components/dictionary/glossary-card";
import { generateSeo } from "@/lib/seo";
import type { Metadata } from "next";

export const metadata: Metadata = generateSeo({
  title: "慈悲空间 — 现代佛学研究与经典学习平台",
  description:
    "深入经藏，智慧如海。慈悲空间是一个现代化佛学研究与学习平台，提供佛经原文阅读、佛学词典、百科知识库等功能。",
  canonical: "/",
});

export default async function HomePage() {
  const [latestSutras, featuredTerms] = await Promise.all([
    getAllSutras(),
    getAllGlossaryTerms(),
  ]);

  // Show first 3 sutras and first 3 glossary terms
  const displaySutras = latestSutras.slice(0, 3);
  const displayTerms = featuredTerms.slice(0, 3);

  return (
    <>
      <HomeHero />

      <Suspense fallback={null}>
        <DailySutra />
      </Suspense>

      <FeaturedSection
        title="经典库"
        description="浏览大乘佛教核心经典，阅读原文"
        href="/sutras"
        linkLabel="浏览全部经典"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {displaySutras.map((s) => (
            <SutraCard key={s.id} {...s} />
          ))}
        </div>
      </FeaturedSection>

      <FeaturedSection
        title="佛学词典"
        description="精确的术语解释，含梵文和英文对应"
        href="/dictionary"
        linkLabel="浏览全部词条"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {displayTerms.map((t) => (
            <GlossaryCard key={t.id} {...t} />
          ))}
        </div>
      </FeaturedSection>
    </>
  );
}
```

- [ ] **Step 5: Verify homepage renders**

```bash
pnpm dev
```

Navigate to `http://localhost:3000`. Expected: Hero with "慈悲空间" title and CTA buttons, Daily Sutra section, Sutra Library section with 3 cards, Dictionary section with 3 cards.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: add homepage with hero, daily sutra, and featured sections"
```

---

### Task 17: Build Auth Pages

**Files:**
- Create: `src/app/auth/login/page.tsx`, `src/app/auth/register/page.tsx`

**Interfaces:**
- Consumes: `authClient` from Task 5 (client-side only)
- Produces: `/auth/login` and `/auth/register` pages

- [ ] **Step 1: Write login page**

Create `src/app/auth/login/page.tsx`:

```typescript
"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { authClient } from "@/lib/auth-client";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await authClient.signIn.email({
      email,
      password,
    });

    setLoading(false);

    if (result.error) {
      setError(result.error.message || "登录失败，请重试。");
    } else {
      router.push("/");
      router.refresh();
    }
  }

  return (
    <div className="mx-auto max-w-md px-4 py-20">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">登录</CardTitle>
          <CardDescription>
            登录慈悲空间，记录学习笔记与收藏
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && (
              <p className="text-sm text-red-600 bg-red-50 p-3 rounded-md">{error}</p>
            )}
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                邮箱
              </label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">
                密码
              </label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-3">
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "登录中..." : "登录"}
            </Button>
            <p className="text-sm text-muted-foreground text-center">
              还没有账号？{" "}
              <Link href="/auth/register" className="text-accent hover:underline">
                注册
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
```

- [ ] **Step 2: Write register page**

Create `src/app/auth/register/page.tsx`:

```typescript
"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { authClient } from "@/lib/auth-client";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await authClient.signUp.email({
      name,
      email,
      password,
    });

    setLoading(false);

    if (result.error) {
      setError(result.error.message || "注册失败，请重试。");
    } else {
      router.push("/");
      router.refresh();
    }
  }

  return (
    <div className="mx-auto max-w-md px-4 py-20">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">注册</CardTitle>
          <CardDescription>
            创建慈悲空间账号，开始你的学习之旅
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && (
              <p className="text-sm text-red-600 bg-red-50 p-3 rounded-md">{error}</p>
            )}
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">
                名称
              </label>
              <Input
                id="name"
                type="text"
                placeholder="你的名称"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                邮箱
              </label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">
                密码
              </label>
              <Input
                id="password"
                type="password"
                placeholder="至少8位字符"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-3">
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "注册中..." : "注册"}
            </Button>
            <p className="text-sm text-muted-foreground text-center">
              已有账号？{" "}
              <Link href="/auth/login" className="text-accent hover:underline">
                登录
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
```

- [ ] **Step 3: Verify auth flow**

```bash
pnpm dev
```

- Navigate to `http://localhost:3000/auth/register`
- Register with test email
- Should redirect to homepage
- Navigate to `http://localhost:3000/auth/login`
- Log in with the same credentials
- Should redirect to homepage

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: add login and register pages"
```

---

### Task 18: Write Remaining MDX Content Files

**Files:**
- Create: `content/sutras/heart-sutra.mdx`, `content/sutras/lotus-sutra.mdx`, `content/sutras/amitabha-sutra.mdx`, `content/sutras/shurangama-sutra.mdx`, `content/sutras/avatamsaka-sutra.mdx`, `content/sutras/platform-sutra.mdx`, `content/sutras/vimalakirti-sutra.mdx`

**Interfaces:**
- Consumes: MDX frontmatter convention from design spec
- Produces: 7 additional MDX sutra files readable by `/sutras/[slug]`

- [ ] **Step 1: Write heart-sutra.mdx**

Create `content/sutras/heart-sutra.mdx`:

```mdx
---
slug: heart-sutra
title: 般若波罗蜜多心经
category: 般若部
dynasty: 唐
translator: 玄奘
---

## 心经全文

观自在菩萨，行深般若波罗蜜多时，照见五蕴皆空，度一切苦厄。

舍利子，色不异空，空不异色，色即是空，空即是色，受想行识，亦复如是。

舍利子，是诸法空相，不生不灭，不垢不净，不增不减。

是故空中无色，无受想行识，无眼耳鼻舌身意，无色声香味触法，
无眼界，乃至无意识界。无无明，亦无无明尽，乃至无老死，
亦无老死尽。无苦集灭道，无智亦无得。以无所得故。

菩提萨埵，依般若波罗蜜多故，心无挂碍。无挂碍故，
无有恐怖，远离颠倒梦想，究竟涅槃。

三世诸佛，依般若波罗蜜多故，得阿耨多罗三藐三菩提。

故知般若波罗蜜多，是大神咒，是大明咒，是无上咒，是无等等咒，
能除一切苦，真实不虚。

故说般若波罗蜜多咒，即说咒曰：揭谛揭谛，波罗揭谛，波罗僧揭谛，菩提萨婆诃。
```

- [ ] **Step 2: Write lotus-sutra.mdx**

Create `content/sutras/lotus-sutra.mdx`:

```mdx
---
slug: lotus-sutra
title: 妙法莲华经
category: 法华部
dynasty: 姚秦
translator: 鸠摩罗什
---

## 方便品第二（节选）

尔时，世尊从三昧安详而起，告舍利弗：

"诸佛智慧甚深无量，其智慧门难解难入，一切声闻、辟支佛所不能知。
所以者何？佛曾亲近百千万亿无数诸佛，尽行诸佛无量道法，勇猛精进，
名称普闻，成就甚深未曾有法，随宜所说，意趣难解。"

"舍利弗，吾从成佛已来，种种因缘，种种譬喻，广演言教，
无数方便引导众生，令离诸著。所以者何？如来方便知见波罗蜜，
皆已具足。"

"舍利弗，如来知见，广大深远，无量无碍，力无所畏，禅定解脱三昧，
深入无际，成就一切未曾有法。"

## 譬喻品第三（节选）

"舍利弗，若国邑聚落有大长者，其年衰迈，财富无量，
多有田宅及诸僮仆。其家广大，唯有一门，多诸人众，
一百、二百乃至五百人止住其中。堂阁朽故，墙壁隤落，
柱根腐败，梁栋倾危，周匝俱时歘然火起，焚烧舍宅。"

"是时长者见是大火从四面起，即大惊怖，而作是念：
'我虽能于此所烧之门安隐得出，而诸子等于火宅内乐著嬉戏，
不觉不知，不惊不怖，火来逼身，苦痛切己，心不厌患，无求出意。'"
```

- [ ] **Step 3: Write amitabha-sutra.mdx**

Create `content/sutras/amitabha-sutra.mdx`:

```mdx
---
slug: amitabha-sutra
title: 佛说阿弥陀经
category: 净土部
dynasty: 姚秦
translator: 鸠摩罗什
---

## 正文（节选）

如是我闻。一时，佛在舍卫国祇树给孤独园，与大比丘僧千二百五十人俱，
皆是大阿罗汉，众所知识。

尔时，佛告长老舍利弗：

"从是西方，过十万亿佛土，有世界名曰极乐。其土有佛，号阿弥陀，今现在说法。"

"舍利弗，彼土何故名为极乐？其国众生，无有众苦，但受诸乐，故名极乐。"

"又舍利弗，极乐国土，七重栏楯，七重罗网，七重行树，皆是四宝，
周匝围绕，是故彼国名为极乐。"

"又舍利弗，极乐国土有七宝池，八功德水充满其中。池底纯以金沙布地。
四边阶道，金、银、琉璃、玻璃合成。上有楼阁，亦以金、银、琉璃、玻璃、
砗磲、赤珠、玛瑙而严饰之。池中莲花，大如车轮，青色青光，黄色黄光，
赤色赤光，白色白光，微妙香洁。"

"舍利弗，极乐国土成就如是功德庄严。"
```

- [ ] **Step 4: Write shurangama-sutra.mdx**

Create `content/sutras/shurangama-sutra.mdx`:

```mdx
---
slug: shurangama-sutra
title: 大佛顶首楞严经
category: 密教部
dynasty: 唐
translator: 般剌密谛
---

## 卷一（节选）

如是我闻。一时，佛在室罗筏城祇桓精舍，与大比丘众千二百五十人俱。

时，波斯匿王为其父王讳日营斋，请佛宫掖，自迎如来，广设珍羞无上妙味，
兼复亲延诸大菩萨。城中复有长者居士，同时饭僧，伫佛来应。
佛敕文殊，分领菩萨及阿罗汉，应诸斋主。

唯有阿难，先受别请，远游未还，不遑僧次。既无上座，及阿阇梨，
途中独归。其日无供，即时阿难执持应器，于所游城次第循乞。

心中初求最后檀越以为斋主，无问刹帝利尊姓及旃陀罗。
方行等慈，不择微贱，发意圆成一切众生无量功德。

## 卷二（节选）

佛告阿难："汝等当知，一切众生从无始来生死相续，皆由不知常住真心性净明体，
用诸妄想，此想不真，故有轮转。"
```

- [ ] **Step 5: Write avatamsaka-sutra.mdx**

Create `content/sutras/avatamsaka-sutra.mdx`:

```mdx
---
slug: avatamsaka-sutra
title: 大方广佛华严经
category: 华严部
dynasty: 唐
translator: 实叉难陀
---

## 觉林菩萨偈（节选）

譬如工画师，分布诸彩色。
虚妄取异相，大种无差别。
大种中无色，色中无大种。
亦不离大种，而有色可得。

心中无彩画，彩画中无心。
然不离于心，有彩画可得。
彼心恒不住，无量难思议。
示现一切色，各各不相知。

譬如工画师，不能知自心。
而由心故画，诸法性如是。
心如工画师，能画诸世间。
五蕴悉从生，无法而不造。

## 梵行品（节选）

若人欲了知，三世一切佛。
应观法界性，一切唯心造。
```

- [ ] **Step 6: Write platform-sutra.mdx**

Create `content/sutras/platform-sutra.mdx`:

```mdx
---
slug: platform-sutra
title: 六祖大师法宝坛经
category: 禅宗部
dynasty: 唐
translator: 法海（集记）
---

## 行由品第一（节选）

时，大师至宝林，韶州韦刺史与官僚入山请师出，于城中大梵寺讲堂为众开缘说法。

师升座次，刺史官僚三十余人、儒宗学士二十余人、僧尼道俗一千余人，
同时作礼，愿闻法要。

大师告众曰：

"善知识，菩提自性，本来清净，但用此心，直了成佛。
善知识，且听惠能行由得法事意。"

"惠能严父，本贯范阳，左降流于岭南，作新州百姓。此身不幸，
父又早亡。老母孤遗，移来南海，艰辛贫乏，于市卖柴。"

## 般若品第二（节选）

"善知识，凡夫即佛，烦恼即菩提。前念迷即凡夫，后念悟即佛。
前念著境即烦恼，后念离境即菩提。"
```

- [ ] **Step 7: Write vimalakirti-sutra.mdx**

Create `content/sutras/vimalakirti-sutra.mdx`:

```mdx
---
slug: vimalakirti-sutra
title: 维摩诘所说经
category: 经集部
dynasty: 姚秦
translator: 鸠摩罗什
---

## 方便品第二（节选）

尔时，毗耶离大城中有长者，名维摩诘。已曾供养无量诸佛，深殖善本，
得无生忍，辩才无碍，游戏神通，逮诸总持，获无所畏，降魔劳怨，
入深法门，善于智度，通达方便，大愿成就。

明了众生心之所趣，又能分别诸根利钝，久于佛道心已纯淑，决定大乘。
诸有所作能善思量，住佛威仪，心大如海。

## 入不二法门品第九（节选）

尔时，维摩诘谓众菩萨言："诸仁者，云何菩萨入不二法门？各随所乐说之。"

会中有菩萨名法自在，说言："诸仁者，生灭为二。法本不生，今则无灭。
得此无生法忍，是为入不二法门。"

德守菩萨曰："我我所为二。因有我故便有我所，若无有我则无我所。
是为入不二法门。"
```

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "feat: add all 8 MDX sutra content files"
```

---

### Task 19: SEO Metadata Integration on All Pages

**Files:**
- Verify/Update: all page files already created, ensure `generateSeo()` is used consistently
- Create: `src/app/sitemap.ts`, `src/app/robots.ts`

**Interfaces:**
- Consumes: all pages from Tasks 8-17
- Produces: site-wide SEO compliance per design spec

- [ ] **Step 1: Verify all pages have metadata exports**

Check every `page.tsx` already has `generateSeo()` or `Metadata` export (they do from previous tasks). Add `openGraph` images note:

All pages already export metadata via `generateSeo()`. ✅ — verified by construction.

- [ ] **Step 2: Write sitemap**

Create `src/app/sitemap.ts`:

```typescript
import { getAllSutras } from "@/lib/sutras";
import { getAllGlossaryTerms } from "@/lib/glossary";
import { getAllEncyclopediaEntries } from "@/lib/encyclopedia";
import type { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://cebei.space";

  const [sutras, terms, entries] = await Promise.all([
    getAllSutras(),
    getAllGlossaryTerms(),
    getAllEncyclopediaEntries(),
  ]);

  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: `${baseUrl}/sutras`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/dictionary`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/encyclopedia`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/search`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.5 },
  ];

  const sutraPages: MetadataRoute.Sitemap = sutras.map((s) => ({
    url: `${baseUrl}/sutras/${s.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const glossaryPages: MetadataRoute.Sitemap = terms.map((t) => ({
    url: `${baseUrl}/dictionary/${t.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const encyclopediaPages: MetadataRoute.Sitemap = entries.map((e) => ({
    url: `${baseUrl}/encyclopedia/${e.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...staticPages, ...sutraPages, ...glossaryPages, ...encyclopediaPages];
}
```

- [ ] **Step 3: Write robots.txt**

Create `src/app/robots.ts`:

```typescript
import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://cebei.space";
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/auth/"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
```

- [ ] **Step 4: Add JSON-LD structured data to sutra detail page**

Update `src/app/sutras/[slug]/page.tsx` — add schema.org structured data in the component (not metadata):

The `generateSeo()` already outputs schema via `other["schema:org"]`. No further changes needed for basic SEO. ✅

- [ ] **Step 5: Verify SEO in page source**

```bash
pnpm dev
```

Navigate to `http://localhost:3000/sutras/diamond-sutra`. View page source. Expected: `<title>`, `<meta name="description">`, `<link rel="canonical">`, `<meta property="og:title">`.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: add sitemap, robots.txt, and verify SEO on all pages"
```

---

### Task 20: Vercel Deployment Configuration

**Files:**
- Create: `vercel.json`
- Modify: `.env.local` (document production vars)

**Interfaces:**
- Consumes: complete Phase 1 application
- Produces: deployable application on Vercel

- [ ] **Step 1: Write vercel.json**

Create `vercel.json`:

```json
{
  "buildCommand": "pnpm build",
  "installCommand": "pnpm install",
  "framework": "nextjs",
  "regions": ["hkg1"]
}
```

- [ ] **Step 2: Document environment variables for production**

Create `.env.example`:

```
# Database
DATABASE_URL=postgres://user:password@host:5432/dbname

# Better Auth
BETTER_AUTH_SECRET=generate-a-random-secret-here
BETTER_AUTH_URL=https://cebei.space

# App
NEXT_PUBLIC_APP_URL=https://cebei.space
```

- [ ] **Step 3: Run final build check**

```bash
pnpm build
```

Expected: Build succeeds with no errors. Check for any TypeScript errors, ESLint warnings, or routing issues. Fix if any.

- [ ] **Step 4: Run full verification checklist**

```bash
pnpm dev
```

Manual verification checklist:

| # | Check | How |
|---|-------|-----|
| 1 | Homepage renders | Visit `/` |
| 2 | Sutra list renders | Visit `/sutras` |
| 3 | Category filter works | Click category badges on `/sutras` |
| 4 | Sutra detail renders | Visit `/sutras/diamond-sutra` |
| 5 | Dictionary list renders | Visit `/dictionary` |
| 6 | Dictionary detail renders | Visit `/dictionary/prajna` |
| 7 | Encyclopedia list renders | Visit `/encyclopedia` |
| 8 | Encyclopedia detail renders | Visit `/encyclopedia/nagarjuna` |
| 9 | Search API works | `curl "localhost:3000/api/search?q=般若"` |
| 10 | Search page renders | Visit `/search?q=般若` |
| 11 | Login page renders | Visit `/auth/login` |
| 12 | Register page renders | Visit `/auth/register` |
| 13 | Registration works | Register a test user |
| 14 | Login works | Login with the test user |
| 15 | SEO tags present | View source on any page |
| 16 | Sitemap renders | Visit `/sitemap.xml` |
| 17 | Robots.txt renders | Visit `/robots.txt` |
| 18 | Design compliance | Check: minimal, warm gray + gold only, no flashy animations |
| 19 | Mobile responsive | Resize browser to 375px width |
| 20 | Build succeeds | `pnpm build` exits 0 |

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "chore: add Vercel deployment config and env template"
```

---

## Implementation Summary

| # | Task | Files | Est. Time |
|---|------|-------|-----------|
| 1 | Scaffold Next.js 16 | ~8 | 10 min |
| 2 | Tailwind + shadcn/ui + Design Tokens | ~2 | 15 min |
| 3 | Drizzle ORM + DB Schema | ~7 | 20 min |
| 4 | Seed Script | 1 | 15 min |
| 5 | Better Auth Setup | 3 | 15 min |
| 6 | Global Layout (Header/Footer) | 4 | 20 min |
| 7 | SEO Utility + Shared Components | 4 | 15 min |
| 8 | Sutra List Page | 4 | 20 min |
| 9 | Sutra Detail Page (MDX Reader) | 4 | 25 min |
| 10 | Dictionary List Page | 4 | 20 min |
| 11 | Dictionary Detail Page | 2 | 15 min |
| 12 | Encyclopedia List Page | 4 | 20 min |
| 13 | Encyclopedia Detail Page | 1 | 10 min |
| 14 | Search API | 1 | 15 min |
| 15 | Search Page | 3 | 20 min |
| 16 | Homepage | 4 | 25 min |
| 17 | Auth Pages (Login/Register) | 2 | 20 min |
| 18 | MDX Content Files (7 sutras) | 7 | 20 min |
| 19 | SEO Integration + Sitemap | 2 | 15 min |
| 20 | Vercel Config + Final QA | 2 | 15 min |

**Total: ~20 tasks, ~350 min (~6 hours)**
