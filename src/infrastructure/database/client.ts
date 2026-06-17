import { drizzle } from "drizzle-orm/d1";
import * as schema from "./schema";
import { getD1Binding } from "@/cloudflare/bindings/d1";

export function getDb() {
  const dbBinding = getD1Binding();
  return drizzle(dbBinding, { schema });
}

// Lazy database proxy to avoid top-level getCloudflareContext() invocation during module evaluation
export const db = new Proxy({} as ReturnType<typeof getDb>, {
  get(target, prop, receiver) {
    const actualDb = getDb();
    const value = Reflect.get(actualDb, prop);
    if (typeof value === "function") {
      return value.bind(actualDb);
    }
    return value;
  }
});
