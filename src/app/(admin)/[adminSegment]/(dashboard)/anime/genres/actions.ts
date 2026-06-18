"use server";

import { AnimeService } from "@/modules/anime/services/animeService";
import { revalidatePath } from "next/cache";

const animeService = new AnimeService();

export async function createGenreAction(name: string) {
  if (!name || name.trim() === "") {
    throw new Error("Genre name is required");
  }
  await animeService.createGenre(name.trim());
  revalidatePath("/", "layout");
}

export async function renameGenreAction(id: string, name: string) {
  if (!id || !name || name.trim() === "") {
    throw new Error("Genre ID and name are required");
  }
  await animeService.renameGenre(id, name.trim());
  revalidatePath("/", "layout");
}

export async function deleteGenreAction(id: string) {
  if (!id) {
    throw new Error("Genre ID is required");
  }
  await animeService.deleteGenre(id);
  revalidatePath("/", "layout");
}
