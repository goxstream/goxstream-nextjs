import { getQueueBinding } from "@/cloudflare/bindings/queues";

export interface TranscodeMessage {
  action: "transcode";
  episodeId: string;
  sourceFileKey: string;
  targetQuality: string; // e.g., "1080p", "720p", "360p"
  timestamp: string;
}

/**
 * Publishes a transcoding job payload to the Cloudflare Queue.
 * 
 * @param episodeId - The target episode ID
 * @param sourceFileKey - The original video source key in R2
 * @param targetQuality - The target video resolution output
 */
export async function publishTranscodeTask(
  episodeId: string,
  sourceFileKey: string,
  targetQuality: string
): Promise<void> {
  try {
    const queue = getQueueBinding("INGEST_QUEUE");

    const message: TranscodeMessage = {
      action: "transcode",
      episodeId,
      sourceFileKey,
      targetQuality,
      timestamp: new Date().toISOString(),
    };

    await queue.send(message);
  } catch (error) {
    console.error("Failed to publish transcode task to INGEST_QUEUE:", error);
    throw error;
  }
}
