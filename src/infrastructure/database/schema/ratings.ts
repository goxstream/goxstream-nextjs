import { sqliteTable, text, integer, primaryKey } from "drizzle-orm/sqlite-core";
import { relations, sql } from "drizzle-orm";
import { profiles } from "./users";
import { anime } from "./anime";

// --- User Anime Ratings ---
export const animeRatings = sqliteTable(
  "anime_ratings",
  {
    userId: text("user_id")
      .notNull()
      .references(() => profiles.id, { onDelete: "cascade" }),
    animeId: text("anime_id")
      .notNull()
      .references(() => anime.id, { onDelete: "cascade" }),
    rating: integer("rating").notNull(), // rating score, e.g., 1 to 10 scale
    createdAt: integer("created_at", { mode: "timestamp" })
      .notNull()
      .default(sql`(strftime('%s', 'now'))`),
    updatedAt: integer("updated_at", { mode: "timestamp" })
      .notNull()
      .default(sql`(strftime('%s', 'now'))`),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.userId, t.animeId] }),
  })
);

// --- Relations ---
export const animeRatingsRelations = relations(animeRatings, ({ one }) => ({
  user: one(profiles, {
    fields: [animeRatings.userId],
    references: [profiles.id],
  }),
  anime: one(anime, {
    fields: [animeRatings.animeId],
    references: [anime.id],
  }),
}));

// Additional relations for existing tables to avoid spaghetti code in original files
export const animeAdditionalRelations = relations(anime, ({ many }) => ({
  ratings: many(animeRatings),
}));

export const profilesAdditionalRelations = relations(profiles, ({ many }) => ({
  ratings: many(animeRatings),
}));
