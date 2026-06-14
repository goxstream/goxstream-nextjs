# Prompt for Antigravity IDE

Goal:

Create an `implementation_plan_01.md` artifact for building a modern anime streaming homepage inspired by the attached reference layout (similar information architecture to Bstation), using Next.js 16, React 19, TypeScript, Tailwind CSS v4, shadcn/ui, Animate UI, and Motion (motion.dev).

Important:

- Do NOT implement code yet.
- Generate only a detailed `implementation_plan_01.md`.
- The document must be highly structured and production-oriented.
- The plan should assume this is a long-term anime streaming platform named "GoxStream".
- Focus only on Homepage (Landing Page).
- Use dummy data only.
- Mobile-first but optimized for desktop.
- Use modern component composition patterns.
- Follow App Router architecture.
- Use Server Components whenever possible.
- Use Client Components only when interactivity is required.
- Use TypeScript strict mode assumptions.
- Use reusable section architecture.

---

# Step 0 (MANDATORY)

Before any planning section, the document MUST begin with:

# Data Preparation

Create dummy anime dataset consisting of 10 anime entries.

Required fields:

- id
- title
- slug
- coverImage
- bannerImage
- synopsis
- genres
- year
- quarter
- episodeCount
- status
- rating
- popularity

Quarter values:

- Winter
- Spring
- Summer
- Fall

Genre examples:

- Action
- Adventure
- Fantasy
- Isekai
- Romance
- Comedy
- Drama
- Mystery
- Sci-Fi
- Slice of Life

Generate realistic dummy data.

Also define:

- Trending Anime
- New Releases
- Top Rated
- Continue Watching
- Recommended
- Seasonal Anime

The implementation plan must explain where the dummy data should be stored and how it should be structured for future migration to API/database sources.

---

# Typography System (MANDATORY)

The implementation plan must establish a strict typography system and enforce it across the entire homepage.

## Primary Heading Font

Use:

- Plus Jakarta Sans

This font MUST be used for:

- Brand logo text
- Hero titles
- Section titles
- Anime titles
- Navigation labels
- Sidebar menu items
- Buttons
- Search interface labels
- Metadata labels
- Tags and badges
- Card headings
- CTA elements

Recommended weights:

- 500 Medium
- 600 SemiBold
- 700 Bold
- 800 ExtraBold

Purpose:

- Modern streaming-platform appearance
- Strong visual hierarchy
- Clean branding consistency
- High readability across desktop and mobile

---

## Body Font

Use:

- Helvetica
- Helvetica Neue
- Arial
- sans-serif

This font MUST be used for:

- Anime synopsis
- Paragraph content
- Descriptions
- Footer text
- Informational content
- Secondary metadata
- Supporting text

Recommended weights:

- 400 Regular
- 500 Medium

Purpose:

- Comfortable reading experience
- Neutral and timeless appearance
- Excellent readability for long-form content

---

## Typography Constraint

Do NOT introduce:

- Additional heading fonts
- Display fonts
- Serif fonts
- Decorative fonts
- Script fonts

The homepage typography system must exclusively use:

- Plus Jakarta Sans (Heading System)
- Helvetica Stack (Body System)

---

## Tailwind Font Mapping

The implementation plan must define:

font-heading:

"Plus Jakarta Sans", sans-serif

font-body:

"Helvetica Neue", Helvetica, Arial, sans-serif

Example usage:

- Hero Title → font-heading
- Section Title → font-heading
- Anime Title → font-heading
- Navigation → font-heading
- Button Text → font-heading
- Synopsis → font-body
- Description → font-body
- Footer Content → font-body

---

## Typography Hierarchy

The implementation plan must define responsive typography scales for:

1. Hero Title
2. Section Title
3. Anime Title
4. Navigation Label
5. Metadata
6. Body Text
7. Caption

Suggested ranges:

Hero Title:

48–72px

Section Title:

24–32px

Anime Title:

18–24px

Navigation:

14–16px

Body Text:

14–16px

Caption:

12–14px

The implementation plan should explain how this typography system supports a premium anime streaming experience while maintaining a distinctive GoxStream identity.

---

# Tech Stack Context

Current project:

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS v4
- Motion (motion.dev)
- Shadcn/UI
- Animate UI
- Lucide React
- Embla Carousel

Available dependencies are already installed.

Use:

