import {
  localeOptions,
  switchLocalePath,
  type Locale,
} from "../lib/i18n";

export function LanguageSwitcher({
  locale,
  languageLabel,
  currentPath,
  compact = false,
}: {
  locale: Locale;
  languageLabel: string;
  currentPath: string;
  compact?: boolean;
}) {
  const active = localeOptions.find((option) => option.code === locale);
  return (
    <details
      className={compact ? "language-switcher language-switcher-compact" : "language-switcher"}
    >
      <summary aria-label={languageLabel}>
        <span>{compact ? active?.shortLabel : active?.label}</span>
        <span aria-hidden="true">⌄</span>
      </summary>
      <div className="language-options" role="list" aria-label={languageLabel}>
        {localeOptions.map((option) => (
          <a
            key={option.code}
            href={switchLocalePath(option.code, currentPath)}
            hrefLang={option.code}
            lang={option.code}
            aria-current={option.code === locale ? "page" : undefined}
          >
            <span>{option.shortLabel}</span>
            {option.label}
          </a>
        ))}
      </div>
    </details>
  );
}
