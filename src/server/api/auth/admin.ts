import { authAdmin } from "@/modules/auth/services/authAdmin";
import { toNextJsHandler } from "better-auth/next-js";

export const adminAuthHandler = toNextJsHandler(authAdmin);
