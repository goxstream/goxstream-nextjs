import { createAuthClient } from "better-auth/react";

// Client for regular user authentication
export const authClientUser = createAuthClient({
  basePath: "/api/auth/user",
});

// Client for admin authentication
export const authClientAdmin = createAuthClient({
  basePath: "/api/auth/admin",
});
