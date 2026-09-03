type ErrorSeverity = "error" | "warning" | "info";

/**
 * Reports an error to the console with a Melala prefix. The previous
 * in-memory log was never surfaced anywhere, so it's been removed —
 * keep this console-only unless a real monitoring sink is added.
 */
export function reportError(error: unknown, severity: ErrorSeverity = "error"): void {
  const message =
    error instanceof Error ? error.message : typeof error === "string" ? error : String(error);

  const stack = error instanceof Error ? error.stack : undefined;

  if (severity === "error") {
    console.error("[Melala Error]", message, stack);
  } else {
    console.warn("[Melala]", message);
  }
}
