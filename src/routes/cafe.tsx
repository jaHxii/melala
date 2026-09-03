import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useCallback } from "react";
import {
  MenuGrid,
  MenuHeader,
  CategoryFilter,
  StickyPayButton,
  BackToTopButton,
} from "@/components/menu";
import { SITE_URL } from "@/lib/constants";
import { useLanguage } from "@/lib/language";
import { fetchMenuItems, toMenuSections, type MenuSection } from "@/lib/menu-db";
import { readMenuCache, writeMenuCache } from "@/lib/menu-cache";
import { cafeMenu } from "@/data/cafeMenu";

export const Route = createFileRoute("/cafe")({
  head: () => ({
    meta: [
      { title: "Melala — Cafe Menu" },
      {
        name: "description",
        content:
          "The Melala Cafe menu: breakfast, pizzas, sandwiches and wraps, burgers, hot drinks, frappuccinos, juices and mojitos with ETB prices.",
      },
      { property: "og:title", content: "Melala — Cafe Menu" },
      {
        property: "og:description",
        content: "Breakfast, pizzas, sandwiches, coffee and juices.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: `${SITE_URL}/cafe` },
      { property: "og:image", content: `${SITE_URL}/cafe-dark-logo.png` },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "canonical", href: `${SITE_URL}/cafe` },
      { rel: "preload", href: "/logo.webp", as: "image", type: "image/webp" },
    ],
  }),
  component: CafeMenuPage,
});

function CafeMenuPage() {
  const { t } = useLanguage();
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [menuSections, setMenuSections] = useState<MenuSection[]>(cafeMenu);
  const [stale, setStale] = useState(false);

  const loadMenu = useCallback(async () => {
    const result = await fetchMenuItems("cafe");
    if (result.failed) {
      // DB unreachable: fall back to the last saved menu, flagged as stale.
      const cached = readMenuCache("cafe");
      if (cached && cached.sections.length > 0) {
        setMenuSections(toMenuSections(cached.sections, cached.items));
        setStale(true);
      }
      return;
    }
    setStale(false);
    if (result.sections.length > 0) {
      writeMenuCache("cafe", result.sections, result.items);
      setMenuSections(toMenuSections(result.sections, result.items));
    }
  }, []);

  useEffect(() => {
    loadMenu();
  }, [loadMenu]);

  return (
    <div className="menu-bg-solid min-h-screen">
      <div className="mx-auto flex max-w-5xl flex-col px-4 pb-24 sm:px-6">
        <MenuHeader
          eyebrow="Melala"
          title={t("cafeMenu")}
          lightLogo="/cafe-light-logo.jpg"
          darkLogo="/cafe-dark-logo.png"
        />
        {stale && (
          <div
            role="status"
            className="mx-auto mt-4 flex w-full max-w-md items-center gap-3 rounded-xl border px-4 py-2.5 text-xs"
            style={{
              borderColor: "var(--border)",
              background: "var(--card)",
              color: "var(--muted-foreground)",
            }}
          >
            <span className="flex-1">{t("menuStaleNotice")}</span>
            <button
              type="button"
              onClick={loadMenu}
              className="shrink-0 rounded-lg px-3 py-1 text-[11px] font-bold transition-all active:scale-95"
              style={{
                background: "var(--brand)",
                color: "var(--brand-foreground)",
              }}
            >
              {t("menuRefresh")}
            </button>
          </div>
        )}
        <p className="mt-4 text-center text-xs tracking-[0.2em] text-muted-foreground uppercase">
          {t("allPricesInEtb")}
        </p>
        <CategoryFilter
          sections={menuSections}
          activeCategory={activeCategory}
          onSelect={setActiveCategory}
        />
        <MenuGrid sections={menuSections} filter={activeCategory} />
        <BackToTopButton />
        <StickyPayButton from="cafe" />
      </div>
    </div>
  );
}
