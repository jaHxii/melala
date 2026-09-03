import { useState, useCallback, type FormEvent, type ChangeEvent } from "react";
import type { DbPaymentMethod } from "@/lib/payment-db";
import {
  updatePaymentMethod,
  deletePaymentMethod,
  createPaymentMethod,
  uploadPaymentImage,
} from "@/lib/payment-db";
import { useDirtyGuard } from "@/hooks/use-dirty-guard";

/* ── Small shared pieces ──────────────────────────────────────── */

function UploadField({
  label,
  current,
  onUploaded,
}: {
  label: string;
  current: string;
  onUploaded: (url: string) => void;
}) {
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);

  const handleFile = useCallback(
    async (e: ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      setError("");
      setUploading(true);
      const result = await uploadPaymentImage(
        file,
        label.toLowerCase().includes("qr") ? "qr" : "logo",
      );
      setUploading(false);
      if (result.error) {
        setError(result.error);
      } else {
        onUploaded(result.url);
      }
      e.target.value = "";
    },
    [label, onUploaded],
  );

  return (
    <div>
      <label
        className="mb-1 block text-[11px] font-semibold uppercase tracking-wide"
        style={{ color: "var(--muted-foreground)" }}
      >
        {label}
      </label>
      <div className="flex items-center gap-3">
        {current && (
          <img
            src={current}
            alt={label}
            className="h-12 w-12 shrink-0 rounded-lg border object-contain"
            style={{ borderColor: "var(--border)", background: "var(--background)" }}
          />
        )}
        <label
          className="inline-block cursor-pointer rounded-lg border px-3 py-2 text-xs font-medium transition-all hover:opacity-80"
          style={{
            border: "1px solid var(--border)",
            color: "var(--foreground)",
          }}
        >
          {uploading ? "Uploading…" : current ? "Replace image" : "Upload image"}
          <input
            type="file"
            accept="image/png,image/jpeg,image/webp"
            onChange={handleFile}
            className="hidden"
          />
        </label>
      </div>
      {error && (
        <p className="mt-1 text-[11px]" style={{ color: "oklch(0.55 0.2 25)" }}>
          {error}
        </p>
      )}
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label
        className="mb-1 block text-[11px] font-semibold uppercase tracking-wide"
        style={{ color: "var(--muted-foreground)" }}
      >
        {label}
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        placeholder={placeholder}
        className="w-full rounded-xl px-3 py-2.5 text-sm"
        style={{
          border: "1px solid var(--border)",
          background: "var(--background)",
          color: "var(--foreground)",
        }}
      />
    </div>
  );
}

/* ── Payment Method Editor ────────────────────────────────────── */

type PaymentMethodEditorProps = {
  method: DbPaymentMethod;
  onUpdate: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  canMoveUp?: boolean;
  canMoveDown?: boolean;
};

