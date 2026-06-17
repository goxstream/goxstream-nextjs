# Database Initialization & Next.js Lifecycle

To ensure reliable database connectivity, D1 clients must be initialized in a way that respects Next.js App Router compilation phases and dev server lifecycles.

## The Module Evaluation Issue

When Next.js / Turbopack builds the dependency graph (during `next dev` startup or production build), it evaluates all imported modules. 

If your configuration files call `getCloudflareContext()` directly at the top level of the file:
```typescript
// src/lib/auth/user.ts
const db = getDb(); // Calls getCloudflareContext() globally

export const auth = betterAuth({
  database: drizzleAdapter(db, { ... })
});
```
This will result in a 500 boot crash:
`ERROR: getCloudflareContext has been called without having called initOpenNextCloudflareForDev from the Next.js config file.`

This happens because the file is loaded at compile/build time before the mock request context is bound by the adapter.

## The Solution: Lazy Database Proxy

To defer the execution of `getCloudflareContext()` until runtime (when the server is actively handling an HTTP request), always use a JavaScript `Proxy` for global database references.

### 1. Implementation
Define the proxy inside the main database entrypoint:

```typescript
// src/db/index.ts
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { drizzle } from "drizzle-orm/d1";
import * as schema from "./schema";

export function getDb() {
  const { env } = getCloudflareContext();
  if (!env || !env.DB) {
    throw new Error("Cloudflare D1 binding 'DB' not found. Please ensure you are running the server with Wrangler.");
  }
  return drizzle(env.DB, { schema });
}

// Lazy database proxy to defer context fetching until runtime queries
export const db = new Proxy({} as ReturnType<typeof getDb>, {
  get(target, prop, receiver) {
    const actualDb = getDb();
    const value = Reflect.get(actualDb, prop);
    // Bind functions to the database instance to preserve 'this' context
    if (typeof value === "function") {
      return value.bind(actualDb);
    }
    return value;
  }
});
```

### 2. Configuration Injection
Instead of calling `getDb()` directly inside configurations (like Better Auth or third-party adapters), pass the lazy `db` proxy:

```typescript
// src/lib/auth/user.ts
import { db } from "@/db"; // Import the Proxy db
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";

export const authUser = betterAuth({
  basePath: "/api/auth/user",
  database: drizzleAdapter(db, {
    provider: "sqlite",
    schema: { ... }
  })
});
```

This prevents early execution of `getCloudflareContext()` during static analysis or compile phases, while executing queries flawlessly at request runtime.
