# Cebei Space — Phase 1 MVP Design Spec

**Date:** 2026-06-24
**Status:** Approved
**Context:** 基于 [DEV.md](../../../DEV.md) 的 Phase 1 实现设计

---

## 1. Project Summary

**Cebei Space**（慈悲空间）是一个现代化佛学研究与学习平台。Phase 1 目标：上线可用的知识库，包含首页、经典库、佛学词典、百科、搜索、最小登录。

## 2. Architecture

```
┌─────────────────────────────────────────────────────┐
│                    Vercel                            │
│  ┌───────────────────────────────────────────────┐  │
│  │              Next.js 16 App Router             │  │
│  │                                                │  │
│  │  /sutras          ← MDX 渲染（5-10部核心经典）  │  │
│  │  /dictionary      ← PostgreSQL 查询            │  │
│  │  /encyclopedia    ← PostgreSQL 查询            │  │
│  │  /search          ← PostgreSQL FTS             │  │
│  │  /                ← 首页（混合数据源）           │  │
│  │                                                │  │
│  │  Route Handlers   ← REST API                   │  │
│  │  Drizzle ORM      ← 数据库层                    │  │
│  │  Better Auth      ← 认证（最小登录）            │  │
│  └───────────────────────────────────────────────┘  │
│                         │                           │
│              ┌──────────┴──────────┐                │
│              │   Remote PostgreSQL │                │
│              │   (user-provided)   │                │
│              └─────────────────────┘                │
└─────────────────────────────────────────────────────┘
```

### Key Decisions

- **MDX 存经典正文**：Phase 1 手选 5-10 部核心经典，内容以 MDX 文件形式存放 repo
- **PostgreSQL 存结构化数据**：词典、百科、用户、经典元数据（`sutras` 表）
- **MDX ↔ DB 关联**：通过 `slug` 字段关联（MDX 文件名 ↔ `sutras.slug`）
- **搜索分层**：PostgreSQL FTS 搜词典+百科+经典元数据；经典正文搜索后续由 Meilisearch/Typesense 补充
- **Better Auth 最小登录**：Phase 1 即集成邮箱注册/登录，为 Phase 2 笔记收藏做准备
- **远程数据库**：使用用户提供的远程 PostgreSQL 实例

## 3. Tech Stack

| 层 | 技术 | 版本 |
|----|------|------|
| Framework | Next.js App Router | 16 |
| Language | TypeScript | 5.x |
| Styling | Tailwind CSS | 4.x |
| UI Kit | shadcn/ui | latest |
| Icons | Lucide Icons | latest |
| Content | MDX | v3 |
| ORM | Drizzle ORM | latest |
| Database | PostgreSQL | 17 |
| Auth | Better Auth | latest |
| Deployment | Vercel | — |

## 4. Data Model

### 4.1 Tables (Drizzle ORM + PostgreSQL)

```sql
-- 用户 (Phase 1 最小登录)
users
  id          uuid PK DEFAULT gen_random_uuid()
  email       text UNIQUE NOT NULL
  name        text
  avatar_url  text
  created_at  timestamptz DEFAULT now()

-- 经典元数据（MDX 的索引）
sutras
  id          uuid PK
  slug        text UNIQUE NOT NULL       -- 对应 MDX 文件名，如 "diamond-sutra"
  title       text NOT NULL              -- 金刚经
  title_en    text                       -- Diamond Sutra
  dynasty     text                       -- 唐
  translator  text                       -- 鸠摩罗什
  summary     text                       -- 简介
  category    text                       -- 般若部 / 法华部 / ...
  created_at  timestamptz DEFAULT now()

-- 词典
glossary
  id             uuid PK
  slug           text UNIQUE NOT NULL     -- URL slug: "prajna"
  term           text NOT NULL            -- 般若
  term_en        text                     -- Prajñā
  term_sanskrit  text                     -- प्रज्ञा
  definition     text NOT NULL
  related_terms  text[]                   -- {菩提, 空性}
  created_at     timestamptz DEFAULT now()

-- 百科
encyclopedia
  id         uuid PK
  slug       text UNIQUE NOT NULL        -- URL slug: "nagarjuna"
  title      text NOT NULL
  category   text                        -- 人物 / 宗派 / 经典 / 历史
  content    text NOT NULL
  created_at timestamptz DEFAULT now()
```

### 4.2 Full Text Search Indexes

```sql
CREATE INDEX idx_glossary_fts ON glossary
  USING gin(to_tsvector('simple', term || ' ' || definition));
CREATE INDEX idx_encyclopedia_fts ON encyclopedia
  USING gin(to_tsvector('simple', title || ' ' || content));
CREATE INDEX idx_sutras_fts ON sutras
  USING gin(to_tsvector('simple', title || ' ' || coalesce(summary,'')));
```

### 4.3 MDX File Structure

```
content/sutras/
├── diamond-sutra.mdx          ← 金刚经
├── heart-sutra.mdx            ← 心经
├── lotus-sutra.mdx            ← 法华经（节选）
├── amitabha-sutra.mdx         ← 阿弥陀经
├── shurangama-sutra.mdx       ← 楞严经（节选）
├── avatamsaka-sutra.mdx       ← 华严经（节选）
├── platform-sutra.mdx         ← 六祖坛经
└── vimalakirti-sutra.mdx      ← 维摩诘经
```

每个 MDX 文件包含 frontmatter：

```yaml
---
slug: diamond-sutra
title: 金刚般若波罗蜜经
category: 般若部
---
```

## 5. Routes & Pages (11 pages)

### 5.1 Route Map