- Animate UI components whenever possible
- Motion.dev for page transitions and advanced animations
- Embla Carousel for horizontal anime rails
- Radix primitives through Animate UI/Shadcn

Avoid introducing unnecessary dependencies.

---

# Design Direction

Create a premium anime streaming experience inspired by:

- Netflix
- Crunchyroll
- Bstation
- Disney+
- IQIYI

Characteristics:

- Clean
- Modern
- Cinematic
- Content-first
- Smooth animations
- High visual hierarchy
- Large artwork
- Strong typography
- Fast perceived performance

Do not copy branding.

Create original design language for GoxStream.

---

# Homepage Layout Reference

The implementation plan must include this ASCII wireframe and explain every section.

Desktop Layout:

┌──────────────────────────────────────────────────────────────────────┐
│ HEADER                                                               │
│ ☰ Logo      Search                         User Actions             │
└──────────────────────────────────────────────────────────────────────┘

┌───────────────────────┬──────────────────────────────────────────────┐
│ SIDEBAR               │                                              │
│                       │                                              │
│ Home                  │               HERO BANNER                    │
│ Anime                 │                                              │
│ Movies                │           Featured Anime + CTA + Metadata    │
│ Trending              │                                              │
│ Categories            │                                              │
│                       │                                              │
│                       │                                              │
└───────────────────────┴──────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────┐
│                                                                      │
│                                                                      │
│                         HERO BANNER                                  │
│                                                                      │
│                 Featured Anime + CTA + Metadata                      │
│                                                                      │
│                                                                      │
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────┐
│ CONTINUE WATCHING                                                    │
│ ◄ Anime Card  Anime Card  Anime Card  Anime Card  Anime Card ►       │
└──────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────┐
│ TRENDING THIS WEEK                                                   │
│ ◄ Anime Card  Anime Card  Anime Card  Anime Card  Anime Card ►       │
└──────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────┐
│ NEW RELEASES                                                         │
│ ◄ Anime Card  Anime Card  Anime Card  Anime Card  Anime Card ►       │
└──────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────┐
│ TOP RATED                                                            │
│ ◄ Anime Card  Anime Card  Anime Card  Anime Card  Anime Card ►       │
└──────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────┐
│ SEASONAL ANIME                                                       │
│ ◄ Anime Card  Anime Card  Anime Card  Anime Card  Anime Card ►       │
└──────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────┐
│ RECOMMENDED FOR YOU                                                  │
│ ◄ Anime Card  Anime Card  Anime Card  Anime Card  Anime Card ►       │
└──────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────┐
│ GENRE SHOWCASES                                                      │
│ Action | Fantasy | Romance | Sci-Fi | Comedy                         │
└──────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────┐
│ FOOTER                                                               │
└──────────────────────────────────────────────────────────────────────┘

---

# Animation Requirements

Document must explain:

## Hero

Use Motion.dev:

- Hero entrance animation
- Background parallax
- CTA reveal animation
- Metadata stagger animation

## Anime Rails

Use Animate UI + Motion:

- Fade in on viewport
- Stagger card appearance
- Hover lift effect
- Hover scale effect
- Poster image zoom effect

## Sidebar

Use Animate UI:

- Collapsible desktop sidebar
- Mobile drawer
- Smooth open/close transitions

## Search

Use animated search expansion.

## Page

Use route transition strategy.

---

# Component Architecture

The implementation plan must propose component hierarchy such as:

app/
components/
features/
data/
lib/

Homepage sections should be isolated into reusable feature modules.

Example:

features/home/
- hero
- anime-rail
- continue-watching
- trending
- seasonal
- recommendations
- genre-showcase

Explain responsibilities of every module.

---

# Anime Card System

The implementation plan must define:

- Small Card
- Medium Card
- Large Featured Card

For each card specify:

- dimensions
- content
- hover interaction
- animation behavior

---

# Responsive Strategy

Document must include:

- Mobile
- Tablet
- Desktop
- Ultra-wide

Layout adaptation rules.

---

# Performance Requirements

Document must explain:

- Server Components first
- Image optimization
- Dynamic imports
- Lazy loading rails
- Skeleton loading
- Streaming-friendly architecture

---

# Accessibility Requirements

Document must explain:

- Keyboard navigation
- Focus states
- ARIA labels
- Reduced motion support

---

# Deliverable

Generate a complete and detailed `implementation_plan_01.md`.

The document should be written as if prepared by a senior frontend architect reviewing a production anime streaming platform roadmap.
