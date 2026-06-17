# D1 Transactions & Batching

Cloudflare D1 runs on a serverless SQLite engine. As a result, it has critical architectural limitations compared to standard PostgreSQL/MySQL setups.

## 1. The Interactive Transaction Constraint
D1 **does not support interactive, long-running transactions** (like `db.transaction()` containing arbitrary async Javascript operations). Because D1 handles queries over HTTP/WebSocket calls:
- Running async operations inside a transaction block would hold lock state, resulting in performance issues and query execution failures.
- Standard ORM transaction blocks that execute multiple separate requests under a single transaction session will fail or throw errors in production.

## 2. Using Drizzle `db.batch()`
To run atomic multi-write updates safely on D1, use the `db.batch()` API. This packages multiple queries and runs them in a single database round-trip.

### Example: Dynamic batching
```typescript
import { db } from "@/db";
import { anime, episodes } from "@/db/schema";

async function createAnimeWithEpisode(animeData: any, episodeData: any) {
  // Use db.batch to send queries in a single atomic transaction payload
  const [newAnime] = await db.batch([
    db.insert(anime).values(animeData).returning(),
    db.insert(episodes).values(episodeData)
  ]);
  
  return newAnime;
}
```

### Key Rules for Batching:
- **Atomicity**: If one query in a batch fails, the entire batch is rolled back automatically.
- **Performance**: Batching drastically reduces network latency because it groups multiple queries into a single payload.
- **Maximum Commands**: D1 batches can hold up to 100 statements. If performing large inserts, split them into smaller chunks.
