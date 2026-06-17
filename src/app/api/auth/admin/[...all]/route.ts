import { authAdmin } from "@/lib/auth/admin";
import { toNextJsHandler } from "better-auth/next-js";

export const { GET, POST } = toNextJsHandler(authAdmin);
