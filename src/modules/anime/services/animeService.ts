import { notFound } from "next/navigation";
import { AnimeRepository } from "../repositories/animeRepository";
import type { Anime } from "../types";
import type { AdminAnimeRow, AdminGenreRow } from "../dto/adminAnime";
import { db } from "@/infrastructure/database/client";
import { genres as genresTable, animeGenres as animeGenresTable } from "@/infrastructure/database/schema";
import { count, eq } from "drizzle-orm";

export class AnimeService {
  private repository = new AnimeRepository();

  async getAdminAnimeList(): Promise<AdminAnimeRow[]> {
    try {
      const list = await this.repository.findAllForAdmin();

      return list.map((a: any) => ({
        id: a.id,
        title: a.title,
        slug: a.slug,
        coverImage: a.coverImage,
        status: a.status as AdminAnimeRow["status"],
        genres: a.genres?.map((g: any) => g.genre.name) || [],
        year: a.year,
        quarter: a.quarter as AdminAnimeRow["quarter"],
        episodeCount: a.episodeCount,
        rating: a.rating != null ? Number(a.rating) : null,
        popularity: a.popularity ?? 0,
        createdAt: a.createdAt instanceof Date ? a.createdAt : new Date((a.createdAt as number) * 1000),
        updatedAt: a.updatedAt instanceof Date ? a.updatedAt : new Date((a.updatedAt as number) * 1000),
      }));
    } catch (error) {
      console.error("Failed to fetch admin anime list:", error);
      return [];
    }
  }

  async getHomepageData() {
    try {
      const list = await this.repository.findAll();
      
      const mapped: Anime[] = list.map((a: any) => ({
        id: a.id,
        title: a.title,
        slug: a.slug,
        coverImage: a.coverImage,
        bannerImage: a.bannerImage,
        synopsis: a.synopsis || "",
        genres: a.genres?.map((g: any) => g.genre.name) || [],
        year: a.year || new Date().getFullYear(),
        quarter: (a.quarter as any) || "Winter",
        episodeCount: a.episodeCount || 0,
        status: (a.status as any) || "Ongoing",
        rating: Number(a.rating) || 0,
        popularity: a.popularity || 0,
      }));

      return this.partitionCategories(mapped);
    } catch (error) {
      console.error("Failed to fetch anime from DB:", error);
      return this.partitionCategories([]);
    }
  }

  async getAnimeDetails(slug: string): Promise<{
    anime: Anime;
    episodes: any[];
  }> {
    let animeRecord: any = null;
    let episodeRecords: any[] = [];

    try {
      animeRecord = await this.repository.findBySlug(slug);
      if (animeRecord) {
        episodeRecords = await this.repository.findEpisodesByAnimeId(animeRecord.id);
      }
    } catch (error) {
      console.error("Failed to fetch anime details from database:", error);
    }

    if (!animeRecord) {
      notFound();
    }

    const mappedAnime: Anime = {
      id: animeRecord.id,
      title: animeRecord.title,
      slug: animeRecord.slug,
      coverImage: animeRecord.coverImage,
      bannerImage: animeRecord.bannerImage,
      synopsis: animeRecord.synopsis || "",
      genres: animeRecord.genres?.map((g: any) => g.genre.name) || [],
      year: animeRecord.year || new Date().getFullYear(),
      quarter: (animeRecord.quarter as any) || "Winter",
      episodeCount: animeRecord.episodeCount || 0,
      status: (animeRecord.status as any) || "Ongoing",
      rating: Number(animeRecord.rating) || 0,
      popularity: animeRecord.popularity || 0,
    };

    // Generate mock episodes if none are stored in the database
    const mappedEpisodes = episodeRecords.length > 0
      ? episodeRecords
      : Array.from({ length: mappedAnime.episodeCount || 12 }, (_, i) => ({
          id: `${mappedAnime.id}-ep-${i + 1}`,
          episodeNumber: i + 1,
          title: `Episode ${i + 1}`,
          synopsis: `Description for episode ${i + 1} of ${mappedAnime.title}. In this episode, we follow the characters as they face new obstacles and uncover secrets.`,
          durationSeconds: 1440, // 24 minutes
          thumbnailKey: mappedAnime.bannerImage,
          airedAt: null,
        }));

    return {
      anime: mappedAnime,
      episodes: mappedEpisodes,
    };
  }

  async getAdminGenreList(): Promise<AdminGenreRow[]> {
    try {
      const list = await db
        .select({
          id: genresTable.id,
          name: genresTable.name,
          slug: genresTable.slug,
          animeCount: count(animeGenresTable.animeId),
        })
        .from(genresTable)
        .leftJoin(animeGenresTable, eq(genresTable.id, animeGenresTable.genreId))
        .groupBy(genresTable.id)
        .all();
      return list;
    } catch (error) {
      console.error("Failed to fetch admin genre list:", error);
      return [];
    }
  }

  async createGenre(name: string) {
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    const id = `genre-${slug}`;
    await db.insert(genresTable).values({ id, name, slug }).run();
  }

  async renameGenre(id: string, name: string) {
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    await db.update(genresTable).set({ name, slug, updatedAt: new Date() }).where(eq(genresTable.id, id)).run();
  }

  async deleteGenre(id: string) {
    await db.delete(genresTable).where(eq(genresTable.id, id)).run();
  }

  private partitionCategories(list: Anime[]) {
    const trending = [...list].sort((a, b) => (b.popularity || 0) - (a.popularity || 0)).slice(0, 5);
    const newReleases = list.filter(a => a.year === 2024).slice(0, 5);
    const topRated = [...list].sort((a, b) => (b.rating || 0) - (a.rating || 0)).slice(0, 5);
    const continueWatching = list.slice(0, 5);
    const recommended = list.slice(5, 10);
    const seasonal = list.filter(a => a.year === 2024 && a.quarter === "Winter").slice(0, 5);
    const featured = trending;

    return {
      trending,
      newReleases,
      topRated,
      continueWatching,
      recommended,
      seasonal,
      featured,
    };
  }
}
