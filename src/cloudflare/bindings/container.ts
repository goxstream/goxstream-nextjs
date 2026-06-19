import { getEnv } from "./env";

/**
  * Retrieves the Cloudflare Durable Object Namespace binding for GoxstreamContainer.
  * 
  * @param bindingName - The name of the container binding in wrangler.jsonc (e.g. "GOXSTREAM_CONTAINER")
  * @returns The Durable Object Namespace for the container
  */
export function getContainerBinding(bindingName: string): DurableObjectNamespace<any> {
  const env = getEnv() as any;
  const container = env[bindingName];
  if (!container) {
    throw new Error(`Cloudflare Container binding '${bindingName}' not found. Please ensure it is configured in wrangler.jsonc.`);
  }
  return container as DurableObjectNamespace<any>;
}
