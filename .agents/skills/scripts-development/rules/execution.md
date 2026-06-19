# Script Execution Guidelines

Execution guidelines explain how to run and test script files safely on various runtime environments.

## Guidelines

1. **TypeScript Standard & Compilation**:
   - **TypeScript Mandatory**: All scripts must be written in TypeScript (`.ts`) to leverage strict typing and ensure compile-time check validation. Plain JavaScript (`.js`) scripts are prohibited.
   - TypeScript scripts must be executed directly without compilation using `tsx` (TypeScript Execute):
     ```bash
     npx tsx scripts/your-script.ts
     ```
   - Do not compile scripts to JavaScript manually inside the workspace.


2. **Cross-Platform Compatibility**:
   - Always resolve paths dynamically using the Node.js `path` module. Use `path.join` or `path.resolve` combined with `process.cwd()` to ensure compatibility on both Unix and Windows environments.
   - When writing to directories, always check for their existence first:
     ```typescript
     import * as fs from "fs";
     import * as path from "path";
     
     const outputDir = path.join(process.cwd(), "scripts", "seeds", "sql");
     if (!fs.existsSync(outputDir)) {
       fs.mkdirSync(outputDir, { recursive: true });
     }
     ```

3. **Executing Generated D1 SQL Seeds**:
   - Local DB Seed execution:
     ```bash
     npx wrangler d1 execute DB --local --file=scripts/seeds/sql/anime.sql
     ```
   - Remote/Production DB Seed execution:
     ```bash
     npx wrangler d1 execute DB --remote --file=scripts/seeds/sql/anime.sql
     ```

4. **Integration with package.json**:
   - Add new scripts to the `"scripts"` field in `package.json` to make them discoverable.
   - Follow the naming pattern:
     - `db:seed:gen` for seed generator scripts.
     - `db:seed:<target>` for local seeding.
     - `db:seed:<target>:remote` for remote/production seeding.
