import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { paymentMethods } from "@/data/paymentMethods";
import { MenuHeader, SectionBadge, SiteFooter } from "@/components/menu";
import { SITE_URL } from "@/lib/constants";
import { useLanguage } from "@/lib/language";

export const Route = createFileRoute("/payment")({
  head: () => ({
    meta: [
      { title: "Melala — Payment" },
      {
        name: "description",
        content: "Scan one of the three payment QR codes to settle your bill at Melala.",
      },
      { property: "og:title", content: "Melala — Payment" },
      { property: "og:description", content: "Three ways to pay your bill at Melala." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: `${SITE_URL}/payment` },
      { property: "og:image", content: `${SITE_URL}/logo.png` },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/payment` }],
  }),
  component: PaymentPage,
});

function PaymentPage() {
  const { t } = useLanguage();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  return (
    <main className="mx-auto flex min-h-screen max-w-5xl flex-col px-4 pb-20 sm:px-6">
      <MenuHeader eyebrow="Melala" title={t("paymentTitle")} />
      <p className="mt-4 text-center text-sm text-muted-foreground">{t("paymentDescription")}</p>

      <div className="mx-auto mt-16 grid max-w-5xl gap-14 sm:grid-cols-2 lg:grid-cols-3">
        {paymentMethods.map((method) => (
          <section key={method.name} className="menu-card">
            <div className="-mt-8 mb-6 flex justify-center">
              <SectionBadge label={method.name} />
            </div>
            <div className="mx-auto w-full max-w-[280px]">
              <img
                src={method.image}
                alt={`Payment QR code for ${method.name}`}
                className="aspect-square w-full rounded-[10px] bg-white p-3"
              />
            </div>
            <p className="mt-5 text-center text-sm text-muted-foreground">{method.detail}</p>
          </section>
        ))}
      </div>

      <p className="mt-16 text-center text-xs tracking-[0.2em] text-muted-foreground uppercase">
        {t("showConfirmation")}
      </p>

      <div className="mt-8 flex justify-center">
        <BackToMenu />
      </div>
      <SiteFooter />
    </main>
  );
}

function BackToMenu() {
  const { t } = useLanguage();

  return (
    <button type="button" onClick={() => window.history.back()} className="btn-outline">
      {t("backToMenu")}
    </button>
  );
}
