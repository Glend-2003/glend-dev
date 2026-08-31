import { Container } from "@/components/ui";
import { profile } from "@/content/profile";

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-border py-10">
      <Container className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="font-mono text-xs text-fg-subtle">
          {profile.name} · {profile.location}
        </p>
        <ul className="flex flex-wrap gap-4 font-mono text-xs">
          <li>
            <a
              className="text-fg-muted transition-colors hover:text-accent"
              href={`mailto:${profile.email}`}
            >
              email
            </a>
          </li>
          <li>
            <a
              className="text-fg-muted transition-colors hover:text-accent"
              href={profile.github}
              rel="noreferrer noopener"
              target="_blank"
            >
              github
            </a>
          </li>
          <li>
            <a
              className="text-fg-muted transition-colors hover:text-accent"
              href={profile.linkedin}
              rel="noreferrer noopener"
              target="_blank"
            >
              linkedin
            </a>
          </li>
        </ul>
      </Container>
    </footer>
  );
}
