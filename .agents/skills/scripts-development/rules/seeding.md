# Database Seeding Guidelines

Seeding scripts populate local and remote databases with initial/test datasets for development.

## Seed Structure

All seeds must follow a two-tier approach to separation of concerns:
1. **TypeScript Definitions & Logic**: Located under `scripts/seeds/*.ts`. These files define types, template functions, and mock arrays (e.g., mock users, roles, and anime metadata).
2. **Generated SQL Output**: Generated dynamically by `scripts/seed.ts` and written directly into `scripts/seeds/sql/*.sql`. Do not edit these SQL files manually; they must always be generated programmatically.

## Guidelines

1. **Idempotence & On Conflict Handling**:
   - Every `INSERT` statement must use SQLite-compatible conflict resolution.
   - For unique constraints (like email, usernames, ids), use `ON CONFLICT` clauses:
     ```sql
     INSERT INTO users (id, name, email, created_at, updated_at)
     VALUES ('user_1', 'Test User', 'user@example.com', strftime('%s', 'now'), strftime('%s', 'now'))
     ON CONFLICT(email) DO UPDATE SET name=excluded.name;
     ```
   - For static tables/lookups, use `ON CONFLICT DO NOTHING`.

2. **Secure Credentials**:
   - Plaintext passwords must never be stored in the database or written directly to SQL outputs.
   - Generate mock password hashes asynchronously during the build step using Better Auth cryptographical utilities before exporting the SQL template:
     ```typescript
     import { hashPassword } from "better-auth/crypto";
     const passwordHash = await hashPassword("user_password");
     ```

3. **Time Formatting**:
   - Dates in the D1 SQLite schema should be stored as Unix timestamps.
   - Use `strftime('%s', 'now')` in template strings to ensure valid date formatting during SQL execution.
