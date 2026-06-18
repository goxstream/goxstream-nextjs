# Environment Variables Configuration

This guide explains the architecture, differences, and usage rules of environment variables for GoxStream, both in local development and when deploying to Cloudflare Workers.

---

## Local Development (.env vs .dev.vars)

During local development, there are two environment variable files with distinct roles:

* **`.env` (Next.js Node.js Environment)**:
  * Used when running the standard local Next.js development server (`npm run dev`).
  * Values are read by Next.js to populate `process.env`.
  * **Not read** by Wrangler's local simulation.

* **`.dev.vars` (Wrangler Local Bindings)**:
  * Used when running the Cloudflare runtime simulation locally (`npx wrangler dev` or `npm run preview`).
  * Wrangler reads this file to populate the `env` bindings object in the Cloudflare Worker context (`CloudflareEnv`).
  * Defined using simple key-value format (same syntax as `.env`).

---

## Production Architecture (Build Env vs Runtime Env)

When deploying to Cloudflare Workers, environment variables are split into two crucial phases:

### 1. Build-Time Environment Variables (Build Env)
* **Configuration Location**: Cloudflare Dashboard -> Workers & Pages -> Project Settings -> **Build** -> **Variables and secrets**.
* **Availability**: Only available during the compilation/build process (`next build` or `npm run build:on`).
* **Characteristics**:
  * Can only be read by **Static** (`○`) Next.js routes. Next.js bakes these values directly into the output HTML/JS during the build phase.
  * **Dynamic** (`ƒ`) routes, Server Actions, API Routes, and Middleware **cannot** read these build-time variables when serving request-time traffic on the Edge Worker.

### 2. Runtime Environment Variables (Runtime Env)
* **Configuration Location**:
  * Cloudflare Dashboard -> Compute -> Workers & Pages -> Select your Worker -> Settings -> **Variables and secrets** (Runtime).
  * Or defined in the `"vars"` block in `wrangler.jsonc`.
* **Availability**: Available at request-time on the Edge Worker when serving user traffic.
* **Characteristics**:
  * **Required** for all dynamic routes, Server Actions, API Routes, and Middleware.
  * Passed dynamically by the Cloudflare Workers container into the worker context object.

---

## Variable Usage Matrix

| Route Type / Code Layer | Evaluation Phase | Cloudflare Variable Source |
| :--- | :--- | :--- |
| **Static Route (`○`)** | Build-time | Build Environment Variables |
| **Dynamic Route (`ƒ`)** | Request-time (Runtime) | Runtime Variables & Secrets / `wrangler.jsonc` |
| **API Routes & Actions**| Request-time (Runtime) | Runtime Variables & Secrets / `wrangler.jsonc` |
| **Middleware** | Request-time (Runtime) | Runtime Variables & Secrets / `wrangler.jsonc` |

---

## Access Guidelines & Conventions

### 1. Naming Conventions
* Internal, backend, or private credentials **must** use the `GOX_` prefix (e.g., `GOX_DATABASE_URL`, `GOX_ADMIN_SLUG`).
* Variables intended for exposure to the client-side browser **must** use the `NEXT_PUBLIC_` prefix (e.g., `NEXT_PUBLIC_APP_URL`).

### 2. Accessing Variables on the Server
Always use the `getEnv()` wrapper from `src/cloudflare/bindings/env.ts` to access variables dynamically at runtime on Cloudflare Workers:

```typescript
import { getEnv } from "@/cloudflare/bindings/env";

export async function checkAdminAccess(adminSegment: string) {
  const env = getEnv();
  const expectedSlug = env.GOX_ADMIN_SLUG; // Safely read from runtime bindings

  if (adminSegment !== expectedSlug) {
    throw new Error("Unauthorized");
  }
}
```

> [!WARNING]
> Do not use `process.env.VARIABLE` to read custom environment variables in dynamic server code, as they are not bound to `process.env` in Cloudflare Workers at runtime unless explicitly injected.
