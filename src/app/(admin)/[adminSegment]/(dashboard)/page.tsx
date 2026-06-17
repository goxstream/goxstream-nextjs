import { getDb } from "@/db";
import { users, anime, episodes, comments } from "@/db/schema";
import { count } from "drizzle-orm";
import { DashboardOverview } from "@/features/admin/components/DashboardOverview";

export default async function AdminDashboardPage() {
  const db = getDb();

  // Fetch counts from Drizzle ORM over Cloudflare D1
  const [usersCountRes, animeCountRes, episodesCountRes, commentsCountRes] = await Promise.all([
    db.select({ count: count() }).from(users),
    db.select({ count: count() }).from(anime),
    db.select({ count: count() }).from(episodes),
    db.select({ count: count() }).from(comments),
  ]);

  return (
    <DashboardOverview
      usersCount={usersCountRes[0]?.count ?? 0}
      animeCount={animeCountRes[0]?.count ?? 0}
      episodesCount={episodesCountRes[0]?.count ?? 0}
      commentsCount={commentsCountRes[0]?.count ?? 0}
    />
  );
}
