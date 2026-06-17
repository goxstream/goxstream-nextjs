import { getAnimeList } from "@/server/api/anime/getAnimeList";

export const dynamic = "force-dynamic";

export async function GET() {
  return getAnimeList();
}
