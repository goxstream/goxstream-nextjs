import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db";
import * as schema from "@/db/schema";

export const authUser = betterAuth({
  basePath: "/api/auth/user",
  database: drizzleAdapter(db, {
    provider: "sqlite",
    schema: {
      user: schema.users,
      session: schema.userSessions,
      account: schema.userAccounts,
      verification: schema.userVerifications,
    },
  }),
  advanced: {
    cookiePrefix: "gox-user",
  },
  emailAndPassword: {
    enabled: true,
  },
});
