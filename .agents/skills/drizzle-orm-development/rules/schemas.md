# Drizzle Schemas

Drizzle schemas define the SQLite tables, fields, types, and relations.

## Guidelines

1. **Table Structure**:
   - Import columns from `"drizzle-orm/sqlite-core"`.
   - Name files by their singular entity (e.g. `anime.ts`, `episodes.ts`).
   - Example:
     ```typescript
     import { sqliteTable, text, integer, index } from "drizzle-orm/sqlite-core";
     import { relations } from "drizzle-orm";

     export const anime = sqliteTable(
       "anime",
       {
         id: integer("id").primaryKey({ autoIncrement: true }),
         title: text("title").notNull(),
         slug: text("slug").notNull().unique(),
         description: text("description"),
         views: integer("views").default(0).notNull(),
       },
       (table) => ({
         slugIdx: index("anime_slug_idx").on(table.slug),
       })
     );

     export const episodes = sqliteTable("episodes", {
       id: integer("id").primaryKey({ autoIncrement: true }),
       animeId: integer("anime_id")
         .notNull()
         .references(() => anime.id, { onDelete: "cascade" }),
       title: text("title").notNull(),
       episodeNumber: integer("episode_number").notNull(),
     });

     export const animeRelations = relations(anime, ({ many }) => ({
       episodes: many(episodes),
     }));

     export const episodeRelations = relations(episodes, ({ one }) => ({
       anime: one(anime, {
         fields: [episodes.animeId],
         references: [anime.id],
       }),
     }));
     ```

2. **Conventions**:
   - Use `snake_case` in database column names (first argument of column constructor, e.g. `animeId: integer("anime_id")`).
   - Use `camelCase` for TypeScript property keys (e.g. `animeId`).
   - Define indexes for columns frequently queried in `where` or `orderBy` conditions.
