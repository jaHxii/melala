import { useState, useCallback, type FormEvent } from "react";
import type { DbMenuItem } from "@/lib/menu-db";
import { updateMenuItem, deleteMenuItem } from "@/lib/menu-db";

type ItemEditorProps = {
  item: DbMenuItem;
  onUpdate: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  canMoveUp?: boolean;
  canMoveDown?: boolean;
};

export function ItemEditor({
  item,
  onUpdate,
  onMoveUp,
  onMoveDown,
  canMoveUp = false,
  canMoveDown = false,
}: ItemEditorProps) {
  const [editing, setEditing] = useState(false);
  const [nameEn, setNameEn] = useState(item.name_en);
  const [nameAm, setNameAm] = useState(item.name_am ?? "");
  const [descEn, setDescEn] = useState(item.description_en ?? "");
  const [descAm, setDescAm] = useState(item.description_am ?? "");
  const [price, setPrice] = useState(String(item.price));
  const [available, setAvailable] = useState(item.available);
  const [saving, setSaving] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSave = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      setSaving(true);
      setError("");

      const updates: Parameters<typeof updateMenuItem>[1] = {
        name_en: nameEn,
        price: Number(price),
        available,
      };
      if (nameAm) updates.name_am = nameAm;
      if (descEn) updates.description_en = descEn;
      if (descAm) updates.description_am = descAm;

      const result = await updateMenuItem(item.id, updates);

      setSaving(false);
      if (result) {
        setEditing(false);
        setSuccess(true);
        setTimeout(() => setSuccess(false), 1500);
        onUpdate();
      } else {
        setError("Failed to save. Are you logged in?");
      }
    },
    [item.id, nameEn, nameAm, descEn, descAm, price, available, onUpdate],
  );

  const handleDelete = useCallback(async () => {
    const success = await deleteMenuItem(item.id);
    if (success) {
      onUpdate();
    } else {
      setError("Failed to delete. Are you logged in?");
    }
  }, [item.id, onUpdate]);

  const handleCancel = useCallback(() => {
    setNameEn(item.name_en);
    setNameAm(item.name_am ?? "");
    setDescEn(item.description_en ?? "");
    setDescAm(item.description_am ?? "");
    setPrice(String(item.price));
    setAvailable(item.available);
    setEditing(false);
    setError("");
  }, [item]);

  /* ── Edit Form ────────────────────────────────────────────── */

  if (editing) {
    return (
      <div
        className="overflow-hidden rounded-xl"
        style={{
          border: "1px solid oklch(0.54 0.15 34 / 0.2)",
          background: "var(--background)",
        }}
      >
        <div
          className="px-4 py-2.5"
          style={{
            borderBottom: "1px solid var(--border)",
            background: "var(--background)",
          }}
        >
          <span className="text-xs font-semibold" style={{ color: "var(--brand)" }}>
            Editing: {item.name_en}
          </span>
        </div>
        <form onSubmit={handleSave} className="space-y-3 p-4">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label
                className="mb-1 block text-[11px] font-semibold uppercase tracking-wide"
                style={{ color: "var(--muted-foreground)" }}
              >
                Name (English)
              </label>
              <input
                type="text"
                value={nameEn}
                onChange={(e) => setNameEn(e.target.value)}
                required
                className="w-full rounded-xl px-3 py-2.5 text-sm"
                style={{
                  border: "1px solid var(--border)",
                  background: "var(--card)",
                  color: "var(--foreground)",
                }}
              />
            </div>
            <div>
              <label
                className="mb-1 block text-[11px] font-semibold uppercase tracking-wide"
                style={{ color: "var(--muted-foreground)" }}
              >
                Name (Amharic)
              </label>
              <input
                type="text"
                value={nameAm}
                onChange={(e) => setNameAm(e.target.value)}
                className="w-full rounded-xl px-3 py-2.5 text-sm"
                style={{
                  border: "1px solid var(--border)",
                  background: "var(--card)",
                  color: "var(--foreground)",
                }}
              />
            </div>
            <div>
              <label
                className="mb-1 block text-[11px] font-semibold uppercase tracking-wide"
                style={{ color: "var(--muted-foreground)" }}
              >
                Description (English)
              </label>
              <input
                type="text"
                value={descEn}
                onChange={(e) => setDescEn(e.target.value)}
                className="w-full rounded-xl px-3 py-2.5 text-sm"
                style={{
                  border: "1px solid var(--border)",
                  background: "var(--card)",
                  color: "var(--foreground)",
                }}
              />
            </div>
            <div>
              <label
                className="mb-1 block text-[11px] font-semibold uppercase tracking-wide"
                style={{ color: "var(--muted-foreground)" }}
              >
                Description (Amharic)
              </label>
              <input
                type="text"
                value={descAm}
                onChange={(e) => setDescAm(e.target.value)}
                className="w-full rounded-xl px-3 py-2.5 text-sm"
                style={{
                  border: "1px solid var(--border)",
                  background: "var(--card)",
                  color: "var(--foreground)",
                }}
              />
            </div>
            <div>
              <label
                className="mb-1 block text-[11px] font-semibold uppercase tracking-wide"
                style={{ color: "var(--muted-foreground)" }}
              >
                Price (ETB)
              </label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
                min="0"
                className="w-full rounded-xl px-3 py-2.5 text-sm"
                style={{
                  border: "1px solid var(--border)",
                  background: "var(--card)",
                  color: "var(--foreground)",
                }}
              />
            </div>
            <div className="flex items-end">
              <label
                className="flex items-center gap-2.5 rounded-xl px-4 py-2.5 text-sm"
                style={{
                  border: "1px solid var(--border)",
                  background: "var(--card)",
                  color: "var(--muted-foreground)",
                }}
              >
                <input
                  type="checkbox"
                  checked={available}
                  onChange={(e) => setAvailable(e.target.checked)}
                  className="h-4 w-4 rounded"
                  style={{ accentColor: "var(--brand)" }}
                />
                Available on menu
              </label>
            </div>
          </div>
          {error && (
            <p
              className="rounded-lg px-3 py-2 text-xs"
              style={{
                background: "oklch(0.6 0.2 25 / 0.1)",
                color: "oklch(0.6 0.2 25)",
              }}
            >
              {error}
            </p>
          )}
          <div className="flex items-center gap-3 pt-1">
            <button
              type="submit"
              disabled={saving || !nameEn.trim()}
              className="rounded-xl px-8 py-3 text-sm font-bold text-white transition-all active:scale-[0.97] disabled:opacity-40"
              style={{
                background: "var(--brand)",
                boxShadow: "0 4px 14px -3px oklch(0.54 0.15 34 / 0.5)",
              }}
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="rounded-xl px-6 py-3 text-sm font-medium transition-all"
              style={{
                border: "1px solid var(--border)",
                color: "var(--muted-foreground)",
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    );
  }

  /* ── Display Row ──────────────────────────────────────────── */

  return (
    <div
      className="flex items-center gap-3 rounded-xl px-4 py-3 transition-all"
      style={{
        border: success ? "1px solid oklch(0.5 0.15 145 / 0.3)" : "1px solid var(--border)",
        background: success ? "oklch(0.5 0.15 145 / 0.05)" : "var(--background)",
      }}
    >
      {(onMoveUp || onMoveDown) && (
        <div className="flex shrink-0 flex-col gap-0.5">
          <button
            type="button"
            onClick={onMoveUp}
            disabled={!canMoveUp}
            aria-label={`Move ${item.name_en} up`}
            title="Move up"
            className="flex h-6 w-6 items-center justify-center rounded-md transition-colors disabled:cursor-default disabled:opacity-25"
            style={{ color: "var(--muted-foreground)" }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m18 15-6-6-6 6" />
            </svg>
          </button>
          <button
            type="button"
            onClick={onMoveDown}
            disabled={!canMoveDown}
            aria-label={`Move ${item.name_en} down`}
            title="Move down"
            className="flex h-6 w-6 items-center justify-center rounded-md transition-colors disabled:cursor-default disabled:opacity-25"
            style={{ color: "var(--muted-foreground)" }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m6 9 6 6 6-6" />
            </svg>
          </button>
        </div>
      )}
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="truncate text-sm font-semibold" style={{ color: "var(--foreground)" }}>
            {item.name_en}
          </span>
          {!item.available && (
            <span
              className="shrink-0 rounded-md px-1.5 py-0.5 text-[10px] font-bold"
              style={{
                background: "oklch(0.6 0.2 25 / 0.1)",
                color: "oklch(0.6 0.2 25)",
              }}
            >
              HIDDEN
            </span>
          )}
        </div>
        {item.name_am && (
          <p className="font-ethiopic text-xs" style={{ color: "var(--muted-foreground)" }}>
            {item.name_am}
          </p>
        )}
        {item.description_en && (
          <p className="mt-0.5 text-xs" style={{ color: "var(--muted-foreground)", opacity: 0.6 }}>
            {item.description_en}
          </p>
        )}
        {error && (
          <p className="mt-1 text-xs" style={{ color: "oklch(0.6 0.2 25)" }}>
            {error}
          </p>
        )}
      </div>
      <span
        className="shrink-0 rounded-lg px-2.5 py-1 font-mono text-sm font-bold"
        style={{
          background: "oklch(0.68 0.12 71 / 0.1)",
          color: "var(--gold, oklch(0.68 0.12 71))",
        }}
      >
        {item.price}
      </span>{" "}
      <div className="flex shrink-0 gap-1">
        <button
          type="button"
          onClick={() => setEditing(true)}
          className="rounded-lg border px-3 py-1.5 text-xs font-medium transition-all"
          style={{
            border: "1px solid var(--border)",
            color: "var(--foreground)",
          }}
        >
          Edit
        </button>
        {!showConfirm ? (
          <button
            type="button"
            onClick={() => setShowConfirm(true)}
            className="rounded-lg border px-3 py-1.5 text-xs font-medium transition-all"
            style={{
              border: "1px solid oklch(0.6 0.2 25 / 0.3)",
              color: "oklch(0.55 0.2 25)",
            }}
          >
            Delete
          </button>
        ) : (
          <div className="flex gap-1.5">
            <button
              type="button"
              onClick={handleDelete}
              className="rounded-lg px-4 py-1.5 text-xs font-bold text-white transition-all active:scale-95"
              style={{
                background: "oklch(0.55 0.2 25)",
                boxShadow: "0 2px 8px -2px oklch(0.55 0.2 25 / 0.5)",
              }}
            >
              Delete
            </button>
            <button
              type="button"
              onClick={() => setShowConfirm(false)}
              className="rounded-lg px-3 py-1.5 text-xs font-medium transition-all"
              style={{
                border: "1px solid var(--border)",
                color: "var(--muted-foreground)",
              }}
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Add Item Form ────────────────────────────────────────────── */

type AddItemFormProps = {
  sectionId: string;
  onAdded: () => void;
};

export function AddItemForm({ sectionId, onAdded }: AddItemFormProps) {
  const [open, setOpen] = useState(false);
  const [nameEn, setNameEn] = useState("");
  const [nameAm, setNameAm] = useState("");
  const [descEn, setDescEn] = useState("");
  const [price, setPrice] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      setSaving(true);
      setError("");

      const { createMenuItem } = await import("@/lib/menu-db");
      const itemData: Parameters<typeof createMenuItem>[1] = {
        name_en: nameEn,
        price: Number(price),
      };
      if (nameAm) itemData.name_am = nameAm;
      if (descEn) itemData.description_en = descEn;

      const result = await createMenuItem(sectionId, itemData);

      setSaving(false);
      if (result) {
        setNameEn("");
        setNameAm("");
        setDescEn("");
        setPrice("");
        setOpen(false);
        onAdded();
      } else {
        setError("Failed to add item. Are you logged in?");
      }
    },
    [sectionId, nameEn, nameAm, descEn, price, onAdded],
  );

  const handleCancel = useCallback(() => {
    setNameEn("");
    setNameAm("");
    setDescEn("");
    setPrice("");
    setOpen(false);
    setError("");
  }, []);

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="w-full rounded-xl py-3 text-xs font-semibold transition-all"
        style={{
          border: "1px dashed var(--border)",
          color: "var(--muted-foreground)",
        }}
      >
        + Add Item
      </button>
    );
  }

  return (
    <div
      className="overflow-hidden rounded-xl"
      style={{
        border: "1px solid oklch(0.54 0.15 34 / 0.2)",
        background: "var(--background)",
      }}
    >
      <div
        className="px-4 py-2.5"
        style={{
          borderBottom: "1px solid var(--border)",
          background: "var(--background)",
        }}
      >
        <span className="text-xs font-semibold" style={{ color: "var(--brand)" }}>
          New Item
        </span>
      </div>
      <form onSubmit={handleSubmit} className="space-y-3 p-4">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <label
              className="mb-1 block text-[11px] font-semibold uppercase tracking-wide"
              style={{ color: "var(--muted-foreground)" }}
            >
              Name (English)
            </label>
            <input
              type="text"
              value={nameEn}
              onChange={(e) => setNameEn(e.target.value)}
              required
              className="w-full rounded-xl px-3 py-2.5 text-sm"
              style={{
                border: "1px solid var(--border)",
                background: "var(--card)",
                color: "var(--foreground)",
              }}
              placeholder="e.g. Doro Wot"
            />
          </div>
          <div>
            <label
              className="mb-1 block text-[11px] font-semibold uppercase tracking-wide"
              style={{ color: "var(--muted-foreground)" }}
            >
              Name (Amharic)
            </label>
            <input
              type="text"
              value={nameAm}
              onChange={(e) => setNameAm(e.target.value)}
              className="w-full rounded-xl px-3 py-2.5 text-sm"
              style={{
                border: "1px solid var(--border)",
                background: "var(--card)",
                color: "var(--foreground)",
              }}
              placeholder="e.g. ዶሮ ወጥ"
            />
          </div>
          <div>
            <label
              className="mb-1 block text-[11px] font-semibold uppercase tracking-wide"
              style={{ color: "var(--muted-foreground)" }}
            >
              Description
            </label>
            <input
              type="text"
              value={descEn}
              onChange={(e) => setDescEn(e.target.value)}
              className="w-full rounded-xl px-3 py-2.5 text-sm"
              style={{
                border: "1px solid var(--border)",
                background: "var(--card)",
                color: "var(--foreground)",
              }}
              placeholder="Optional description"
            />
          </div>
          <div>
            <label
              className="mb-1 block text-[11px] font-semibold uppercase tracking-wide"
              style={{ color: "var(--muted-foreground)" }}
            >
              Price (ETB)
            </label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
              min="0"
              className="w-full rounded-xl px-3 py-2.5 text-sm"
              style={{
                border: "1px solid var(--border)",
                background: "var(--card)",
                color: "var(--foreground)",
              }}
              placeholder="e.g. 720"
            />
          </div>
        </div>
        {error && (
          <p
            className="rounded-lg px-3 py-2 text-xs"
            style={{
              background: "oklch(0.6 0.2 25 / 0.1)",
              color: "oklch(0.6 0.2 25)",
            }}
          >
            {error}
          </p>
        )}
        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={saving || !nameEn.trim()}
            className="rounded-xl px-8 py-3 text-sm font-bold text-white transition-all active:scale-[0.97] disabled:opacity-40"
            style={{
              background: "var(--brand)",
              boxShadow: "0 4px 14px -3px oklch(0.54 0.15 34 / 0.5)",
            }}
          >
            {saving ? "Adding..." : "+ Add Item"}
          </button>
          <button
            type="button"
            onClick={handleCancel}
            className="rounded-xl px-6 py-3 text-sm font-medium transition-all"
            style={{
              border: "1px solid var(--border)",
              color: "var(--muted-foreground)",
            }}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
