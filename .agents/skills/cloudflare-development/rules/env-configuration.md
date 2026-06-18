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
  * **`keep_vars` Option**: Setting `"keep_vars": true` in `wrangler.jsonc` tells Wrangler to preserve any manually added variables on the Cloudflare Dashboard during deployment, preventing them from being overwritten or deleted.

---

## Variable Usage Matrix

| Route Type / Code Layer | Evaluation Phase | Cloudflare Variable Source |
| :--- | :--- | :--- |
| **Static Route (`○`)** | Build-time | Build Environment Variables |
| **Dynamic Route (`ƒ`)** | Request-time (Runtime) | Runtime Variables & Secrets / `wrangler.jsonc` |
| **API Routes & Actions**| Request-time (Runtime) | Runtime Variables & Secrets / `wrangler.jsonc` |
| **Middleware** | Request-time (Runtime) | Runtime Variables & Secrets / `wrangler.jsonc` |

---

## Current Project Environment Variables (Daftar Env Saat Ini)

Below is the classification and detailed list of all environment variables currently defined in the GoxStream project files:

### 1. Variables in `.env` (Next.js Local Env)

These variables configure local server settings and authentication, and must be deployed to the **Runtime Variables & Secrets** (not build variables) in Cloudflare Production:

* **`GOX_ADMIN_SLUG`**:
  * **Value**: `backstage`
  * **Classification**: **Runtime Environment Variable**
  * **Usage**: Checked dynamically on each request to `/[adminSegment]` in the admin layout. Since the route is dynamic (`ƒ`), it must be available at request-time. Managed in `wrangler.jsonc` under `"vars"`.

* **`BETTER_AUTH_SECRET`**:
  * **Value**: `[YOUR_BETTER_AUTH_SECRET_KEY]` (e.g., a 32-character random string)
  * **Classification**: **Runtime Environment Variable (Secret)**
  * **Usage**: Required at runtime by Better Auth to encrypt session cookies and tokens. Must be configured as an encrypted **Secret** in Cloudflare Dashboard (not in wrangler.jsonc for security).

* **`BETTER_AUTH_URL`**:
  * **Value**: `http://localhost:3000` (Local) / `https://goxstream-nextjs.dyzulk.workers.dev` (Production)
  * **Classification**: **Runtime Environment Variable**
  * **Usage**: Required by Better Auth to construct absolute URIs for redirects and cookie domains at request-time. Managed in `wrangler.jsonc` under `"vars"`.

### 2. Variables in `.dev.vars` (Wrangler Local Env)

These variables are used to mimic production Workers configuration locally:

* **`NEXTJS_ENV`**:
  * **Value**: `development`
  * **Classification**: **Build and Runtime Environment Variable**
  * **Usage**: Configures Next.js/OpenNext runtime mode.

* **`NEXT_PRIVATE_MINIMAL_MODE`**:
  * **Value**: `1`
  * **Classification**: **Build and Runtime Environment Variable**
  * **Usage**: Minimizes the Next.js production server footprint. Configured statically in `wrangler.jsonc` under `"vars"`.

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
