// @ts-ignore
import { default as handler } from "../../.open-next/worker.js";
import { handleScheduledEvent } from "./workers/cron";
import { handleQueueBatch } from "./workers/queue-consumer";

export default {
  // Reuse the standard OpenNext fetch handler
  fetch: handler.fetch,

  // Add our custom Scheduled handler (Cron)
  async scheduled(event, env, ctx) {
    ctx.waitUntil(handleScheduledEvent(event, env));
  },

  // Add our custom Queue handler
  async queue(batch, env, ctx) {
    ctx.waitUntil(handleQueueBatch(batch, env));
  },
} satisfies ExportedHandler<CloudflareEnv>;

// Re-export any other exports from OpenNext if present (e.g. Durable Objects)
// @ts-ignore
export * from "../../.open-next/worker.js";
