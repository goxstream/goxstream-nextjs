# Cloudflare D1 Queries

D1 is Cloudflare's serverless SQL database based on SQLite.

## Guidelines

1. **Running Queries via CLI**:
   - Run custom queries or diagnostic statements using Wrangler D1 CLI commands.
   - For local development database:
     ```bash
     npx wrangler d1 execute DB --local --command="SELECT * FROM anime LIMIT 5;"
     ```
   - For remote production database:
     ```bash
     npx wrangler d1 execute DB --remote --command="SELECT * FROM anime LIMIT 5;"
     ```

2. **Drizzle Integration**:
   - D1 is queried through Drizzle ORM.
   - Maintain index constraints matching queries to keep query execution times under the SQLite threshold.
   - Use standard SQLite functions since D1 is SQLite-backed. Avoid Postgres or MySQL-specific dialects.
