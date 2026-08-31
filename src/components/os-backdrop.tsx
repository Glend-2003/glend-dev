import { profile } from "@/content/profile";
import type { Locale } from "@/i18n/config";

/**
 * Fondo de escritorio. Es puramente decorativo, asi que va marcado con
 * aria-hidden y fuera del flujo: un lector de pantalla no debe encontrarse
 * arte ASCII entre el contenido.
 */

/** Salida al estilo `neofetch`, con datos reales del sitio. */
function fetchOutput(locale: Locale): string {
  const rows: [string, string][] = [
    ["user", "glend@portfolio"],
    ["os", "Cloudflare Workers"],
    ["shell", "next.js 16 · app router"],
    ["lang", locale === "es" ? "es_CR.UTF-8" : "en_US.UTF-8"],
    ["stack", "typescript · react · zod"],
    ["locale", "es · en"],
    ["loc", profile.location.toLowerCase()],
  ];
  const width = Math.max(...rows.map(([k]) => k.length));
  return rows.map(([k, v]) => `${k.padEnd(width)} : ${v}`).join("\n");
}

/**
 * Tux en ASCII. Se mantiene estrecho a proposito: vive en el margen derecho y
 * no debe invadir nunca la columna de texto.
 */
const TUX = String.raw`
     .--.
    |o_o |
    |:_/ |
   //   \ \
  (|     | )
 /'\_   _/'\
 \___)=(___/
`;

export function OsBackdrop({ locale }: { locale: Locale }) {
  return (
    <div className="os-backdrop" aria-hidden>
      <div className="os-glow" />
      <div className="os-grid" />
      <div className="os-scanlines" />
      <div className="os-watermark">
        {TUX}
        {"\n"}
        {fetchOutput(locale)}
      </div>
    </div>
  );
}
