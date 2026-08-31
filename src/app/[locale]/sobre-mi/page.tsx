import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ButtonLink, Card, Container, SectionLabel } from "@/components/ui";
import { profile, timeline } from "@/content/profile";
import { getDictionary } from "@/i18n/dictionaries";
import { isLocale } from "@/i18n/config";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/sobre-mi">): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  return {
    title: getDictionary(locale).about.metaTitle,
    description: profile.summary[locale],
  };
}

export default async function AboutPage({ params }: PageProps<"/[locale]/sobre-mi">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale).about;

  return (
    <Container className="py-14 sm:py-16">
      <header className="max-w-2xl pb-12">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          {profile.name}
        </h1>
        <p className="mt-2 font-mono text-xs text-accent">{profile.role[locale]}</p>
        <p className="mt-5 text-pretty leading-relaxed text-fg-muted">
          {profile.summary[locale]}
        </p>
        <div className="mt-7 flex flex-wrap gap-3">
          <ButtonLink href={`mailto:${profile.email}`} external>
            {dict.write}
          </ButtonLink>
          <ButtonLink href={profile.linkedin} variant="ghost" external>
            LinkedIn
          </ButtonLink>
          <ButtonLink href={profile.github} variant="ghost" external>
            GitHub
          </ButtonLink>
        </div>
      </header>

      <section>
        <SectionLabel index="01">{dict.timeline}</SectionLabel>
        <ol className="grid gap-4">
          {timeline.map((t) => (
            <li key={t.title.en}>
              <Card className="p-6">
                <p className="font-mono text-xs text-fg-subtle">{t.period[locale]}</p>
                <h2 className="mt-2 text-base font-medium tracking-tight">
                  {t.title[locale]}
                </h2>
                <p className="mt-1 text-sm text-fg-muted">{t.org[locale]}</p>
                <ul className="mt-4 space-y-2">
                  {t.points[locale].map((p) => (
                    <li
                      key={p}
                      className="flex gap-3 text-sm leading-relaxed text-fg-muted"
                    >
                      <span
                        aria-hidden
                        className="mt-2.5 h-px w-3 shrink-0 bg-border-strong"
                      />
                      <span className="text-pretty">{p}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            </li>
          ))}
        </ol>
      </section>

      <section className="pt-14">
        <SectionLabel index="02">{dict.certsAndLangs}</SectionLabel>
        <div className="grid gap-4 sm:grid-cols-2">
          <Card className="p-5">
            <h3 className="mb-3 font-mono text-xs uppercase tracking-[0.14em] text-accent">
              {dict.certifications}
            </h3>
            <ul className="space-y-3">
              {profile.certifications.map((c) => (
                <li key={c.name.en} className="text-sm">
                  <p>{c.name[locale]}</p>
                  <p className="font-mono text-[11px] text-fg-subtle">
                    {c.org} · {c.year}
                  </p>
                </li>
              ))}
            </ul>
          </Card>
          <Card className="p-5">
            <h3 className="mb-3 font-mono text-xs uppercase tracking-[0.14em] text-accent">
              {dict.languages}
            </h3>
            <ul className="space-y-3">
              {profile.languages.map((l) => (
                <li key={l.name.en} className="text-sm">
                  <p>{l.name[locale]}</p>
                  <p className="font-mono text-[11px] text-fg-subtle">
                    {l.level[locale]}
                  </p>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </section>
    </Container>
  );
}
