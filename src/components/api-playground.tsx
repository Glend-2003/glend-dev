"use client";

import { useCallback, useMemo, useState } from "react";
import { Badge, Card } from "@/components/ui";
import type { Dictionary } from "@/i18n/dictionaries";
import type { Locale } from "@/i18n/config";

type Method = "GET" | "POST";

type EndpointId = keyof Dictionary["playground"]["endpoints"];
type TenantId = keyof Dictionary["playground"]["tenants"];

/**
 * El endpoint declara solo su mecanica. Su nombre y lo que ensena viven en el
 * diccionario, indexados por el mismo id: anadir un endpoint sin traducirlo
 * rompe la compilacion.
 */
type Endpoint = {
  id: EndpointId;
  method: Method;
  path: string;
  body?: (ctx: { day: string }) => unknown;
  query?: (ctx: { day: string }) => Record<string, string>;
};

const TENANTS = [
  { id: "barberia-nostromo", hours: "09:00–18:00" },
  { id: "clinica-santa-elena", hours: "07:00–15:00" },
] as const satisfies readonly [{ id: TenantId; hours: string }, ...{ id: TenantId; hours: string }[]];

const ENDPOINTS = [
  {
    id: "services",
    method: "GET",
    path: "/api/demo/services",
  },
  {
    id: "availability",
    method: "GET",
    path: "/api/demo/availability",
    query: ({ day }) => ({ date: day }),
  },
  {
    id: "book",
    method: "POST",
    path: "/api/demo/appointments",
    body: ({ day }) => ({
      serviceId: "corte",
      customerName: "Ana Solis",
      startsAt: `${day}T10:00:00.000Z`,
    }),
  },
  {
    id: "cross-tenant",
    method: "POST",
    path: "/api/demo/appointments",
    body: ({ day }) => ({
      serviceId: "general",
      customerName: "Intruso",
      startsAt: `${day}T10:00:00.000Z`,
    }),
  },
  {
    id: "list",
    method: "GET",
    path: "/api/demo/appointments",
  },
  {
    id: "no-tenant",
    method: "GET",
    path: "/api/demo/services",
  },
] as const satisfies readonly [Endpoint, ...Endpoint[]];

const DEFAULT_TENANT = TENANTS[0];
const DEFAULT_ENDPOINT = ENDPOINTS[0];

type Result = {
  status: number;
  statusText: string;
  ms: number;
  headers: [string, string][];
  body: unknown;
};

function tomorrow(): string {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() + 1);
  return d.toISOString().slice(0, 10);
}

