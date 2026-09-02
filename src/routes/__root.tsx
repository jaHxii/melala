import {
  Outlet,
  Link,
  createRootRoute,
  useRouter,
  HeadContent,
  Scripts,
  useMatches,
  useNavigate,
} from "@tanstack/react-router";
import { type ReactNode, Suspense, useEffect } from "react";

import appCss from "../styles.css?url";
import { reportError } from "../lib/error-tracking";
import { SITE_URL, SITE_TITLE } from "../lib/constants";
import { LanguageProvider, useLanguage } from "../lib/language";
import { ThemeProvider, useTheme } from "../lib/theme";
import { LanguageToggle } from "@/components/LanguageToggle";
import { ThemeToggle } from "@/components/ThemeToggle";

/* ── Back Button Handler ────────────────────────────────────────── */

/**
 * On QR menu pages (/cafe, /restaurant): back does nothing.
 * On payment page (/payment): back redirects to the correct menu.
 */
function BackBlocker() {
  const matches = useMatches();
  const currentPath = matches.at(-1)?.pathname ?? "/";
  const navigate = useNavigate();

  useEffect(() => {
    // Push a fake entry so the first back press doesn't leave the page
    window.history.pushState(null, "", window.location.href);

    const onPopState = () => {
      if (currentPath === "/payment") {
        // Read the from param to go back to the right menu
        const params = new URLSearchParams(window.location.search);
        const from = params.get("from");
        const menuPath = from === "restaurant" ? "/restaurant" : "/cafe";
        navigate({ to: menuPath, replace: true });
      } else {
        // On menu pages: stay on the same page
        window.history.pushState(null, "", window.location.href);
      }
    };

    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, [currentPath, navigate]);

  return null;
}

/* ── Minimal Home Header ────────────────────────────────────────── */

function HomeHeader() {
  const { theme } = useTheme();
  const isLight = theme === "light";

  return (
    <header className="header-gradient-bar sticky top-0 z-50 border-b border-transparent bg-background/95 backdrop-blur-sm transition-all duration-300">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-2.5 sm:px-6">
        <Link
          to="/"
          className="flex min-w-0 items-center gap-3"
          aria-label="Melala Cafe & Restaurant — home"
        >
          {isLight ? (
            <img
              src="/light-logo.jpg"
              alt="Melala Cafe & Restaurant logo"
              width="54"
              height="54"
              className="h-auto w-auto shrink-0 rounded-sm object-contain"
              style={{ maxHeight: "54px" }}
              decoding="async"
            />
          ) : (
            <picture>
              <source type="image/webp" srcSet="/logo.webp" />
              <img
                src="/logo.png"
                alt="Melala Cafe & Restaurant logo"
                width="54"
                height="54"
                className="h-auto w-auto shrink-0 rounded-sm object-contain"
                style={{ maxHeight: "54px" }}
                decoding="async"
              />
            </picture>
          )}
          <span className="hidden min-w-0 flex-col leading-tight sm:flex">
            <span className="truncate font-display text-base font-semibold tracking-[0.16em] uppercase brand-coffee">
              Melala
            </span>
            <span className="font-ethiopic truncate text-[12px] text-muted-foreground">
              ሜላላ ቡና ወሰን
            </span>
          </span>
        </Link>
        <div className="flex items-center gap-2">
          <LanguageToggle />
        </div>
      </div>
    </header>
  );
}

/* ── Minimal Home Footer ────────────────────────────────────────── */

function HomeFooter() {
  return (
    <footer className="relative mt-24 border-t border-border text-foreground">
      <div aria-hidden="true" className="bg-grain absolute inset-0 opacity-40" />
      <div className="relative mx-auto max-w-6xl px-6 py-14">
        {" "}
        <div className="flex flex-col items-center gap-10 md:flex-row md:items-start md:justify-center">
          {" "}
          <div className="flex flex-col gap-6 text-sm text-foreground/80 sm:flex-row sm:gap-10">
            <div>
              <h2 className="font-sans text-xs font-bold tracking-[0.22em] uppercase text-foreground/60">
                Visit
              </h2>
              <ul className="mt-3 space-y-1.5">
                <li>2RHP+VCW, Addis Ababa, Ethiopia</li>
                <li>7:00 AM – 10:00 PM daily</li>
              </ul>
            </div>
            <div>
              <h2 className="font-sans text-xs font-bold tracking-[0.22em] uppercase text-foreground/60">
                Contact
              </h2>
              <ul className="mt-3 space-y-1.5">
                <li>
                  <a href="tel:+251911609157" className="hover:text-foreground focus-ring">
                    +251 911 60 91 57
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h2 className="font-sans text-xs font-bold tracking-[0.22em] uppercase text-foreground/60">
                Follow
              </h2>
              <ul className="mt-3 space-y-1.5">
                <li>
                  <a
                    href="https://web.facebook.com/p/Melala-Coffee-61584402941113/?_rdc=1&_rdr"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline decoration-foreground/20 underline-offset-4 hover:text-foreground focus-ring"
                  >
                    Facebook
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.instagram.com/melala_coffee/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline decoration-foreground/20 underline-offset-4 hover:text-foreground focus-ring"
                  >
                    Instagram
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.tiktok.com/@melala_restaurant_cafe"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline decoration-foreground/20 underline-offset-4 hover:text-foreground focus-ring"
                  >
                    TikTok
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>{" "}
      <div className="border-t border-foreground/10">
        <div className="mx-auto max-w-6xl px-6 py-5 text-center">
          <p className="text-xs text-foreground/60">
            © {new Date().getFullYear()} Melala Cafe & Restaurant. All rights reserved.
          </p>
          <p className="mt-1 text-xs text-foreground/40">
            Developed by{" "}
            <a
              href="https://t.me/cloud_xii"
              target="_blank"
              rel="noreferrer"
              className="text-foreground/60 transition-colors hover:text-foreground focus-ring"
            >
              cloud_xii
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}

/* ── Error / Loading / 404 ──────────────────────────────────────── */

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link to="/" className="btn-primary focus-ring">
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  reportError(error, "error");
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="btn-primary focus-ring"
          >
            Try again
          </button>
          <Link to="/" className="btn-secondary focus-ring">
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function RootLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center">
        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-cream border-t-transparent" />
        <p className="mt-4 text-sm text-muted-foreground">Loading...</p>
      </div>
    </div>
  );
}

