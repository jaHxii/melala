type ErrorSeverity = "error" | "warning" | "info";

interface ErrorReport {
  message: string;
  stack?: string;
  url: string;
  timestamp: number;
  severity: ErrorSeverity;
  userAgent: string;
}

const ERROR_LOG: ErrorReport[] = [];
const MAX_LOG_SIZE = 50;

export function reportError(error: unknown, severity: ErrorSeverity = "error"): void {
  const message =
    error instanceof Error ? error.message : typeof error === "string" ? error : String(error);

  const stack = error instanceof Error ? error.stack : undefined;

  const report: ErrorReport = {
    message,
    stack,
    url: typeof window !== "undefined" ? window.location.href : "",
    timestamp: Date.now(),
    severity,
    userAgent: typeof navigator !== "undefined" ? navigator.userAgent : "",
  };

  ERROR_LOG.unshift(report);
  if (ERROR_LOG.length > MAX_LOG_SIZE) ERROR_LOG.length = MAX_LOG_SIZE;

  if (severity === "error") {
    console.error("[Melala Error]", message, stack);
  }
}
