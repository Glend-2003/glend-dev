import type { Appointment, TenantStore } from "./tenants";

/**
 * La disponibilidad se DERIVA de horario + citas existentes. No hay tabla de
 * slots pregenerados: cambiar el horario del negocio no obliga a reconciliar
 * miles de filas. Es la misma decision que tome en SkillLink.
 */

const SLOT_MIN = 30;

export type Slot = { startsAt: string; available: boolean };

function overlaps(aStart: number, aEnd: number, bStart: number, bEnd: number): boolean {
  return aStart < bEnd && bStart < aEnd;
}

export function slotsForDay(store: TenantStore, day: string): Slot[] {
  const slots: Slot[] = [];
  const durationByService = new Map(store.services.map((s) => [s.id, s.durationMin]));

  const booked = store.appointments
    .filter((a) => a.startsAt.startsWith(day))
    .map((a) => {
      const start = Date.parse(a.startsAt);
      const mins = durationByService.get(a.serviceId) ?? SLOT_MIN;
      return { start, end: start + mins * 60_000 };
    });

  for (let hour = store.openHour; hour < store.closeHour; hour++) {
    for (let min = 0; min < 60; min += SLOT_MIN) {
      const startsAt = `${day}T${String(hour).padStart(2, "0")}:${String(min).padStart(2, "0")}:00.000Z`;
      const start = Date.parse(startsAt);
      const end = start + SLOT_MIN * 60_000;
      const available = !booked.some((b) => overlaps(start, end, b.start, b.end));
      slots.push({ startsAt, available });
    }
  }
  return slots;
}

export type BookResult =
  | { ok: true; appointment: Appointment }
  | { ok: false; reason: "unknown-service" | "outside-hours" | "conflict" };

export function book(
  store: TenantStore,
  input: { serviceId: string; customerName: string; startsAt: string },
): BookResult {
  const service = store.services.find((s) => s.id === input.serviceId);
  if (!service) return { ok: false, reason: "unknown-service" };

  const start = Date.parse(input.startsAt);
  const end = start + service.durationMin * 60_000;
  const startHour = new Date(start).getUTCHours();
  const endMs = new Date(start).setUTCHours(store.closeHour, 0, 0, 0);

  if (startHour < store.openHour || end > endMs) {
    return { ok: false, reason: "outside-hours" };
  }

  const durationByService = new Map(store.services.map((s) => [s.id, s.durationMin]));
  const conflict = store.appointments.some((a) => {
    const aStart = Date.parse(a.startsAt);
    const aEnd = aStart + (durationByService.get(a.serviceId) ?? 30) * 60_000;
    return overlaps(start, end, aStart, aEnd);
  });
  if (conflict) return { ok: false, reason: "conflict" };

  const appointment: Appointment = {
    id: `apt_${Math.random().toString(36).slice(2, 10)}`,
    serviceId: service.id,
    customerName: input.customerName,
    startsAt: new Date(start).toISOString(),
    createdAt: new Date().toISOString(),
  };
  store.appointments.push(appointment);
  return { ok: true, appointment };
}
