# DEV.md

## Project

Name: Cibei Space

Domain: cibei.space

Slogan:

> 深入经藏，智慧如海

English:

> Explore the Dharma. Study the Sutras. Cultivate Wisdom.

---

# Product Vision

Cibei Space 是一个现代化佛学研究与学习平台。

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
* CBETA 全文链接
* SAT 全文链接

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

## 7. Buddhist Sutra Stories

URL

/stories

Functions

* 佛经故事
* 本生故事
* 因缘故事
* 譬喻故事
* 分类浏览
* 相关经文链接

Description

佛教经典中蕴含着大量富有哲理和教育意义的故事，包括佛陀本生故事（Jātaka）、因缘故事、譬喻故事等。本模块对这些故事进行梳理、分类和数字化呈现，帮助用户通过生动易懂的故事理解佛法智慧。

Examples

* 舍身饲虎（本生故事）
* 九色鹿（本生故事）
* 割肉喂鹰（本生故事）
* 兔王舍身（本生故事）
* 须大拏太子（本生故事）
* 目连救母（因缘故事·盂兰盆经）
* 韦提希夫人（因缘故事·观无量寿佛经）
* 央掘魔罗（因缘故事·放下屠刀）
* 吉萨·瞿昙弥（因缘故事·芥子求药）
* 芭陀迦罗（因缘故事·一日失所有）
* 阿难与摩登伽女（因缘故事·楞严经）
* 盲人摸象（譬喻故事·涅槃经）
* 火宅三车（譬喻故事·法华经）
* 长者穷子（譬喻故事·法华经）
* 化城喻（譬喻故事·法华经）
* 衣里明珠（譬喻故事·法华经）
* 芥子纳须弥（譬喻故事·华严经）
* 三兽过河（譬喻故事·优婆塞戒经）
* 四马喻（譬喻故事·杂阿含经）
* 猴子捞月（譬喻故事·根本说一切有部毗奈耶）
* 毒箭喻（譬喻故事·箭喻经）
* 筏喻（譬喻故事·筏喻经）
* 拈花微笑（禅宗公案）
* 达摩安心（禅宗公案）
* 风幡心动（禅宗公案）
* 南泉斩猫（禅宗公案）
* 赵州无字（禅宗公案）
* 百丈野狐（禅宗公案）
* 四门游观（佛陀传记·佛所行赞）
* 降魔成道（佛陀传记·佛所行赞）
* 牧女献糜（佛陀传记·佛所行赞）
* 初转法轮（佛陀传记·转法轮经）

---

## 8. Poster Generation

URL

/api/poster/[type]/[slug]

Functions

* 生成分享海报
* 支持经典库、词典、百科、故事四个模块
* 1200×630 标准分享图
* 24小时缓存

Description

每个模块的详情页提供"下载海报"按钮，通过 @vercel/og 动态生成精美的分享图片。海报采用慈悲空间的金色极简设计风格，包含标题、摘要、品牌标识和链接，便于在社交媒体上分享传播。

Types

sutra

经典库详情页海报

dictionary

佛学词典详情页海报

encyclopedia

佛学百科详情页海报

story

佛经故事详情页海报

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
cbeta_id
sat_id
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

## stories

id
title
title_en
category
source_sutra
summary
content
moral
image_url
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
2. 佛经故事
3. 佛学词典
4. 学习路线
5. AI佛学助手
6. 热门专题
7. 最新研究文章

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
