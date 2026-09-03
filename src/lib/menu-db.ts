import { supabase } from "@/lib/supabase";

/* ── Database Types ───────────────────────────────────────────── */

export type MenuType = "cafe" | "restaurant";

export type DbSection = {
  id: string;
  name_en: string;
  name_am: string | null;
  type: MenuType;
  sort_order: number;
  created_at: string;
};

export type DbMenuItem = {
  id: string;
  section_id: string;
  name_en: string;
  name_am: string | null;
  description_en: string | null;
  description_am: string | null;
  price: number;
  sort_order: number;
  available: boolean;
  created_at: string;
};

/* ── Public Menu Types (matching existing MenuSection/MenuItem) ── */

export type MenuItem = {
  name: string;
  local?: string;
  description?: string;
  price: number;
};

export type MenuSection = {
  category: string;
  local?: string;
  items: MenuItem[];
};

/* ── Fetch Sections ───────────────────────────────────────────── */

export async function fetchSections(type: MenuType): Promise<DbSection[]> {
  if (!supabase) {
    console.warn("Supabase not configured — skipping fetchSections");
    return [];
  }

  const { data, error } = await supabase
    .from("sections")
    .select("*")
    .eq("type", type)
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("Error fetching sections:", error);
    return [];
  }
  return data ?? [];
}

/* ── Fetch Menu Items ─────────────────────────────────────────── */

export type MenuFetchResult = {
  sections: DbSection[];
  items: DbMenuItem[];
  /** true when the DB could not be reached (no client or a query error). */
  failed: boolean;
};

export async function fetchMenuItems(type: MenuType): Promise<MenuFetchResult> {
  if (!supabase) {
    console.warn("Supabase not configured — skipping fetchMenuItems");
    return { sections: [], items: [], failed: true };
  }

  const { data: sections, error: sectionsError } = await supabase
    .from("sections")
    .select("*")
    .eq("type", type)
    .order("sort_order", { ascending: true });

  if (sectionsError) {
    console.error("Error fetching sections:", sectionsError);
    return { sections: [], items: [], failed: true };
  }

  if (!sections || sections.length === 0) {
    // An empty result is not a failure: the DB is simply unseeded.
    return { sections: [], items: [], failed: false };
  }

  const sectionIds = sections.map((s) => s.id);

  const { data: items, error: itemsError } = await supabase
    .from("menu_items")
    .select("*")
    .in("section_id", sectionIds)
    .order("sort_order", { ascending: true });

  if (itemsError) {
    console.error("Error fetching menu items:", itemsError);
    return { sections, items: [], failed: true };
  }

  return { sections, items: items ?? [], failed: false };
}

/* ── Transform to MenuSection[] (for public menu components) ──── */

export function toMenuSections(dbSections: DbSection[], dbItems: DbMenuItem[]): MenuSection[] {
  return dbSections.map((section) => {
    const local = section.name_am ?? undefined;
    return {
      category: section.name_en,
      ...(local !== undefined && { local }),
      items: dbItems
        .filter((item) => item.section_id === section.id && item.available)
        .map((item) => {
          const itemLocal = item.name_am ?? undefined;
          const desc = item.description_en ?? undefined;
          return {
            name: item.name_en,
            ...(itemLocal !== undefined && { local: itemLocal }),
            ...(desc !== undefined && { description: desc }),
            price: item.price,
          };
        }),
    };
  });
}

/* ── Input Sanitization ─────────────────────────────────────── */

function sanitize(input: string): string {
  return input.trim().slice(0, 200);
}

/* ── Create Section ───────────────────────────────────────────── */

