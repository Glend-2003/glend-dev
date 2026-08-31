import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge, Card, Container, SectionLabel } from "@/components/ui";
import { kindLabels, projects } from "@/content/projects";
import { getDictionary } from "@/i18n/dictionaries";
import { isLocale } from "@/i18n/config";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/proyectos">): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = getDictionary(locale);
  return { title: dict.projects.title, description: dict.projects.metaDescription };
}

export default async function ProjectsPage({ params }: PageProps<"/[locale]/proyectos">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);

  return (
    <Container className="py-16 sm:py-20">
      <SectionLabel index="01">{dict.projects.title}</SectionLabel>
      <p className="mb-10 max-w-2xl text-pretty leading-relaxed text-fg-muted">
        {dict.projects.intro}
      </p>
      <ul className="grid gap-4">
        {projects.map((p) => (
          <li key={p.slug}>
            <Card>
              <Link href={`/${locale}/proyectos/${p.slug}`} className="block p-6">
                <div className="flex flex-wrap items-baseline justify-between gap-3">
                  <h2 className="text-lg font-medium tracking-tight">{p.name}</h2>
                  <span className="font-mono text-xs text-fg-subtle">
                    {kindLabels[p.kind][locale]} · {p.year}
                  </span>
                </div>
                <p className="mt-2 max-w-2xl text-pretty text-sm leading-relaxed text-fg-muted">
                  {p.tagline[locale]}
                </p>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {p.stack.map((s) => (
                    <Badge key={s}>{s}</Badge>
                  ))}
                </div>
              </Link>
            </Card>
          </li>
        ))}
      </ul>
    </Container>
  );
}
