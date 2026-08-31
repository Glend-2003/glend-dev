import type { ReactNode } from "react";
import Link from "next/link";

export function cn(...parts: (string | false | null | undefined)[]): string {
  return parts.filter(Boolean).join(" ");
}

export function Container({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mx-auto w-full max-w-5xl px-5 sm:px-8", className)}>
      {children}
    </div>
  );
}

/** Etiqueta monoespaciada que numera y nombra una seccion, como un indice tecnico. */
export function SectionLabel({ index, children }: { index: string; children: ReactNode }) {
  return (
    <div className="mb-8 flex items-baseline gap-3 border-b border-border pb-3">
      <span className="font-mono text-xs text-accent">{index}</span>
      <h2 className="font-mono text-xs uppercase tracking-[0.18em] text-fg-muted">
        {children}
      </h2>
    </div>
  );
}

export function Badge({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-sm border border-border bg-bg-sunken px-2 py-0.5 font-mono text-[11px] leading-5 text-fg-muted">
      {children}
    </span>
  );
}

export function Card({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-md border border-border bg-bg-raised transition-colors hover:border-border-strong",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function ButtonLink({
  href,
  children,
  variant = "primary",
  external,
}: {
  href: string;
  children: ReactNode;
  variant?: "primary" | "ghost";
  external?: boolean;
}) {
  const base =
    "inline-flex items-center gap-2 rounded-sm px-4 py-2 font-mono text-xs transition-colors";
  const styles =
    variant === "primary"
      ? "bg-accent text-accent-fg hover:opacity-90"
      : "border border-border text-fg-muted hover:border-border-strong hover:text-fg";

  if (external) {
    return (
      <a
        href={href}
        className={cn(base, styles)}
        target="_blank"
        rel="noreferrer noopener"
      >
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={cn(base, styles)}>
      {children}
    </Link>
  );
}
