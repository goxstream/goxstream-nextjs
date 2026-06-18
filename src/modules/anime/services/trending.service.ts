import { db } from "@/infrastructure/database/client";
import { anime as animeTable } from "@/infrastructure/database/schema/anime";
import { episodes as episodesTable } from "@/infrastructure/database/schema/media";
import { bookmarks as bookmarksTable } from "@/infrastructure/database/schema/interactions";
import { count, eq, sql } from "drizzle-orm";
import { getKVBinding } from "@/cloudflare/bindings/kv";
import { getExecutionContext } from "@/cloudflare/runtime/context";

export class TrendingService {
  private static CACHE_KEY = "goxstream:trending:list";
  private static CACHE_TTL_SECONDS = 3600; // 1 hour

  /**
   * Fetches the list of trending anime.
   * Tries to read from Cloudflare KV Cache first. If it's a miss, recalculates and updates the cache.
   */
  async getTrendingAnime(limit: number = 10): Promise<any[]> {
    let cachedData: string | null = null;
    let kv: KVNamespace | null = null;

    try {
      kv = getKVBinding("KV_CACHE");
      cachedData = await kv.get(TrendingService.CACHE_KEY);
    } catch (error) {
      console.warn("Cloudflare KV_CACHE binding not available, reading from database directly:", error);
    }

    if (cachedData) {
      try {
        const list = JSON.parse(cachedData);
        return list.slice(0, limit);
      } catch (parseError) {
        console.error("Failed to parse cached trending data:", parseError);
      }
    }

    // Cache Miss or KV Error: Calculate trending scores in real-time
    const trendingList = await this.calculateAndSortTrending();

    // Cache asynchronously using ctx.waitUntil if running inside Cloudflare Workers context
    if (kv) {
      try {
        const cachePromise = kv.put(
          TrendingService.CACHE_KEY,
          JSON.stringify(trendingList),
          { expirationTtl: TrendingService.CACHE_TTL_SECONDS }
        );
        
        try {
          const ctx = getExecutionContext();
          ctx.waitUntil(cachePromise);
        } catch {
          // Fallback if running outside of execution context (e.g. during build or scripts)
          await cachePromise;
        }
      } catch (cacheWriteError) {
        console.error("Failed to write trending list to KV_CACHE:", cacheWriteError);
      }
    }

    return trendingList.slice(0, limit);
  }

  /**
   * Calculates trending scores from the database using a Time Decay formula.
   * Formula: Score = ((Views * w_v) + (Bookmarks * w_c)) / (AgeHours + 2) ^ Gravity
   */
  private async calculateAndSortTrending(): Promise<any[]> {
    try {
      const allAnime = await db.select().from(animeTable).all();
      
      const computedList = await Promise.all(
        allAnime.map(async (item) => {
          // Get total view count from all episodes of this anime
          const episodesData = await db
            .select({
              totalViews: sql<number>`sum(${episodesTable.viewCount})`,
            })
            .from(episodesTable)
            .where(eq(episodesTable.animeId, item.id))
            .get();
          
          const views = episodesData?.totalViews ? Number(episodesData.totalViews) : 0;

          // Get total bookmarks (interactions) of this anime
          const bookmarkData = await db
            .select({
              count: count(bookmarksTable.userId),
            })
            .from(bookmarksTable)
            .where(eq(bookmarksTable.animeId, item.id))
            .get();
          
          const bookmarksCount = bookmarkData?.count ? Number(bookmarkData.count) : 0;

          // Compute anime age in hours since it was added to the system
          const createdAtTime = item.createdAt ? new Date(item.createdAt).getTime() : Date.now();
          const ageHours = Math.max(0, (Date.now() - createdAtTime) / (1000 * 60 * 60));

          // Weights and Gravity parameters
          const w_v = 1.0;  // Weight for views
          const w_c = 2.5;  // Weight for bookmarks (active interactions carry higher value)
          const gravity = 1.8; // Time decay gravity factor

          const numerator = (views * w_v) + (bookmarksCount * w_c);
          const denominator = Math.pow(ageHours + 2, gravity);
          const trendingScore = denominator > 0 ? numerator / denominator : 0;

          return {
            ...item,
            rating: item.rating != null ? Number(item.rating) : null,
            popularity: item.popularity ?? 0,
            trendingScore: Math.round(trendingScore * 10000) / 10000,
          };
        })
      );

      // Sort by trendingScore in descending order
      return computedList.sort((a, b) => b.trendingScore - a.trendingScore);
    } catch (error) {
      console.error("Error calculating trending scores from database:", error);
      return [];
    }
  }
}
