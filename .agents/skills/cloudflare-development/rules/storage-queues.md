# Storage and Queues

Integrations with Cloudflare R2 object storage and Cloudflare Queues for asynchronous pipelines.

## Guidelines

1. **R2 Operations**:
   - Access R2 buckets via the request context:
     ```typescript
     const bucket = getRequestContext().env.ANIME_BUCKET;
     ```
   - Put objects:
     ```typescript
     await bucket.put("key/name.mp4", streamOrBuffer, {
       customMetadata: { animeId: "123" }
     });
     ```
   - Get objects:
     ```typescript
     const object = await bucket.get("key/name.mp4");
     ```

2. **Cloudflare Queues**:
   - Send tasks for background processing (e.g. transcoding, video ingestion).
   - Sending messages:
     ```typescript
     const queue = getRequestContext().env.INGEST_QUEUE;
     await queue.send({
       type: "transcode",
       episodeId: 456
     });
     ```
   - Consumers should handle retries and failures gracefully.
