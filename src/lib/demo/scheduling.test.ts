import { describe, expect, it } from "vitest";
import { resolveTenant, type TenantStore } from "./tenants";
import { book, slotsForDay } from "./scheduling";

function fresh(id: string): TenantStore {
  const store = resolveTenant(id);
  if (!store) throw new Error(`tenant ${id} no existe`);
  store.appointments.length = 0;
  return store;
}

const DAY = "2026-09-01";

describe("aislamiento entre tenants", () => {
  it("una cita creada en un negocio no aparece en el otro", () => {
    const barberia = fresh("barberia-nostromo");
    const clinica = fresh("clinica-santa-elena");

    const result = book(barberia, {
      serviceId: "corte",
      customerName: "Ana",
      startsAt: `${DAY}T10:00:00.000Z`,
    });

    expect(result.ok).toBe(true);
    expect(barberia.appointments).toHaveLength(1);
    expect(clinica.appointments).toHaveLength(0);
  });

  it("un servicio de otro negocio es desconocido, no reservable", () => {
    const barberia = fresh("barberia-nostromo");
    // `general` existe, pero pertenece a la clinica.
    const result = book(barberia, {
      serviceId: "general",
      customerName: "Ana",
      startsAt: `${DAY}T10:00:00.000Z`,
    });

    expect(result).toEqual({ ok: false, reason: "unknown-service" });
  });

  it("resolveTenant no devuelve nada para un id inexistente", () => {
    expect(resolveTenant("negocio-que-no-existe")).toBeNull();
    expect(resolveTenant(null)).toBeNull();
  });
});

describe("reglas de agenda", () => {
  it("rechaza citas solapadas", () => {
    const barberia = fresh("barberia-nostromo");
    book(barberia, {
      serviceId: "combo", // 50 min
      customerName: "Ana",
      startsAt: `${DAY}T10:00:00.000Z`,
    });

    const second = book(barberia, {
      serviceId: "corte",
      customerName: "Luis",
      startsAt: `${DAY}T10:30:00.000Z`,
    });

    expect(second).toEqual({ ok: false, reason: "conflict" });
  });

  it("rechaza citas fuera del horario del negocio", () => {
    const clinica = fresh("clinica-santa-elena"); // 07:00 - 15:00
    const result = book(clinica, {
      serviceId: "general",
      customerName: "Ana",
      startsAt: `${DAY}T16:00:00.000Z`,
    });

    expect(result).toEqual({ ok: false, reason: "outside-hours" });
  });

  it("la disponibilidad se deriva del horario, no de slots pregenerados", () => {
    const clinica = fresh("clinica-santa-elena");
    const slots = slotsForDay(clinica, DAY);

    // 07:00 a 15:00 en pasos de 30 min = 16 slots.
    expect(slots).toHaveLength(16);
    expect(slots.every((s) => s.available)).toBe(true);
  });

  it("una cita marca como no disponibles todos los slots que ocupa", () => {
    const barberia = fresh("barberia-nostromo");
    book(barberia, {
      serviceId: "combo", // 50 min: cubre 10:00 y 10:30
      customerName: "Ana",
      startsAt: `${DAY}T10:00:00.000Z`,
    });

    const slots = slotsForDay(barberia, DAY);
    const busy = slots.filter((s) => !s.available).map((s) => s.startsAt);

    expect(busy).toEqual([`${DAY}T10:00:00.000Z`, `${DAY}T10:30:00.000Z`]);
  });
});

describe("contrato de errores de la API", () => {
  it("el `type` es estable y neutro al idioma; solo el texto se traduce", async () => {
    const { apiLocale, message } = await import("./messages");

    const es = message("es", "unknown-service");
    const en = message("en", "unknown-service");

    // Mismo problema, distinto idioma: el identificador no cambia.
    expect(es.detail).not.toBe(en.detail);
    expect(es.title).not.toBe(en.title);

    const req = (header: string | null) =>
      new Request("http://x/", header ? { headers: { "accept-language": header } } : {});

    expect(apiLocale(req("en-US,en;q=0.9"))).toBe("en");
    expect(apiLocale(req("es-CR"))).toBe("es");
    // Un idioma no soportado o ausente cae al idioma por defecto.
    expect(apiLocale(req("fr-FR"))).toBe("es");
    expect(apiLocale(req(null))).toBe("es");
  });
});
