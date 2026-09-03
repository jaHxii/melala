/**
 * In-memory undo for admin deletes: after a delete succeeds the editor
 * registers a restore closure, and a toast offers Undo for 30 seconds.
 * Not persisted — a page reload clears it, which is acceptable.
 */

export type UndoAction = {
  id: string;
  label: string;
  restore: () => Promise<boolean>;
  expiresAt: number;
};

const UNDO_TTL_MS = 30_000;

let current: UndoAction | null = null;
const listeners = new Set<(action: UndoAction | null) => void>();

function publish(): void {
  listeners.forEach((l) => l(current));
}

export function registerUndo(action: Omit<UndoAction, "expiresAt">): void {
  current = { ...action, expiresAt: Date.now() + UNDO_TTL_MS };
  publish();
  window.setTimeout(() => {
    if (current?.id === action.id) {
      current = null;
      publish();
    }
  }, UNDO_TTL_MS);
}

export function subscribeUndo(listener: (action: UndoAction | null) => void): () => void {
  listeners.add(listener);
  listener(current);
  return () => listeners.delete(listener);
}

export async function runUndo(): Promise<boolean> {
  const action = current;
  if (!action) return false;
  current = null;
  publish();
  return action.restore();
}
