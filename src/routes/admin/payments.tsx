import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect, useCallback } from "react";
import { AdminProvider, useAdmin } from "@/lib/admin";
import {
  fetchPaymentMethods,
  swapPaymentMethodOrder,
  type DbPaymentMethod,
} from "@/lib/payment-db";
import { PaymentMethodEditor, AddPaymentMethodForm } from "@/components/admin/PaymentMethodEditor";

export const Route = createFileRoute("/admin/payments")({
  head: () => ({ meta: [{ name: "robots", content: "noindex, nofollow" }] }),
  component: () => (
    <AdminProvider>
      <AdminPayments />
    </AdminProvider>
  ),
});

function AdminPayments() {
  const { user, loading } = useAdmin();
  const navigate = useNavigate();
  const [methods, setMethods] = useState<DbPaymentMethod[]>([]);
  const [fetching, setFetching] = useState(true);

  const loadData = useCallback(async () => {
    setFetching(true);
    const result = await fetchPaymentMethods({ includeDisabled: true });
    setMethods(result.methods);
    setFetching(false);
  }, []);

  useEffect(() => {
    if (!loading && !user) {
      navigate({ to: "/admin/login" });
    }
  }, [loading, user, navigate]);

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user, loadData]);

  const handleMove = useCallback(
    async (index: number, dir: -1 | 1) => {
      const from = methods[index];
      const to = methods[index + dir];
      if (!from || !to) return;
      const result = await swapPaymentMethodOrder(from.id, to.id);
      if (result.ok) {
        loadData();
      } else {
        console.error("Payment method reorder failed:", result.error);
      }
    },
    [methods, loadData],
  );

  if (loading || !user) {
    return null;
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--background)" }}>
      {/* Header */}
      <div
        style={{
          borderBottom: "1px solid var(--border)",
          background: "var(--card)",
        }}
      >
        <div className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-4">
          <Link
            to="/admin"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors"
            style={{ color: "var(--muted-foreground)" }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m12 19-7-7 7-7" />
              <path d="M19 12H5" />
            </svg>
          </Link>
          <div className="min-w-0 flex-1">
            <h1 className="truncate text-lg font-bold" style={{ color: "var(--foreground)" }}>
              💳 Payment Methods
            </h1>
            <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>
              {methods.length} method(s) · changes appear on /payment immediately
            </p>
          </div>
          <a
            href="/payment?from=cafe"
            target="_blank"
            rel="noreferrer"
            title="Open the live payment page in a new tab"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors"
            style={{ color: "var(--muted-foreground)" }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M15 3h6v6" />
              <path d="M10 14 21 3" />
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
            </svg>
          </a>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-3xl px-4 py-6">
        {fetching ? (
          <div className="py-20 text-center">
            <div
              className="mx-auto h-8 w-8 animate-spin rounded-full"
              style={{
                border: "2px solid var(--border)",
                borderTopColor: "var(--brand)",
              }}
            />
            <p className="mt-4 text-sm" style={{ color: "var(--muted-foreground)" }}>
              Loading payment methods...
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {methods.map((method, index) => (
              <PaymentMethodEditor
                key={method.id}
                method={method}
                onUpdate={loadData}
                onMoveUp={index > 0 ? () => handleMove(index, -1) : undefined}
                onMoveDown={index < methods.length - 1 ? () => handleMove(index, 1) : undefined}
                canMoveUp={index > 0}
                canMoveDown={index < methods.length - 1}
              />
            ))}
            <AddPaymentMethodForm onAdded={loadData} />
          </div>
        )}
      </div>
    </div>
  );
}
