import { getEnv } from "./env";

export function getKVBinding(bindingName: string): KVNamespace {
  const env = getEnv() as any;
  const kv = env[bindingName];
  if (!kv) {
    throw new Error(`Cloudflare KV namespace binding '${bindingName}' not found. Please ensure it is configured in wrangler.jsonc.`);
  }
  return kv as KVNamespace;
}
