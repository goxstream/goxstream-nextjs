---
name: scripts-development
description: "Activates when creating, modifying, or executing build/maintenance scripts, seeding scripts, patches, database seeding routines, or custom Node.js/tsx automation scripts in the scripts/ folder."
license: MIT
metadata:
  author: goxstream
---

# Scripts Development

Guidelines for creating, managing, and running seeding, migration, patching, and automation scripts inside the GoxStream Next.js repository.

## Consistency First
- Keep all build, maintenance, and database setup scripts inside the `scripts/` directory.
- All new scripts must be written in TypeScript (`.ts`) instead of JavaScript (`.js`) to enforce strict type-safety.
- Follow the conventions established by existing scripts like `seed.ts` and `patch-opennext.ts`.


## Quick Reference

### 1. Seeding Guidelines -> `rules/seeding.md`
- Design clean, modular, and idempotent database seed scripts.
- Generate and manage intermediate `.sql` script outputs inside `scripts/seeds/sql/`.

### 2. Execution & Execution Safety -> `rules/execution.md`
- Safely run TypeScript scripts across environments (local and remote).
- Follow clean practices for importing dependencies and handling filesystem differences.

## Common Pitfalls
- Storing hardcoded credentials, secret keys, or unhashed passwords in seed files (always hash passwords using Better Auth or other crypto tools before generating SQL).
- Writing non-idempotent SQL commands in seeds (always append `ON CONFLICT` clauses to insert statements).
- Running raw SQL scripts against remote/production databases without locally validating them first.
