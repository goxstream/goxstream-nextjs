# Project Directory Structure Rule

The directory structure of the GoxStream Next.js 16 application is defined below:

```
anime-streaming/
│
├── .github/
│   ├── workflows/
│   │   ├── ci.yml
│   │   ├── preview.yml
│   │   └── production.yml
│   │
│   └── ISSUE_TEMPLATE/
│
├── docs/
│   ├── architecture/
│   ├── adr/
│   ├── api/
│   ├── database/
│   └── deployment/
│
├── public/
│   ├── images/
│   ├── icons/
│   ├── manifest.json
│   └── robots.txt
│
├── scripts/
│   ├── seed.ts
│   ├── migrate.ts
│   ├── sync-anime.ts
│   └── generate-types.ts
│
├── src/
│
│   ├── app/
│   │
│   │   ├── (marketing)/
│   │   │   ├── layout.tsx          (Marketing-specific layout, pricing/about)
│   │   │   ├── pricing/
│   │   │   └── about/
│   │   │
│   │   ├── (auth)/
│   │   │   ├── layout.tsx          (Auth layout, centered cards)
│   │   │   ├── sign-in/
│   │   │   ├── sign-up/
│   │   │   └── forgot-password/
│   │   │
│   │   ├── (app)/
│   │   │   ├── layout.tsx          (App layout, profile/history details)
│   │   │   ├── profile/
│   │   │   └── history/
│   │   │
│   │   ├── (catalog)/
│   │   │   ├── layout.tsx          (Catalog layout containing persistent header/sidebar)
│   │   │   ├── page.tsx            (Interactive catalog homepage resolved at /)
│   │   │   ├── browse/             (Search and discovery resolved at /browse)
│   │   │   │   └── page.tsx
│   │   │   ├── genres/             (Genre filter listing resolved at /genres)
│   │   │   │   └── page.tsx
│   │   │   └── anime/              (Shared catalog routes - guest and user accessible)
│   │   │       └── [slug]/
│   │   │           ├── page.tsx        (Anime details resolved at /anime/:slug)
│   │   │           └── watch/
│   │   │               └── page.tsx    (Video player resolved at /anime/:slug/watch)
│   │   │
│   │   ├── (admin)/
│   │   │   └── [adminSegment]/
│   │   │       ├── layout.tsx          (Admin layout checking adminSegment against ADMIN_SLUG env)
│   │   │       ├── (dashboard)/
│   │   │       │   ├── layout.tsx      (Dashboard shell with sidebar + header)
│   │   │       │   ├── page.tsx        (Dashboard overview, resolved at /[adminSegment])
│   │   │       │   ├── anime/
│   │   │       │   │   ├── page.tsx    (Browse Catalog)
│   │   │       │   │   ├── new/       (Add Title)
│   │   │       │   │   └── genres/    (Genres)
│   │   │       │   ├── episodes/
│   │   │       │   │   ├── page.tsx    (All Episodes)
│   │   │       │   │   ├── new/       (Upload Episode)
│   │   │       │   │   └── subtitles/ (Subtitles)
│   │   │       │   ├── media/
│   │   │       │   │   ├── sources/   (Video Sources)
│   │   │       │   │   └── storage/   (Storage R2)
│   │   │       │   ├── users/
│   │   │       │   │   ├── page.tsx    (Accounts)
│   │   │       │   │   ├── roles/     (Roles & Permissions)
│   │   │       │   │   └── sessions/  (Sessions)
│   │   │       │   ├── comments/
│   │   │       │   │   ├── page.tsx    (Moderation)
│   │   │       │   │   └── reported/  (Reported)
│   │   │       │   └── settings/
│   │   │       │       ├── page.tsx    (Site Config)
│   │   │       │       └── tokens/    (API Tokens)
│   │   │
│   │   ├── api/
│   │   │
│   │   │   ├── v1/
│   │   │   │
│   │   │   ├── auth/
│   │   │   │   └── route.ts
│   │   │   │
│   │   │   ├── anime/
│   │   │   │   ├── route.ts
│   │   │   │   └── [slug]/
│   │   │   │       └── route.ts
│   │   │   │
│   │   │   ├── episodes/
│   │   │   │   └── route.ts
│   │   │   │
│   │   │   ├── watch-history/
│   │   │   │   └── route.ts
│   │   │   │
│   │   │   ├── bookmarks/
│   │   │   │   └── route.ts
│   │   │   │
│   │   │   └── search/
│   │   │       └── route.ts
│   │   │
│   │   ├── layout.tsx              (Global root HTML wrapper and providers)
│   │   ├── error.tsx
│   │   ├── loading.tsx
│   │   └── not-found.tsx
│
│   ├── features/
│   │
│   │   ├── auth/
│   │   │
│   │   ├── anime/
│   │   │
│   │   ├── episode/
│   │   │
│   │   ├── watch/
│   │   │
│   │   ├── search/
│   │   │
│   │   ├── bookmark/
│   │   │
│   │   ├── history/
│   │   │
│   │   ├── recommendation/
│   │   │
│   │   ├── subscription/
│   │   │
│   │   └── admin/
│   │       ├── components/
│   │       └── layout/
│   │           ├── AdminSidebar.tsx
│   │           ├── NavMain.tsx
│   │           └── NavUser.tsx
│   │
│   ├── modules/
│   │
│   │   ├── auth/
│   │   │   ├── actions/
│   │   │   ├── services/
│   │   │   ├── repositories/
│   │   │   ├── schemas/
│   │   │   ├── dto/
│   │   │   ├── mappers/
│   │   │   └── types/
│   │   │
│   │   ├── anime/
│   │   │   ├── actions/
│   │   │   ├── services/
│   │   │   ├── repositories/
│   │   │   ├── schemas/
│   │   │   ├── dto/
│   │   │   ├── mappers/
│   │   │   └── types/
│   │   │
│   │   ├── episode/
│   │   ├── user/
│   │   ├── watch-history/
│   │   ├── bookmark/
│   │   ├── comment/
│   │   ├── search/
│   │   ├── recommendation/
│   │   └── subscription/
│
│   ├── infrastructure/
│   │
│   │   ├── database/
│   │   │   ├── drizzle/
│   │   │   ├── migrations/
│   │   │   ├── client.ts
│   │   │   └── schema/
│   │   │
│   │   ├── cache/
│   │   │   ├── redis.ts
│   │   │   └── cache-tags.ts
│   │   │
│   │   ├── storage/
│   │   │   ├── r2.ts
│   │   │   └── signed-url.ts
│   │   │
│   │   ├── queue/
│   │   │   ├── ingest.ts
│   │   │   └── transcoding.ts
│   │   │
│   │   ├── search/
│   │   │   └── meilisearch.ts
│   │   │
│   │   ├── analytics/
│   │   │   └── analytics.ts
│   │   │
│   │   ├── email/
│   │   │   └── resend.ts
│   │   │
│   │   ├── payment/
│   │   │   └── midtrans.ts
│   │   │
│   │   └── observability/
│   │       ├── logger.ts
│   │       ├── metrics.ts
│   │       └── tracing.ts
│
│   ├── cloudflare/
│   │
│   │   ├── bindings/
│   │   │   ├── env.ts
│   │   │   ├── d1.ts
│   │   │   ├── r2.ts
│   │   │   ├── kv.ts
│   │   │   └── queues.ts
│   │   │
│   │   ├── middleware/
│   │   │   ├── rate-limit.ts
│   │   │   └── bot-protection.ts
│   │   │
│   │   ├── workers/
│   │   │   ├── cron.ts
│   │   │   └── queue-consumer.ts
│   │   │
│   │   └── runtime/
│   │       └── context.ts
│
│   ├── server/
│   │
│   │   ├── actions/
│   │   │   ├── auth/
│   │   │   ├── anime/
│   │   │   ├── bookmarks/
│   │   │   └── history/
│   │   │
│   │   ├── api/
│   │   │   ├── auth/
│   │   │   ├── anime/
│   │   │   └── mobile/
│   │   │
│   │   └── procedures/
│
│   ├── components/
│   │
│   │   ├── ui/
│   │   ├── layouts/
│   │   ├── anime/
│   │   ├── player/
│   │   └── shared/
│
│   ├── hooks/
│   │
│   ├── lib/
│   │   ├── utils.ts
│   │   └── layout.shared.ts    (Central configuration source for headers and sidebars)
│   │
│   ├── providers/
│   │
│   ├── constants/
│   │
│   ├── shared/
│   │
│   │   ├── types/
│   │   ├── schemas/
│   │   ├── validators/
│   │   ├── contracts/
│   │   ├── errors/
│   │   └── utils/
│   │
│   └── styles/
│       ├── globals.css
│       └── tokens.css
│
├── tests/
│   ├── unit/
│   ├── integration/
│   ├── e2e/
│   └── performance/
│
├── drizzle/
│
├── wrangler.jsonc
├── open-next.config.ts
├── next.config.ts
├── tsconfig.json
├── package.json
└── README.md
```

