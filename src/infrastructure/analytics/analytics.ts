import { getAnalyticsBinding } from "@/cloudflare/bindings/analytics";

export interface TelemetryEvent {
  event: string; // The event identifier, e.g., "video.play", "user.login"
  userId?: string;
  metadata?: Record<string, string | number>;
}

/**
 * Records a system telemetry event using the native Cloudflare Workers Analytics Engine.
 * Maps event details to blobs/indexes, executing in a non-blocking manner.
 * 
 * @param event - The telemetry event payload
 */
export function trackEvent(event: TelemetryEvent): void {
  try {
    const dataset = getAnalyticsBinding("TELEMETRY_DATASET");

    // Workers Analytics Engine accepts up to 20 blobs (strings) and 20 doubles (numbers).
    const blobs = [
      event.event,
      event.userId || "anonymous",
      JSON.stringify(event.metadata || {}),
    ];

    dataset.writeDataPoint({
      blobs,
      doubles: [],
      indexes: [event.event],
    });
  } catch (error) {
    console.warn(
      `Failed to log event '${event.event}' to Workers Analytics Engine:`,
      error
    );
  }
}
