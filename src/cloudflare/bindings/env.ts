import { getCloudflareContext } from "@opennextjs/cloudflare";

export function getEnv(): CloudflareEnv {
  const { env } = getCloudflareContext();
  if (!env) {
    throw new Error("Cloudflare environment context not found. Please ensure the application is running via Wrangler.");
  }
  return env as CloudflareEnv;
}
