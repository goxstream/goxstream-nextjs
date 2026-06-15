# Route Handlers

Route Handlers allow you to create custom request handlers for a given route using the Web Request and Response APIs.

## Guidelines

### 1. Next.js Routing Constraint
Next.js App Router **only resolves** files named exactly `route.ts` (or `route.js`/`route.tsx`) as endpoints. Files like `route.get.ts` or `route.post.ts` will not be resolved natively by Next.js and will result in 404 responses.

All HTTP verbs for a specific path must be exported from the single `route.ts` file in that directory.

---

### 2. Modular Handler Pattern (Recommended)
To keep route files modular and readable when endpoints support multiple complex HTTP methods, split the handlers into sibling files (e.g., `route.get.ts`, `route.post.ts`) and import/export them inside the central `route.ts`.

#### File Structure Example:
```
src/app/api/v1/anime/
├── route.ts          (Main Next.js entrypoint)
├── route.get.ts      (Implements GET requests logic)
└── route.post.ts     (Implements POST requests logic)
```

#### Step 1: Write `route.get.ts`
```typescript
import { NextRequest, NextResponse } from "next/server";
import { getRequestContext } from "@opennextjs/cloudflare";

export async function handleGET(request: NextRequest) {
  const env = getRequestContext().env;
  // Fetch anime using env.DB...
  return NextResponse.json({ success: true, data: [] });
}
```

#### Step 2: Write `route.post.ts`
```typescript
import { NextRequest, NextResponse } from "next/server";
import { getRequestContext } from "@opennextjs/cloudflare";

export async function handlePOST(request: NextRequest) {
  const env = getRequestContext().env;
  // Create anime using env.DB...
  return NextResponse.json({ success: true });
}
```

#### Step 3: Connect inside `route.ts`
```typescript
import { handleGET } from "./route.get";
import { handlePOST } from "./route.post";

export { handleGET as GET, handlePOST as POST };
```

---

### 3. Runtime Integration
- Access Cloudflare resources such as D1 or R2 using `getRequestContext().env` inside handlers.
- Handle CORS configuration, header manipulation, and status codes via standard `NextResponse`.
