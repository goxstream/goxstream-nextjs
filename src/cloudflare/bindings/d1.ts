import { getEnv } from "./env";

export function getD1Binding(): D1Database {
  const env = getEnv();
  if (!env.DB) {
    throw new Error("Cloudflare D1 database binding 'DB' not found. Please ensure it is configured in wrangler.jsonc.");
  }
  return env.DB;
}