---

## Routing & Layout Strategy

### 1. Route Groups
- **`(marketing)`**: Contains non-authenticated public marketing pages (pricing page, about pages). These routes share a marketing-specific landing layout (`(marketing)/layout.tsx`) and resolve directly to `/pricing` and `/about`.
- **`(app)`**: Contains core authenticated platform pages (profile, history). These routes are grouped under the main application layout (`(app)/layout.tsx`) containing sidebars, watch details, and user session configurations. They resolve to `/profile` and `/history`.
- **`(catalog)`**: Contains the main interactive anime catalog homepage (`page.tsx` resolved at `/`) and all penelusuran paths (`browse/`, `genres/`, `anime/`). These routes are grouped under a catalog layout (`(catalog)/layout.tsx`) containing shared headers, sidebars, and search discovery structures.
- **`(auth)`**: Contains the authentication routes, wrapped inside a clean centered layout (`(auth)/layout.tsx`) without headers or sidebars.
- **`(admin)`**: Contains the administrative control panel pages. These routes are nested under a dynamic path parameter `[adminSegment]` (`src/app/(admin)/[adminSegment]/`). The layout (`layout.tsx`) validates the parameter against the server-side `GOX_ADMIN_SLUG` environment variable. If matched, it passes the slug down to the navigation components as a prop. This prevents exposing the secret admin path in public JavaScript client bundles.

### 2. Catalog Routing Strategy
- Placing the catalog routes under `(catalog)` allows anonymous guests and signed-in users to share the same templates and components without duplicating the layout, making UI updates fully centralized.

### 3. Shared Layout Configurations (`src/lib/layout.shared.ts`)
- Configures shared variables and parameters (such as link structures for headers and sidebars) in a unified format, complying with DRY principles across route group layouts.