```
/
├── page.tsx                    ← 首页
├── layout.tsx                  ← 全局 Layout
│
├── /sutras
│   ├── page.tsx                ← 经典库列表
│   ├── [slug]
│   │   └── page.tsx            ← 经典阅读详情
│
├── /dictionary
│   ├── page.tsx                ← 词典首页
│   ├── [slug]
│   │   └── page.tsx            ← 词条详情
│
├── /encyclopedia
│   ├── page.tsx                ← 百科首页
│   ├── [slug]
│   │   └── page.tsx            ← 百科条目
│
├── /search
│   └── page.tsx                ← 全局搜索
│
├── /auth
│   ├── /login/page.tsx         ← 登录
│   └── /register/page.tsx      ← 注册
│
├── /api
│   ├── /auth/[...all]/route.ts ← Better Auth
│   ├── /sutras/route.ts        ← 经典 CRUD
│   ├── /glossary/route.ts      ← 词典 CRUD
│   ├── /encyclopedia/route.ts  ← 百科 CRUD
│   └── /search/route.ts        ← 搜索 API
```

### 5.2 Page Summary

| 页面 | URL | 数据源 | 功能 |
|------|-----|--------|------|
| 首页 | `/` | DB + MDX 摘要 | Hero → 今日经典 → 词典入口 → 百科入口 → 热门专题 |
| 经典列表 | `/sutras` | DB `sutras` 表 | 分类筛选、朝代筛选、搜索、卡片列表 |
| 经典阅读 | `/sutras/[slug]` | MDX 渲染 | 正文阅读、侧栏目录、版本信息 |
| 词典列表 | `/dictionary` | DB `glossary` 表 | A-Z 索引、部首索引、搜索 |
| 词条详情 | `/dictionary/[slug]` | DB `glossary` | 术语解释、梵文、英文、相关词 |
| 百科列表 | `/encyclopedia` | DB `encyclopedia` | 按分类筛选：人物/宗派/经典/历史 |
| 百科详情 | `/encyclopedia/[slug]` | DB `encyclopedia` | 长篇内容阅读 |
| 全局搜索 | `/search` | PostgreSQL FTS | 跨库搜索、按类型筛选结果 |
| 登录 | `/auth/login` | Better Auth | 邮箱密码登录 |
| 注册 | `/auth/register` | Better Auth | 邮箱注册 |

## 6. Component Architecture

```
components/
├── ui/                          ← shadcn/ui 组件（约 8 个）
│   ├── button.tsx
│   ├── input.tsx
│   ├── card.tsx
│   ├── dialog.tsx
│   ├── dropdown-menu.tsx
│   ├── badge.tsx
│   ├── separator.tsx
│   └── skeleton.tsx
│
├── layout/
│   ├── header.tsx               ← 全局顶栏（Logo + 导航 + 搜索 + 用户）
│   ├── footer.tsx               ← 全局底栏
│   ├── sidebar.tsx              ← 经典阅读侧栏（目录导航）
│   └── search-bar.tsx           ← 全局搜索框
│
├── sutra/
│   ├── sutra-card.tsx           ← 经典列表卡片
│   ├── sutra-reader.tsx         ← MDX 渲染容器（阅读排版）
│   ├── sutra-toc.tsx            ← 经典目录（章节导航）
│   └── sutra-category-filter.tsx ← 分类筛选器
│
├── dictionary/
│   ├── glossary-index.tsx       ← A-Z / 部首索引
│   ├── glossary-card.tsx        ← 词条卡片
│   └── related-terms.tsx        ← 相关词条链接组件
│
├── encyclopedia/
│   ├── encyclopedia-card.tsx    ← 百科条目卡片
│   └── category-nav.tsx         ← 分类导航
│
├── search/
│   ├── search-result-item.tsx   ← 搜索结果项
│   └── search-filters.tsx       ← 结果类型筛选
│
├── home/
│   ├── hero.tsx                 ← 首页 Hero（大字标题 + CTA）
│   ├── daily-sutra.tsx          ← 今日经典模块
│   └── featured-section.tsx     ← 通用展示区（可复用）
│
└── shared/
    ├── breadcrumb.tsx           ← 面包屑导航
    ├── seo-head.tsx             ← SEO meta 生成组件
    └── empty-state.tsx          ← 空状态占位
```

**总计：~8 个 shadcn/ui 组件 + ~20 个业务组件**

## 7. Design Style

- **Apple Design Award Style**：Minimal / Elegant / Quiet / Reading Focused
- **配色**：Black + White + Warm Gray + Gold Accent
- **排版**：大字号，宽松行距，大量留白
- **避免**：花哨动画、过度配色、宗教图标堆砌

## 8. SEO Strategy (per DEV.md)

每页必须包含：
- `title` + `description`
- `canonical` URL
- Open Graph 标签
- schema.org Structured Data（Article / CollectionPage / Definition）

## 9. Content Policy

- ✅ 学术研究、经文学习、历史研究、思想讨论
- ❌ 宗教攻击、门派攻击、政治内容、迷信宣传、算命占卜、招财改运

## 10. Phase 1 Scope Boundaries

### In Scope
- 首页（Hero + 5 Sections）
- 经典库（浏览、搜索、筛选、MDX 阅读）
- 佛学词典（浏览、搜索、术语详情）
- 百科（分类浏览、条目详情）
- 全局搜索（PostgreSQL FTS）
- SEO（所有页面）
- 最小登录（Better Auth 邮箱注册/登录）
- 数据种子脚本（词典 + 百科 + 经典元数据）

### Out of Scope (Phase 2+)
- 用户系统完整功能（Phase 2）
- 笔记系统、收藏功能（Phase 2）
- AI 助手（Phase 3）
- 学习路径、推荐系统（Phase 3）
- 多语言、Mobile App、社区（Phase 4）
- Meilisearch / Typesense（Future）
