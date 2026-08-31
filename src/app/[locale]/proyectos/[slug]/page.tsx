import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Badge, Card, Container } from "@/components/ui";
import { getProject, kindLabels, projects } from "@/content/projects";
import { getDictionary } from "@/i18n/dictionaries";
import { isLocale, locales } from "@/i18n/config";

export function generateStaticParams() {
  return locales.flatMap((locale) => projects.map((p) => ({ locale, slug: p.slug })));
}

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/proyectos/[slug]">): Promise<Metadata> {
  const { locale, slug } = await params;
  const project = getProject(slug);
  if (!project || !isLocale(locale)) return {};
  return { title: project.name, description: project.tagline[locale] };
}

function Block({
  index,
  title,
  children,
}: {
  index: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-t border-border py-10">
      <div className="mb-5 flex items-baseline gap-3">
        <span className="font-mono text-xs text-accent">{index}</span>
        <h2 className="font-mono text-xs uppercase tracking-[0.18em] text-fg-muted">
          {title}
        </h2>
      </div>
      {children}
    </section>
  );
}

export default async function ProjectPage({
  params,
}: PageProps<"/[locale]/proyectos/[slug]">) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  const project = getProject(slug);
  if (!project) notFound();
  const dict = getDictionary(locale);

  return (
    <Container className="py-14 sm:py-16">
      <Link
        href={`/${locale}/proyectos`}
        className="font-mono text-xs text-fg-subtle transition-colors hover:text-accent"
      >
        {dict.projects.back}
      </Link>

      <header className="mt-6 pb-10">
        <p className="font-mono text-xs text-fg-subtle">
          {kindLabels[project.kind][locale]} · {project.year}
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
          {project.name}
        </h1>
        <p className="mt-3 max-w-2xl text-pretty text-lg leading-relaxed text-fg-muted">
          {project.tagline[locale]}
        </p>
        <div className="mt-5 flex flex-wrap gap-1.5">
          {project.stack.map((s) => (
            <Badge key={s}>{s}</Badge>
          ))}
        </div>
      </header>

      <Block index="01" title={dict.projects.problem}>
        <p className="max-w-2xl text-pretty leading-relaxed text-fg-muted">
          {project.problem[locale]}
        </p>
      </Block>

      <Block index="02" title={dict.projects.constraints}>
        <ul className="max-w-2xl space-y-3">
          {project.constraints[locale].map((c) => (
            <li key={c} className="flex gap-3 text-pretty leading-relaxed text-fg-muted">
              <span aria-hidden className="mt-2 h-px w-4 shrink-0 bg-border-strong" />
              <span>{c}</span>
            </li>
          ))}
        </ul>
      </Block>

      <Block index="03" title={dict.projects.decisions}>
        <ul className="grid gap-4">
          {project.decisions.map((d) => (
            <li key={d.title.en}>
              <Card className="p-6">
                <h3 className="text-base font-medium tracking-tight">
                  {d.title[locale]}
                </h3>
                <p className="mt-3 text-pretty text-sm leading-relaxed text-fg-muted">
                  {d.why[locale]}
                </p>
                <p className="mt-4 border-l-2 border-border-strong pl-4 text-pretty text-sm leading-relaxed text-fg-subtle">
                  <span className="font-mono text-[11px] uppercase tracking-wider text-warn">
                    {dict.projects.insteadOf}{" "}
                  </span>
                  {d.insteadOf[locale]}
                </p>
              </Card>
            </li>
          ))}
        </ul>
      </Block>

      <Block index="04" title={dict.projects.outcome}>
        <ul className="max-w-2xl space-y-3">
          {project.outcomes[locale].map((o) => (
            <li key={o} className="flex gap-3 text-pretty leading-relaxed text-fg-muted">
              <span aria-hidden className="mt-1.5 font-mono text-xs text-accent">
                ✓
              </span>
              <span>{o}</span>
            </li>
          ))}
        </ul>
      </Block>

      <Block index="05" title={dict.projects.retrospective}>
        <p className="max-w-2xl text-pretty leading-relaxed text-fg-muted">
          {project.retrospective[locale]}
        </p>
      </Block>
    </Container>
  );
}
