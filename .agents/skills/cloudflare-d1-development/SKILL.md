---
name: cloudflare-d1-development
description: "Activates when configuring D1 database schemas, writing queries, managing migrations, executing CLI database commands, or initializing D1 database clients. Covers lazy database proxies to avoid compilation startup crashes."
license: MIT
metadata:
  author: goxstream
---

# Cloudflare D1 Development

Guidelines for building, initializing, managing, and querying Cloudflare D1 databases in Next.js, Cloudflare Workers, and Drizzle ORM environments.

## Consistency First
- Verify database binding names in `wrangler.jsonc` match references in `src/infrastructure/database/client.ts` and related interfaces.
- Avoid raw SQLite query executions. Always query via the Drizzle ORM client interface.

## Quick Reference

### 1. Database Initialization & Next.js Lifecycle → `rules/initialization.md`
- Access bindings in Next.js using `@opennextjs/cloudflare` runtime context.
- Use a **Lazy Database Proxy** to prevent Next.js/Turbopack dev server compilation crashes.
- Understand the difference between module evaluation time and request runtime.

### 2. CLI Executions & Migrations → `rules/cli-migrations.md`
- Run local vs remote SQL scripts.
- Generate, apply, and sync Drizzle schema migrations.

### 3. D1 Transactions & Batching → `rules/transactions-batching.md`
- Handle D1's serverless transaction limits.
- Optimize queries using Drizzle `db.batch()` API.

### 4. Drizzle & SQLite Syntax Guidelines → `rules/drizzle-sqlite.md`
- Write SQLite-compatible Drizzle schemas and queries.
- Manage indexing, constraints, and relationships.

## Common Pitfalls
- Calling `getCloudflareContext()` in global scope during module load (always use the lazy proxy or query inside functions at runtime).
- Using PostgreSQL/MySQL-specific functions or columns in Drizzle (D1 runs SQLite).
- Failing to run `npm run cf-typegen` after updating D1 bindings in `wrangler.jsonc`.
- Trying to run interactive, nested transactions with D1 (always use batching or single-step operations).
