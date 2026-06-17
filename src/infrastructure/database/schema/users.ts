import { sqliteTable, text, integer, primaryKey } from "drizzle-orm/sqlite-core";
import { relations, sql } from "drizzle-orm";
import { users } from "./auth";
import { watchHistory, bookmarks, comments } from "./interactions";

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

// --- Custom Application Sessions & API Tokens ---

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