/* ── Route Definition ───────────────────────────────────────────── */

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { name: "theme-color", content: "#160e08" },
      { title: SITE_TITLE },
      {
        name: "description",
        content:
          "Melala Cafe & Restaurant, Addis Ababa. Specialty coffee, all-day breakfast and Ethiopian classics.",
      },
      { property: "og:site_name", content: "Melala" },
      { property: "og:type", content: "website" },
      { property: "og:title", content: SITE_TITLE },
      {
        property: "og:description",
        content: "Specialty coffee, all-day breakfast and Ethiopian classics in Addis Ababa.",
      },
      { property: "og:image", content: `${SITE_URL}/logo.png` },
      { property: "og:image:width", content: "512" },
      { property: "og:image:height", content: "512" },
      { property: "og:url", content: SITE_URL },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: SITE_TITLE },
      {
        name: "twitter:description",
        content: "Specialty coffee, all-day breakfast and Ethiopian classics in Addis Ababa.",
      },
      { name: "twitter:image", content: `${SITE_URL}/logo.png` },
      { name: "robots", content: "index, follow" },
      { name: "author", content: "Melala Cafe & Restaurant" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      {
        rel: "preconnect",
        href: "https://fonts.gstatic.com",
        crossOrigin: "anonymous",
      },
      {
        rel: "preload",
        href: "https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=Inter:wght@400;500;600;700&family=Noto+Sans+Ethiopic:wght@400;500;600&display=swap",
        as: "style",
      },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=Inter:wght@400;500;600;700&family=Noto+Sans+Ethiopic:wght@400;500;600&display=swap",
      },
      { rel: "icon", href: "/logo.png", type: "image/png", sizes: "512x512" },
      {
        rel: "icon",
        href: "/favicon.png",
        type: "image/png",
        sizes: "32x32",
      },
      {
        rel: "apple-touch-icon",
        href: "/logo.png",
        sizes: "512x512",
      },
      { rel: "manifest", href: "/manifest.json" },
    ],
  }),

  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

/* ── Shell ──────────────────────────────────────────────────────── */

/** Routes that are pure QR-scan pages — no header, no footer, no nav. */
const QR_ROUTES = ["/cafe", "/restaurant", "/payment"];

function RootShell({ children }: { children: ReactNode }) {
  const matches = useMatches();
  const currentPath = matches.at(-1)?.pathname ?? "/";
  const isQRPage = QR_ROUTES.some((r) => currentPath === r || currentPath.startsWith(r + "/"));
  const isHome = currentPath === "/";

  return (
    <html lang="en">
      <head>
        <HeadContent />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var lang = localStorage.getItem("melala-lang");
                  if (lang === "am") document.documentElement.lang = "am";
                  var theme = localStorage.getItem("melala-theme");
                  if (theme === "dark") document.documentElement.classList.add("dark");
                  else if (theme === "light") document.documentElement.classList.remove("dark");
                  else if (window.matchMedia("(prefers-color-scheme: dark)").matches) document.documentElement.classList.add("dark");
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body>
        <ThemeProvider>
          <LanguageProvider>
            <HtmlLangSync />{" "}
            {isQRPage ? (
              /* QR pages: no chrome, just content + back blocker + toggles */
              <>
                <BackBlocker />
                {children}
                <div className="fixed right-4 top-[5.5rem] z-[9999] flex gap-2 max-sm:top-[4.5rem]">
                  <ThemeToggle />
                  <LanguageToggle />
                </div>
              </>
            ) : isHome ? (
              /* Home page: minimal header + content + minimal footer */
              <>
                <HomeHeader />
                <main id="main" className="pb-16 sm:pb-0">
                  {children}
                </main>
                <HomeFooter />
                <div className="fixed right-4 top-4 z-[9999] flex gap-2">
                  <ThemeToggle />
                  <LanguageToggle />
                </div>
              </>
            ) : (
              /* Other pages (404, error): basic shell */
              <>
                <main id="main" className="pb-16 sm:pb-0">
                  {children}
                </main>
                <div className="fixed right-4 top-4 z-[9999] flex gap-2">
                  <ThemeToggle />
                  <LanguageToggle />
                </div>
              </>
            )}
          </LanguageProvider>
        </ThemeProvider>
        <Scripts />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', () => {
                  navigator.serviceWorker.register('/sw.js').catch(() => {});
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}

/** Syncs <html lang> when the user switches language via the UI. */
function HtmlLangSync() {
  const { locale } = useLanguage();

  useEffect(() => {
    document.documentElement.lang = locale === "am" ? "am" : "en";
  }, [locale]);

  return null;
}

function RootComponent() {
  return (
    <Suspense fallback={<RootLoading />}>
      <Outlet />
    </Suspense>
  );
}
