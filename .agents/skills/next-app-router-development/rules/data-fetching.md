# Data Fetching and Caching

Data fetching in Next.js 16 should be optimized to leverage Cloudflare's edge runtime.

## Guidelines

1. **Server-Side Fetching**:
   - Fetch data directly in Server Components using `async`/`await`.
   - Re-use the bound database client or call external APIs with standard `fetch`.
   - Example:
     ```typescript
     import { Suspense } from "react";
     import { AnimeList } from "@/components/anime/AnimeList";
     import { AnimeSkeleton } from "@/components/anime/AnimeSkeleton";

     async function FetchAnimeData() {
       const res = await fetch("https://api.example.com/anime", {
         next: { revalidate: 3600 } // cache for 1 hour
       });
       return res.json();
     }

     export default async function Page() {
       return (
         <main>
           <h1>Featured Anime</h1>
           <Suspense fallback={<AnimeSkeleton />}>
             <AnimeDataWrapper />
           </Suspense>
         </main>
       );
     }

     async function AnimeDataWrapper() {
       const data = await FetchAnimeData();
       return <AnimeList items={data} />;
     }
     ```

2. **Caching**:
   - Leverage `next: { revalidate }` or Next.js `unstable_cache` for dynamic database queries.
   - For highly volatile or user-specific data, pass `{ cache: "no-store" }` to ensure fresh fetches.

3. **Incremental Loading**:
   - Wrap dynamic components in React `Suspense` and specify UI skeletons to avoid blocking page loads.
