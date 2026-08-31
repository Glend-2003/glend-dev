"use client";

import { usePathname, useRouter } from "next/navigation";
import { useTransition } from "react";
import { locales, localeNames, localeShort, type Locale } from "@/i18n/config";
import { setLocale } from "@/i18n/actions";

/**
 * Conserva la ruta actual al cambiar de idioma: /en/proyectos/kapibook pasa a
 * /es/proyectos/kapibook, no al inicio. Perder el contexto al cambiar de idioma
 * es el error clasico de este componente.
 *
 * La eleccion se guarda en una cookie desde el servidor para que la proxima
 * visita a una URL sin idioma entre directamente en el correcto, sin volver a
 * negociar con Accept-Language.
 */
export function LocaleSwitcher({ current, label }: { current: Locale; label: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function pathFor(locale: Locale): string {
    const segments = pathname.split("/");
    // segments[0] es la cadena vacia antes de la primera barra.
    segments[1] = locale;
    return segments.join("/") || `/${locale}`;
  }

  function switchTo(locale: Locale) {
    startTransition(async () => {
      await setLocale(locale);
      router.replace(pathFor(locale));
    });
  }

  return (
    <div
      role="group"
      aria-label={label}
      className="ml-1 flex items-center rounded-sm border border-border p-0.5"
      data-pending={pending ? "" : undefined}
    >
      {locales.map((locale) => {
        const active = locale === current;
        return (
          <button
            key={locale}
            type="button"
            lang={locale}
            aria-current={active ? "true" : undefined}
            aria-label={localeNames[locale]}
            onClick={() => switchTo(locale)}
            className={
              active
                ? "rounded-[2px] bg-accent px-2 py-1 font-mono text-[11px] text-accent-fg"
                : "rounded-[2px] px-2 py-1 font-mono text-[11px] text-fg-subtle transition-colors hover:text-fg"
            }
          >
            {localeShort[locale]}
          </button>
        );
      })}
    </div>
  );
}
