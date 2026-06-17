import { db } from "@/infrastructure/database/client";
import { anime } from "@/infrastructure/database/schema";

export async function getAnimeList() {
  try {
    const listAnime = await db.select().from(anime).all();
    return Response.json({ data: listAnime });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Internal server error";
    return Response.json({ error: errorMessage }, { status: 500 });
  }
}
