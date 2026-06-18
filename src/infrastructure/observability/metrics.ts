import { trackEvent } from "../analytics/analytics";
import { getTraceContext } from "./tracing";

/**
 * Records performance latency and status metrics for HTTP requests.
 */
export function recordRequestMetric(path: string, durationMs: number, status: number): void {
  const traceCtx = getTraceContext();
  trackEvent({
    event: "system.request",
    userId: traceCtx?.userId || "anonymous",
    metadata: {
      path,
      durationMs,
      status,
      traceId: traceCtx?.traceId || "",
    },
  });
}

/**
 * Records critical technical errors occurring in system components.
 */
export function recordErrorMetric(errorType: string, component: string): void {
  const traceCtx = getTraceContext();
  trackEvent({
    event: "system.error",
    userId: traceCtx?.userId || "anonymous",
    metadata: {
      errorType,
      component,
      traceId: traceCtx?.traceId || "",
    },
  });
}
