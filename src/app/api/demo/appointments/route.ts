import { z } from "zod";
import { ok, problem, withTenant } from "@/lib/demo/http";
import { book } from "@/lib/demo/scheduling";

const body = z.object({
  serviceId: z.string().min(1),
  customerName: z.string().min(2).max(60),
  startsAt: z.iso.datetime(),
});

export async function GET(req: Request) {
  const ctx = withTenant(req);
  if ("response" in ctx) return ctx.response;
  return ok({ tenant: ctx.store.id, appointments: ctx.store.appointments }, ctx.rate);
}

export async function POST(req: Request) {
  const ctx = withTenant(req);
  if ("response" in ctx) return ctx.response;

  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    return problem(400, "malformed-json", ctx.locale);
  }

  const parsed = body.safeParse(raw);
  if (!parsed.success) {
    return problem(422, "validation-body", ctx.locale, {
      errors: z.treeifyError(parsed.error),
    });
  }

  const result = book(ctx.store, parsed.data);
  if (!result.ok) return problem(409, result.reason, ctx.locale);

  return ok({ tenant: ctx.store.id, appointment: result.appointment }, ctx.rate, 201);
}
