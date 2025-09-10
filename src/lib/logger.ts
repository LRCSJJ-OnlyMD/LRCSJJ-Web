/**
 * Production-ready logging utility
 * Handles different log levels and environment-based logging
 */

type LogLevel = "debug" | "info" | "warn" | "error";

interface LogContext {
  userId?: string;
  userType?: "admin" | "club_manager" | "public";
  feature?: string;
  action?: string;
  timestamp?: string;
  [key: string]: string | number | boolean | undefined;
}

class Logger {
  private readonly isDevelopment: boolean;
  private readonly isProduction: boolean;

  constructor() {
    this.isDevelopment = process.env.NODE_ENV === "development";
    this.isProduction = process.env.NODE_ENV === "production";
  }

  private shouldLog(level: LogLevel): boolean {
    if (this.isProduction) {
      // In production, only log warnings and errors
      return level === "warn" || level === "error";
    }
    // In development, log everything
    return true;
  }

  private formatMessage(
    level: LogLevel,
    message: string,
    context?: LogContext
  ): Record<string, unknown> {
    const timestamp = new Date().toISOString();

    const logEntry = {
      timestamp,
      level: level.toUpperCase(),
      message,
      environment: process.env.NODE_ENV,
      ...(context && { context }),
    };

    return logEntry;
  }

  private writeLog(
    level: LogLevel,
    message: string,
    context?: LogContext
  ): void {
    if (!this.shouldLog(level)) return;

    const formattedLog = this.formatMessage(level, message, context);

    if (this.isDevelopment) {
      // In development, use console for immediate feedback
      switch (level) {
        case "debug":
          console.debug("🐛", formattedLog);
          break;
        case "info":
          console.info("ℹ️", formattedLog);
          break;
        case "warn":
          console.warn("⚠️", formattedLog);
          break;
        case "error":
          console.error("❌", formattedLog);
          break;
      }
    } else {
      // In production, could integrate with external logging service
      // For now, use minimal console logging for critical issues
      if (level === "error") {
        console.error(`[${formattedLog.timestamp}] ERROR:`, message);
      } else if (level === "warn") {
        console.warn(`[${formattedLog.timestamp}] WARN:`, message);
      }
    }
  }

  debug(message: string, context?: LogContext): void {
    this.writeLog("debug", message, context);
  }

  info(message: string, context?: LogContext): void {
    this.writeLog("info", message, context);
  }

  warn(message: string, context?: LogContext): void {
    this.writeLog("warn", message, context);
  }

  error(message: string, error?: Error | unknown, context?: LogContext): void {
    const errorContext: LogContext = {
      ...context,
    };

    if (error instanceof Error) {
      errorContext.errorName = error.name;
      errorContext.errorMessage = error.message;
      if (this.isDevelopment) {
        errorContext.errorStack = error.stack;
      }
    } else if (error && typeof error === "object") {
      errorContext.errorType = "unknown_object";
    }

    this.writeLog("error", message, errorContext);
  }

  // Specialized logging methods for common use cases
  auth(
    message: string,
    userId?: string,
    userType?: "admin" | "club_manager"
  ): void {
    this.info(message, { feature: "authentication", userId, userType });
  }

  payment(
    message: string,
    paymentId?: string,
    amount?: number,
    currency?: string
  ): void {
    this.info(message, {
      feature: "payment",
      paymentId,
      amount,
      currency,
      action: "payment_processing",
    });
  }

  security(message: string, context?: LogContext): void {
    this.warn(message, { ...context, feature: "security", priority: "high" });
  }

  api(
    message: string,
    endpoint?: string,
    method?: string,
    statusCode?: number
  ): void {
    this.info(message, {
      feature: "api",
      endpoint,
      method,
      statusCode,
      action: "api_call",
    });
  }
}

// Export singleton instance
export const logger = new Logger();

// Export types for use in other files
export type { LogLevel, LogContext };
