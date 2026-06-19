// @ts-ignore
import { default as handler } from "../../.open-next/worker.js";
import { handleScheduledEvent } from "./workers/cron";
import { handleQueueBatch } from "./workers/queue-consumer";
import { Container, ContainerProxy } from "@cloudflare/containers";
export { ContainerProxy };

export class GoxstreamContainer extends Container {
  defaultPort = 8080;
  sleepAfter = "15m";
}

// @ts-ignore
GoxstreamContainer.outboundByHost = {
  "r2.internal": async (request: Request, env: any) => {
    const url = new URL(request.url);
    const key = decodeURIComponent(url.pathname.slice(1));
    
    if (request.method === "GET") {
      const object = await env.ANIME_BUCKET.get(key);
      if (!object) return new Response("Not Found", { status: 404 });
      return new Response(object.body, {
        headers: { "Content-Type": object.httpMetadata?.contentType || "application/octet-stream" }
      });
    }
    
    if (request.method === "PUT") {
      await env.ANIME_BUCKET.put(key, request.body, {
        httpMetadata: { contentType: request.headers.get("content-type") || "application/octet-stream" }
      });
      return new Response("OK", { status: 200 });
    }
    
    return new Response("Method Not Allowed", { status: 405 });
  }
};

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

