import { useLanguage } from "@/lib/language";

export function LanguageToggle() {
  const { locale, setLocale, t } = useLanguage();

  return (
    <button
      onClick={() => setLocale(locale === "en" ? "am" : "en")}
      className="flex h-10 items-center rounded-full border border-border bg-background/90 px-4 text-sm font-medium text-muted-foreground backdrop-blur-sm transition-colors hover:bg-card hover:text-foreground"
      aria-label="Toggle language"
    >
      {locale === "en" ? t("english") : t("amharic")}
    </button>
  );
}
