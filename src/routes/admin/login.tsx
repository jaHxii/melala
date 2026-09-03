import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect, useCallback, type FormEvent } from "react";
import { AdminProvider, useAdmin } from "@/lib/admin";
import { useTheme } from "@/lib/theme";

export const Route = createFileRoute("/admin/login")({
  head: () => ({ meta: [{ name: "robots", content: "noindex, nofollow" }] }),
  component: () => (
    <AdminProvider>
      <AdminLogin />
    </AdminProvider>
  ),
});

function AdminLogin() {
  const { login, user } = useAdmin();
  const navigate = useNavigate();
  const { theme } = useTheme();

  useEffect(() => {
    if (user) {
      navigate({ to: "/admin" });
    }
  }, [user, navigate]);
  const isLight = theme === "light";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      setError("");
      setLoading(true);

      const result = await login(email, password);

      setLoading(false);
      if (result.error) {
        setError(result.error);
      } else {
        navigate({ to: "/admin" });
      }
    },
    [email, password, login, navigate],
  );

  if (user) {
    return null;
  }

  return (
    <div
      className="flex min-h-screen items-center justify-center px-4"
      style={{ background: "var(--background)" }}
    >
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="mb-6 text-center">
          {isLight ? (
            <img
              src="/cafe-light-logo.jpg"
              alt="Melala"
              className="mx-auto h-20 w-20 rounded-2xl object-contain"
            />
          ) : (
            <img
              src="/cafe-dark-logo.png"
              alt="Melala"
              className="mx-auto h-20 w-20 rounded-2xl object-contain"
            />
          )}
        </div>

        {/* Card */}
        <div
          className="rounded-2xl p-6 shadow-lg"
          style={{
            border: "1px solid var(--border)",
            background: "var(--card)",
          }}
        >
          <div className="mb-6 text-center">
            <h1 className="text-xl font-bold" style={{ color: "var(--foreground)" }}>
              Admin Panel
            </h1>
            <p className="mt-1 text-sm" style={{ color: "var(--muted-foreground)" }}>
              Sign in to manage menus
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div
                className="rounded-xl px-4 py-3 text-sm"
                style={{
                  border: "1px solid oklch(0.6 0.2 25 / 0.3)",
                  background: "oklch(0.6 0.2 25 / 0.1)",
                  color: "oklch(0.6 0.2 25)",
                }}
              >
                {error}
              </div>
            )}

            <div>
              <label
                htmlFor="email"
                className="mb-1.5 block text-xs font-semibold uppercase tracking-wide"
                style={{ color: "var(--muted-foreground)" }}
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                className="w-full rounded-xl px-4 py-3 text-sm"
                style={{
                  border: "1px solid var(--border)",
                  background: "var(--background)",
                  color: "var(--foreground)",
                }}
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-1.5 block text-xs font-semibold uppercase tracking-wide"
                style={{ color: "var(--muted-foreground)" }}
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                className="w-full rounded-xl px-4 py-3 text-sm"
                style={{
                  border: "1px solid var(--border)",
                  background: "var(--background)",
                  color: "var(--foreground)",
                }}
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl py-3 text-sm font-bold transition-all active:scale-[0.98] disabled:opacity-50"
              style={{
                background: "var(--brand)",
                color: "var(--brand-foreground)",
              }}
            >
              {loading ? (
                <span className="inline-flex items-center gap-2">
                  <span
                    className="h-4 w-4 animate-spin rounded-full"
                    style={{
                      border: "2px solid oklch(1 0 0 / 0.3)",
                      borderTopColor: "white",
                    }}
                  />
                  Signing in...
                </span>
              ) : (
                "Sign In"
              )}
            </button>
          </form>
        </div>

        <p
          className="mt-6 text-center text-xs"
          style={{ color: "var(--muted-foreground)", opacity: 0.5 }}
        >
          Melala Cafe & Restaurant
        </p>
      </div>
    </div>
  );
}
