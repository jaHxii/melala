import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useCallback } from "react";
import { MenuGrid, MenuHeader, CategoryFilter, StickyPayButton } from "@/components/menu";
import { SITE_URL } from "@/lib/constants";
import { useLanguage } from "@/lib/language";
import { fetchMenuItems, toMenuSections, type MenuSection } from "@/lib/menu-db";
import { restaurantMenu } from "@/data/restaurantMenu";

export const Route = createFileRoute("/restaurant")({
  head: () => ({
    meta: [
      { title: "Melala — Restaurant Menu" },
      {
        name: "description",
        content:
          "The Melala Restaurant menu: starters, Ethiopian specials, main courses, pizza, pasta, burgers, salads, desserts and drinks with ETB prices.",
      },
      { property: "og:title", content: "Melala — Restaurant Menu" },
      {
        property: "og:description",
        content: "Ethiopian specials, grills, pizza, pasta and desserts.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: `${SITE_URL}/restaurant` },
      { property: "og:image", content: `${SITE_URL}/cafe-dark-logo.png` },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "canonical", href: `${SITE_URL}/restaurant` },
      { rel: "preload", href: "/logo.webp", as: "image", type: "image/webp" },
    ],
  }),
  component: RestaurantMenuPage,
});

function RestaurantMenuPage() {
  const { t } = useLanguage();
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [menuSections, setMenuSections] = useState<MenuSection[]>(restaurantMenu);

  const loadMenu = useCallback(async () => {
    const { sections, items } = await fetchMenuItems("restaurant");
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
          title={t("restaurantMenu")}
          lightLogo="/rest-light-logo.jpg"
          darkLogo="/rest-dark-logo.jpg"
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
        <StickyPayButton from="restaurant" />
      </div>
    </div>
  );
}
