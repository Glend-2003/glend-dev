import Link from "next/link";
import { Container } from "@/components/ui";
import { defaultLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";

/**
 * notFound() se lanza antes de resolver params, asi que esta pagina no conoce
 * el idioma de la URL. Muestra los dos: es mas util que adivinar mal.
 */
export default function NotFound() {
  const es = getDictionary("es").notFound;
  const en = getDictionary("en").notFound;

  return (
    <Container className="py-24">
      <p className="font-mono text-xs text-accent">404</p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight">{es.title}</h1>
      <p className="mt-3 text-fg-muted">{es.body}</p>
      <h2 lang="en" className="mt-8 text-3xl font-semibold tracking-tight">
        {en.title}
      </h2>
      <p lang="en" className="mt-3 text-fg-muted">
        {en.body}
      </p>
      <Link
        href={`/${defaultLocale}`}
        className="mt-8 inline-block font-mono text-xs text-accent hover:underline"
      >
        {es.home}
      </Link>
    </Container>
  );
}
