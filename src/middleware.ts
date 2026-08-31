import { NextResponse, type NextRequest } from "next/server";
import { LOCALE_COOKIE, defaultLocale, isLocale, locales } from "@/i18n/config";

/**
 * Toda URL publica lleva su idioma en la ruta. Este middleware solo atiende las
 * que no lo llevan: elige el idioma una vez y redirige a la URL canonica.
 *
 * Prioridad: eleccion previa del usuario (cookie) > Accept-Language > es.
 * La preferencia explicita gana siempre sobre la del navegador.
 */

function negotiate(header: string | null): string | null {
  if (!header) return null;

  const ranked = header
    .split(",")
    .map((part) => {
      const [tag = "", ...params] = part.trim().split(";");
      const q = params.find((p) => p.trim().startsWith("q="));
      const quality = q ? Number.parseFloat(q.split("=")[1] ?? "1") : 1;
      return { tag: tag.trim().toLowerCase(), quality };
    })
    .sort((a, b) => b.quality - a.quality);

  for (const { tag } of ranked) {
    const base = tag.split("-")[0] ?? "";
    if (isLocale(base)) return base;
  }
  return null;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const hasLocale = locales.some(
    (l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`),
  );
  if (hasLocale) return NextResponse.next();

  const cookie = request.cookies.get(LOCALE_COOKIE)?.value;
  const locale =
    (cookie && isLocale(cookie) && cookie) ||
    negotiate(request.headers.get("accept-language")) ||
    defaultLocale;

  const url = request.nextUrl.clone();
  url.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  // Ni la API ni los assets se localizan: la API habla un solo contrato.
  matcher: ["/((?!api|_next|favicon.ico|.*\\..*).*)"],
};
