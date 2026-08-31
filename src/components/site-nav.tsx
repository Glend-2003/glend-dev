import Link from "next/link";
import { Container } from "@/components/ui";
import { LocaleSwitcher } from "@/components/locale-switcher";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";

/**
 * En movil la cabecera necesitaba 518px para una sola fila y un telefono da
 * 375: el conmutador de idioma quedaba cortado fuera de pantalla.
 *
 * Se reparte en dos filas con flex-wrap y `order` en vez de duplicar el
 * marcado o esconder los enlaces tras un menu hamburguesa. Un punado de enlaces
 * cortos no justifica un menu, y un solo <nav> evita dos landmarks con la
 * misma etiqueta para un lector de pantalla.
 *
 *   movil     fila 1: logo + idioma · fila 2: enlaces a lo ancho
 *   sm+       una fila: logo · enlaces · idioma
 */
export function SiteNav({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const links = [
    { href: `/${locale}/proyectos`, label: dict.nav.projects },
    { href: `/${locale}/playground`, label: dict.nav.playground },
    { href: `/${locale}/sobre-mi`, label: dict.nav.about },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-bg/85 backdrop-blur">
      <Container className="flex flex-wrap items-center gap-x-3 py-2 sm:h-14 sm:flex-nowrap sm:py-0">
        <Link
          href={`/${locale}`}
          className="order-1 mr-auto shrink-0 font-mono text-sm text-fg transition-colors hover:text-accent"
        >
          <span className="text-accent">~/</span>glend
        </Link>

        {/* En movil viaja a la fila 1 junto al logo; en sm+ cierra la fila. */}
        <div className="order-2 shrink-0 sm:order-3">
          <LocaleSwitcher current={locale} label={dict.nav.languageLabel} />
        </div>

        <nav
          aria-label={dict.nav.ariaLabel}
          className="no-scrollbar order-3 w-full overflow-x-auto pt-1.5 sm:order-2 sm:w-auto sm:overflow-visible sm:pt-0"
        >
          {/*
            En movil `justify-between` reparte los enlaces a lo ancho y hace
            innecesario el gap; el ahorro es lo que permite que entren en
            320px sin desplazarse.
          */}
          <ul className="flex items-center justify-between sm:justify-end sm:gap-1">
            {links.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="block whitespace-nowrap rounded-sm px-1 py-1.5 font-mono text-[11px] text-fg-muted transition-colors hover:bg-bg-sunken hover:text-fg sm:px-2 sm:text-xs"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </Container>
    </header>
  );
}
