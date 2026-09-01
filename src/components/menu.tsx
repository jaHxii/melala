import { Link } from "@tanstack/react-router";
import type { MenuSection as MenuSectionType, MenuItem as MenuItemType } from "@/data/cafeMenu";
import { useInView } from "@/hooks/use-in-view";
import { useLanguage } from "@/lib/language";

export function SectionBadge({ label, local }: { label: string; local?: string | undefined }) {
  return (
    <span className="badge-pill">
      {local ? <span className="badge-local">{local}&nbsp;/&nbsp;</span> : null}
      {label}
    </span>
  );
}

export function MenuItemRow({ item }: { item: MenuItemType }) {
  return (
    <li className="menu-row">
      <div className="min-w-0 flex-1">
        {item.local ? <p className="item-local">{item.local}</p> : null}
        <h3 className="item-name">{item.name}</h3>
        {item.description ? <p className="item-desc">{item.description}</p> : null}
      </div>
      <span className="leader" aria-hidden="true" />
      <span className="item-price">{item.price}</span>
    </li>
  );
}

export function MenuSectionCard({ section }: { section: MenuSectionType }) {
  const { ref, isInView } = useInView({ threshold: 0.05 });

  return (
    <section
      ref={ref}
      className={`menu-card break-inside-avoid reveal ${isInView ? "visible" : ""}`}
    >
      <div className="-mt-8 mb-6 flex justify-center">
        <SectionBadge label={section.category} local={section.local} />
      </div>
      <ul className="space-y-5" aria-label={`${section.category} menu items`}>
        {section.items.map((item) => (
          <MenuItemRow key={item.name} item={item} />
        ))}
      </ul>
    </section>
  );
}

export function BrandLogo({ className = "w-32 sm:w-40" }: { className?: string }) {
  return (
    <picture>
      <source srcSet="/logo.webp" type="image/webp" />
      <img
        src="/logo.png"
        alt="Melala Coffee logo"
        className={`mx-auto h-auto ${className}`}
        width={512}
        height={512}
        fetchPriority="high"
      />
    </picture>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-border py-8 text-center">
      <p className="mt-4 text-xs tracking-[0.2em] text-muted-foreground uppercase">
        © {new Date().getFullYear()} Melala Cafe &amp; Restaurant
      </p>
      <p className="mt-2 text-xs text-muted-foreground">
        Developed by{" "}
        <a
          href="https://t.me/cloud_xii"
          target="_blank"
          rel="noreferrer"
          className="text-primary transition-colors hover:underline"
        >
          cloud_xii
        </a>
      </p>
    </footer>
  );
}

export function MenuHeader({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <header className="hero-stagger pt-14 pb-4 text-center sm:pt-20">
      <BrandLogo className="mb-5 w-44 sm:w-56" />
      <p className="tracking-widget text-accent">{eyebrow}</p>
      <h1 className="display-title mt-3">{title}</h1>
      <div className="mx-auto mt-5 h-px w-24 bg-border" />
    </header>
  );
}

export function PaymentButton({ from }: { from: string }) {
  const { t } = useLanguage();

  return (
    <Link to="/payment" search={{ from }} className="btn-primary">
      {t("payment")}
    </Link>
  );
}

export function PaymentBar({ from }: { from: string }) {
  return (
    <div className="mt-auto border-t border-border py-4">
      <div className="mx-auto flex max-w-5xl justify-center">
        <PaymentButton from={from} />
      </div>
    </div>
  );
}

export function MenuGrid({ sections }: { sections: MenuSectionType[] }) {
  return (
    <div className="mx-auto max-w-5xl gap-x-8 pt-10 lg:columns-2">
      {sections.map((section) => (
        <div key={section.category} className="mb-14 break-inside-avoid">
          <MenuSectionCard section={section} />
        </div>
      ))}
    </div>
  );
}
