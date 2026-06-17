# CLI Executions & Migrations

Managing the SQLite database state requires synchronizing changes between Drizzle schemas, generated migrations, and the D1 database binding instances.

## 1. Schema Generation
When updates are made to schemas in `src/db/schema.ts` (or files in `src/infrastructure/database/drizzle/schema/`):

```bash
npx drizzle-kit generate
```
This generates the relevant `.sql` migration files under the `drizzle/` or `drizzle/migrations/` directory.

## 2. Local D1 Migrations
Apply the generated `.sql` migration files directly to the local development environment using Wrangler:

```bash
npx wrangler d1 execute DB --local --file=drizzle/migrations/0000_xxxx.sql
```
*Note: Replace `0000_xxxx.sql` with your generated migration file name.*

## 3. Production/Remote D1 Migrations
Apply migrations to the remote production D1 instance:

```bash
npx wrangler d1 execute DB --remote --file=drizzle/migrations/0000_xxxx.sql
```

## 4. Diagnostic SQL Execution
Run direct commands or verify records in the local D1 instance:

```bash
npx wrangler d1 execute DB --local --command="SELECT * FROM users;"
```

Or for remote database inspections:

```bash
npx wrangler d1 execute DB --remote --command="SELECT count(*) FROM anime;"
```

## 5. Type Generation
Ensure you rebuild cloudflare types to sync wrangler binding definitions in the environment interface:

```bash
npm run cf-typegen
```
This updates TypeScript declarations so that the `env.DB` bindings are fully recognized inside `CloudflareEnv` interfaces.
