import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useCallback } from "react";
import { MenuGrid, MenuHeader, CategoryFilter, StickyPayButton } from "@/components/menu";
import { SITE_URL } from "@/lib/constants";
import { useLanguage } from "@/lib/language";
import { fetchMenuItems, toMenuSections, type MenuSection } from "@/lib/menu-db";
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

  const loadMenu = useCallback(async () => {
    const { sections, items } = await fetchMenuItems("cafe");
    if (sections.length > 0) {
      setMenuSections(toMenuSections(sections, items));
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
        <p className="mt-4 text-center text-xs tracking-[0.2em] text-muted-foreground uppercase">
          {t("allPricesInEtb")}
        </p>
        <CategoryFilter
          sections={menuSections}
          activeCategory={activeCategory}
          onSelect={setActiveCategory}
        />
        <MenuGrid sections={menuSections} filter={activeCategory} />
        <StickyPayButton from="cafe" />
      </div>
    </div>
  );
}
