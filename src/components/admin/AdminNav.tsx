import { Link, useLocation } from "@tanstack/react-router";

const TABS = [
  { to: "/admin", label: "Dashboard", match: "/admin" },
  { to: "/admin/cafe", label: "Cafe", match: "/admin/cafe" },
  { to: "/admin/restaurant", label: "Restaurant", match: "/admin/restaurant" },
  { to: "/admin/payments", label: "Payments", match: "/admin/payments" },
] as const;

/** Slim tab bar shared by all admin pages for fast switching. */
export function AdminNav() {
  const { pathname } = useLocation();

  const isActive = (match: string) =>
    match === "/admin"
      ? pathname === "/admin" || pathname === "/admin/"
      : pathname.startsWith(match);

  return (
    <nav
      className="sticky top-0 z-40 border-b backdrop-blur-sm"
      style={{
        borderColor: "var(--border)",
        background: "color-mix(in oklab, var(--card) 92%, transparent)",
      }}
    >
      <div className="mx-auto flex max-w-3xl gap-1 overflow-x-auto px-4 py-2">
        {TABS.map((tab) => (
          <Link
            key={tab.to}
            to={tab.to}
            className="shrink-0 rounded-full px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all focus-ring"
            style={
              isActive(tab.match)
                ? {
                    background: "var(--brand)",
                    color: "var(--brand-foreground)",
                  }
                : {
                    color: "var(--muted-foreground)",
                  }
            }
          >
            {tab.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
