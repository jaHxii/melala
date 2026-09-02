import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { cafeMenu } from "@/data/cafeMenu";
import { MenuGrid, MenuHeader, CategoryFilter, StickyPayButton } from "@/components/menu";
import { SITE_URL } from "@/lib/constants";
import { useLanguage } from "@/lib/language";

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
      { property: "og:image", content: `${SITE_URL}/logo.png` },
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

  return (
    <div className="mx-auto flex max-w-5xl flex-col px-4 pb-24 sm:px-6">
      <MenuHeader eyebrow="Melala" title={t("cafeMenu")} />
      <p className="mt-4 text-center text-xs tracking-[0.2em] text-muted-foreground uppercase">
        {t("allPricesInEtb")}
      </p>
      <CategoryFilter
        sections={cafeMenu}
        activeCategory={activeCategory}
        onSelect={setActiveCategory}
      />
      <MenuGrid sections={cafeMenu} filter={activeCategory} />
      <StickyPayButton from="cafe" />
    </div>
  );
}
