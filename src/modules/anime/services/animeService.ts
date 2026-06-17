import { notFound } from "next/navigation";
import { AnimeRepository } from "../repositories/animeRepository";
import type { Anime } from "../types";

export class AnimeService {
  private repository = new AnimeRepository();

  async getHomepageData() {
    try {
      const list = await this.repository.findAll();
      
      const mapped: Anime[] = list.map((a) => ({
        id: a.id,
        title: a.title,
        slug: a.slug,
        coverImage: a.coverImage,
        bannerImage: a.bannerImage,
        synopsis: a.synopsis || "",
        genres: a.genres || [],
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
      genres: animeRecord.genres || [],
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
