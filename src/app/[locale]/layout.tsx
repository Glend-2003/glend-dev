import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { profile } from "@/content/profile";
import { getDictionary } from "@/i18n/dictionaries";
import { defaultLocale, isLocale, locales, localeTags, ogLocales } from "@/i18n/config";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

/**
 * hreflang exige URLs absolutas, y el dominio depende de donde se despliegue.
 *
 * NEXT_PUBLIC_SITE_URL se resuelve en tiempo de build, asi que debe estar
 * definida al compilar (en Cloudflare, como variable del proyecto). Se deja el
 * fallback de Vercel para que el Dockerfile y un despliegue alternativo sigan
 * funcionando sin tocar codigo, y localhost para desarrollo.
 */
const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000");

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: LayoutProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};

  const role = profile.role[locale];
  const pitch = profile.pitch[locale];

  return {
    metadataBase: new URL(siteUrl),
    title: { default: `${profile.name} — ${role}`, template: `%s — ${profile.name}` },
    description: pitch,
    alternates: {
      canonical: `/${locale}`,
      // hreflang: cada idioma declara al otro como alternativa, y x-default
      // apunta al que sirve a quien no encaja en ninguno. Sin esto, Google
      // trata /es y /en como contenido duplicado.
      languages: {
        ...Object.fromEntries(locales.map((l) => [localeTags[l], `/${l}`])),
        "x-default": `/${defaultLocale}`,
      },
    },
    openGraph: {
      title: `${profile.name} — ${role}`,
      description: pitch,
      locale: ogLocales[locale],
      alternateLocale: locales.filter((l) => l !== locale).map((l) => ogLocales[l]),
      url: `/${locale}`,
      siteName: profile.name,
      type: "website",
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: LayoutProps<"/[locale]">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const dict = getDictionary(locale);

  return (
    <html
      lang={localeTags[locale]}
      // Extensiones de navegador (traductores, correctores) inyectan atributos
      // en <html> antes de que React hidrate. Sin esto, cada usuario con una
      // instalada ve un error de hidratacion que no es nuestro.
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col font-sans">
        <a
          href="#contenido"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-sm focus:bg-accent focus:px-3 focus:py-2 focus:font-mono focus:text-xs focus:text-accent-fg"
        >
          {dict.nav.skipToContent}
        </a>
        <SiteNav locale={locale} dict={dict} />
        <main id="contenido" className="flex-1">
          {children}
        </main>
        <SiteFooter />
      </body>
    </html>
  );
}
