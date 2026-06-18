import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";
import { relations, sql } from "drizzle-orm";
import { episodes } from "./media";
import { bookmarks } from "./interactions";
import { animeGenres } from "./genres";

// --- Anime Metadata (Dummy-aligned) ---

export const anime = sqliteTable("anime", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  coverImage: text("cover_image").notNull(),
  bannerImage: text("banner_image").notNull(),
  synopsis: text("synopsis"),
  year: integer("year"),
  quarter: text("quarter").$type<"Winter" | "Spring" | "Summer" | "Fall">(),
  episodeCount: integer("episode_count"),
  status: text("status").$type<"Ongoing" | "Completed" | "Upcoming">(),
  rating: real("rating"),
  popularity: integer("popularity").default(0),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(strftime('%s', 'now'))`),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(strftime('%s', 'now'))`),
});

export const animeRelations = relations(anime, ({ many }) => ({
  episodes: many(episodes),
  bookmarks: many(bookmarks),
  genres: many(animeGenres),
}));

