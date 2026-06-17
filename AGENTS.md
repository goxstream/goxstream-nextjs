# GoxStream NextJS Guidelines

This document contains rules, guidelines, and conventions for the GoxStream anime streaming platform codebase. All agents and sub-agents must adhere strictly to these conventions.

## Foundational Context

This application is built using Next.js 16 App Router, React 19, Tailwind CSS v4, and Drizzle ORM, deployed on Cloudflare Workers via OpenNextJS/Cloudflare.

- **Next.js**: 16.2.6 (App Router)
- **React**: 19.1.7
- **Tailwind CSS**: v4 (PostCSS/CSS-first config)
- **Drizzle ORM**: 0.45.2 (drizzle-kit, D1 driver)
- **Wrangler**: v4 (Cloudflare Workers CLI)
- **Adapter**: @opennextjs/cloudflare (1.19.9)

## Skills Activation

This repository contains local agent skills structured inside the `.agents/skills/` directory. You MUST activate the relevant skill whenever working on tasks within its domain:

- `next-app-router-development`: Applied when creating or modifying pages, layouts, templates, React Server Components (RSC), Client Components, Server Actions, or route handlers.
- `cloudflare-development`: Applied when working with Cloudflare Workers configurations, R2 bucket operations, KV caching, or Queues.
- `cloudflare-d1-development`: Applied when writing D1 queries, managing Drizzle/D1 migrations, executing Wrangler D1 commands, or initializing D1 database clients.
- `drizzle-orm-development`: Applied when writing database schemas, relations, creating migrations, or running seeding operations.
- `tailwindcss-v4-development`: Applied when writing styles, editing theme tokens, utility classes, and layouts.
- `shadcn-ui-development`: Applied when using shadcn CLI or installing components.


## Conventions

### 1. Consistency First
- Prioritize consistency over theoretical ideals. Before writing code, inspect sibling components, actions, or route handlers to replicate established patterns, imports, structures, and styling.
- Follow the directory structure defined in [.agents/PROJECT_STRUCTURE_RULE.md](file:///c:/Users/dyzulk/Documents/goxstream/goxstream-nextjs/.agents/PROJECT_STRUCTURE_RULE.md) and the architectural guidelines in [.agents/PROJECT_ARCHITECTURE.md](file:///c:/Users/dyzulk/Documents/goxstream/goxstream-nextjs/.agents/PROJECT_ARCHITECTURE.md) exactly.

### 2. Directory & Naming Guidelines
- Use `kebab-case` for directory names (e.g., `src/features/watch-history/`).
- Use `PascalCase` for React components and file names containing them (e.g., `WatchPlayer.tsx`).
- Use `camelCase` for utilities, schemas, helper functions, and actions (e.g., `getUserHistory.ts`).

### 3. Next.js 16 App Router
- Default all files in `src/app/` to React Server Components (RSC) to preserve performance and edge capabilities.
- Explicitly declare `"use client"` only at the very top of components that require hooks, client side interactivity, or browser APIs.
- Place Server Actions in distinct files with `"use server"` declarations.

### 4. Database Access
- Never perform raw SQL queries directly. Always query via the Drizzle ORM bound `DB` client interface.
- Ensure database interactions are wrapped in transactions if performing multi-step writes.

### 5. Formatting & Styles
- Avoid writing raw or vanilla CSS in components. Always use Tailwind CSS v4 utility classes.
- Theme tokens must be declared using the `@theme` directive in `src/styles/globals.css`.

### 6. Environment Variables Naming
- Environment variables related to the GoxStream domain logic, backend APIs, services, or private server credentials MUST be prefixed with `GOX_` (e.g., `GOX_DATABASE_URL`, `GOX_ANILIST_API_KEY`, `GOX_ADMIN_SLUG`).
- Environment variables intended for exposure to the Next.js client-side browser (accessible in Client Components) MUST be prefixed with `NEXT_PUBLIC_` (e.g., `NEXT_PUBLIC_APP_URL`).

## Engineering Workflow

### 1. Verification & Compilation
- Run TypeScript checks to verify type safety:
  ```bash
  npx tsc --noEmit
  ```
- Run linter verification to maintain code style:
  ```bash
  npm run lint
  ```

### 2. Cloudflare & Local Build
- Run local Wrangler dev server to verify local execution:
  ```bash
  npx wrangler dev
  ```
- Build the bundle to confirm compatibility with the OpenNextJS/Cloudflare compiler:
  ```bash
  npm run build
  ```

### 3. Drizzle Schema Updates
- When updating schemas in `src/infrastructure/database/drizzle/schema/`:
  1. Generate migrations:
     ```bash
     npx drizzle-kit generate
     ```
  2. Apply migrations locally or to preview D1:
     ```bash
     npx wrangler d1 execute DB --local --file=drizzle/migrations/0000_xxxx.sql
     ```
  3. Rebuild Cloudflare types:
     ```bash
     npm run cf-typegen
     ```
