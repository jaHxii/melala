import { createFileRoute } from "@tanstack/react-router";
import { paymentMethods } from "@/data/paymentMethods";
import { MockQr } from "@/components/MockQr";
import { MenuHeader, SectionBadge , SiteFooter } from "@/components/menu";

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
      { property: "og:url", content: "/payment" },
    ],
    links: [{ rel: "canonical", href: "/payment" }],
  }),
  component: PaymentPage,
});

function PaymentPage() {
  return (
    <main className="mx-auto min-h-screen max-w-5xl px-4 pb-20 sm:px-6">
      <MenuHeader eyebrow="Melala" title="Payment" />
      <p className="mt-4 text-center text-sm text-muted-foreground">
        Scan the code for your preferred payment method.
      </p>

      <div className="mx-auto mt-16 grid max-w-5xl gap-14 sm:grid-cols-2 lg:grid-cols-3">
        {paymentMethods.map((method) => (
          <section key={method.name} className="menu-card">
            <div className="-mt-8 mb-6 flex justify-center">
              <SectionBadge label={method.name} />
            </div>
            <div className="mx-auto w-full max-w-[280px]">
              <MockQr seed={method.seed} label={method.name} />
            </div>
            <p className="mt-5 text-center text-sm text-muted-foreground">{method.detail}</p>
          </section>
        ))}
      </div>

      <p className="mt-16 text-center text-xs tracking-[0.2em] text-muted-foreground uppercase">
        Please show your payment confirmation to a member of staff
      </p>

      <div className="mt-8 flex justify-center">
        <BackToMenu />
      </div>
      <SiteFooter />
    </main>
  );
}

function BackToMenu() {
  return (
    <button
      type="button"
      onClick={() => window.history.back()}
      className="text-xs tracking-[0.24em] text-muted-foreground uppercase transition-colors hover:text-primary focus-visible:text-primary"
    >
      Back to menu
    </button>
  );
}
