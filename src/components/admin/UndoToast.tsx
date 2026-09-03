import { useState, useEffect, useCallback } from "react";
import { subscribeUndo, runUndo, type UndoAction } from "@/lib/delete-undo";

/** Floating "Deleted — Undo" toast shown for 30s after any admin delete. */
export function UndoToast({ onRestored }: { onRestored?: () => void }) {
  const [action, setAction] = useState<UndoAction | null>(null);

  useEffect(() => subscribeUndo(setAction), []);

  const handleUndo = useCallback(async () => {
    const ok = await runUndo();
    if (ok) onRestored?.();
  }, [onRestored]);

  if (!action) return null;

  return (
    <div className="fixed inset-x-0 bottom-4 z-[9999] flex justify-center px-4">
      <div
        role="status"
        className="flex max-w-md items-center gap-3 rounded-2xl px-4 py-3 shadow-2xl"
        style={{
          border: "1px solid var(--border)",
          background: "var(--card)",
          color: "var(--foreground)",
        }}
      >
        <span className="min-w-0 flex-1 truncate text-sm">
          Deleted <span className="font-bold">“{action.label}”</span>
        </span>
        <button
          type="button"
          onClick={handleUndo}
          className="shrink-0 rounded-lg px-4 py-2 text-xs font-bold text-white transition-all active:scale-95 focus-ring"
          style={{ background: "var(--brand)" }}
        >
          Undo
        </button>
      </div>
    </div>
  );
}
