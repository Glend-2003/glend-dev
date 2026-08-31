/**
 * Datos de demostracion. Cada tenant vive en su propio contenedor: la funcion
 * que resuelve el tenant es el UNICO lugar que conoce el mapa completo, igual
 * que en KapiBook el middleware es el unico que conoce la cadena de conexion.
 *
 * El resto del dominio recibe un `TenantStore` ya resuelto y no tiene forma de
 * alcanzar los datos de otro negocio. El aislamiento es estructural, no una
 * clausula WHERE que alguien puede olvidar.
 */

export type Service = {
  id: string;
  name: string;
  durationMin: number;
  /** En centimos. El dinero nunca se guarda en punto flotante. */
  priceCents: number;
  currency: "CRC";
};

export type Appointment = {
  id: string;
  serviceId: string;
  customerName: string;
  /** ISO 8601 en UTC. */
  startsAt: string;
  createdAt: string;
};

export type TenantStore = {
  readonly id: string;
  readonly name: string;
  readonly openHour: number;
  readonly closeHour: number;
  readonly services: readonly Service[];
  readonly appointments: Appointment[];
};

export const TENANT_HEADER = "x-tenant";

function seed(): Map<string, TenantStore> {
  return new Map<string, TenantStore>([
    [
      "barberia-nostromo",
      {
        id: "barberia-nostromo",
        name: "Barberia Nostromo",
        openHour: 9,
        closeHour: 18,
        services: [
          { id: "corte", name: "Corte clasico", durationMin: 30, priceCents: 700000, currency: "CRC" },
          { id: "barba", name: "Perfilado de barba", durationMin: 20, priceCents: 450000, currency: "CRC" },
          { id: "combo", name: "Corte + barba", durationMin: 50, priceCents: 1000000, currency: "CRC" },
        ],
        appointments: [],
      },
    ],
    [
      "clinica-santa-elena",
      {
        id: "clinica-santa-elena",
        name: "Clinica Santa Elena",
        openHour: 7,
        closeHour: 15,
        services: [
          { id: "general", name: "Consulta general", durationMin: 30, priceCents: 2500000, currency: "CRC" },
          { id: "control", name: "Control de seguimiento", durationMin: 15, priceCents: 1200000, currency: "CRC" },
        ],
        appointments: [],
      },
    ],
  ]);
}

/**
 * En serverless cada instancia puede tener su propia memoria. Para una demo es
 * aceptable y se advierte en la UI; en produccion esto seria una conexion por
 * tenant a su base de datos.
 */
const globalForTenants = globalThis as unknown as {
  __demoTenants?: Map<string, TenantStore>;
};

const tenants = (globalForTenants.__demoTenants ??= seed());

export function listTenants(): { id: string; name: string }[] {
  return [...tenants.values()].map((t) => ({ id: t.id, name: t.name }));
}

/** Unico punto de acceso al mapa de tenants. */
export function resolveTenant(id: string | null): TenantStore | null {
  if (!id) return null;
  return tenants.get(id) ?? null;
}
