import { AsyncLocalStorage } from "node:async_hooks";

export interface TraceContext {
  traceId: string;
  userId?: string;
  clientIP?: string;
}

export const traceContextStorage = new AsyncLocalStorage<TraceContext>();

/**
 * Executes a function within a specific trace context.
 */
export function runWithTraceContext<T>(context: TraceContext, fn: () => T): T {
  return traceContextStorage.run(context, fn);
}

/**
 * Retrieves the current trace context, if any.
 */
export function getTraceContext(): TraceContext | undefined {
  return traceContextStorage.getStore();
}

/**
 * Generates a random trace ID.
 */
export function generateTraceId(): string {
  return Array.from({ length: 16 }, () =>
    Math.floor(Math.random() * 16).toString(16)
  ).join("");
}
