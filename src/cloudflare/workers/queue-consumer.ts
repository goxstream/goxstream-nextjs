// queue-consumer.ts - Queue Message Consumer (Cloudflare Queues)
export async function handleQueueBatch(batch: MessageBatch<any>, env: CloudflareEnv): Promise<void> {
  for (const message of batch.messages) {
    console.log("Processing queue message with ID:", message.id);
    
    try {
      const body = message.body;
      if (body && body.action === "transcode") {
        const { episodeId, sourceFileKey } = body;
        console.log(`Triggering transcoding for episode ${episodeId} using source ${sourceFileKey}`);
        
        const devConverterUrl = (env as any).GOX_CONVERTER_URL;
        const url = devConverterUrl 
          ? `${devConverterUrl}/transcode` 
          : `http://localhost/container/${episodeId}/transcode`;
        
        const client = devConverterUrl ? fetch : (env as any).CONVERTER_SERVICE.fetch;
        
        const appUrl = (env as any).BETTER_AUTH_URL || "http://localhost:3000";
        const inputUrl = `${appUrl}/api/internal/media/download?key=${sourceFileKey}`;
        const uploadUrlPrefix = `${appUrl}/api/internal/media/upload/streams/${episodeId}`;

        // Picu pemrosesan video secara asinkron di converter
        const response = await client(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            job_id: episodeId,
            input_url: inputUrl,
            upload_url_prefix: uploadUrlPrefix
          })
        });
        
        if (!response.ok) {
          throw new Error(`Converter responded with status ${response.status}: ${await response.text()}`);
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


