import { useCallback, useEffect, useState } from "react";
import { useLanguage } from "@/lib/language";
import type { CartLine } from "@/lib/order-cart";

const priceFormatter = new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 });

type OrderCartApi = {
  lines: CartLine[];
  setQty: (id: string, qty: number) => void;
  clear: () => void;
  totalCount: number;
  totalPrice: number;
};

/* ── Micro-animations (respects reduced motion) ────────────────── */

const CART_STYLES = `
@keyframes melala-sheet-up {
  from { transform: translateY(48px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}
@keyframes melala-fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}
@keyframes melala-bar-in {
  from { transform: translateY(10px) scale(0.97); opacity: 0; }
  to { transform: translateY(0) scale(1); opacity: 1; }
}
@media (prefers-reduced-motion: reduce) {
  .melala-sheet-up, .melala-fade-in, .melala-bar-in { animation: none !important; }
}
`;

/* ── Cart line (inside the sheet) ──────────────────────────────── */

function OrderLine({
  line,
  setQty,
}: {
  line: CartLine;
  setQty: (id: string, qty: number) => void;
}) {
  const { t, locale } = useLanguage();
  const amFirst = locale === "am" && !!line.local;
  const name = amFirst ? line.local! : line.name;
  const sub = amFirst ? line.name : line.local;

  return (
    <li
      className="flex items-center gap-2 rounded-xl border px-3 py-2.5"
      style={{ borderColor: "var(--border)", background: "var(--background)" }}
    >
      <div className="min-w-0 flex-1 break-words">
        {sub ? <p className="font-ethiopic text-xs text-foreground/60">{sub}</p> : null}
        <p className={`text-sm font-semibold ${amFirst ? "font-ethiopic" : ""}`}>{name}</p>
        <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>
          {priceFormatter.format(line.price)} × {line.qty}
        </p>
      </div>
      <div className="flex items-center gap-1.5">
        <button
          type="button"
          onClick={() => setQty(line.id, line.qty - 1)}
          aria-label={t("removeItem")}
          className="focus-ring flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-base transition-all active:scale-90"
          style={{
            borderColor: "var(--border)",
            background: "var(--background)",
            color: "var(--muted-foreground)",
          }}
        >
          −
        </button>
        <span className="w-5 shrink-0 text-center text-sm font-bold">{line.qty}</span>
        <button
          type="button"
          onClick={() => setQty(line.id, line.qty + 1)}
          aria-label={t("addItem")}
          className="focus-ring flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-base font-bold transition-all active:scale-90"
          style={{ borderColor: "transparent", background: "var(--berbere)", color: "#fff" }}
        >
          +
        </button>
      </div>
      <span className="w-14 shrink-0 text-right text-sm font-bold">
        {priceFormatter.format(line.price * line.qty)}
      </span>
    </li>
  );
}

/* ── Floating bar + bottom sheet ───────────────────────────────── */

export function OrderCart({ cart }: { cart: OrderCartApi }) {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  const { lines, setQty, clear, totalCount, totalPrice } = cart;

  // Auto-close when the last item is removed.
  useEffect(() => {
    if (open && totalCount === 0) setOpen(false);
  }, [open, totalCount]);

  // Lock body scroll while the sheet is open.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  const toggle = useCallback(() => {
    try {
      navigator.vibrate?.(10);
    } catch {
      /* vibrate not supported */
    }
    setOpen((v) => !v);
  }, []);

  if (totalCount === 0 && !open) return null;

  return (
    <>
      <style>{CART_STYLES}</style>

      {/* Floating summary bar, just above the sticky Pay button */}
      <div className="pointer-events-none fixed inset-x-0 bottom-[84px] z-[55] flex justify-center px-4">
        <button
          type="button"
          onClick={toggle}
          style={{
            background: "var(--brand)",
            color: "var(--brand-foreground)",
            border: "none",
            animation: "melala-bar-in 220ms cubic-bezier(0.16, 1, 0.3, 1) both",
          }}
          className="focus-ring pointer-events-auto flex items-center gap-2.5 rounded-full px-5 py-3 text-sm font-bold shadow-lg transition-transform active:scale-95"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
            <path d="M3 6h18" />
            <path d="M16 10a4 4 0 0 1-8 0" />
          </svg>
          {t("myOrder")} ({totalCount}) · {priceFormatter.format(totalPrice)}
        </button>
      </div>

      {/* Bottom sheet */}
      {open && (
        <div
          className="fixed inset-0 z-[60]"
          role="dialog"
          aria-modal="true"
          aria-label={t("myOrder")}
        >
          <div
            className="absolute inset-0 bg-black/60"
            style={{ animation: "melala-fade-in 180ms ease-out both" }}
            onClick={() => setOpen(false)}
          />
          <div
            className="absolute inset-x-0 bottom-0 mx-auto flex max-h-[80vh] w-full max-w-2xl flex-col rounded-t-3xl border-t border-border"
            style={{
              background: "var(--card)",
              color: "var(--foreground)",
              animation: "melala-sheet-up 240ms cubic-bezier(0.16, 1, 0.3, 1) both",
            }}
          >
            {/* Drag handle */}
            <div className="flex justify-center pt-2.5" aria-hidden="true">
              <span className="h-1 w-10 rounded-full" style={{ background: "var(--border)" }} />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-5 pt-2 pb-4">
              <h2 className="font-display text-lg font-bold">
                {t("myOrder")} ({totalCount})
              </h2>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label={t("close")}
                className="focus-ring flex h-9 w-9 items-center justify-center rounded-full transition-all hover:opacity-70 active:scale-90"
                style={{ background: "var(--background)", color: "var(--foreground)" }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  aria-hidden="true"
                >
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto px-5 pb-4">
              <p
                className="mb-3 text-[11px] font-bold uppercase tracking-[0.18em]"
                style={{ color: "var(--muted-foreground)" }}
              >
                {t("orderHint")}
              </p>
              <ul className="space-y-2.5">
                {lines.map((line) => (
                  <OrderLine key={line.id} line={line} setQty={setQty} />
                ))}
              </ul>
            </div>

            {/* Footer */}
            <div className="border-t border-border px-5 py-4">
              <div className="mb-3 flex items-baseline justify-between">
                <span
                  className="text-xs font-bold uppercase tracking-[0.18em]"
                  style={{ color: "var(--muted-foreground)" }}
                >
                  {t("orderTotal")}
                </span>
                <span className="font-display text-xl font-bold">
                  {priceFormatter.format(totalPrice)}
                </span>
              </div>
              <button
                type="button"
                onClick={clear}
                className="focus-ring w-full rounded-xl border px-4 py-3 text-xs font-bold uppercase tracking-[0.18em] transition-all active:scale-[0.98]"
                style={{ borderColor: "var(--berbere)", color: "var(--berbere)" }}
              >
                {t("clearOrder")}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
