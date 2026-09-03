import { createFileRoute } from "@tanstack/react-router";
import { BrandLogo } from "@/components/menu";
import { SITE_URL } from "@/lib/constants";
import { useParallax } from "@/hooks/use-parallax";
import { useInView } from "@/hooks/use-in-view";
import { useLanguage } from "@/lib/language";

const GOOGLE_MAPS_LINK = "https://maps.google.com/maps?q=2RHP+VCW,+Addis+Ababa";
const PHONE = "+251911609157";

const structuredData = {
  "@context": "https://schema.org",
  "@type": "Restaurant",
  name: "Melala Cafe & Restaurant",
  description: "Specialty coffee, all-day breakfast and Ethiopian classics in Addis Ababa.",
  url: SITE_URL,
  telephone: "+251911609157",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Ararat-Kara Road, Wesen area",
    addressLocality: "Addis Ababa",
    addressCountry: "ET",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: "9.029689518033686",
    longitude: "38.83598120219571",
  },
  openingHoursSpecification: {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
    opens: "07:00",
    closes: "22:00",
  },
  servesCuisine: ["Ethiopian", "Coffee", "Breakfast", "Pizza"],
  priceRange: "$$",
  image: `${SITE_URL}/cafe-dark-logo.png`,
};

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
      { property: "og:url", content: SITE_URL },
      { property: "og:image", content: `${SITE_URL}/cafe-dark-logo.png` },
    ],
    links: [{ rel: "canonical", href: SITE_URL }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify(structuredData),
      },
    ],
  }),
  component: Home,
});

function Home() {
  const parallaxOffset = useParallax(0.15);
  const { ref: infoRef, isInView: infoVisible } = useInView({ threshold: 0.2 });
  const { t } = useLanguage();

  return (
    <div className="mx-auto flex max-w-3xl flex-col px-5 sm:px-6">
      <section className="flex flex-1 flex-col items-center justify-center py-20 text-center">
        <div style={{ transform: `translateY(${-parallaxOffset * 0.5}px)` }}>
          <BrandLogo className="mb-8 w-56 sm:w-72" />
        </div>
        <p className="tracking-widget text-cream/60">{t("estAddisAbaba")}</p>
        <h1
          className="mt-5 font-display font-semibold uppercase leading-none tracking-[0.16em]"
          style={{ fontSize: "clamp(3rem, 10vw, 5rem)" }}
        >
          <span className="brand-coffee uppercase">Melala</span>
          <br />
          <span className="text-3xl sm:text-4xl">{t("cafeAndRestaurant")}</span>
        </h1>
        <div className="mx-auto mt-6 h-px w-24 bg-border" />
        <p className="mt-6 max-w-md text-sm leading-relaxed text-foreground/70 sm:text-base">
          {t("description")}
        </p>

        <div className="mt-10 flex w-full max-w-xs flex-col gap-3 sm:flex-row sm:max-w-none sm:justify-center">
          <a
            href={GOOGLE_MAPS_LINK}
            target="_blank"
            rel="noreferrer"
            className="btn-primary w-full sm:w-40"
          >
            {t("findUs")}
          </a>
          <a href={`tel:${PHONE}`} className="btn-outline w-full sm:w-40">
            {t("callUs")}
          </a>
        </div>

        <div className="mt-16 animate-float text-foreground/40">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M7 13l5 5 5-5" />
            <path d="M7 6l5 5 5-5" />
          </svg>
        </div>
      </section>

      <section
        ref={infoRef}
        className={`grid grid-cols-2 gap-4 pb-16 reveal ${infoVisible ? "visible" : ""}`}
      >
        <div className="card-hover rounded-2xl border border-border bg-card p-6 text-center">
          <p className="tracking-widget text-cream/60">{t("hours")}</p>
          <p className="mt-3 text-sm text-foreground/60">{t("monSun")}</p>
          <p className="text-sm text-foreground">{t("hoursTime")}</p>
        </div>
        <div className="card-hover rounded-2xl border border-border bg-card p-6 text-center">
          <p className="tracking-widget text-cream/60">{t("contact")}</p>
          <a href={`tel:${PHONE}`} className="mt-3 block text-sm text-foreground/70 focus-ring">
            091 160 91 57
          </a>
        </div>
        <div className="card-hover col-span-2 rounded-2xl border border-border bg-card p-6 text-center">
          <p className="tracking-widget text-cream/60">{t("location")}</p>
          <p className="mt-3 text-sm text-foreground/70">
            Ararat-Kara Road, Wesen area,
            <br />
            Yeka sub-city, Addis Ababa
          </p>
          <p className="mt-1 text-sm text-foreground/60">{t("plusCode")}</p>
        </div>
      </section>
    </div>
  );
}
