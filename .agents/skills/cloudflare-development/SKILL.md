---
name: cloudflare-development
description: "Activates when configuring or interacting with Cloudflare Developer Platform services. Triggered by changes to wrangler.jsonc, open-next.config.ts, wrangler commands (dev, deploy, d1, r2, kv), getRequestContext() calls, or binding interfaces."
license: MIT
metadata:
  author: goxstream
---

# Cloudflare Development

Guidelines for building applications with Cloudflare Workers, Pages, and storage integrations via Wrangler.

## consistency First
- Verify binding names in `wrangler.jsonc` match references in `src/cloudflare/bindings/env.ts` or related files.

## Quick Reference

### 1. Bindings Configuration → `rules/bindings.md`
- Define environment types and interface schema.
- Reference bindings safely using `@opennextjs/cloudflare` runtime context.

### 2. D1 Databases → `rules/d1-queries.md`
- Run local migrations and query verification scripts.
- Integrate Drizzle ORM with D1 SQLite database driver.

### 3. R2 and Queues → `rules/storage-queues.md`
- Implement file storage workflows and streaming using R2 buckets.
- Set up background pipelines via Cloudflare Queues.

## Common Pitfalls
- Storing secrets directly in `wrangler.jsonc` (use Wrangler secrets instead: `wrangler secret put SECRET_NAME`).
- Attempting to read env variables on the server using `process.env` (always use `getRequestContext().env`).
- Forgetting to run `npm run cf-typegen` after editing bindings in `wrangler.jsonc`.
