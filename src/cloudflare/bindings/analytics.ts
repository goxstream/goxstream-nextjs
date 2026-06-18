import { getEnv } from "./env";

/**
 * Retrieves the bound Cloudflare Analytics Engine dataset by its binding name.
 * 
 * @param bindingName - The name of the dataset binding in wrangler.jsonc
 * @returns The AnalyticsEngineDataset instance
 */
export function getAnalyticsBinding(bindingName: string): AnalyticsEngineDataset {
  const env = getEnv() as any;
  const dataset = env[bindingName];
  if (!dataset) {
    throw new Error(
      `Cloudflare Analytics Engine Dataset binding '${bindingName}' not found. Please ensure it is configured in wrangler.jsonc.`
    );
  }
  return dataset as AnalyticsEngineDataset;
}
