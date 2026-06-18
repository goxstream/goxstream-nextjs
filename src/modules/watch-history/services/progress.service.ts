import { db } from "@/infrastructure/database/client";
import { watchHistory as watchHistoryTable } from "@/infrastructure/database/schema/interactions";
import { episodes as episodesTable } from "@/infrastructure/database/schema/media";
import { eq, and, sql } from "drizzle-orm";

export class ProgressService {
  private static COMPLETION_PERCENTAGE_THRESHOLD = 90.0; // 90% completion triggers watched status
  private static MIN_RESUME_PERCENTAGE = 5.0; // below 5%, start from beginning (0)
  private static MAX_RESUME_PERCENTAGE = 90.0; // above 90%, start from beginning/next episode (0)

  /**
   * Retrieves the current watch progress for a user on a specific episode.
   * Calculates the smart resume offset based on threshold rules.
   */
  async getProgress(userId: string, episodeId: string) {
    try {
      const record = await db.query.watchHistory.findFirst({
        where: and(
          eq(watchHistoryTable.userId, userId),
          eq(watchHistoryTable.episodeId, episodeId)
        ),
      });

      const episode = await db
        .select({ durationSeconds: episodesTable.durationSeconds })
        .from(episodesTable)
        .where(eq(episodesTable.id, episodeId))
        .get();

      if (!record || !episode || !episode.durationSeconds) {
        return {
          progress: 0,
          completed: false,
          percentage: 0,
          resumeOffset: 0,
        };
      }

      const duration = episode.durationSeconds;
      const percentage = (record.progress / duration) * 100;
      
      // Calculate smart resume offset:
      // If watched less than 5% or more than 90%, start from 0. Otherwise, resume where they left off.
      let resumeOffset = record.progress;
      if (percentage < ProgressService.MIN_RESUME_PERCENTAGE || percentage >= ProgressService.MAX_RESUME_PERCENTAGE) {
        resumeOffset = 0;
      }

      return {
        progress: record.progress,
        completed: record.completed,
        percentage: Math.round(percentage * 100) / 100,
        resumeOffset,
      };
    } catch (error) {
      console.error("Error retrieving watch progress:", error);
      return {
        progress: 0,
        completed: false,
        percentage: 0,
        resumeOffset: 0,
      };
    }
  }

  /**
   * Saves or updates the user's progress on an episode.
   * Auto-completes the episode if progress exceeds the threshold.
   * Increments the episode view count on first-time play or completion if applicable.
   */
  async saveProgress(userId: string, episodeId: string, progressSeconds: number) {
    try {
      const episode = await db
        .select({ 
          durationSeconds: episodesTable.durationSeconds,
          viewCount: episodesTable.viewCount
        })
        .from(episodesTable)
        .where(eq(episodesTable.id, episodeId))
        .get();

      if (!episode || !episode.durationSeconds) {
        throw new Error(`Episode with ID ${episodeId} not found or has no duration.`);
      }

      const duration = episode.durationSeconds;
      const progress = Math.max(0, Math.min(progressSeconds, duration));
      const percentage = (progress / duration) * 100;
      const isCompleted = percentage >= ProgressService.COMPLETION_PERCENTAGE_THRESHOLD;

      // Check for existing progress record
      const existingRecord = await db.query.watchHistory.findFirst({
        where: and(
          eq(watchHistoryTable.userId, userId),
          eq(watchHistoryTable.episodeId, episodeId)
        ),
      });

      if (!existingRecord) {
        // First time watching this episode:
        // 1. Insert progress record
        await db.insert(watchHistoryTable).values({
          userId,
          episodeId,
          progress,
          completed: isCompleted,
          updatedAt: new Date(),
        }).run();

        // 2. Increment view count
        await db
          .update(episodesTable)
          .set({ viewCount: sql`${episodesTable.viewCount} + 1` })
          .where(eq(episodesTable.id, episodeId))
          .run();
      } else {
        // Update existing record
        const wasCompleted = existingRecord.completed;
        const nowCompleted = wasCompleted || isCompleted;

        await db
          .update(watchHistoryTable)
          .set({
            progress,
            completed: nowCompleted,
            updatedAt: new Date(),
          })
          .where(
            and(
              eq(watchHistoryTable.userId, userId),
              eq(watchHistoryTable.episodeId, episodeId)
            )
          )
          .run();
      }

      return {
        completed: isCompleted,
        percentage: Math.round(percentage * 100) / 100,
      };
    } catch (error) {
      console.error("Error saving watch progress:", error);
      throw error;
    }
  }
}
