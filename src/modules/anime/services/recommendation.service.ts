import { db } from "@/infrastructure/database/client";
import { anime as animeTable } from "@/infrastructure/database/schema/anime";
import { watchHistory as watchHistoryTable } from "@/infrastructure/database/schema/interactions";
import { episodes as episodesTable } from "@/infrastructure/database/schema/media";
import { eq, ne, inArray } from "drizzle-orm";
import { calculateCosineSimilarity } from "../utils/similarity";
import { TrendingService } from "./trending.service";

export class RecommendationService {
  private trendingService = new TrendingService();

  /**
   * Fetches content-based anime recommendations for a target anime based on genre similarity.
   */
  async getRecommendationsForAnime(targetAnimeId: string, limit: number = 5): Promise<any[]> {
    try {
      // 1. Fetch target anime with its genres
      const targetAnime = await db.query.anime.findFirst({
        where: eq(animeTable.id, targetAnimeId),
        with: {
          genres: {
            with: {
              genre: true,
            },
          },
        },
      });

      if (!targetAnime) {
        return [];
      }

      const targetGenreIds = new Set(
        targetAnime.genres?.map((g: any) => g.genreId).filter(Boolean) || []
      );

      if (targetGenreIds.size === 0) {
        // Fallback to trending if target anime has no genres
        return this.trendingService.getTrendingAnime(limit);
      }

      // 2. Fetch all other anime with their genres
      const otherAnimeList = await db.query.anime.findMany({
        where: ne(animeTable.id, targetAnimeId),
        with: {
          genres: {
            with: {
              genre: true,
            },
          },
        },
      });

      // 3. Compile the union of all unique genre IDs between target and candidates
      const allGenreIdsSet = new Set<string>(targetGenreIds);
      otherAnimeList.forEach((item) => {
        item.genres?.forEach((g: any) => {
          if (g.genreId) allGenreIdsSet.add(g.genreId);
        });
      });
      const uniqueGenreIds = Array.from(allGenreIdsSet);

      // Helper function to build genre binary vector
      const buildVector = (genreIds: Set<string>): number[] => {
        return uniqueGenreIds.map((id) => (genreIds.has(id) ? 1 : 0));
      };

      // Vector of the target anime
      const targetVector = buildVector(targetGenreIds);

      // 4. Calculate similarity score for each candidate
      const candidates = otherAnimeList.map((item) => {
        const itemGenreIds = new Set<string>(
          item.genres?.map((g: any) => g.genreId).filter(Boolean) || []
        );
        const candidateVector = buildVector(itemGenreIds);
        const similarity = calculateCosineSimilarity(targetVector, candidateVector);

        return {
          ...item,
          rating: item.rating != null ? Number(item.rating) : null,
          popularity: item.popularity ?? 0,
          similarityScore: similarity,
        };
      });

      // 5. Sort candidates by similarity score descending, and filter out zero similarity
      return candidates
        .filter((c) => c.similarityScore > 0)
        .sort((a, b) => b.similarityScore - a.similarityScore)
        .slice(0, limit);
    } catch (error) {
      console.error("Error generating recommendations for anime:", error);
      return [];
    }
  }

  /**
   * Fetches personalized recommendations for a user based on their aggregated watch history.
   */
  async getRecommendationsForUser(userId: string, limit: number = 5): Promise<any[]> {
    try {
      // 1. Fetch user's watch history (distinct anime ids from episodes watched)
      const userHistory = await db
        .select({
          animeId: episodesTable.animeId,
        })
        .from(watchHistoryTable)
        .innerJoin(episodesTable, eq(watchHistoryTable.episodeId, episodesTable.id))
        .where(eq(watchHistoryTable.userId, userId))
        .all();

      const watchedAnimeIds = Array.from(
        new Set(userHistory.map((h) => h.animeId).filter(Boolean))
      );

      if (watchedAnimeIds.length === 0) {
        // Fallback to trending anime if user has no watch history
        return this.trendingService.getTrendingAnime(limit);
      }

      // 2. Fetch all anime user has watched to calculate genre weights
      const watchedAnimeList = await db.query.anime.findMany({
        where: inArray(animeTable.id, watchedAnimeIds),
        with: {
          genres: {
            with: {
              genre: true,
            },
          },
        },
      });

      // 3. Aggregate genre frequency to build user preference profile
      const userGenreWeights = new Map<string, number>();
      watchedAnimeList.forEach((item) => {
        item.genres?.forEach((g: any) => {
          if (g.genreId) {
            userGenreWeights.set(g.genreId, (userGenreWeights.get(g.genreId) || 0) + 1);
          }
        });
      });

      if (userGenreWeights.size === 0) {
        return this.trendingService.getTrendingAnime(limit);
      }

      // 4. Fetch all unwatched anime candidates
      const candidateList = await db.query.anime.findMany({
        with: {
          genres: {
            with: {
              genre: true,
            },
          },
        },
      });

      // Filter out already watched anime from candidates
      const unwatchedCandidates = candidateList.filter(
        (c) => !watchedAnimeIds.includes(c.id)
      );

      // Collect all unique genre IDs
      const allGenreIdsSet = new Set<string>(userGenreWeights.keys());
      unwatchedCandidates.forEach((item) => {
        item.genres?.forEach((g: any) => {
          if (g.genreId) allGenreIdsSet.add(g.genreId);
        });
      });
      const uniqueGenreIds = Array.from(allGenreIdsSet);

      // 5. Construct vectors
      // User preference vector holds genre frequencies as weights
      const userVector = uniqueGenreIds.map((id) => userGenreWeights.get(id) || 0);

      const buildVector = (genreIds: Set<string>): number[] => {
        return uniqueGenreIds.map((id) => (genreIds.has(id) ? 1 : 0));
      };

      // 6. Calculate Cosine Similarity with user vector
      const scoredCandidates = unwatchedCandidates.map((item) => {
        const itemGenreIds = new Set<string>(
          item.genres?.map((g: any) => g.genreId).filter(Boolean) || []
        );
        const itemVector = buildVector(itemGenreIds);
        const similarity = calculateCosineSimilarity(userVector, itemVector);

        return {
          ...item,
          rating: item.rating != null ? Number(item.rating) : null,
          popularity: item.popularity ?? 0,
          recommendationScore: similarity,
        };
      });

      // 7. Sort by score in descending order
      return scoredCandidates
        .filter((c) => c.recommendationScore > 0)
        .sort((a, b) => b.recommendationScore - a.recommendationScore)
        .slice(0, limit);
    } catch (error) {
      console.error("Error generating personalized user recommendations:", error);
      return [];
    }
  }
}
