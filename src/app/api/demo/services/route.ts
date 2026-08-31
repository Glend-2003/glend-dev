import { ok, withTenant } from "@/lib/demo/http";

export async function GET(req: Request) {
  const ctx = withTenant(req);
  if ("response" in ctx) return ctx.response;

  return ok(
    { tenant: ctx.store.id, services: ctx.store.services },
    ctx.rate,
  );
}
