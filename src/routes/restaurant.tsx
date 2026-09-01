import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { restaurantMenu } from "@/data/restaurantMenu";
import { MenuGrid, MenuHeader, PaymentBar, SiteFooter } from "@/components/menu";
import { SITE_URL } from "@/lib/constants";
import { useLanguage } from "@/lib/language";

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
      { property: "og:image", content: `${SITE_URL}/logo.png` },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/restaurant` }],
  }),
  component: RestaurantMenuPage,
});

function RestaurantMenuPage() {
  const { t } = useLanguage();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  return (
    <main className="mx-auto flex min-h-screen max-w-5xl flex-col px-4 sm:px-6">
      <MenuHeader eyebrow="Melala" title={t("restaurantMenu")} />
      <p className="mt-4 text-center text-xs tracking-[0.2em] text-muted-foreground uppercase">
        {t("allPricesInEtb")}
      </p>
      <MenuGrid sections={restaurantMenu} />
      <PaymentBar />
      <SiteFooter />
    </main>
  );
}
