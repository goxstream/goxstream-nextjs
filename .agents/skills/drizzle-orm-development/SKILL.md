---
name: drizzle-orm-development
description: "Activates when writing or modifying database schemas, relations, migrations, or seed scripts. Triggered by files in drizzle/, src/infrastructure/database/drizzle/schema/, drizzle.config.ts, or when running drizzle-kit CLI commands."
license: MIT
metadata:
  author: goxstream
---

# Drizzle ORM Development

Guidelines for writing type-safe schema definitions, configuring relationship mappings, and applying migrations to D1 SQLite database.

## consistency First
- Check existing files inside `src/infrastructure/database/drizzle/schema/` to match column conventions (snake_case database names, camelCase property mapping).

## Quick Reference

### 1. Schema Definitions → `rules/schemas.md`
- Define tables, data types, indexes, and primary key relationships.
- Use explicit foreign key constraints.

### 2. Migrations Workflow → `rules/migrations.md`
- Generate migration scripts after modifying schemas.
- Run migrations on local preview environments and production.

## Common Pitfalls
- Defining MySQL or PostgreSQL dialects (always use SQLite dialect imports: `import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core"`).
- Forgetting to register new schemas in the main client connection mapping.
- Attempting to modify existing migration `.sql` files directly (always generate a new migration file instead).
