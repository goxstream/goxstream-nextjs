import { sqliteTable, text, integer, real, unique } from "drizzle-orm/sqlite-core";
import { relations, sql } from "drizzle-orm";
import { anime } from "./anime";
import { watchHistory, comments } from "./interactions";

// --- Content & Streaming ---

export const episodes = sqliteTable(
  "episodes",
  {
    id: text("id").primaryKey(),
    animeId: text("anime_id")
      .notNull()
      .references(() => anime.id, { onDelete: "cascade" }),
    episodeNumber: real("episode_number").notNull(),
    title: text("title"),
    synopsis: text("synopsis"),
    durationSeconds: integer("duration_seconds"),
    thumbnailKey: text("thumbnail_key"),
    airedAt: integer("aired_at", { mode: "timestamp" }),
    viewCount: integer("view_count").notNull().default(0),
    createdAt: integer("created_at", { mode: "timestamp" })
      .notNull()
      .default(sql`(strftime('%s', 'now'))`),
  },
  (t) => ({
    unq: unique().on(t.animeId, t.episodeNumber),
  }),
);

export const episodesRelations = relations(episodes, ({ one, many }) => ({
  anime: one(anime, { fields: [episodes.animeId], references: [anime.id] }),
  videoSources: many(videoSources),
  subtitles: many(subtitles),
  watchHistory: many(watchHistory),
  comments: many(comments),
}));

export const videoQualities = sqliteTable("video_qualities", {
  id: text("id").primaryKey(), // '360p', '1080p'
  name: text("name").notNull(),
});

export const videoQualitiesRelations = relations(
  videoQualities,
  ({ many }) => ({
    sources: many(videoSources),
  }),
);

export const videoFormats = sqliteTable("video_formats", {
  id: text("id").primaryKey(), // 'hls', 'mp4'
  name: text("name").notNull(),
});

export const videoFormatsRelations = relations(videoFormats, ({ many }) => ({
  sources: many(videoSources),
}));

export const videoSources = sqliteTable("video_sources", {
  id: text("id").primaryKey(),
  episodeId: text("episode_id")
    .notNull()
    .references(() => episodes.id, { onDelete: "cascade" }),
  qualityId: text("quality_id")
    .notNull()
    .references(() => videoQualities.id, { onDelete: "restrict" }),
  formatId: text("format_id")
    .notNull()
    .references(() => videoFormats.id, { onDelete: "restrict" }),
  fileKey: text("file_key").notNull(),
  url: text("url"),
  fileSize: integer("file_size"),
  isPrimary: integer("is_primary", { mode: "boolean" })
    .notNull()
    .default(false),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(strftime('%s', 'now'))`),
});

export const videoSourcesRelations = relations(videoSources, ({ one }) => ({
  episode: one(episodes, {
    fields: [videoSources.episodeId],
    references: [episodes.id],
  }),
  quality: one(videoQualities, {
    fields: [videoSources.qualityId],
    references: [videoQualities.id],
  }),
  format: one(videoFormats, {
    fields: [videoSources.formatId],
    references: [videoFormats.id],
  }),
}));

export const subtitles = sqliteTable("subtitles", {
  id: text("id").primaryKey(),
  episodeId: text("episode_id")
    .notNull()
    .references(() => episodes.id, { onDelete: "cascade" }),
  language: text("language").notNull(),
  label: text("label").notNull(),
  fileKey: text("file_key").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(strftime('%s', 'now'))`),
});

export const subtitlesRelations = relations(subtitles, ({ one }) => ({
  episode: one(episodes, {
    fields: [subtitles.episodeId],
    references: [episodes.id],
  }),
}));
