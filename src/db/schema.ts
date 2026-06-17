import {
  sqliteTable,
  text,
  integer,
  real,
  primaryKey,
  unique,
  index,
} from "drizzle-orm/sqlite-core";
import { relations, sql } from "drizzle-orm";

// --- Auth & Access Control ---

export const roles = sqliteTable("roles", {
  id: text("id").primaryKey(), // e.g., 'superadmin', 'user'
  name: text("name").notNull(),
  description: text("description"),
});

export const rolesRelations = relations(roles, ({ many }) => ({
  profiles: many(profiles),
  permissions: many(rolePermissions),
}));

export const permissions = sqliteTable("permissions", {
  id: text("id").primaryKey(), // e.g., 'settings:update'
  name: text("name").notNull(),
  description: text("description"),
});

export const permissionsRelations = relations(permissions, ({ many }) => ({
  roles: many(rolePermissions),
}));

export const rolePermissions = sqliteTable(
  "role_permissions",
  {
    roleId: text("role_id")
      .notNull()
      .references(() => roles.id, { onDelete: "cascade" }),
    permissionId: text("permission_id")
      .notNull()
      .references(() => permissions.id, { onDelete: "cascade" }),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.roleId, t.permissionId] }),
  }),
);

export const rolePermissionsRelations = relations(
  rolePermissions,
  ({ one }) => ({
    role: one(roles, {
      fields: [rolePermissions.roleId],
      references: [roles.id],
    }),
    permission: one(permissions, {
      fields: [rolePermissions.permissionId],
      references: [permissions.id],
    }),
  }),
);

// --- Better Auth User Tables ---

export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: integer("email_verified", { mode: "boolean" }).notNull().default(false),
  image: text("image"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().default(sql`(strftime('%s', 'now'))`),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull().default(sql`(strftime('%s', 'now'))`),
});

export const userSessions = sqliteTable(
  "user_sessions",
  {
    id: text("id").primaryKey(),
    expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
    token: text("token").notNull().unique(),
    createdAt: integer("created_at", { mode: "timestamp" }).notNull().default(sql`(strftime('%s', 'now'))`),
    updatedAt: integer("updated_at", { mode: "timestamp" }).notNull().default(sql`(strftime('%s', 'now'))`),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  },
  (table) => [index("user_sessions_userId_idx").on(table.userId)],
);

export const userAccounts = sqliteTable(
  "user_accounts",
  {
    id: text("id").primaryKey(),
    accountId: text("account_id").notNull(),
    providerId: text("provider_id").notNull(),
    userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    idToken: text("id_token"),
    accessTokenExpiresAt: integer("access_token_expires_at", { mode: "timestamp" }),
    refreshTokenExpiresAt: integer("refresh_token_expires_at", { mode: "timestamp" }),
    scope: text("scope"),
    password: text("password"),
    createdAt: integer("created_at", { mode: "timestamp" }).notNull().default(sql`(strftime('%s', 'now'))`),
    updatedAt: integer("updated_at", { mode: "timestamp" }).notNull().default(sql`(strftime('%s', 'now'))`),
  },
  (table) => [index("user_accounts_userId_idx").on(table.userId)],
);

export const userVerifications = sqliteTable(
  "user_verifications",
  {
    id: text("id").primaryKey(),
    identifier: text("identifier").notNull(),
    value: text("value").notNull(),
    expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
    createdAt: integer("created_at", { mode: "timestamp" }).notNull().default(sql`(strftime('%s', 'now'))`),
    updatedAt: integer("updated_at", { mode: "timestamp" }).notNull().default(sql`(strftime('%s', 'now'))`),
  },
  (table) => [index("user_verifications_identifier_idx").on(table.identifier)],
);

// --- Better Auth Admin Tables ---

export const admins = sqliteTable("admins", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: integer("email_verified", { mode: "boolean" }).notNull().default(false),
  image: text("image"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().default(sql`(strftime('%s', 'now'))`),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull().default(sql`(strftime('%s', 'now'))`),
});

export const adminSessions = sqliteTable(
  "admin_sessions",
  {
    id: text("id").primaryKey(),
    expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
    token: text("token").notNull().unique(),
    createdAt: integer("created_at", { mode: "timestamp" }).notNull().default(sql`(strftime('%s', 'now'))`),
    updatedAt: integer("updated_at", { mode: "timestamp" }).notNull().default(sql`(strftime('%s', 'now'))`),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    userId: text("user_id").notNull().references(() => admins.id, { onDelete: "cascade" }),
  },
  (table) => [index("admin_sessions_userId_idx").on(table.userId)],
);

