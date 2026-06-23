# DEV.md

## Project

Name: Cebei Space

Domain: cebei.space

Slogan:

> 深入经藏，智慧如海

English:

> Explore the Dharma. Study the Sutras. Cultivate Wisdom.

---

# Product Vision

Cebei Space 是一个现代化佛学研究与学习平台。

平台不以宗教宣传为目标，而以：

* 佛教经典数字化
* 佛学知识研究
* 经论学习
* 历史考据
* 学术资料整理
* AI辅助研读

为核心方向。

目标成为：

"中文互联网最完整的佛学知识库与学习平台"

参考：

* CBETA
* SAT Daizōkyō Database
* Buddhist Digital Resource Center
* Wikipedia
* Stanford Encyclopedia of Philosophy

结合现代 AI 技术构建新一代佛学研究工具。

---

# Tech Stack

## Frontend

* Next.js 16 App Router
* TypeScript
* Tailwind CSS
* shadcn/ui
* Lucide Icons
* MDX

## Backend

* Next.js Route Handlers
* PostgreSQL 17

## ORM

* Drizzle ORM

## Search

* PostgreSQL Full Text Search

Future:

* Meilisearch
* Typesense

## Authentication

* Better Auth

## Deployment

* Vercel

## Storage

* Cloudflare R2

---

# Design Principles

## Visual Style

Apple Design Award Style

Characteristics:

* Minimal
* Elegant
* Quiet
* Reading Focused
* Large Typography
* Generous White Space

Avoid:

* Flashy animations
* Excessive colors
* Religious icon overload

Use:

* Black
* White
* Warm Gray
* Gold Accent

---

# Core Modules

## 1. Sutra Library

URL

/sutras

Functions

* Browse Sutras
* Search Sutras
* Filter by Canon
* Read Original Text
* Compare Versions

Examples

* 金刚经
* 法华经
* 阿弥陀经
* 楞严经
* 华严经

---

## 2. Buddhist Dictionary

URL

/dictionary

Functions

* 佛学词典
* 名相解释
* 梵文对应
* 英文对应

Example

般若

菩提

缘起

空性

涅槃

---

## 3. Buddhist Encyclopedia

URL

/encyclopedia

Functions

* 人物
* 宗派
* 经典
* 历史事件

Examples

龙树

玄奘

鸠摩罗什

天台宗

华严宗

禅宗

---

## 4. Learning Paths

URL

/paths

Structured Learning

Beginner

Intermediate

Advanced

Example

佛学入门

四圣谛

八正道

十二因缘

中观学

唯识学

禅宗思想

---

## 5. AI Dharma Assistant

URL

/ai

Functions

* 问答
* 经文解释
* 术语解释
* 学习路线推荐

Rules

AI 必须说明：

内容仅供学习参考

不替代法师指导

不替代宗教实践

---

## 6. Notes

URL

/notes

Functions

* 阅读笔记
* 高亮摘录
* 收藏夹
* 学习记录

---

# Database Schema

## users

id
email
name
avatar
created_at

## sutras

id
title
title_en
dynasty
translator
summary
content
created_at

## glossary

id
term
term_en
definition
related_terms

## encyclopedia

id
title
category
content

## notes

id
user_id
sutra_id
content
created_at

---

# SEO Strategy

Every page must contain:

* title
* description
* canonical
* open graph
* schema.org structured data

Target Keywords

佛学

佛教经典

金刚经

心经

法华经

佛教知识库

佛教词典

Buddhist Studies

Sutra Library

Dharma Learning

---

# Homepage Structure

Hero

Title:

慈悲空间

Subtitle:

现代佛学研究与经典学习平台

CTA

开始学习

浏览经典

Sections

1. 今日经典
2. 佛学词典
3. 学习路线
4. AI佛学助手
5. 热门专题
6. 最新研究文章

---

# Content Policy

禁止：

* 宗教攻击
* 门派攻击
* 政治内容
* 迷信宣传
* 算命
* 占卜
* 招财改运

允许：

* 学术研究
* 经文学习
* 历史研究
* 思想讨论

---

# MVP Milestone

Phase 1

* 首页
* 经典库
* 佛学词典
* 搜索
* SEO

Phase 2

* 用户系统
* 笔记系统
* 收藏功能

Phase 3

* AI助手
* 学习路径
* 推荐系统

Phase 4

* 多语言
* Mobile App
* 社区功能

---

# Success Metric

Month 1

100 用户

Month 3

1000 用户

Month 6

5000 用户

Month 12

20000 用户

Goal

成为中文佛学学习领域最优秀的数字化知识平台之一。
