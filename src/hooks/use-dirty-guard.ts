import { useEffect } from "react";

/**
 * Warns before the tab/window closes while a form has unsaved changes.
 * (SPA navigation inside the admin is handled by the editors' own
 * confirm-on-cancel; this covers reload/close.)
 */
export function useDirtyGuard(dirty: boolean): void {
  useEffect(() => {
    if (!dirty) return;
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [dirty]);
}