export const adminAccounts = sqliteTable(
  "admin_accounts",
  {
    id: text("id").primaryKey(),
    accountId: text("account_id").notNull(),
    providerId: text("provider_id").notNull(),
    userId: text("user_id").notNull().references(() => admins.id, { onDelete: "cascade" }),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    idToken: text("id_token"),
    accessTokenExpiresAt: integer("access_token_expires_at", { mode: "timestamp" }),
    refreshTokenExpiresAt: integer("refresh_token_expires_at", { mode: "timestamp" }),
    scope: text("scope"),
    password: text("password"),
    createdAt: integer("created_at", { mode: "timestamp" }).notNull().default(sql`(strftime('%s', 'now'))`),
    updatedAt: integer("updated_at", { mode: "timestamp" }).notNull().default(sql`(strftime('%s', 'now'))`),
  },
  (table) => [index("admin_accounts_userId_idx").on(table.userId)],
);

export const adminVerifications = sqliteTable(
  "admin_verifications",
  {
    id: text("id").primaryKey(),
    identifier: text("identifier").notNull(),
    value: text("value").notNull(),
    expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
    createdAt: integer("created_at", { mode: "timestamp" }).notNull().default(sql`(strftime('%s', 'now'))`),
    updatedAt: integer("updated_at", { mode: "timestamp" }).notNull().default(sql`(strftime('%s', 'now'))`),
  },
  (table) => [index("admin_verifications_identifier_idx").on(table.identifier)],
);

// --- User Profile (Decoupled) ---

export const profiles = sqliteTable("profiles", {
  id: text("id")
    .primaryKey()
    .references(() => users.id, { onDelete: "cascade" }),
  username: text("username").notNull().unique(),
  displayName: text("display_name"),
  avatarUrl: text("avatar_url"),
  roleId: text("role_id")
    .notNull()
    .default("user")
    .references(() => roles.id, { onDelete: "restrict" }),
  passwordHash: text("password_hash"),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(strftime('%s', 'now'))`),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(strftime('%s', 'now'))`),
});

export const profilesRelations = relations(profiles, ({ one, many }) => ({
  user: one(users, { fields: [profiles.id], references: [users.id] }),
  role: one(roles, { fields: [profiles.roleId], references: [roles.id] }),
  watchHistory: many(watchHistory),
  bookmarks: many(bookmarks),
  comments: many(comments),
  sessions: many(sessions),
  apiTokens: many(apiTokens),
}));

export const usersRelations = relations(users, ({ one, many }) => ({
  profile: one(profiles, { fields: [users.id], references: [profiles.id] }),
  sessions: many(userSessions),
  accounts: many(userAccounts),
}));

export const adminsRelations = relations(admins, ({ many }) => ({
  sessions: many(adminSessions),
  accounts: many(adminAccounts),
}));

export const userSessionsRelations = relations(userSessions, ({ one }) => ({
  user: one(users, { fields: [userSessions.userId], references: [users.id] }),
}));

export const userAccountsRelations = relations(userAccounts, ({ one }) => ({
  user: one(users, { fields: [userAccounts.userId], references: [users.id] }),
}));

export const adminSessionsRelations = relations(adminSessions, ({ one }) => ({
  admin: one(admins, { fields: [adminSessions.userId], references: [admins.id] }),
}));

export const adminAccountsRelations = relations(adminAccounts, ({ one }) => ({
  admin: one(admins, { fields: [adminAccounts.userId], references: [admins.id] }),
}));

// --- Anime Metadata (Dummy-aligned) ---

export const anime = sqliteTable("anime", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  coverImage: text("cover_image").notNull(),
  bannerImage: text("banner_image").notNull(),
  synopsis: text("synopsis"),
  genres: text("genres", { mode: "json" }).$type<string[]>().notNull(),
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
}));

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

// --- System ---

export const siteSettings = sqliteTable("site_settings", {
  key: text("key").primaryKey(),
  value: text("value").notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(strftime('%s', 'now'))`),
});

export const sessions = sqliteTable("sessions", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => profiles.id, { onDelete: "cascade" }),
  userAgent: text("user_agent"),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(strftime('%s', 'now'))`),
  lastUsed: integer("last_used", { mode: "timestamp" })
    .notNull()
    .default(sql`(strftime('%s', 'now'))`),
});

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(profiles, { fields: [sessions.userId], references: [profiles.id] }),
}));

export const apiTokens = sqliteTable("api_tokens", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => profiles.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(strftime('%s', 'now'))`),
  lastUsed: integer("last_used", { mode: "timestamp" })
    .notNull()
    .default(sql`(strftime('%s', 'now'))`),
});

export const apiTokensRelations = relations(apiTokens, ({ one }) => ({
  user: one(profiles, {
    fields: [apiTokens.userId],
    references: [profiles.id],
  }),
}));
