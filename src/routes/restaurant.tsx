import { createFileRoute } from "@tanstack/react-router";
import { restaurantMenu } from "@/data/restaurantMenu";
import { MenuGrid, MenuHeader, PaymentBar } from "@/components/menu";

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
      { property: "og:url", content: "/restaurant" },
    ],
    links: [{ rel: "canonical", href: "/restaurant" }],
  }),
  component: RestaurantMenuPage,
});

function RestaurantMenuPage() {
  return (
    <main className="mx-auto min-h-screen max-w-5xl px-4 sm:px-6">
      <MenuHeader eyebrow="Melala" title="Restaurant Menu" />
      <p className="mt-4 text-center text-xs tracking-[0.2em] text-muted-foreground uppercase">
        All prices in ETB
      </p>
      <MenuGrid sections={restaurantMenu} />
      <PaymentBar />
    </main>
  );
}
