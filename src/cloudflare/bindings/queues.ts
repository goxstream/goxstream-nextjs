import { getEnv } from "./env";

export function getQueueBinding(bindingName: string): Queue {
  const env = getEnv() as any;
  const queue = env[bindingName];
  if (!queue) {
    throw new Error(`Cloudflare Queue binding '${bindingName}' not found. Please ensure it is configured in wrangler.jsonc.`);
  }
  return queue as Queue;
}
