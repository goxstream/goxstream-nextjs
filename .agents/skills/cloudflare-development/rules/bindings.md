# Cloudflare Bindings

Bindings allow your application to interact with Cloudflare resources. In Next.js App Router, these are accessed using the request context.

## Guidelines

1. **Accessing Context**:
   - Access bindings using the `getRequestContext` function from `@opennextjs/cloudflare`.
   - Example:
     ```typescript
     import { getRequestContext } from "@opennextjs/cloudflare";

     export async function getD1Data() {
       const context = getRequestContext();
       const db = context.env.DB;
       const { results } = await db.prepare("SELECT * FROM anime LIMIT 5").all();
       return results;
     }
     ```

2. **Types Generation**:
   - Keep the typing definitions in sync with Wrangler configurations.
   - Run the type generation script after modifying `wrangler.jsonc`:
     ```bash
     npm run cf-typegen
     ```
   - This writes definitions to `cloudflare-env.d.ts`, updating the global `CloudflareEnv` interface definition.

3. **Local Variables**:
   - Define local bindings or secrets using `.dev.vars` for local development. Do not check `.dev.vars` into the repository.
