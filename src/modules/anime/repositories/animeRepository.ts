import { db } from "@/infrastructure/database/client";
import { anime as animeTable, episodes as episodesTable } from "@/infrastructure/database/schema";
import { eq } from "drizzle-orm";

export class AnimeRepository {
  async findAll() {
    return db.select().from(animeTable).all();
  }

  async findBySlug(slug: string) {
    const results = await db
      .select()
      .from(animeTable)
      .where(eq(animeTable.slug, slug))
      .limit(1);
    return results[0] || null;
  }

  async findEpisodesByAnimeId(animeId: string) {
    return db
      .select()
      .from(episodesTable)
      .where(eq(episodesTable.animeId, animeId))
      .orderBy(episodesTable.episodeNumber)
      .all();
  }
}
