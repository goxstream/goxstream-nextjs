import { getTraceContext } from "./tracing";

export type LogLevel = "debug" | "info" | "warn" | "error";

interface LogPayload {
  timestamp: string;
  level: LogLevel;
  message: string;
  traceId?: string;
  userId?: string;
  clientIP?: string;
  meta?: Record<string, any>;
  error?: {
    message: string;
    stack?: string;
  };
}

class Logger {
  private isProduction: boolean;

  constructor() {
    this.isProduction = process.env.NODE_ENV === "production";
  }

  private log(level: LogLevel, message: string, meta?: Record<string, any>, error?: Error | any) {
    const traceCtx = getTraceContext();
    const payload: LogPayload = {
      timestamp: new Date().toISOString(),
      level,
      message,
      traceId: traceCtx?.traceId,
      userId: traceCtx?.userId,
      clientIP: traceCtx?.clientIP,
      meta,
    };

    if (error instanceof Error) {
      payload.error = {
        message: error.message,
        stack: error.stack,
      };
    } else if (error) {
      payload.error = {
        message: String(error),
      };
    }

    if (this.isProduction) {
      const logString = JSON.stringify(payload);
      if (level === "error") {
        console.error(logString);
      } else if (level === "warn") {
        console.warn(logString);
      } else {
        console.log(logString);
      }
    } else {
      const colorMap: Record<LogLevel, string> = {
        debug: "\x1b[36mDEBUG\x1b[0m",
        info: "\x1b[32mINFO \x1b[0m",
        warn: "\x1b[33mWARN \x1b[0m",
        error: "\x1b[31mERROR\x1b[0m",
      };

      const traceStr = payload.traceId ? ` [traceId:${payload.traceId}]` : "";
      const userStr = payload.userId ? ` [userId:${payload.userId}]` : "";
      
      let outMessage = `[${payload.timestamp}] ${colorMap[level]}${traceStr}${userStr}: ${message}`;
      
      if (meta && Object.keys(meta).length > 0) {
        outMessage += `\n  meta: ${JSON.stringify(meta, null, 2).replace(/\n/g, "\n  ")}`;
      }

      if (payload.error) {
        outMessage += `\n  error: ${payload.error.message}`;
        if (payload.error.stack) {
          outMessage += `\n  stack: ${payload.error.stack.replace(/\n/g, "\n  ")}`;
        }
      }

      if (level === "error") {
        console.error(outMessage);
      } else if (level === "warn") {
        console.warn(outMessage);
      } else {
        console.log(outMessage);
      }
    }
  }

  debug(message: string, meta?: Record<string, any>) {
    this.log("debug", message, meta);
  }

  info(message: string, meta?: Record<string, any>) {
    this.log("info", message, meta);
  }

  warn(message: string, meta?: Record<string, any>, error?: Error | any) {
    this.log("warn", message, meta, error);
  }

  error(message: string, error?: Error | any, meta?: Record<string, any>) {
    this.log("error", message, meta, error);
  }
}

export const logger = new Logger();
