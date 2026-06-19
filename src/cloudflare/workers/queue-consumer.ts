import { getContainer } from "@cloudflare/containers";

// queue-consumer.ts - Queue Message Consumer (Cloudflare Queues)
export async function handleQueueBatch(batch: MessageBatch<any>, env: CloudflareEnv): Promise<void> {
  for (const message of batch.messages) {
    console.log("Processing queue message with ID:", message.id);
    
    try {
      const body = message.body;
      if (body && body.action === "transcode") {
        const { episodeId, sourceFileKey } = body;
        console.log(`Triggering transcoding for episode ${episodeId} using source ${sourceFileKey}`);
        
        // Ambil instance container berdasarkan episodeId
        const containerInstance = getContainer(env.GOXSTREAM_CONTAINER, episodeId);
        
        // Picu pemrosesan video secara asinkron di kontainer
        const response = await containerInstance.fetch("http://localhost/transcode", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            job_id: episodeId,
            input_key: sourceFileKey,
            output_prefix: `streams/${episodeId}`
          })
        });
        
        if (!response.ok) {
          throw new Error(`Container responded with status ${response.status}: ${await response.text()}`);
        }
        
        console.log(`Successfully triggered transcode job for episode ${episodeId}`);
      }
      
      message.ack(); // Acknowledge message completion
    } catch (error) {
      console.error(`Failed to process message ${message.id}:`, error);
      // Jangan di-ack agar bisa dicoba ulang (retry) oleh Cloudflare Queue jika terjadi kegagalan sistem
    }
  }
}

