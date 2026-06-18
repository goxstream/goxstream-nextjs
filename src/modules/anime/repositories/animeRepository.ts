import { db } from "@/infrastructure/database/client";
import { anime as animeTable, episodes as episodesTable } from "@/infrastructure/database/schema";
import { eq, desc } from "drizzle-orm";

export class AnimeRepository {
  async findAll() {
    return db.query.anime.findMany({
      with: {
        genres: {
          with: {
            genre: true,
          },
        },
      },
    });
  }

  async findAllForAdmin() {
    return db.query.anime.findMany({
      orderBy: desc(animeTable.createdAt),
      with: {
        genres: {
          with: {
            genre: true,
          },
        },
      },
    });
  }

  async findBySlug(slug: string) {
    const result = await db.query.anime.findFirst({
      where: eq(animeTable.slug, slug),
      with: {
        genres: {
          with: {
            genre: true,
          },
        },
      },
    });
    return result || null;
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
