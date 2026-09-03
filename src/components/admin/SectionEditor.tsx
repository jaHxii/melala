import { useState, useCallback, type FormEvent } from "react";
import type { DbSection, DbMenuItem } from "@/lib/menu-db";
import { updateSection, deleteSection, createSection, swapMenuItemOrder } from "@/lib/menu-db";
import { ItemEditor, AddItemForm } from "./ItemEditor";

type SectionEditorProps = {
  section: DbSection;
  items: DbMenuItem[];
  onUpdate: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  canMoveUp?: boolean;
  canMoveDown?: boolean;
};

export function SectionEditor({
  section,
  items,
  onUpdate,
  onMoveUp,
  onMoveDown,
  canMoveUp = false,
  canMoveDown = false,
}: SectionEditorProps) {
  const [editing, setEditing] = useState(false);
  const [nameEn, setNameEn] = useState(section.name_en);
  const [nameAm, setNameAm] = useState(section.name_am ?? "");
  const [saving, setSaving] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");

  const handleSave = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      setSaving(true);
      setError("");
      const updates: Parameters<typeof updateSection>[1] = {
        name_en: nameEn,
      };
      if (nameAm) updates.name_am = nameAm;

      const success = await updateSection(section.id, updates);
      setSaving(false);
      if (success) {
        setEditing(false);
        onUpdate();
      } else {
        setError("Failed to save. Are you logged in?");
      }
    },
    [section.id, nameEn, nameAm, onUpdate],
  );

  const handleDelete = useCallback(async () => {
    const success = await deleteSection(section.id);
    if (success) {
      onUpdate();
    } else {
      setError("Failed to delete. Are you logged in?");
    }
  }, [section.id, onUpdate]);

  const handleCancel = useCallback(() => {
    setNameEn(section.name_en);
    setNameAm(section.name_am ?? "");
    setEditing(false);
    setError("");
  }, [section]);

  const handleMoveItem = useCallback(
    async (index: number, dir: 1 | -1) => {
      const current = items[index];
      const other = items[index + dir];
      if (!current || !other) return;
      const result = await swapMenuItemOrder(current.id, other.id);
      if (result.ok) {
        onUpdate();
      } else {
        console.error("Reorder failed:", result.error);
        setError(
          result.error
            ? `Failed to reorder: ${result.error}`
            : "Failed to reorder. Are you logged in?",
        );
      }
    },
    [items, onUpdate],
  );

  return (
    <div
      className="overflow-hidden rounded-2xl"
      style={{
        border: "1px solid var(--border)",
        background: "var(--card)",
      }}
    >
      {/* Section Header */}
      <div
        className="flex items-center gap-3 px-4 py-3.5"
        style={{
          borderBottom: "1px solid var(--border)",
          background: "var(--background)",
        }}
      >
        <button
          type="button"
          onClick={() => setCollapsed(!collapsed)}
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg transition-colors"
          style={{ color: "var(--muted-foreground)" }}
          aria-label={collapsed ? "Expand section" : "Collapse section"}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`transition-transform duration-200 ${collapsed ? "" : "rotate-90"}`}
          >
            <path d="m9 18 6-6-6-6" />
          </svg>
        </button>

        {editing ? (
          <form onSubmit={handleSave} className="flex flex-1 items-center gap-2">
            <input
              type="text"
              value={nameEn}
              onChange={(e) => setNameEn(e.target.value)}
              required
              className="min-w-0 flex-1 rounded-lg px-3 py-1.5 text-sm font-bold"
              style={{
                border: "1px solid var(--border)",
                background: "var(--background)",
                color: "var(--foreground)",
              }}
            />
            <input
              type="text"
              value={nameAm}
              onChange={(e) => setNameAm(e.target.value)}
              placeholder="Amharic"
              className="w-28 rounded-lg px-3 py-1.5 text-sm"
              style={{
                border: "1px solid var(--border)",
                background: "var(--background)",
                color: "var(--foreground)",
              }}
            />
            <button
              type="submit"
              disabled={saving}
              className="shrink-0 rounded-lg px-4 py-1.5 text-xs font-bold text-white transition-all disabled:opacity-50"
              style={{ background: "var(--brand)" }}
            >
              {saving ? "Saving..." : "Save"}
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="shrink-0 rounded-lg px-3 py-1.5 text-xs font-medium transition-all"
              style={{
                border: "1px solid var(--border)",
                color: "var(--muted-foreground)",
              }}
            >
              Cancel
            </button>
          </form>
        ) : (
          <>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="truncate text-sm font-bold" style={{ color: "var(--brand)" }}>
                  {section.name_en}
                </span>
                {section.name_am && (
                  <span
                    className="shrink-0 font-ethiopic text-xs"
                    style={{ color: "var(--muted-foreground)" }}
                  >
                    {section.name_am}
                  </span>
                )}
              </div>
            </div>
            <span
              className="shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-bold"
              style={{
                border: "1px solid var(--border)",
                color: "var(--foreground)",
              }}
            >
              {items.length}
            </span>
            <div className="flex shrink-0 gap-1">
              {onMoveUp && (
                <button
                  type="button"
                  onClick={onMoveUp}
                  disabled={!canMoveUp}
                  aria-label={`Move section ${section.name_en} up`}
                  title="Move section up"
                  className="flex h-7 w-7 items-center justify-center rounded-lg border transition-all disabled:cursor-default disabled:opacity-25"
                  style={{
                    border: "1px solid var(--border)",
                    color: "var(--muted-foreground)",
                  }}
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
              )}
              {onMoveDown && (
                <button
                  type="button"
                  onClick={onMoveDown}
                  disabled={!canMoveDown}
                  aria-label={`Move section ${section.name_en} down`}
                  title="Move section down"
                  className="flex h-7 w-7 items-center justify-center rounded-lg border transition-all disabled:cursor-default disabled:opacity-25"
                  style={{
                    border: "1px solid var(--border)",
                    color: "var(--muted-foreground)",
                  }}
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
              )}
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
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={handleDelete}
                    aria-label={`Delete section ${section.name_en} and its ${items.length} item(s) — this cannot be undone`}
                    title={`Deletes this section and all ${items.length} item(s) inside it`}
                    className="rounded-lg px-4 py-1.5 text-xs font-bold text-white transition-all active:scale-95"
                    style={{
                      background: "oklch(0.55 0.2 25)",
                      boxShadow: "0 2px 8px -2px oklch(0.55 0.2 25 / 0.5)",
                    }}
                  >
                    Delete {items.length > 0 ? `(${items.length})` : ""}
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
          </>
        )}
      </div>

      {/* Error */}
      {error && (
        <div
          className="px-4 py-2.5 text-xs"
          style={{
            borderBottom: "1px solid var(--border)",
            background: "oklch(0.6 0.2 25 / 0.05)",
            color: "oklch(0.6 0.2 25)",
          }}
        >
          {error}
        </div>
      )}

      {/* Items */}
      {!collapsed && (
        <div className="space-y-2 p-3">
          {items.map((item, index) => (
            <ItemEditor
              key={item.id}
              item={item}
              onUpdate={onUpdate}
              onMoveUp={index > 0 ? () => handleMoveItem(index, -1) : undefined}
              onMoveDown={index < items.length - 1 ? () => handleMoveItem(index, 1) : undefined}
              canMoveUp={index > 0}
              canMoveDown={index < items.length - 1}
            />
          ))}
          <AddItemForm sectionId={section.id} onAdded={onUpdate} />
        </div>
      )}
    </div>
  );
}

