import { getEnv } from "./env";

export function getR2Binding(bindingName: string): R2Bucket {
  const env = getEnv() as any;
  const bucket = env[bindingName];
  if (!bucket) {
    throw new Error(`Cloudflare R2 bucket binding '${bindingName}' not found. Please ensure it is configured in wrangler.jsonc.`);
  }
  return bucket as R2Bucket;
}
