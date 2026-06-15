# Project Architecture & Guidelines

This document details the architectural boundaries, folder layer responsibilities, and request flow conventions for the GoxStream anime streaming platform.

The codebase is built on **Clean Architecture** combined with **Vertical Slice Architecture**, separating execution runtimes, business logic, domain boundaries, and presentation.

---

## Architectural Layers

### 1. Presentation Layer (`src/app/`)
- Contains Next.js App Router files (`page.tsx`, `layout.tsx`, `error.tsx`, `loading.tsx`) organized into modular **Route Groups**:
  - **`(marketing)`**: Non-authenticated marketing content sharing a promotional layout (pricing, about).
  - **`(app)`**: Core private user workspace sharing a platform layout (profile, history).
  - **`(catalog)`**: Public/private interactive catalog sharing a search-sidebar layout (homepage `/`, browse, genres, anime details, watch player).
  - **`(auth)`**: Autentikasi workspace sharing a centered card layout (sign-in, sign-up, forgot-password).
- Houses REST API route handlers inside `src/app/api/` (mainly v1/ v2 endpoints) designed for Android/iOS mobile apps and third-party webhooks.

### 2. Feature Layer (`src/features/`)
- Encapsulates interactive UI slices and business capabilities (e.g., `features/auth/`, `features/player/`, `features/watch/`).
- Focuses on modular client components, local hooks, CSS styles, and visual states specific to a capability slice.

### 3. Business Core & Domain Logic (`src/modules/`)
Each domain capability (e.g., `modules/auth/`, `modules/anime/`) contains a structured set of layers:
- **`actions/`**: React Server Actions (mutations) acting as the boundary layer for client forms. They validate incoming data, verify sessions, and call business services.
- **`services/`**: Contain the core business logic (e.g., video processing logic, subscription updates, history calculations).
- **`repositories/`**: Abstract data storage access, shielding services from direct database details.
- **`schemas/`**: Input validation schemas (Zod).
- **`dto/`**: Data Transfer Objects defining input/output contracts.
- **`mappers/`**: Convert database query results into domain models or DTOs.
- **`types/`**: Specific domain types and definitions.

### 4. Integration & Infrastructure Layer (`src/infrastructure/`)
- Houses external integrations (e.g., database client bindings, Redis cache, R2 client configuration, Meilisearch client, Midtrans payment gateway, Resend email client, and metrics logs sinks).

### 5. Cloudflare Runtime Isolation (`src/cloudflare/`)
- Isolates Workers runtime, bindings, environment configuration, and context definitions.
- Prevents direct import of Cloudflare Workers APIs or bindings inside the domain modules layer, ensuring the application remains testable and portable.

### 6. Shared Layout Configuration (`src/lib/layout.shared.ts`)
- Stores common configuration objects (like lists of sidebar navigation links, brand configuration, or logo components) imported by multiple group layouts (e.g. `(catalog)/layout.tsx` and `(app)/layout.tsx`) to prevent copy-pasting options.

---

## Communication & Calling Flow

To maintain optimal performance and avoid unnecessary network hops:

### Web Client Request Flow:
```
Web Browser (UI Component)
    │
    ▼
Server Action (src/modules/*/actions/)
    │
    ▼
Service Class (src/modules/*/services/)
    │
    ▼
Repository Class (src/modules/*/repositories/)
    │
    ▼
Database (Drizzle D1 SQLite Client)
```

### Mobile Client Request Flow:
```
Mobile App (iOS / Android)
    │
    ▼
REST API Handler (src/app/api/)
    │
    ▼
Service Class (src/modules/*/services/)
    │
    ▼
Repository Class (src/modules/*/repositories/)
    │
    ▼
Database (Drizzle D1 SQLite Client)
```

> [!WARNING]
> Do not call internal REST API endpoints from Server Actions. Server Actions must import and invoke the Service Layer directly to avoid double execution hops.
