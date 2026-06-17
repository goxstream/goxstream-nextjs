import { authUser } from "@/modules/auth/services/authUser";
import { toNextJsHandler } from "better-auth/next-js";

export const userAuthHandler = toNextJsHandler(authUser);