export function ApiPlayground({
  dict,
  locale,
}: {
  dict: Dictionary["playground"];
  locale: Locale;
}) {
  const [tenant, setTenant] = useState<TenantId>(DEFAULT_TENANT.id);
  const [endpointId, setEndpointId] = useState<EndpointId>(DEFAULT_ENDPOINT.id);
  const [result, setResult] = useState<Result | null>(null);
  const [pending, setPending] = useState(false);

  const day = useMemo(() => tomorrow(), []);
  const endpoint: Endpoint =
    ENDPOINTS.find((e) => e.id === endpointId) ?? DEFAULT_ENDPOINT;
  const sendsTenant = endpoint.id !== "no-tenant";

  const requestBody = endpoint.body?.({ day });
  const url =
    endpoint.path +
    (endpoint.query ? `?${new URLSearchParams(endpoint.query({ day }))}` : "");

  const run = useCallback(async () => {
    setPending(true);
    const started = performance.now();
    try {
      // Los textos de error del problem+json se negocian por Accept-Language,
      // asi que la respuesta llega en el idioma de la pagina.
      const headers: Record<string, string> = { "accept-language": locale };
      if (sendsTenant) headers["x-tenant"] = tenant;
      if (requestBody) headers["content-type"] = "application/json";

      const res = await fetch(url, {
        method: endpoint.method,
        headers,
        ...(requestBody ? { body: JSON.stringify(requestBody) } : {}),
      });
      const ms = Math.round(performance.now() - started);
      const body: unknown = await res.json().catch(() => null);

      setResult({
        status: res.status,
        statusText: res.statusText,
        ms,
        headers: [...res.headers.entries()].filter(([k]) =>
          k.startsWith("x-ratelimit") ||
            k === "content-type" ||
            k === "content-language",
        ),
        body,
      });
    } finally {
      setPending(false);
    }
  }, [endpoint.method, locale, requestBody, sendsTenant, tenant, url]);

  const statusColor =
    result === null
      ? "text-fg-subtle"
      : result.status < 300
        ? "text-accent"
        : result.status < 500
          ? "text-warn"
          : "text-danger";

  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
      <Card className="p-5">
        <fieldset className="mb-6">
          <legend className="mb-3 font-mono text-xs uppercase tracking-[0.14em] text-accent">
            {dict.tenant}
          </legend>
          <div className="grid gap-2">
            {TENANTS.map((t) => (
              <label
                key={t.id}
                className="flex cursor-pointer items-center gap-3 rounded-sm border border-border p-3 transition-colors has-checked:border-accent has-checked:bg-bg-sunken"
              >
                <input
                  type="radio"
                  name="tenant"
                  value={t.id}
                  checked={tenant === t.id}
                  onChange={() => setTenant(t.id)}
                  className="accent-[var(--accent)]"
                />
                <span className="flex-1 text-sm">{dict.tenants[t.id]}</span>
                <span className="font-mono text-[11px] text-fg-subtle">{t.hours}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend className="mb-3 font-mono text-xs uppercase tracking-[0.14em] text-accent">
            {dict.request}
          </legend>
          <div className="grid gap-1.5">
            {ENDPOINTS.map((e) => (
              <label
                key={e.id}
                className="flex cursor-pointer items-center gap-3 rounded-sm border border-border px-3 py-2 transition-colors has-checked:border-accent has-checked:bg-bg-sunken"
              >
                <input
                  type="radio"
                  name="endpoint"
                  value={e.id}
                  checked={endpointId === e.id}
                  onChange={() => setEndpointId(e.id)}
                  className="accent-[var(--accent)]"
                />
                <span className="font-mono text-[11px] text-info">{e.method}</span>
                <span className="flex-1 text-sm">{dict.endpoints[e.id].label}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <p className="mt-5 border-l-2 border-accent pl-3 text-pretty text-sm leading-relaxed text-fg-muted">
          {dict.endpoints[endpoint.id].teaches}
        </p>

        <button
          type="button"
          onClick={run}
          disabled={pending}
          className="mt-5 w-full rounded-sm bg-accent px-4 py-2.5 font-mono text-xs text-accent-fg transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {pending ? dict.running : dict.run}
        </button>
      </Card>

      <Card className="overflow-hidden">
        <div className="border-b border-border bg-bg-sunken px-4 py-3">
          <p className="font-mono text-[11px] leading-relaxed text-fg-muted">
            <span className="text-info">{endpoint.method}</span> {url}
            {sendsTenant ? (
              <>
                <br />
                <span className="text-fg-subtle">x-tenant:</span> {tenant}
              </>
            ) : (
              <>
                <br />
                <span className="text-danger">{dict.noTenantHeader}</span>
              </>
            )}
          </p>
          {requestBody ? (
            <pre className="mt-2 overflow-x-auto font-mono text-[11px] leading-relaxed text-fg-subtle">
              {JSON.stringify(requestBody, null, 2)}
            </pre>
          ) : null}
        </div>

        <div className="p-4" aria-live="polite">
          {result === null ? (
            <p className="font-mono text-xs text-fg-subtle">
              {dict.noResponse}
            </p>
          ) : (
            <>
              <div className="mb-3 flex flex-wrap items-center gap-3">
                <span className={`font-mono text-xs ${statusColor}`}>
                  {result.status} {result.statusText}
                </span>
                <span className="font-mono text-xs text-fg-subtle">{result.ms} ms</span>
                {result.headers.map(([k, v]) => (
                  <Badge key={k}>
                    {k}: {v}
                  </Badge>
                ))}
              </div>
              <pre className="max-h-[26rem] overflow-auto rounded-sm bg-bg-sunken p-3 font-mono text-[11px] leading-relaxed">
                {JSON.stringify(result.body, null, 2)}
              </pre>
            </>
          )}
        </div>
      </Card>
    </div>
  );
}
