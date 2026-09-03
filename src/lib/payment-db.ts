import { supabase } from "@/lib/supabase";
import type { PaymentMethod } from "@/data/paymentMethods";

/* ── Database Types ───────────────────────────────────────────── */

export type DbPaymentMethod = {
  id: string;
  name: string;
  detail: string;
  account: string;
  account_name_en: string;
  account_name_am: string | null;
  image_url: string;
  logo_url: string;
  sort_order: number;
  enabled: boolean;
  created_at: string;
  updated_at: string;
};

export type PaymentMethodInput = {
  name: string;
  detail: string;
  account: string;
  account_name_en: string;
  account_name_am?: string;
  image_url: string;
  logo_url: string;
};

/* ── Fetch ────────────────────────────────────────────────────── */

export type PaymentFetchResult = {
  methods: DbPaymentMethod[];
  /** true when the DB could not be reached (no client or a query error). */
  failed: boolean;
};

export async function fetchPaymentMethods(opts?: {
  includeDisabled?: boolean;
}): Promise<PaymentFetchResult> {
  if (!supabase) {
    console.warn("Supabase not configured — skipping fetchPaymentMethods");
    return { methods: [], failed: true };
  }

  let query = supabase.from("payment_methods").select("*").order("sort_order", { ascending: true });

  if (!opts?.includeDisabled) {
    query = query.eq("enabled", true);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching payment methods:", error);
    return { methods: [], failed: true };
  }

  return { methods: data ?? [], failed: false };
}

/* ── Transform to the public PaymentMethod shape ──────────────── */

export function toPaymentMethods(db: DbPaymentMethod[]): PaymentMethod[] {
  return db.map((m) => ({
    name: m.name,
    detail: m.detail,
    image: m.image_url,
    logo: m.logo_url,
    account: m.account,
    accountName: m.account_name_en,
    accountNameAm: m.account_name_am ?? "",
  }));
}

/* ── Input Sanitization ───────────────────────────────────────── */

function sanitize(input: string): string {
  return input.trim().slice(0, 200);
}

/* ── Create ───────────────────────────────────────────────────── */

export async function createPaymentMethod(
  input: PaymentMethodInput,
): Promise<DbPaymentMethod | null> {
  if (!supabase) return null;

  const clean: PaymentMethodInput = {
    name: sanitize(input.name),
    detail: sanitize(input.detail),
    account: sanitize(input.account),
    account_name_en: sanitize(input.account_name_en),
    account_name_am: input.account_name_am ? sanitize(input.account_name_am) : "",
    image_url: input.image_url.trim(),
    logo_url: input.logo_url.trim(),
  };
  if (!clean.name || !clean.account || !clean.account_name_en) return null;
  if (!clean.image_url || !clean.logo_url) return null;

  // Reject duplicate method names
  const { data: duplicate } = await supabase
    .from("payment_methods")
    .select("id")
    .eq("name", clean.name)
    .maybeSingle();
  if (duplicate) return null;

  // Get max sort_order
  const { data: existing } = await supabase
    .from("payment_methods")
    .select("sort_order")
    .order("sort_order", { ascending: false })
    .limit(1);

  const nextOrder = existing && existing.length > 0 ? existing[0]!.sort_order + 1 : 0;

  const { data, error } = await supabase
    .from("payment_methods")
    .insert({ ...clean, sort_order: nextOrder, enabled: true })
    .select()
    .single();

  if (error) {
    console.error("Error creating payment method:", error);
    return null;
  }
  return data;
}

/* ── Update ───────────────────────────────────────────────────── */

export type PaymentMethodUpdates = Partial<PaymentMethodInput> & {
  enabled?: boolean;
  sort_order?: number;
};

export async function updatePaymentMethod(
  id: string,
  updates: PaymentMethodUpdates,
): Promise<boolean> {
  if (!supabase) return false;

  const clean: PaymentMethodUpdates = {};
  if (updates.name !== undefined) clean.name = sanitize(updates.name);
  if (updates.detail !== undefined) clean.detail = sanitize(updates.detail);
  if (updates.account !== undefined) clean.account = sanitize(updates.account);
  if (updates.account_name_en !== undefined) {
    clean.account_name_en = sanitize(updates.account_name_en);
  }
  if (updates.account_name_am !== undefined) {
    clean.account_name_am = sanitize(updates.account_name_am);
  }
  if (updates.image_url !== undefined) clean.image_url = updates.image_url.trim();
  if (updates.logo_url !== undefined) clean.logo_url = updates.logo_url.trim();
  if (updates.enabled !== undefined) clean.enabled = updates.enabled;
  if (updates.sort_order !== undefined) clean.sort_order = updates.sort_order;
  if (clean.name !== undefined && !clean.name) return false;

  const { error } = await supabase.from("payment_methods").update(clean).eq("id", id);
  if (error) console.error("Error updating payment method:", error);
  return !error;
}

/* ── Swap (reorder) ───────────────────────────────────────────── */

export type SwapResult = { ok: boolean; error?: string };

export async function swapPaymentMethodOrder(idA: string, idB: string): Promise<SwapResult> {
  if (!supabase) return { ok: false, error: "Database is not configured." };
  const { data, error: readError } = await supabase
    .from("payment_methods")
    .select("id, sort_order")
    .in("id", [idA, idB]);
  if (readError) return { ok: false, error: readError.message };
  if (!data || data.length !== 2) {
    return { ok: false, error: "Could not find both rows to swap." };
  }
  const a = data.find((row) => row.id === idA);
  const b = data.find((row) => row.id === idB);
  if (!a || !b) return { ok: false, error: "Could not find both rows to swap." };

  // Two plain updates avoid upsert/ON CONFLICT semantics and RLS quirks.
  for (const row of [
    { id: idA, sort_order: b.sort_order },
    { id: idB, sort_order: a.sort_order },
  ]) {
    const { error } = await supabase
      .from("payment_methods")
      .update({ sort_order: row.sort_order })
      .eq("id", row.id);
    if (error) return { ok: false, error: error.message };
  }
  return { ok: true };
}

/* ── Delete ───────────────────────────────────────────────────── */

export async function deletePaymentMethod(id: string): Promise<boolean> {
  if (!supabase) return false;

  const { error } = await supabase.from("payment_methods").delete().eq("id", id);
  return !error;
}

/* ── Image Upload (QR + logo) ─────────────────────────────────── */

/**
 * Upload an image (QR code or logo) to the public `payment-assets`
 * bucket and return its public URL. Unique timestamped paths mean a
 * re-upload never collides and old URLs keep working in caches.
 */
export async function uploadPaymentImage(
  file: File,
  kind: "qr" | "logo",
): Promise<{ url: string; error?: string }> {
  if (!supabase) return { error: "Database is not configured." };
  if (!file.type.startsWith("image/")) {
    return { error: "Please choose an image file (PNG, JPG, WEBP)." };
  }

  const ext = (file.name.split(".").pop() ?? "png").toLowerCase().replace(/[^a-z0-9]/g, "");
  const path = `${kind}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

  const { error } = await supabase.storage
    .from("payment-assets")
    .upload(path, file, { upsert: false, contentType: file.type });

  if (error) return { error: error.message };

  const { data } = supabase.storage.from("payment-assets").getPublicUrl(path);
  return { url: data.publicUrl };
}
