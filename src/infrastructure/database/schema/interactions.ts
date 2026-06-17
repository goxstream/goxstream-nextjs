import { sqliteTable, text, integer, primaryKey } from "drizzle-orm/sqlite-core";
import { relations, sql } from "drizzle-orm";
import { profiles } from "./users";
import { episodes } from "./media";
import { anime } from "./anime";

// --- User Interaction ---

export const watchHistory = sqliteTable(
  "watch_history",
  {
    userId: text("user_id")
      .notNull()
      .references(() => profiles.id, { onDelete: "cascade" }),
    episodeId: text("episode_id")
      .notNull()
      .references(() => episodes.id, { onDelete: "cascade" }),
    progress: integer("progress").notNull().default(0),
    completed: integer("completed", { mode: "boolean" })
      .notNull()
      .default(false),
    updatedAt: integer("updated_at", { mode: "timestamp" })
      .notNull()
      .default(sql`(strftime('%s', 'now'))`),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.userId, t.episodeId] }),
  }),
);

export const watchHistoryRelations = relations(watchHistory, ({ one }) => ({
  user: one(profiles, {
    fields: [watchHistory.userId],
    references: [profiles.id],
  }),
  episode: one(episodes, {
    fields: [watchHistory.episodeId],
    references: [episodes.id],
  }),
}));

export const bookmarkStatuses = sqliteTable("bookmark_statuses", {
  id: text("id").primaryKey(), // 'watching', 'plan'
  name: text("name").notNull(),
  color: text("color"),
});

export const bookmarkStatusesRelations = relations(
  bookmarkStatuses,
  ({ many }) => ({
    bookmarks: many(bookmarks),
  }),
);

export const bookmarks = sqliteTable(
  "bookmarks",
  {
    userId: text("user_id")
      .notNull()
      .references(() => profiles.id, { onDelete: "cascade" }),
    animeId: text("anime_id")
      .notNull()
      .references(() => anime.id, { onDelete: "cascade" }),
    statusId: text("status_id")
      .notNull()
      .default("plan")
      .references(() => bookmarkStatuses.id, { onDelete: "restrict" }),
    addedAt: integer("added_at", { mode: "timestamp" })
      .notNull()
      .default(sql`(strftime('%s', 'now'))`),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.userId, t.animeId] }),
  }),
);

export const bookmarksRelations = relations(bookmarks, ({ one }) => ({
  user: one(profiles, {
    fields: [bookmarks.userId],
    references: [profiles.id],
  }),
  anime: one(anime, { fields: [bookmarks.animeId], references: [anime.id] }),
  status: one(bookmarkStatuses, {
    fields: [bookmarks.statusId],
    references: [bookmarkStatuses.id],
  }),
}));

export const comments = sqliteTable("comments", {
  id: text("id").primaryKey(),
  episodeId: text("episode_id")
    .notNull()
    .references(() => episodes.id, { onDelete: "cascade" }),
  userId: text("user_id")
    .notNull()
    .references(() => profiles.id, { onDelete: "cascade" }),
  parentId: text("parent_id").references((): any => comments.id, {
    onDelete: "cascade",
  }),
  body: text("body").notNull(),
  isSpoiler: integer("is_spoiler", { mode: "boolean" })
    .notNull()
    .default(false),
  isDeleted: integer("is_deleted", { mode: "boolean" })
    .notNull()
    .default(false),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(strftime('%s', 'now'))`),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(strftime('%s', 'now'))`),
});

export const commentsRelations = relations(comments, ({ one, many }) => ({
  episode: one(episodes, {
    fields: [comments.episodeId],
    references: [episodes.id],
  }),
  user: one(profiles, { fields: [comments.userId], references: [profiles.id] }),
  parent: one(comments, {
    fields: [comments.parentId],
    references: [comments.id],
    relationName: "replies",
  }),
  replies: many(comments, { relationName: "replies" }),
}));
