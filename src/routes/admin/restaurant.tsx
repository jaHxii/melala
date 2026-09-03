import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect, useCallback } from "react";
import { AdminProvider, useAdmin } from "@/lib/admin";
import { fetchMenuItems, type DbSection, type DbMenuItem } from "@/lib/menu-db";
import { SectionEditor, AddSectionForm } from "@/components/admin/SectionEditor";

export const Route = createFileRoute("/admin/restaurant")({
  component: () => (
    <AdminProvider>
      <AdminRestaurant />
    </AdminProvider>
  ),
});

function AdminRestaurant() {
  const { user, loading } = useAdmin();
  const navigate = useNavigate();
  const [sections, setSections] = useState<DbSection[]>([]);
  const [items, setItems] = useState<DbMenuItem[]>([]);
  const [fetching, setFetching] = useState(true);

  const loadData = useCallback(async () => {
    setFetching(true);
    const result = await fetchMenuItems("restaurant");
    setSections(result.sections);
    setItems(result.items);
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
              🍽️ Restaurant Menu
            </h1>
            <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>
              {sections.length} sections &middot; {items.length} items
            </p>
          </div>
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
              Loading menu...
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {sections.map((section) => (
              <SectionEditor
                key={section.id}
                section={section}
                items={items.filter((i) => i.section_id === section.id)}
                onUpdate={loadData}
              />
            ))}
            <AddSectionForm type="restaurant" onAdded={loadData} />
          </div>
        )}
      </div>
    </div>
  );
}
