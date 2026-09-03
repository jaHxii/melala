import { Link } from "@tanstack/react-router";
import {
  type MenuSection as MenuSectionType,
  type MenuItem as MenuItemType,
} from "@/data/cafeMenu";
import { useLanguage } from "@/lib/language";
import { useTheme } from "@/lib/theme";
import { useState, useCallback, useRef, type ReactNode } from "react";

/* ── Section Badge ──────────────────────────────────────────────── */

export function SectionBadge({ label, local }: { label: string; local?: string | undefined }) {
  return (
    <span
      className="inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm font-bold uppercase tracking-[0.16em]"
      style={{ backgroundColor: "var(--clay)", color: "var(--berbere)" }}
    >
      {local ? (
        <span className="font-ethiopic text-xs font-medium normal-case tracking-normal opacity-70">
          {local}&nbsp;/&nbsp;
        </span>
      ) : null}
      {label}
    </span>
  );
}

/* ── Menu Item Row (with tap-to-highlight) ──────────────────────── */

function MenuItemRow({ item }: { item: MenuItemType }) {
  const [tapped, setTapped] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const handleTap = useCallback(() => {
    try {
      navigator.vibrate?.(10);
    } catch {
      /* vibrate not supported */
    }
    setTapped(true);
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setTapped(false), 600);
  }, []);

  return (
    <li
      className="flex items-baseline gap-3 rounded-xl px-4 py-3 transition-colors active:bg-secondary/50"
      onClick={handleTap}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") handleTap();
      }}
    >
      <div className="min-w-0 flex-1">
        {item.local ? <p className="font-ethiopic text-sm text-cream/70">{item.local}</p> : null}
        <h3 className="menu-item-name">{item.name}</h3>
        {item.description ? <p className="menu-item-desc">{item.description}</p> : null}
      </div>
      <span
        aria-hidden="true"
        className="min-w-6 flex-1 self-center border-b-2 border-dotted border-foreground/30"
      />
      <span className={`menu-price-pill transition-all duration-300 ${tapped ? "scale-110" : ""}`}>
        {item.price}
      </span>
    </li>
  );
}

/* ── Menu Section Card (no animation) ───────────────────────────── */

function MenuSectionCard({ section, id }: { section: MenuSectionType; id?: string }) {
  return (
    <section
      id={id}
      className="card-berbere-hover break-inside-avoid rounded-2xl border border-border bg-card p-6 pb-7"
    >
      <div className="-mt-8 mb-8 flex justify-center">
        <SectionBadge label={section.category} local={section.local} />
      </div>
      <div className="mb-6">
        <h2 className="menu-section-title text-center">
          {section.local && (
            <span className="font-ethiopic text-sm font-medium normal-case tracking-normal opacity-70 mr-2">
              {section.local}
            </span>
          )}
          {section.category}
        </h2>
      </div>
      <ul className="space-y-2" aria-label={`${section.category} menu items`}>
        {section.items.map((item) => (
          <MenuItemRow key={item.name} item={item} />
        ))}
      </ul>
    </section>
  );
}

/* ── Brand Logo (tappable → scroll to top) ──────────────────────── */

