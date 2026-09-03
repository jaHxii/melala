import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect, useCallback } from "react";
import { AdminProvider, useAdmin } from "@/lib/admin";
import { fetchMenuItems } from "@/lib/menu-db";
import { AdminNav } from "@/components/admin/AdminNav";
import { DevCredit } from "@/components/DevCredit";

export const Route = createFileRoute("/admin/")({
  head: () => ({ meta: [{ name: "robots", content: "noindex, nofollow" }] }),
  component: () => (
    <AdminProvider>
      <AdminDashboard />
    </AdminProvider>
  ),
});

function latestUpdate(items: { updated_at: string }[]): string | null {
  let latest: string | null = null;
  for (const item of items) {
    if (!latest || item.updated_at > latest) latest = item.updated_at;
  }
  return latest;
}

function timeAgo(iso: string | null): string {
  if (!iso) return "never";
  const seconds = Math.max(0, (Date.now() - new Date(iso).getTime()) / 1000);
  if (seconds < 60) return "just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

function AdminDashboard() {
  const { user, loading, logout } = useAdmin();
  const navigate = useNavigate();
  const [cafeCount, setCafeCount] = useState(0);
  const [cafeHidden, setCafeHidden] = useState(0);
  const [cafeUpdated, setCafeUpdated] = useState<string | null>(null);
  const [restCount, setRestCount] = useState(0);
  const [restHidden, setRestHidden] = useState(0);
  const [restUpdated, setRestUpdated] = useState<string | null>(null);
  const [dbStatus, setDbStatus] = useState<"checking" | "ok" | "error">("checking");

  const loadCounts = useCallback(async () => {
    const cafe = await fetchMenuItems("cafe");
    const rest = await fetchMenuItems("restaurant");
    setCafeCount(cafe.items.length);
    setCafeHidden(cafe.items.filter((i) => !i.available).length);
    setCafeUpdated(latestUpdate([...cafe.sections, ...cafe.items]));
    setRestCount(rest.items.length);
    setRestHidden(rest.items.filter((i) => !i.available).length);
    setRestUpdated(latestUpdate([...rest.sections, ...rest.items]));
    setDbStatus(cafe.failed || rest.failed ? "error" : "ok");
  }, []);

  useEffect(() => {
    if (user) loadCounts();
  }, [user, loadCounts]);

  useEffect(() => {
    if (!loading && !user) {
      navigate({ to: "/admin/login" });
    }
  }, [loading, user, navigate]);

  if (loading) {
    return (
      <div
        className="flex min-h-screen items-center justify-center"
        style={{ background: "var(--background)" }}
      >
        <div
          className="h-8 w-8 animate-spin rounded-full"
          style={{
            border: "2px solid var(--border)",
            borderTopColor: "var(--brand)",
          }}
        />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const handleLogout = async () => {
    await logout();
    navigate({ to: "/admin/login" });
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--background)" }}>
      {/* Header */}
      <div
        style={{
          borderBottom: "1px solid var(--border)",
          background: "var(--card)",
          opacity: 0.95,
        }}
      >
        <div className="mx-auto flex max-w-2xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            <img
              src="/cafe-dark-logo.png"
              alt="Melala"
              className="h-9 w-9 rounded-lg object-contain"
            />
            <div>
              <h1 className="text-lg font-bold" style={{ color: "var(--foreground)" }}>
                Admin Panel
              </h1>
              <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>
                {user.email}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="rounded-xl px-4 py-2 text-xs font-semibold transition-all"
            style={{
              border: "1px solid var(--border)",
              color: "var(--muted-foreground)",
            }}
          >
            Sign Out
          </button>
        </div>
      </div>

      <AdminNav />

      {/* Database status */}
      <div className="mx-auto max-w-2xl px-4 pt-6">
        <div
          className="flex items-center gap-2.5 rounded-xl px-4 py-3 text-xs font-medium"
          style={{
            border: "1px solid var(--border)",
            background: "var(--card)",
            color: "var(--muted-foreground)",
          }}
        >
          <span
            aria-hidden="true"
            className="h-2 w-2 shrink-0 rounded-full"
            style={{
              background:
                dbStatus === "ok"
                  ? "oklch(0.5 0.15 145)"
                  : dbStatus === "error"
                    ? "oklch(0.55 0.2 25)"
                    : "var(--muted-foreground)",
            }}
          />
          <span>
            {dbStatus === "ok" && `Database connected · ${cafeCount + restCount} items`}
            {dbStatus === "error" &&
              "Database unreachable — public menus may show saved data. Check Supabase config & connectivity."}
            {dbStatus === "checking" && "Checking database…"}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-2xl px-4 py-8">
        <p className="mb-6 text-sm" style={{ color: "var(--muted-foreground)" }}>
          Select a menu to edit
        </p>

        <div className="grid gap-4 sm:grid-cols-2">
          <Link
            to="/admin/cafe"
            className="group relative overflow-hidden rounded-2xl p-6 transition-all hover:shadow-lg"
            style={{
              border: "1px solid var(--border)",
              background: "var(--card)",
            }}
          >
            <div className="mb-4 flex items-center justify-between">
              <span className="text-4xl">☕</span>
              <span
                className="rounded-full px-3 py-1 text-xs font-bold"
                style={{
                  background: "oklch(0.54 0.15 34 / 0.1)",
                  color: "var(--brand)",
                }}
              >
                {cafeCount} items
              </span>
            </div>
            <h2 className="text-lg font-bold" style={{ color: "var(--foreground)" }}>
              Cafe Menu
            </h2>
            <p className="mt-1 text-sm" style={{ color: "var(--muted-foreground)" }}>
              Breakfast, drinks, pizzas, snacks
            </p>
            <p className="mt-2 text-xs" style={{ color: "var(--muted-foreground)", opacity: 0.8 }}>
              {cafeHidden > 0 ? `${cafeHidden} hidden · ` : ""}updated {timeAgo(cafeUpdated)}
            </p>
          </Link>

          <Link
            to="/admin/restaurant"
            className="group relative overflow-hidden rounded-2xl p-6 transition-all hover:shadow-lg"
            style={{
              border: "1px solid var(--border)",
              background: "var(--card)",
            }}
          >
            <div className="mb-4 flex items-center justify-between">
              <span className="text-4xl">🍽️</span>
              <span
                className="rounded-full px-3 py-1 text-xs font-bold"
                style={{
                  background: "oklch(0.54 0.15 34 / 0.1)",
                  color: "var(--brand)",
                }}
              >
                {restCount} items
              </span>
            </div>
            <h2 className="text-lg font-bold" style={{ color: "var(--foreground)" }}>
              Restaurant Menu
            </h2>
            <p className="mt-1 text-sm" style={{ color: "var(--muted-foreground)" }}>
              Starters, mains, pizza, pasta, desserts
            </p>
            <p className="mt-2 text-xs" style={{ color: "var(--muted-foreground)", opacity: 0.8 }}>
              {restHidden > 0 ? `${restHidden} hidden · ` : ""}updated {timeAgo(restUpdated)}
            </p>
          </Link>

          <Link
            to="/admin/payments"
            className="group relative overflow-hidden rounded-2xl p-6 transition-all hover:shadow-lg"
            style={{
              border: "1px solid var(--border)",
              background: "var(--card)",
            }}
          >
            <div className="mb-4 flex items-center justify-between">
              <span className="text-4xl">💳</span>
              <span
                className="rounded-full px-3 py-1 text-xs font-bold"
                style={{
                  background: "oklch(0.54 0.15 34 / 0.1)",
                  color: "var(--brand)",
                }}
              >
                Methods
              </span>
            </div>
            <h2 className="text-lg font-bold" style={{ color: "var(--foreground)" }}>
              Payment Methods
            </h2>
            <p className="mt-1 text-sm" style={{ color: "var(--muted-foreground)" }}>
              Names, accounts, QR codes, logos, order
            </p>
          </Link>
        </div>

        <DevCredit />
      </div>
    </div>
  );
}
