import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect, useCallback } from "react";
import { AdminProvider, useAdmin } from "@/lib/admin";
import { fetchMenuItems, swapSectionOrder, type DbSection, type DbMenuItem } from "@/lib/menu-db";
import { SectionEditor, AddSectionForm } from "@/components/admin/SectionEditor";
import { AdminNav } from "@/components/admin/AdminNav";
import { UndoToast } from "@/components/admin/UndoToast";
import { DevCredit } from "@/components/DevCredit";

export const Route = createFileRoute("/admin/restaurant")({
  head: () => ({ meta: [{ name: "robots", content: "noindex, nofollow" }] }),
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
  const [query, setQuery] = useState("");

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

  const handleMoveSection = useCallback(
    async (index: number, dir: -1 | 1) => {
      const from = sections[index];
      const to = sections[index + dir];
      if (!from || !to) return;
      const result = await swapSectionOrder(from.id, to.id);
      if (result.ok) {
        loadData();
      } else {
        console.error("Section reorder failed:", result.error);
      }
    },
    [sections, loadData],
  );

  const q = query.trim().toLowerCase();
  const visibleSections = q
    ? sections.filter(
        (s) => s.name_en.toLowerCase().includes(q) || (s.name_am ?? "").toLowerCase().includes(q),
      )
    : sections;
  const visibleItems = q
    ? items.filter(
        (i) =>
          i.name_en.toLowerCase().includes(q) ||
          (i.name_am ?? "").toLowerCase().includes(q) ||
          (i.description_en ?? "").toLowerCase().includes(q),
      )
    : items;

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
          <a
            href="/restaurant"
            target="_blank"
            rel="noreferrer"
            title="Open the live restaurant menu in a new tab"
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

      <AdminNav />

      {/* Search */}
      <div className="mx-auto max-w-3xl px-4 pt-4">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search items and sections…"
          aria-label="Search restaurant menu"
          className="w-full rounded-xl px-4 py-2.5 text-sm"
          style={{
            border: "1px solid var(--border)",
            background: "var(--card)",
            color: "var(--foreground)",
          }}
        />
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
            {sections.length === 0 && (
              <div
                className="rounded-2xl border border-dashed px-6 py-10 text-center"
                style={{ borderColor: "var(--border)", background: "var(--card)" }}
              >
                <p className="text-sm font-bold" style={{ color: "var(--foreground)" }}>
                  No sections yet
                </p>
                <p className="mt-1 text-xs" style={{ color: "var(--muted-foreground)" }}>
                  Add your first restaurant section below (e.g. “Starters”), then add items inside
                  it.
                </p>
              </div>
            )}
            {visibleSections.map((section, index) => (
              <SectionEditor
                key={section.id}
                section={section}
                items={visibleItems.filter((i) => i.section_id === section.id)}
                onUpdate={loadData}
                onMoveUp={index > 0 ? () => handleMoveSection(index, -1) : undefined}
                onMoveDown={
                  index < sections.length - 1 ? () => handleMoveSection(index, 1) : undefined
                }
                canMoveUp={index > 0}
                canMoveDown={index < sections.length - 1}
              />
            ))}
            <AddSectionForm type="restaurant" onAdded={loadData} />
          </div>
        )}
        <DevCredit />
      </div>
      <UndoToast onRestored={loadData} />
    </div>
  );
}