export function BrandLogo({
  className = "w-32 sm:w-40",
  scrollable = false,
  lightSrc = "/cafe-light-logo.jpg",
  darkSrc = "/cafe-dark-logo.png",
  darkSrcSet,
  alt = "Melala Coffee logo",
}: {
  className?: string;
  scrollable?: boolean;
  lightSrc?: string;
  darkSrc?: string;
  darkSrcSet?: string;
  alt?: string;
}) {
  const { theme } = useTheme();
  const handleClick = useCallback(() => {
    if (scrollable) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [scrollable]);

  const Tag = scrollable ? "button" : "span";
  const isLight = theme === "light";

  return (
    <Tag
      onClick={scrollable ? handleClick : undefined}
      className={scrollable ? "cursor-pointer bg-transparent border-0 p-0" : ""}
      aria-label={scrollable ? "Scroll to top" : undefined}
      type={scrollable ? "button" : undefined}
    >
      {isLight ? (
        <img
          src={lightSrc}
          alt={alt}
          className={`mx-auto h-auto ${className}`}
          width={512}
          height={512}
          fetchPriority="high"
        />
      ) : (
        <picture>
          {darkSrcSet ? <source srcSet={darkSrcSet} type="image/webp" /> : null}
          <img
            src={darkSrc}
            alt={alt}
            className={`mx-auto h-auto ${className}`}
            width={512}
            height={512}
            fetchPriority="high"
          />
        </picture>
      )}
    </Tag>
  );
}

/* ── Menu Header (logo scrolls to top) ──────────────────────────── */

export function MenuHeader({
  eyebrow,
  title,
  lightLogo,
  darkLogo,
  darkLogoSet,
}: {
  eyebrow: string;
  title: string;
  lightLogo?: string;
  darkLogo?: string;
  darkLogoSet?: string;
}) {
  return (
    <header className="flex flex-col items-center pt-14 pb-4 text-center sm:pt-20">
      <BrandLogo
        className="mb-5 w-44 sm:w-56"
        scrollable
        lightSrc={lightLogo}
        darkSrc={darkLogo}
        darkSrcSet={darkLogoSet}
      />
      <p className="tracking-widget text-cream/60">{eyebrow}</p>
      <h1 className="section-heading mt-3 uppercase">
        <span className="brand-coffee">{title || "Melala"}</span>
      </h1>
      <div className="mx-auto mt-5 h-px w-24 bg-border" />
    </header>
  );
}

/* ── Category Filter Pills ──────────────────────────────────────── */

export function CategoryFilter({
  sections,
  activeCategory,
  onSelect,
}: {
  sections: MenuSectionType[];
  activeCategory: string | null;
  onSelect: (category: string | null) => void;
}) {
  return (
    <div className="sticky top-0 z-40 -mx-4 overflow-x-auto bg-background/95 px-4 py-4 backdrop-blur-sm sm:-mx-6 sm:px-6">
      <div className="mx-auto flex max-w-5xl gap-2.5">
        <button
          type="button"
          onClick={() => onSelect(null)}
          className={`filter-pill-active shrink-0 rounded-full border px-5 py-2 text-sm font-bold uppercase tracking-wider transition-all ${
            activeCategory === null
              ? "border-transparent bg-card text-berbere"
              : "border-border bg-card text-foreground/60 hover:border-clay hover:text-foreground"
          }`}
        >
          All
        </button>
        {sections.map((section) => (
          <button
            key={section.category}
            type="button"
            onClick={() => onSelect(section.category)}
            className={`shrink-0 rounded-full border px-5 py-2 text-sm font-bold uppercase tracking-wider transition-all ${
              activeCategory === section.category
                ? "filter-pill-active border-transparent bg-card text-berbere"
                : "border-border bg-card text-foreground/60 hover:border-clay hover:text-foreground"
            }`}
          >
            {section.category}
            <span className="ml-1.5 opacity-50">({section.items.length})</span>
          </button>
        ))}
      </div>
    </div>
  );
}

/* ── Sticky Pay Button ──────────────────────────────────────────── */

export function StickyPayButton({ from }: { from: string }) {
  const { t } = useLanguage();

  const handleClick = useCallback(() => {
    try {
      navigator.vibrate?.(15);
    } catch {
      /* vibrate not supported */
    }
  }, []);

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-background/95 px-4 py-4 backdrop-blur-sm">
      <div className="mx-auto flex max-w-5xl justify-center">
        <Link
          to="/payment"
          search={{ from }}
          className="btn-primary w-full max-w-md focus-ring"
          onClick={handleClick}
        >
          {t("payment")}
        </Link>
      </div>
    </div>
  );
}

/* ── Section Divider (accent gradient) ────────────────────────── */

function SectionDivider() {
  return (
    <div className="my-8 flex items-center justify-center gap-3">
      <div
        className="h-px flex-1"
        style={{
          background:
            "linear-gradient(90deg, transparent, var(--berbere), var(--gold), transparent)",
          opacity: 0.4,
        }}
      />
      <span className="font-display text-xl" style={{ color: "var(--berbere)", opacity: 0.4 }}>
        ✦
      </span>
      <div
        className="h-px flex-1"
        style={{
          background:
            "linear-gradient(90deg, transparent, var(--gold), var(--berbere), transparent)",
          opacity: 0.4,
        }}
      />
    </div>
  );
}

/* ── Menu Grid (with dividers, no animation) ────────────────────── */

export function MenuGrid({
  sections,
  filter,
}: {
  sections: MenuSectionType[];
  filter?: string | null;
}) {
  const filtered = filter ? sections.filter((s) => s.category === filter) : sections;

  return (
    <div className="mx-auto max-w-5xl gap-x-10 pt-6 lg:columns-2">
      {filtered.map((section, i) => (
        <div key={section.category} className="mb-8 break-inside-avoid">
          {i > 0 && !filter && <SectionDivider />}
          <MenuSectionCard
            section={section}
            id={`section-${section.category.toLowerCase().replace(/\s+/g, "-")}`}
          />
        </div>
      ))}
    </div>
  );
}
