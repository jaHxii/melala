import { createFileRoute } from "@tanstack/react-router";

const GOOGLE_MAPS_LINK = "GOOGLE_MAPS_LINK_HERE";
const PHONE = "+251XXXXXXXXX";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Melala — Cafe & Restaurant" },
      {
        name: "description",
        content:
          "Melala Cafe & Restaurant — specialty coffee, all-day breakfast and Ethiopian classics. Find us, call us, or scan our table QR for the menu.",
      },
      { property: "og:title", content: "Melala — Cafe & Restaurant" },
      {
        property: "og:description",
        content: "Specialty coffee, all-day breakfast and Ethiopian classics.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: Home,
});

function Home() {
  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col px-5 sm:px-6">
      <section className="flex flex-1 flex-col items-center justify-center py-20 text-center">
        <p className="tracking-widget text-accent">Est. Addis Ababa</p>
        <h1 className="display-title mt-5">
          Melala
          <br />
          Cafe &amp; Restaurant
        </h1>
        <div className="mx-auto mt-6 h-px w-24 bg-border" />
        <p className="mt-6 max-w-md text-sm leading-relaxed text-muted-foreground sm:text-base">
          Slow-roasted Ethiopian coffee, all-day breakfast and a kitchen that treats every plate
          like it matters. A quiet corner of the city built for lingering.
        </p>

        <div className="mt-10 flex w-full flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <a
            href={GOOGLE_MAPS_LINK}
            target="_blank"
            rel="noreferrer"
            className="btn-primary w-full sm:w-auto"
          >
            Find Us
          </a>
          <a href={`tel:${PHONE}`} className="btn-outline w-full sm:w-auto">
            Call Us
          </a>
        </div>
      </section>

      <section className="grid gap-4 pb-16 sm:grid-cols-3">
        <div className="menu-card text-center">
          <p className="tracking-widget text-accent">Hours</p>
          <p className="mt-3 text-sm text-muted-foreground">Mon – Sun</p>
          <p className="text-sm text-foreground">7:00 AM – 10:00 PM</p>
        </div>
        <div className="menu-card text-center">
          <p className="tracking-widget text-accent">Address</p>
          <p className="mt-3 text-sm text-muted-foreground">Bole, Addis Ababa</p>
          <p className="text-sm text-muted-foreground">Ethiopia</p>
        </div>
        <div className="menu-card text-center">
          <p className="tracking-widget text-accent">Contact</p>
          <p className="mt-3 text-sm text-muted-foreground">{PHONE}</p>
          <p className="text-sm text-muted-foreground">hello@company.com.et</p>
        </div>
      </section>

      <footer className="border-t border-border py-6 text-center">
        <p className="text-xs tracking-[0.2em] text-muted-foreground uppercase">
          © {new Date().getFullYear()} Melala Cafe &amp; Restaurant
        </p>
      </footer>
    </main>
  );
}
