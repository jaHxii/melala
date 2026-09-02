import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useCallback, useEffect } from "react";
import { paymentMethods } from "@/data/paymentMethods";
import { SectionBadge } from "@/components/menu";
import { SITE_URL } from "@/lib/constants";
import { useLanguage } from "@/lib/language";
import { useTheme } from "@/lib/theme";

type PaymentSearch = {
  from: string;
};

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
    links: [
      { rel: "canonical", href: `${SITE_URL}/payment` },
      { rel: "preload", href: "/logo.webp", as: "image", type: "image/webp" },
    ],
  }),
  validateSearch: (search: Record<string, unknown>): PaymentSearch => {
    return { from: (search.from as string) || "cafe" };
  },
  component: PaymentPage,
});

/* ── QR Zoom Modal ──────────────────────────────────────────────── */

function QrZoomModal({
  image,
  name,
  logo,
  onClose,
}: {
  image: string;
  name: string;
  logo: string;
  onClose: () => void;
}) {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`${name} QR code zoomed`}
    >
      <div
        className="relative mx-4 max-w-sm rounded-3xl bg-white p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute -top-3 -right-3 flex size-10 items-center justify-center rounded-full border border-border bg-background text-foreground shadow-lg focus-ring"
          aria-label="Close zoom"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
          </svg>
        </button>
        <div className="mx-auto mb-3 flex size-12 items-center justify-center overflow-hidden rounded-xl bg-brand/5 p-1.5">
          <img
            src={logo}
            alt={`${name} logo`}
            className="h-full w-full object-contain"
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
        </div>
        <p className="mb-4 text-center font-bold text-brand">{name}</p>
        <img src={image} alt={`${name} QR code`} className="aspect-square w-full rounded-2xl" />
        <p className="mt-4 text-center text-xs text-brand/60">Point your camera at this code</p>
      </div>
    </div>
  );
} /* ── Payment Page ───────────────────────────────────────────────── */

function PaymentPage() {
  const { t } = useLanguage();
  const { from } = Route.useSearch();

  const menuPath = from === "restaurant" ? "/restaurant" : "/cafe";
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const [zoomMethod, setZoomMethod] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleSelect = useCallback((name: string) => {
    try {
      navigator.vibrate?.(10);
    } catch {
      /* vibrate not supported */
    }
    setSelectedMethod(name);
  }, []);

  const handleBackToMenu = useCallback(() => {
    try {
      navigator.vibrate?.(15);
    } catch {
      /* vibrate not supported */
    }
  }, []);

  const selected = paymentMethods.find((m) => m.name === selectedMethod);

  const { theme } = useTheme();
  const isLight = theme === "light";
  const isCafe = from === "cafe";

  const lightLogo = isCafe ? "/cafe-light-logo.jpg" : "/rest-light-logo.jpg";
  const darkLogo = isCafe ? "/cafe-dark-logo.png" : "/rest-dark-logo.jpg";

  return (
    <div className="mx-auto flex min-h-screen max-w-5xl flex-col items-center px-4 pb-20 pt-14 sm:px-6 sm:pt-20">
      <img
        src={isLight ? lightLogo : darkLogo}
        alt="Melala"
        width="64"
        height="64"
        className="mb-4 h-16 w-16 object-contain"
        decoding="async"
      />
      <h1 className="section-heading text-center">{t("paymentTitle")}</h1>
      <p className="mt-4 text-center text-sm text-muted-foreground">{t("paymentDescription")}</p>

      {/* Step 1: Select payment method */}
      {!selectedMethod && (
        <div className="mt-12 grid w-full max-w-md gap-4">
          {paymentMethods.map((method) => (
            <button
              key={method.name}
              type="button"
              onClick={() => handleSelect(method.name)}
              className="flex items-center gap-4 rounded-2xl border border-border bg-card p-5 text-left transition-all hover:border-cream hover:shadow-lg hover:shadow-cream/5 active:scale-[0.98] focus-ring"
            >
              <div className="flex size-14 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-cream p-2">
                <img
                  src={method.logo}
                  alt={`${method.name} logo`}
                  className="h-full w-full object-contain"
                  loading="lazy"
                  decoding="async"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-bold text-foreground">{method.name}</p>
                <p className="mt-0.5 text-xs text-foreground/60">{method.detail}</p>
              </div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="shrink-0 text-foreground/40"
              >
                <path d="m9 18 6-6-6-6" />
              </svg>
            </button>
          ))}
        </div>
      )}

      {/* Step 2: Show QR code for selected method */}
      {selected && (
        <div className="mt-10 flex flex-col items-center">
          <button
            type="button"
            onClick={() => setSelectedMethod(null)}
            className="mb-6 flex items-center gap-1 text-sm text-foreground/60 hover:text-foreground focus-ring"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m12 19-7-7 7-7" />
              <path d="M19 12H5" />
            </svg>
            Change method
          </button>
          <SectionBadge label={selected.name} />
          <button
            type="button"
            onClick={() => setZoomMethod(selected.name)}
            className="mt-8 w-full max-w-[280px] cursor-zoom-in rounded-2xl bg-white p-4 shadow-lg transition-transform hover:scale-[1.02] active:scale-[0.98] focus-ring"
            aria-label={`Tap to zoom ${selected.name} QR code`}
          >
            <img
              src={selected.image}
              alt={`Payment QR code for ${selected.name}`}
              className="aspect-square w-full rounded-xl"
              loading="lazy"
              decoding="async"
            />
          </button>
          <p className="mt-4 text-xs text-foreground/50">Tap QR code to zoom</p>

          {/* Copiable account number */}
          <div className="mt-6 flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3">
            <span className="text-sm text-foreground/60">Account:</span>
            <code className="flex-1 font-mono text-base font-bold tracking-wider text-foreground">
              {selected.account}
            </code>
            <button
              type="button"
              onClick={() => {
                try {
                  navigator.clipboard.writeText(selected.account);
                  navigator.vibrate?.(10);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 1500);
                } catch {
                  /* clipboard not supported */
                }
              }}
              className={`shrink-0 rounded-lg border px-3 py-1.5 text-xs font-bold transition-all active:scale-95 focus-ring ${
                copied
                  ? "border-green-500 bg-green-500/10 text-green-500"
                  : "border-border bg-secondary text-foreground hover:border-cream hover:bg-cream hover:text-brand"
              }`}
              aria-label={`Copy account number ${selected.account}`}
            >
              {copied ? "Copied" : "Copy"}
            </button>
          </div>
          <p className="mt-8 text-center text-xs tracking-[0.2em] text-foreground/50 uppercase">
            {t("showConfirmation")}
          </p>
        </div>
      )}

      {/* Back to menu link */}
      <div className="mt-auto pt-8">
        <Link to={menuPath} className="btn-secondary focus-ring" onClick={handleBackToMenu}>
          {t("backToMenu")}
        </Link>
      </div>

      {/* Zoom modal */}
      {zoomMethod && selected && (
        <QrZoomModal
          image={selected.image}
          name={selected.name}
          logo={selected.logo}
          onClose={() => setZoomMethod(null)}
        />
      )}
    </div>
  );
}
