import { getDb } from "@/db";
import { anime } from "@/db/schema";

export const runtime = "edge";

export async function GET() {
  try {
    const db = getDb();
    const listAnime = await db.select().from(anime).all();
    
    return Response.json({ data: listAnime });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Internal server error";
    return Response.json({ error: errorMessage }, { status: 500 });
  }
}
