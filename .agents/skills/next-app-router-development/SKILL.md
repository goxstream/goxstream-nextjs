---
name: next-app-router-development
description: "Activates when developing Next.js 16 App Router application. Triggered by changes to page.tsx, layout.tsx, route.ts, server actions, client components, loading/error boundaries, or metadata API. Focuses on React Server Components (RSC), Client Components, actions validation, React 19 hooks, and SEO metadata."
license: MIT
metadata:
  author: goxstream
---

# Next.js 16 App Router Development

Guidelines for developing within the Next.js 16 App Router and React 19 environment.

## consistency First
- Before creating pages or components, check sibling files inside `src/app/` or `src/features/` to maintain consistent import paths and data-fetching structures.

## Quick Reference

### 1. Server Actions → `rules/server-actions.md`
- Use Server Actions for data mutations (POST, PUT, DELETE).
- Define actions in separate files (e.g., `actions.ts`) with `"use server"` declarations.
- Wrap inputs with Zod schemas and implement error handling using structured responses.
- Access bindings and request contexts via `getRequestContext()` from Cloudflare runtime.

### 2. Data Fetching & Caching → `rules/data-fetching.md`
- Default to React Server Components (RSC) for data fetching to run logic close to the edge.
- Implement Suspense boundaries for slow page components to enable progressive loading.
- Use Next.js caching or Cloudflare KV for high-frequency dynamic routes.

### 3. Route Handlers & APIs → `rules/route-handlers.md`
- Place custom API endpoints inside `src/app/api/` using standard handlers (`export async function GET/POST`).
- Use standard `NextResponse` for JSON delivery.
- Handle authentication and origin validation dynamically.

## Environment Variables Naming
- Environment variables related to the GoxStream domain logic, APIs, or private credentials MUST always be prefixed with `GOX_` (e.g., `GOX_DATABASE_URL`, `GOX_ADMIN_SLUG`).
- Environment variables exposed to the Next.js browser client MUST be prefixed with `NEXT_PUBLIC_` (e.g., `NEXT_PUBLIC_APP_URL`).

## Common Pitfalls
- Adding `"use client"` unnecessarily to container files or layout components.
- Importing server-only dependencies inside Client Components (use `import "server-only"` to guard server modules).
- Forgetting to handle action states and errors gracefully on the client.
