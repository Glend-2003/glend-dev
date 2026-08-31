import { NextResponse } from "next/server";
import { TENANT_HEADER, resolveTenant, type TenantStore } from "./tenants";
import { apiLocale, message, type MessageKey } from "./messages";
import type { Locale } from "@/i18n/config";

/**
 * Errores en formato RFC 7807 (application/problem+json).
 *
 * `type` es el contrato con la maquina y por eso es estable y neutro al idioma;
 * `title` y `detail` son para la persona que depura y se negocian por
 * Accept-Language. Un cliente que ramifique sobre `type` nunca se rompe.
 */
export type Problem = {
  type: string;
  title: string;
  status: number;
  detail: string;
};

const TYPE_BASE = "https://glend.dev/errors";

export function problem(
  status: number,
  key: MessageKey,
  locale: Locale,
  extra?: Record<string, unknown>,
): NextResponse {
  const { title, detail } = message(locale, key);
  const body: Problem & Record<string, unknown> = {
    type: `${TYPE_BASE}/${key}`,
    title,
    status,
    detail,
    ...extra,
  };
  return NextResponse.json(body, {
    status,
    headers: {
      "content-type": "application/problem+json",
      "content-language": locale,
    },
  });
}

/** Rate limit por tenant, ventana fija. Deliberadamente visible en las cabeceras. */
const LIMIT = 30;
const WINDOW_MS = 60_000;

const globalForLimit = globalThis as unknown as {
  __demoRate?: Map<string, { count: number; resetAt: number }>;
};
const buckets = (globalForLimit.__demoRate ??= new Map());

export type RateResult = { ok: boolean; remaining: number; resetAt: number };

export function rateLimit(key: string): RateResult {
  const now = Date.now();
  const bucket = buckets.get(key);
  if (!bucket || bucket.resetAt <= now) {
    const fresh = { count: 1, resetAt: now + WINDOW_MS };
    buckets.set(key, fresh);
    return { ok: true, remaining: LIMIT - 1, resetAt: fresh.resetAt };
  }
  bucket.count += 1;
  return {
    ok: bucket.count <= LIMIT,
    remaining: Math.max(0, LIMIT - bucket.count),
    resetAt: bucket.resetAt,
  };
}

export function rateHeaders(r: RateResult): Record<string, string> {
  return {
    "x-ratelimit-limit": String(LIMIT),
    "x-ratelimit-remaining": String(r.remaining),
    "x-ratelimit-reset": String(Math.ceil(r.resetAt / 1000)),
  };
}

export type TenantContext = { store: TenantStore; rate: RateResult; locale: Locale };

/**
 * Puerta de entrada de todo handler: resuelve el tenant y aplica el limite.
 * Devuelve el store ya aislado, o una respuesta de error lista para retornar.
 */
export function withTenant(req: Request): TenantContext | { response: NextResponse } {
  const locale = apiLocale(req);
  const id = req.headers.get(TENANT_HEADER);

  if (!id) return { response: problem(400, "tenant-required", locale) };

  const store = resolveTenant(id);
  if (!store) return { response: problem(404, "tenant-not-found", locale) };

  const rate = rateLimit(store.id);
  if (!rate.ok) {
    const res = problem(429, "rate-limited", locale);
    for (const [k, v] of Object.entries(rateHeaders(rate))) res.headers.set(k, v);
    return { response: res };
  }

  return { store, rate, locale };
}

export function ok(data: unknown, rate: RateResult, status = 200): NextResponse {
  return NextResponse.json(data, { status, headers: rateHeaders(rate) });
}
