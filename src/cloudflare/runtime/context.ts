import { getCloudflareContext } from "@opennextjs/cloudflare";

// context.ts - Cloudflare Context Manager
export function getExecutionContext() {
  const { ctx } = getCloudflareContext();
  if (!ctx) {
    throw new Error("Cloudflare ExecutionContext not found. Please ensure the application is running via Wrangler.");
  }
  return ctx;
}
