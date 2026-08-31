import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge, ButtonLink, Card, Container, SectionLabel } from "@/components/ui";
import { profile, skills } from "@/content/profile";
import { featuredProjects, kindLabels } from "@/content/projects";
import { getDictionary } from "@/i18n/dictionaries";
import { isLocale } from "@/i18n/config";

export default async function HomePage({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);

  return (
    <>
      <section className="relative overflow-hidden border-b border-border">
        <div className="grid-backdrop pointer-events-none absolute inset-0" aria-hidden />
        <Container className="relative py-20 sm:py-28">
          <p className="mb-5 font-mono text-xs text-accent">
            {profile.location} · {dict.home.availability}
          </p>
          {/*
            El titular es una frase descriptiva de varias clausulas, no un
            eslogan de tres palabras. A 5xl ocupaba cinco lineas y se leia como
            un cartel; a este tamano se lee como lo que es: una afirmacion.
          */}
          <h1 className="max-w-3xl text-balance text-3xl font-semibold leading-[1.15] tracking-tight sm:text-4xl">
            {profile.pitch[locale]}
          </h1>
          <p className="mt-6 max-w-2xl text-pretty leading-relaxed text-fg-muted">
            {profile.summary[locale]}
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <ButtonLink href={`/${locale}/playground`}>
              {dict.home.ctaPlayground}
            </ButtonLink>
            <ButtonLink href={`/${locale}/proyectos`} variant="ghost">
              {dict.home.ctaProjects}
            </ButtonLink>
            <ButtonLink href={profile.cv[locale]} variant="ghost" download>
              {dict.home.cv}
            </ButtonLink>
          </div>
        </Container>
      </section>

      <Container className="py-16 sm:py-20">
        <SectionLabel index="01">{dict.home.featured}</SectionLabel>
        <ul className="grid gap-4">
          {featuredProjects.map((p) => (
            <li key={p.slug}>
              <Card>
                <Link href={`/${locale}/proyectos/${p.slug}`} className="block p-6">
                  <div className="flex flex-wrap items-baseline justify-between gap-3">
                    <h3 className="text-lg font-medium tracking-tight">{p.name}</h3>
                    <span className="font-mono text-xs text-fg-subtle">
                      {kindLabels[p.kind][locale]} · {p.year}
                    </span>
                  </div>
                  <p className="mt-2 max-w-2xl text-pretty text-sm leading-relaxed text-fg-muted">
                    {p.tagline[locale]}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {p.stack.slice(0, 5).map((s) => (
                      <Badge key={s}>{s}</Badge>
                    ))}
                  </div>
                  <p className="mt-4 font-mono text-xs text-accent">
                    {dict.home.readDecisions}
                  </p>
                </Link>
              </Card>
            </li>
          ))}
        </ul>
      </Container>

      <Container className="py-16 sm:py-20">
        <SectionLabel index="02">{dict.home.stack}</SectionLabel>
        <p className="mb-8 max-w-2xl text-sm leading-relaxed text-fg-muted">
          {dict.home.stackIntro}
        </p>
        <div className="grid gap-6 sm:grid-cols-2">
          {skills.map((group) => (
            <Card key={group.label.en} className="p-5">
              <h3 className="mb-4 font-mono text-xs uppercase tracking-[0.14em] text-accent">
                {group.label[locale]}
              </h3>
              <ul className="space-y-2">
                {group.items.map((item) => (
                  <li key={item.name} className="flex flex-wrap items-baseline gap-x-2">
                    <span className="text-sm">{item.name}</span>
                    {item.note ? (
                      <span className="font-mono text-[11px] text-fg-subtle">
                        {item.note[locale]}
                      </span>
                    ) : null}
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>
      </Container>
    </>
  );
}