/* ── Add Section Form ─────────────────────────────────────────── */

type AddSectionFormProps = {
  type: "cafe" | "restaurant";
  onAdded: () => void;
};

export function AddSectionForm({ type, onAdded }: AddSectionFormProps) {
  const [open, setOpen] = useState(false);
  const [nameEn, setNameEn] = useState("");
  const [nameAm, setNameAm] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      setSaving(true);
      setError("");
      const result = await createSection(type, nameEn, nameAm);
      setSaving(false);
      if (result) {
        setNameEn("");
        setNameAm("");
        setOpen(false);
        onAdded();
      } else {
        setError("Failed to add section. Are you logged in?");
      }
    },
    [type, nameEn, nameAm, onAdded],
  );

  const handleCancel = useCallback(() => {
    setNameEn("");
    setNameAm("");
    setOpen(false);
    setError("");
  }, []);

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="w-full rounded-2xl py-5 text-sm font-semibold transition-all"
        style={{
          border: "2px dashed var(--border)",
          color: "var(--muted-foreground)",
        }}
      >
        + Add Section
      </button>
    );
  }

  return (
    <div
      className="overflow-hidden rounded-2xl"
      style={{
        border: "2px solid oklch(0.54 0.15 34 / 0.2)",
        background: "var(--card)",
      }}
    >
      <div
        className="px-4 py-3"
        style={{
          borderBottom: "1px solid var(--border)",
          background: "var(--background)",
        }}
      >
        <span className="text-sm font-bold" style={{ color: "var(--brand)" }}>
          New Section
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
                background: "var(--background)",
                color: "var(--foreground)",
              }}
              placeholder="e.g. Desserts"
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
                background: "var(--background)",
                color: "var(--foreground)",
              }}
              placeholder="e.g. ዝናብ"
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
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={saving || !nameEn.trim()}
            className="rounded-xl px-8 py-3 text-sm font-bold text-white transition-all active:scale-[0.97] disabled:opacity-40"
            style={{
              background: "var(--brand)",
              boxShadow: "0 4px 14px -3px oklch(0.54 0.15 34 / 0.5)",
            }}
          >
            {saving ? "Adding..." : "+ Add Section"}
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
