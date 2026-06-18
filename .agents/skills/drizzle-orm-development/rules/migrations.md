# Drizzle Migrations

Migrations manage database schema state transitions cleanly.

## Guidelines

1. **Generating Migrations**:
   - Make your changes to schema files in `src/infrastructure/database/schema/`.
   - Run drizzle-kit to generate a migration `.sql` file:
     ```bash
     npx drizzle-kit generate
     ```
   - This writes a file into the migrations directory (e.g. `src/infrastructure/database/migrations/0000_xxxx.sql`).

2. **Applying Migrations Locally**:
   - Run migrations on your local development database using Wrangler command:
     ```bash
     npx wrangler d1 execute DB --local --file=src/infrastructure/database/migrations/0000_xxxx.sql
     ```
   - *Never* apply migrations to production before testing locally first.

3. **Applying Migrations to Remote / Production**:
   - Use Wrangler command with the `--remote` flag:
     ```bash
     npx wrangler d1 execute DB --remote --file=src/infrastructure/database/migrations/0000_xxxx.sql
     ```
