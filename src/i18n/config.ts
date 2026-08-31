export const locales = ["es", "en"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "es";

export const localeNames: Record<Locale, string> = {
  es: "Espanol",
  en: "English",
};

/** Codigo mostrado en el conmutador. Corto, porque vive en la barra de navegacion. */
export const localeShort: Record<Locale, string> = {
  es: "ES",
  en: "EN",
};

/** Etiqueta `lang` y `hreflang` del documento. */
export const localeTags: Record<Locale, string> = {
  es: "es-CR",
  en: "en",
};

/** Locale en el formato que espera Open Graph (og:locale). */
export const ogLocales: Record<Locale, string> = {
  es: "es_CR",
  en: "en_US",
};

export const LOCALE_COOKIE = "locale";

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

/**
 * Contenido que existe en los dos idiomas. Al tipar el mapa como Record sobre
 * el union de locales, anadir un idioma en el futuro rompe la compilacion en
 * cada texto que falte en vez de degradar en silencio a la cadena vacia.
 */
export type Localized<T> = Record<Locale, T>;

export function pick<T>(value: Localized<T>, locale: Locale): T {
  return value[locale];
}
