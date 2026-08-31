import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ApiPlayground } from "@/components/api-playground";
import { Card, Container, SectionLabel } from "@/components/ui";
import { getDictionary } from "@/i18n/dictionaries";
import { isLocale } from "@/i18n/config";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/playground">): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = getDictionary(locale).playground;
  return { title: dict.title, description: dict.metaDescription };
}

export default async function PlaygroundPage({
  params,
}: PageProps<"/[locale]/playground">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale).playground;

  return (
    <Container className="py-14 sm:py-16">
      <header className="max-w-2xl pb-12">
        <p className="font-mono text-xs text-accent">{dict.eyebrow}</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
          {dict.title}
        </h1>
        <p className="mt-4 text-pretty leading-relaxed text-fg-muted">{dict.intro1}</p>
        <p className="mt-4 text-pretty leading-relaxed text-fg-muted">
          {dict.intro2Before}
          <span className="font-mono text-xs text-fg">
            {dict.endpoints["cross-tenant"].label}
          </span>
          {dict.intro2After}
        </p>
      </header>

      <ApiPlayground dict={dict} locale={locale} />

      <section className="pt-16">
        <SectionLabel index="01">{dict.whatItShows}</SectionLabel>
        <div className="grid gap-4 sm:grid-cols-2">
          {dict.principles.map((c) => (
            <Card key={c.t} className="p-5">
              <h3 className="text-sm font-medium tracking-tight">{c.t}</h3>
              <p className="mt-2 text-pretty text-sm leading-relaxed text-fg-muted">
                {c.d}
              </p>
            </Card>
          ))}
        </div>

        <p className="mt-8 max-w-2xl border-l-2 border-warn pl-4 text-pretty text-sm leading-relaxed text-fg-subtle">
          <span className="font-mono text-[11px] uppercase tracking-wider text-warn">
            {dict.knownLimit}{" "}
          </span>
          {dict.knownLimitBody}
        </p>
      </section>
    </Container>
  );
}
