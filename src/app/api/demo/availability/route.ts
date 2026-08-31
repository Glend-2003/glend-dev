import { z } from "zod";
import { ok, problem, withTenant } from "@/lib/demo/http";
import { slotsForDay } from "@/lib/demo/scheduling";

const query = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});

export async function GET(req: Request) {
  const ctx = withTenant(req);
  if ("response" in ctx) return ctx.response;

  const url = new URL(req.url);
  const parsed = query.safeParse({ date: url.searchParams.get("date") ?? "" });
  if (!parsed.success) {
    return problem(422, "validation-query", ctx.locale, {
      errors: z.treeifyError(parsed.error),
    });
  }

  const slots = slotsForDay(ctx.store, parsed.data.date);
  return ok(
    {
      tenant: ctx.store.id,
      date: parsed.data.date,
      hours: { open: ctx.store.openHour, close: ctx.store.closeHour },
      slots,
    },
    ctx.rate,
  );
}
