import { getCloudflareContext } from "@opennextjs/cloudflare";
import { drizzle } from "drizzle-orm/d1";
import * as schema from "./schema";

export function getDb() {
  const { env } = getCloudflareContext();
  if (!env || !env.DB) {
    throw new Error("Cloudflare D1 binding 'DB' not found. Please ensure you are running the server with Wrangler.");
  }
  return drizzle(env.DB, { schema });
}
