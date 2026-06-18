import { AnimeService } from "@/modules/anime/services/animeService";

export async function getAnimeList() {
  try {
    const animeService = new AnimeService();
    const listAnime = await animeService.getAnimeList();
    return Response.json({ data: listAnime });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Internal server error";
    return Response.json({ error: errorMessage }, { status: 500 });
  }
}
