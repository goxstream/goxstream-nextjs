import { AnimeService } from "@/modules/anime/services/animeService";
import { GenresClientPage } from "./GenresClientPage";

export const revalidate = 0;

export default async function AdminAnimeGenresPage() {
  const animeService = new AnimeService();
  const data = await animeService.getAdminGenreList();

  return <GenresClientPage data={data} />;
}
