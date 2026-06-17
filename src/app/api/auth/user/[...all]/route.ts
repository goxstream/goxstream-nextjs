import { authUser } from "@/lib/auth/user";
import { toNextJsHandler } from "better-auth/next-js";

export const { GET, POST } = toNextJsHandler(authUser);
