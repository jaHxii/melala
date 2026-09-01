import { createFileRoute } from "@tanstack/react-router";
import { cafeMenu } from "@/data/cafeMenu";
import { MenuGrid, MenuHeader, PaymentBar } from "@/components/menu";

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
      { property: "og:description", content: "Breakfast, pizzas, sandwiches, coffee and juices." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/cafe" },
    ],
    links: [{ rel: "canonical", href: "/cafe" }],
  }),
  component: CafeMenuPage,
});

function CafeMenuPage() {
  return (
    <main className="mx-auto min-h-screen max-w-5xl px-4 sm:px-6">
      <MenuHeader eyebrow="Melala" title="Cafe Menu" />
      <p className="mt-4 text-center text-xs tracking-[0.2em] text-muted-foreground uppercase">
        All prices in ETB
      </p>
      <MenuGrid sections={cafeMenu} />
      <PaymentBar />
    </main>
  );
}
