import { sqliteTable, text, integer, primaryKey } from "drizzle-orm/sqlite-core";
import { relations, sql } from "drizzle-orm";
import { anime } from "./anime";

export const genres = sqliteTable("genres", {
  id: text("id").primaryKey(),
  name: text("name").notNull().unique(),
  slug: text("slug").notNull().unique(),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(strftime('%s', 'now'))`),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(strftime('%s', 'now'))`),
});

export const animeGenres = sqliteTable(
  "anime_genres",
  {
    animeId: text("anime_id")
      .notNull()
      .references(() => anime.id, { onDelete: "cascade" }),
    genreId: text("genre_id")
      .notNull()
      .references(() => genres.id, { onDelete: "cascade" }),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.animeId, t.genreId] }),
  })
);

export const genresRelations = relations(genres, ({ many }) => ({
  anime: many(animeGenres),
}));

export const animeGenresRelations = relations(animeGenres, ({ one }) => ({
  anime: one(anime, {
    fields: [animeGenres.animeId],
    references: [anime.id],
  }),
  genre: one(genres, {
    fields: [animeGenres.genreId],
    references: [genres.id],
  }),
}));
