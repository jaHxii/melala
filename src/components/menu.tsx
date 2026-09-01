import { Link } from "@tanstack/react-router";
import type { MenuSection as MenuSectionType, MenuItem as MenuItemType } from "@/data/cafeMenu";

export function SectionBadge({ label, local }: { label: string; local?: string }) {
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
  return (
    <section className="menu-card break-inside-avoid">
      <div className="-mt-8 mb-6 flex justify-center">
        <SectionBadge label={section.category} local={section.local} />
      </div>
      <ul className="space-y-5">
        {section.items.map((item) => (
          <MenuItemRow key={item.name} item={item} />
        ))}
      </ul>
    </section>
  );
}

export function MenuHeader({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <header className="pt-14 pb-4 text-center sm:pt-20">
      <p className="tracking-widget text-accent">{eyebrow}</p>
      <h1 className="display-title mt-3">{title}</h1>
      <div className="mx-auto mt-5 h-px w-24 bg-border" />
    </header>
  );
}

export function PaymentButton() {
  return (
    <Link to="/payment" className="btn-primary">
      Payment
    </Link>
  );
}

export function PaymentBar() {
  return (
    <div className="sticky bottom-0 z-20 -mx-4 mt-14 border-t border-border bg-background/90 px-4 py-4 backdrop-blur sm:-mx-6 sm:px-6">
      <div className="mx-auto flex max-w-5xl justify-center">
        <PaymentButton />
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
