import type { DbSection, DbMenuItem, MenuType } from "./menu-db";

/**
 * Last-known-good menu snapshot so QR menu pages can still show a menu when
 * Supabase is unreachable or the customer is offline (poor cafe wifi).
 * Menu JSON is small, so localStorage is sufficient — no IndexedDB needed.
 */
export type MenuCacheEntry = {
  sections: DbSection[];
  items: DbMenuItem[];
  savedAt: number;
};

const PREFIX = "melala-menu-v1-";

function key(type: MenuType): string {
  return PREFIX + type;
}

export function writeMenuCache(type: MenuType, sections: DbSection[], items: DbMenuItem[]): void {
  if (sections.length === 0) return;
  try {
    const entry: MenuCacheEntry = { sections, items, savedAt: Date.now() };
    localStorage.setItem(key(type), JSON.stringify(entry));
  } catch {
    // Storage full or unavailable — caching is best-effort.
  }
}

export function readMenuCache(type: MenuType): MenuCacheEntry | null {
  try {
    const raw = localStorage.getItem(key(type));
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<MenuCacheEntry>;
    if (!Array.isArray(parsed.sections) || !Array.isArray(parsed.items)) return null;
    return {
      sections: parsed.sections,
      items: parsed.items,
      savedAt: typeof parsed.savedAt === "number" ? parsed.savedAt : 0,
    };
  } catch {
    return null;
  }
}
