import { useCallback, useEffect, useMemo, useState } from "react";

export type CartItemInput = {
  name: string;
  local?: string;
  price: number;
};

export type CartLine = CartItemInput & {
  /** Stable identity: `${section category}::${item name}`. */
  id: string;
  qty: number;
};

const STORAGE_PREFIX = "melala-order-cart-";

function readStoredLines(key: string): CartLine[] | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_PREFIX + key);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return null;
    return parsed.filter(
      (l): l is CartLine =>
        !!l &&
        typeof l === "object" &&
        typeof (l as CartLine).id === "string" &&
        typeof (l as CartLine).name === "string" &&
        typeof (l as CartLine).price === "number" &&
        typeof (l as CartLine).qty === "number",
    );
  } catch {
    // Corrupted storage — ignore and start fresh.
    return null;
  }
}

function writeStoredLines(key: string, lines: CartLine[]) {
  try {
    if (lines.length === 0) {
      window.localStorage.removeItem(STORAGE_PREFIX + key);
    } else {
      window.localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(lines));
    }
  } catch {
    // Storage unavailable — the cart still works for the session.
  }
}

/**
 * A per-menu selection cart for customers. Purely client-side: items are
 * picked, counted and reviewed on screen to show the waiter. Persisted in
 * localStorage so a reload (or accidental close) doesn't lose the list.
 */
export function useOrderCart(menuKey: string) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [hydrated, setHydrated] = useState(false);

  // Load persisted lines after first render to avoid SSR hydration mismatch.
  useEffect(() => {
    const stored = readStoredLines(menuKey);
    if (stored && stored.length > 0) setLines(stored);
    setHydrated(true);
  }, [menuKey]);

  useEffect(() => {
    if (hydrated) writeStoredLines(menuKey, lines);
  }, [hydrated, menuKey, lines]);

  const add = useCallback((item: CartItemInput, category: string) => {
    const id = `${category}::${item.name}`;
    setLines((prev) => {
      const existing = prev.find((l) => l.id === id);
      if (existing) {
        return prev.map((l) => (l.id === id ? { ...l, qty: l.qty + 1 } : l));
      }
      return [...prev, { id, name: item.name, local: item.local, price: item.price, qty: 1 }];
    });
  }, []);

  const setQty = useCallback((id: string, qty: number) => {
    setLines((prev) =>
      qty <= 0
        ? prev.filter((l) => l.id !== id)
        : prev.map((l) => (l.id === id ? { ...l, qty } : l)),
    );
  }, []);

  const clear = useCallback(() => setLines([]), []);

  const totalCount = useMemo(() => lines.reduce((sum, l) => sum + l.qty, 0), [lines]);
  const totalPrice = useMemo(() => lines.reduce((sum, l) => sum + l.qty * l.price, 0), [lines]);
  const qtyById = useMemo(() => {
    const map: Record<string, number> = {};
    for (const l of lines) map[l.id] = l.qty;
    return map;
  }, [lines]);

  return { lines, add, setQty, clear, totalCount, totalPrice, qtyById };
}