export function PaymentMethodEditor({
  method,
  onUpdate,
  onMoveUp,
  onMoveDown,
  canMoveUp = false,
  canMoveDown = false,
}: PaymentMethodEditorProps) {
  const [editing, setEditing] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [name, setName] = useState(method.name);
  const [detail, setDetail] = useState(method.detail);
  const [account, setAccount] = useState(method.account);
  const [accountNameEn, setAccountNameEn] = useState(method.account_name_en);
  const [accountNameAm, setAccountNameAm] = useState(method.account_name_am ?? "");
  const [imageUrl, setImageUrl] = useState(method.image_url);
  const [logoUrl, setLogoUrl] = useState(method.logo_url);

  const handleSave = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      setSaving(true);
      setError("");
      const success = await updatePaymentMethod(method.id, {
        name,
        detail,
        account,
        account_name_en: accountNameEn,
        account_name_am: accountNameAm,
        image_url: imageUrl,
        logo_url: logoUrl,
      });
      setSaving(false);
      if (success) {
        setEditing(false);
        onUpdate();
      } else {
        setError("Failed to save. Check the values and that you are logged in.");
      }
    },
    [method.id, name, detail, account, accountNameEn, accountNameAm, imageUrl, logoUrl, onUpdate],
  );

  const handleToggle = useCallback(async () => {
    setError("");
    const success = await updatePaymentMethod(method.id, { enabled: !method.enabled });
    if (success) onUpdate();
    else setError("Failed to update. Are you logged in?");
  }, [method.id, method.enabled, onUpdate]);

  const handleDelete = useCallback(async () => {
    const success = await deletePaymentMethod(method.id);
    if (success) onUpdate();
    else setError("Failed to delete. Are you logged in?");
  }, [method.id, onUpdate]);

  const dirty =
    editing &&
    (name !== method.name ||
      detail !== method.detail ||
      account !== method.account ||
      accountNameEn !== method.account_name_en ||
      accountNameAm !== (method.account_name_am ?? "") ||
      imageUrl !== method.image_url ||
      logoUrl !== method.logo_url);
  useDirtyGuard(dirty);

  const handleCancel = useCallback(() => {
    if (dirty && !window.confirm("Discard unsaved changes?")) return;
    setName(method.name);
    setDetail(method.detail);
    setAccount(method.account);
    setAccountNameEn(method.account_name_en);
    setAccountNameAm(method.account_name_am ?? "");
    setImageUrl(method.image_url);
    setLogoUrl(method.logo_url);
    setEditing(false);
    setError("");
  }, [method, dirty]);

  return (
    <div
      className="overflow-hidden rounded-2xl"
      style={{
        border: "1px solid var(--border)",
        background: "var(--card)",
      }}
    >
      {/* Header */}
      <div
        className="flex items-center gap-3 px-4 py-3.5"
        style={{
          borderBottom: "1px solid var(--border)",
          background: "var(--background)",
        }}
      >
        <div
          className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-lg border object-contain p-1"
          style={{ borderColor: "var(--border)", background: "var(--background)" }}
        >
          <img
            src={method.logo_url}
            alt={`${method.name} logo`}
            className="h-full w-full object-contain"
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="truncate text-sm font-bold" style={{ color: "var(--brand)" }}>
              {method.name}
            </span>
            {!method.enabled && (
              <span
                className="shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide"
                style={{
                  background: "oklch(0.6 0.2 25 / 0.1)",
                  color: "oklch(0.55 0.2 25)",
                }}
              >
                Hidden
              </span>
            )}
          </div>
          <p className="truncate font-mono text-xs" style={{ color: "var(--muted-foreground)" }}>
            {method.account}
          </p>
        </div>
        <div className="flex shrink-0 gap-1">
          {onMoveUp && (
            <button
              type="button"
              onClick={onMoveUp}
              disabled={!canMoveUp}
              aria-label={`Move ${method.name} up`}
              title="Move up"
              className="flex h-8 w-8 items-center justify-center rounded-lg border transition-all disabled:cursor-default disabled:opacity-25"
              style={{ border: "1px solid var(--border)", color: "var(--muted-foreground)" }}
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
              aria-label={`Move ${method.name} down`}
              title="Move down"
              className="flex h-8 w-8 items-center justify-center rounded-lg border transition-all disabled:cursor-default disabled:opacity-25"
              style={{ border: "1px solid var(--border)", color: "var(--muted-foreground)" }}
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
            onClick={handleToggle}
            title={method.enabled ? "Hide from the payment page" : "Show on the payment page"}
            className="rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-all"
            style={{
              border: "1px solid var(--border)",
              color: method.enabled ? "var(--foreground)" : "var(--muted-foreground)",
            }}
          >
            {method.enabled ? "Show" : "Hidden"}
          </button>
          <button
            type="button"
            onClick={() => setEditing(true)}
            className="rounded-lg border px-3 py-1.5 text-xs font-medium transition-all"
            style={{ border: "1px solid var(--border)", color: "var(--foreground)" }}
          >
            Edit
          </button>
          {!showConfirm ? (
            <button
              type="button"
              onClick={() => setShowConfirm(true)}
              className="rounded-lg border px-3 py-1.5 text-xs font-medium transition-all"
              style={{ border: "1px solid oklch(0.6 0.2 25 / 0.3)", color: "oklch(0.55 0.2 25)" }}
            >
              Delete
            </button>
          ) : (
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={handleDelete}
                aria-label={`Delete payment method ${method.name} — this cannot be undone`}
                className="rounded-lg px-4 py-1.5 text-xs font-bold text-white transition-all active:scale-95"
                style={{ background: "oklch(0.55 0.2 25)" }}
              >
                Delete
              </button>
              <button
                type="button"
                onClick={() => setShowConfirm(false)}
                className="rounded-lg px-3 py-1.5 text-xs font-medium transition-all"
                style={{ border: "1px solid var(--border)", color: "var(--muted-foreground)" }}
              >
                Cancel
              </button>
            </div>
          )}
        </div>
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

      {/* Edit form */}
      {editing && (
        <form onSubmit={handleSave} className="space-y-4 p-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Method name" value={name} onChange={setName} required />
            <Field
              label="Short description (EN)"
              value={detail}
              onChange={setDetail}
              placeholder="e.g. Scan with your telebirr app"
            />
            <Field
              label="Account number"
              value={account}
              onChange={setAccount}
              required
              placeholder="e.g. 911866919"
            />
            <Field
              label="Account owner (English)"
              value={accountNameEn}
              onChange={setAccountNameEn}
              required
            />
            <Field
              label="Account owner (Amharic)"
              value={accountNameAm}
              onChange={setAccountNameAm}
            />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <UploadField label="QR code image" current={imageUrl} onUploaded={setImageUrl} />
            <UploadField label="Logo image" current={logoUrl} onUploaded={setLogoUrl} />
          </div>
          <p className="text-[11px]" style={{ color: "var(--muted-foreground)" }}>
            Upload the official QR code image saved from the bank/app — never generate one, so the
            code always matches the real account.
          </p>
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={saving || !name.trim() || !account.trim() || !accountNameEn.trim()}
              className="rounded-xl px-8 py-3 text-sm font-bold text-white transition-all active:scale-[0.97] disabled:opacity-40"
              style={{ background: "var(--brand)" }}
            >
              {saving ? "Saving…" : "Save"}
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="rounded-xl px-6 py-3 text-sm font-medium transition-all"
              style={{ border: "1px solid var(--border)", color: "var(--muted-foreground)" }}
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

/* ── Add Payment Method Form ──────────────────────────────────── */

export function AddPaymentMethodForm({ onAdded }: { onAdded: () => void }) {
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [name, setName] = useState("");
  const [detail, setDetail] = useState("");
  const [account, setAccount] = useState("");
  const [accountNameEn, setAccountNameEn] = useState("");
  const [accountNameAm, setAccountNameAm] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [logoUrl, setLogoUrl] = useState("");

  const handleSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      setSaving(true);
      setError("");
      const result = await createPaymentMethod({
        name,
        detail,
        account,
        account_name_en: accountNameEn,
        account_name_am: accountNameAm,
        image_url: imageUrl,
        logo_url: logoUrl,
      });
      setSaving(false);
      if (result) {
        setName("");
        setDetail("");
        setAccount("");
        setAccountNameEn("");
        setAccountNameAm("");
        setImageUrl("");
        setLogoUrl("");
        setOpen(false);
        onAdded();
      } else {
        setError(
          "Failed to add method. Check for a duplicate name and that both images are uploaded.",
        );
      }
    },
    [name, detail, account, accountNameEn, accountNameAm, imageUrl, logoUrl, onAdded],
  );

  const handleCancel = useCallback(() => {
    setName("");
    setDetail("");
    setAccount("");
    setAccountNameEn("");
    setAccountNameAm("");
    setImageUrl("");
    setLogoUrl("");
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
        + Add Payment Method
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
          New Payment Method
        </span>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4 p-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field
            label="Method name"
            value={name}
            onChange={setName}
            required
            placeholder="e.g. Coopay"
          />
          <Field
            label="Short description (EN)"
            value={detail}
            onChange={setDetail}
            placeholder="e.g. Scan with your Coopay app"
          />
          <Field label="Account number" value={account} onChange={setAccount} required />
          <Field
            label="Account owner (English)"
            value={accountNameEn}
            onChange={setAccountNameEn}
            required
          />
          <Field
            label="Account owner (Amharic)"
            value={accountNameAm}
            onChange={setAccountNameAm}
          />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <UploadField
            label="QR code image (required)"
            current={imageUrl}
            onUploaded={setImageUrl}
          />
          <UploadField label="Logo image (required)" current={logoUrl} onUploaded={setLogoUrl} />
        </div>
        {(!imageUrl || !logoUrl) && (
          <p className="text-[11px]" style={{ color: "var(--muted-foreground)" }}>
            Upload the official QR code image saved from the bank/app — never generate one.
          </p>
        )}
        {error && (
          <p
            className="rounded-lg px-3 py-2 text-xs"
            style={{ background: "oklch(0.6 0.2 25 / 0.1)", color: "oklch(0.6 0.2 25)" }}
          >
            {error}
          </p>
        )}
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={
              saving ||
              !name.trim() ||
              !account.trim() ||
              !accountNameEn.trim() ||
              !imageUrl ||
              !logoUrl
            }
            className="rounded-xl px-8 py-3 text-sm font-bold text-white transition-all active:scale-[0.97] disabled:opacity-40"
            style={{ background: "var(--brand)" }}
          >
            {saving ? "Adding…" : "+ Add Method"}
          </button>
          <button
            type="button"
            onClick={handleCancel}
            className="rounded-xl px-6 py-3 text-sm font-medium transition-all"
            style={{ border: "1px solid var(--border)", color: "var(--muted-foreground)" }}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
