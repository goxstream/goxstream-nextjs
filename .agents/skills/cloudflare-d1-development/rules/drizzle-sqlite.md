# Drizzle & SQLite Syntax Guidelines

Cloudflare D1 uses SQLite as its backing database. Drizzle queries and schemas must adhere strictly to SQLite limitations and conventions.

## 1. SQLite Data Types
SQLite supports only five basic storage classes: `NULL`, `INTEGER`, `REAL`, `TEXT`, and `BLOB`.
When writing Drizzle schemas in `schema.ts`:
- **Dates**: SQLite has no native Date type. Use `integer("field", { mode: "timestamp" })` or `text("field")` to store timestamps.
- **Booleans**: SQLite has no native Boolean type. Use `integer("field", { mode: "boolean" })`.
- **JSON**: SQLite handles JSON as text. Use `text("field", { mode: "json" })` for complex object properties.

```typescript
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  email: text("email").notNull().unique(),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  isActive: integer("is_active", { mode: "boolean" }).default(true),
  metadata: text("metadata", { mode: "json" })
});
```

## 2. Querying Limits
- **All / Run**: In Drizzle SQLite core, query execution terminates with:
  - `.all()`: Returns all rows matching the criteria.
  - `.get()`: Returns the first row (or `undefined` if none match). Use this for unique lookups instead of `.limit(1)`.
  - `.run()`: Executes the query and returns SQLite-specific execution metadata (such as changes/lastInsertRowId).
- **No `returning()` support in old engines**: Modern D1 engines fully support `.returning()` clauses for `INSERT`, `UPDATE`, and `DELETE`.

## 3. SQL Functions
Avoid Postgres-specific or MySQL-specific functions (e.g. `now()`, `concat()`, or timezone-aware date parsing). Use standard SQLite functions:
- To get the current timestamp in raw SQL blocks: `sql`(CURRENT_TIMESTAMP)`` or pass `new Date()` directly in values.
- String concatenation uses `||` operator instead of `concat()`.

## 4. Indexing and Performance
- Define indexes explicitly on fields that are queried frequently (such as slugs, foreign keys, or search keywords).
- SQLite performs full table scans for unindexed filters. Ensure proper indexing to maintain database response speed.
