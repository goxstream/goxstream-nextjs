"use server";

import { revalidatePath } from "next/cache";
import { AnimeService } from "../services/animeService";
import { createAnimeSchema } from "../schemas/createAnimeSchema";

const animeService = new AnimeService();

export async function createAnimeAction(rawInput: unknown) {
  const parseResult = createAnimeSchema.safeParse(rawInput);
  if (!parseResult.success) {
    const errorMap: Record<string, string> = {};
    for (const issue of parseResult.error.issues) {
      const path = issue.path.join(".");
      errorMap[path] = issue.message;
    }
    return {
      success: false,
      errors: errorMap,
    };
  }

  try {
    await animeService.createAnime(parseResult.data);
    revalidatePath("/", "layout");
    return {
      success: true,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Failed to create anime",
    };
  }
}
