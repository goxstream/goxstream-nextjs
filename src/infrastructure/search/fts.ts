import { db } from "@/infrastructure/database/client";
import { anime as animeTable } from "@/infrastructure/database/schema/anime";
import { like, or } from "drizzle-orm";

/**
 * Searches the anime database for titles, slugs, or synopses matching the query term.
 * Leverages native D1 SQLite text pattern matching.
 * 
 * @param queryText - The text query input by the user
 * @param limit - Maximum number of search results to return
 * @returns List of matching anime records
 */
export async function searchAnime(queryText: string, limit: number = 20): Promise<any[]> {
  if (!queryText || queryText.trim() === "") {
    return [];
  }

  const searchPattern = `%${queryText.trim()}%`;

  try {
    const results = await db
      .select()
      .from(animeTable)
      .where(
        or(
          like(animeTable.title, searchPattern),
          like(animeTable.slug, searchPattern),
          like(animeTable.synopsis, searchPattern)
        )
      )
      .limit(limit)
      .all();

    return results.map((item) => ({
      ...item,
      rating: item.rating != null ? Number(item.rating) : null,
      popularity: item.popularity ?? 0,
    }));
  } catch (error) {
    console.error("Search query execution failed:", error);
    return [];
  }
}
