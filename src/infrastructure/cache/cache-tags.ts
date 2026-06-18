import { revalidateTag } from "next/cache";

export const CACHE_TAGS = {
  anime: "anime",
  episodes: "episodes",
  trending: "trending",
  recommendations: "recommendations",
} as const;

export type CacheTag = typeof CACHE_TAGS[keyof typeof CACHE_TAGS];

/**
 * Revalidates a cached resource by its tag.
 * Wraps Next.js native revalidateTag function.
 * 
 * @param tag - The cache tag to revalidate
 */
export function revalidateCacheTag(tag: CacheTag): void {
  try {
    revalidateTag(tag, "default");
  } catch (error) {
    console.warn(
      `Failed to revalidate cache tag '${tag}' (this is normal if running outside a request context):`,
      error
    );
  }
}