export async function createSection(
  type: MenuType,
  nameEn: string,
  nameAm: string,
): Promise<DbSection | null> {
  if (!supabase) return null;

  const cleanNameEn = sanitize(nameEn);
  const cleanNameAm = sanitize(nameAm);
  if (!cleanNameEn) return null;

  // Reject duplicate section names within the same menu type
  const { data: duplicate } = await supabase
    .from("sections")
    .select("id")
    .eq("type", type)
    .eq("name_en", cleanNameEn)
    .maybeSingle();
  if (duplicate) return null;

  // Get max sort_order
  const { data: existing } = await supabase
    .from("sections")
    .select("sort_order")
    .eq("type", type)
    .order("sort_order", { ascending: false })
    .limit(1);

  const nextOrder = existing && existing.length > 0 ? existing[0]!.sort_order + 1 : 0;

  const { data, error } = await supabase
    .from("sections")
    .insert({
      type,
      name_en: cleanNameEn,
      name_am: cleanNameAm || null,
      sort_order: nextOrder,
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating section:", error);
    return null;
  }
  return data;
}

/* ── Update Section ───────────────────────────────────────────── */

export async function updateSection(
  id: string,
  updates: { name_en?: string; name_am?: string; sort_order?: number },
): Promise<boolean> {
  if (!supabase) return false;

  const clean: typeof updates = {};
  if (updates.name_en !== undefined) clean.name_en = sanitize(updates.name_en);
  if (updates.name_am !== undefined) clean.name_am = sanitize(updates.name_am);
  if (updates.sort_order !== undefined) clean.sort_order = updates.sort_order;
  if (clean.name_en !== undefined && !clean.name_en) return false;

  const { error } = await supabase.from("sections").update(clean).eq("id", id);
  return !error;
}
export type SwapResult = { ok: boolean; error?: string };

/** Swap two sections' sort_order values (used by admin reordering). */
export async function swapSectionOrder(idA: string, idB: string): Promise<SwapResult> {
  if (!supabase) return { ok: false, error: "Database is not configured." };
  const { data, error: readError } = await supabase
    .from("sections")
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
      .from("sections")
      .update({ sort_order: row.sort_order })
      .eq("id", row.id);
    if (error) return { ok: false, error: error.message };
  }
  return { ok: true };
}

/* ── Delete Section ───────────────────────────────────────────── */

export async function deleteSection(id: string): Promise<boolean> {
  if (!supabase) return false;

  // Delete all items in this section first
  await supabase.from("menu_items").delete().eq("section_id", id);

  const { error } = await supabase.from("sections").delete().eq("id", id);
  return !error;
}

/* ── Create Menu Item ─────────────────────────────────────────── */

export async function createMenuItem(
  sectionId: string,
  item: {
    name_en: string;
    name_am?: string;
    description_en?: string;
    description_am?: string;
    price: number;
  },
): Promise<DbMenuItem | null> {
  if (!supabase) return null;

  const cleanNameEn = sanitize(item.name_en);
  if (!cleanNameEn || !Number.isFinite(item.price) || item.price < 0) return null;

  // Get max sort_order for this section
  const { data: existing } = await supabase
    .from("menu_items")
    .select("sort_order")
    .eq("section_id", sectionId)
    .order("sort_order", { ascending: false })
    .limit(1);

  const nextOrder = existing && existing.length > 0 ? existing[0]!.sort_order + 1 : 0;

  const { data, error } = await supabase
    .from("menu_items")
    .insert({
      section_id: sectionId,
      name_en: cleanNameEn,
      name_am: sanitize(item.name_am || "") || null,
      description_en: sanitize(item.description_en || "") || null,
      description_am: sanitize(item.description_am || "") || null,
      price: Math.max(0, Math.round(item.price)),
      sort_order: nextOrder,
      available: true,
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating menu item:", error);
    return null;
  }
  return data;
}

/* ── Update Menu Item ─────────────────────────────────────────── */

export async function updateMenuItem(
  id: string,
  updates: {
    name_en?: string;
    name_am?: string;
    description_en?: string;
    description_am?: string;
    price?: number;
    available?: boolean;
    sort_order?: number;
  },
): Promise<boolean> {
  if (!supabase) return false;

  const clean: typeof updates = {};
  if (updates.name_en !== undefined) clean.name_en = sanitize(updates.name_en);
  if (updates.name_am !== undefined) clean.name_am = sanitize(updates.name_am);
  if (updates.description_en !== undefined) clean.description_en = sanitize(updates.description_en);
  if (updates.description_am !== undefined) clean.description_am = sanitize(updates.description_am);
  if (updates.price !== undefined) clean.price = Math.max(0, Math.round(updates.price));
  if (updates.available !== undefined) clean.available = updates.available;
  if (updates.sort_order !== undefined) clean.sort_order = updates.sort_order;
  if (clean.name_en !== undefined && !clean.name_en) return false;
  if (updates.price !== undefined && (!Number.isFinite(updates.price) || updates.price < 0)) {
    return false;
  }

  const { error } = await supabase.from("menu_items").update(clean).eq("id", id);
  return !error;
} /** Swap two items' sort_order values (used by admin reordering). */
export async function swapMenuItemOrder(idA: string, idB: string): Promise<SwapResult> {
  if (!supabase) return { ok: false, error: "Database is not configured." };
  const { data, error: readError } = await supabase
    .from("menu_items")
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
      .from("menu_items")
      .update({ sort_order: row.sort_order })
      .eq("id", row.id);
    if (error) return { ok: false, error: error.message };
  }
  return { ok: true };
}

/* ── Delete Menu Item ─────────────────────────────────────────── */

export async function deleteMenuItem(id: string): Promise<boolean> {
  if (!supabase) return false;

  const { error } = await supabase.from("menu_items").delete().eq("id", id);
  return !error;
}
