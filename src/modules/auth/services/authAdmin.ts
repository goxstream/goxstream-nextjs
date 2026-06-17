import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/infrastructure/database/client";
import * as schema from "@/infrastructure/database/schema";

export const authAdmin = betterAuth({
  basePath: "/api/auth/admin",
  database: drizzleAdapter(db, {
    provider: "sqlite",
    schema: {
      user: schema.admins,
      session: schema.adminSessions,
      account: schema.adminAccounts,
      verification: schema.adminVerifications,
    },
  }),
  advanced: {
    cookiePrefix: "gox-admin",
  },
  emailAndPassword: {
    enabled: true,
  },
});
