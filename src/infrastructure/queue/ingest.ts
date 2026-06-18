import { getQueueBinding } from "@/cloudflare/bindings/queues";

export interface IngestMessage {
  action: "ingest";
  episodeId: string;
  fileKey: string;
  timestamp: string;
}

/**
 * Publishes an ingestion job payload to the Cloudflare Queue.
 * 
 * @param episodeId - The target episode ID
 * @param fileKey - The R2 storage key of the uploaded video file
 */
export async function publishIngestTask(episodeId: string, fileKey: string): Promise<void> {
  try {
    const queue = getQueueBinding("INGEST_QUEUE");
    
    const message: IngestMessage = {
      action: "ingest",
      episodeId,
      fileKey,
      timestamp: new Date().toISOString(),
    };

    await queue.send(message);
  } catch (error) {
    console.error("Failed to publish ingest task to INGEST_QUEUE:", error);
    throw error;
  }
}
