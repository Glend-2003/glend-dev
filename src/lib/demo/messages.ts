import { defaultLocale, isLocale, type Locale } from "@/i18n/config";

/**
 * RFC 7807 separa lo que lee una maquina de lo que lee una persona: `type` es
 * un identificador estable que un cliente puede programar, y `title`/`detail`
 * son prosa para el humano que depura.
 *
 * Por eso `type` NUNCA se traduce y `detail` si: negociar el idioma del texto
 * no rompe a ningun cliente, porque ningun cliente deberia ramificar sobre el.
 */
export type MessageKey =
  | "tenant-required"
  | "tenant-not-found"
  | "rate-limited"
  | "malformed-json"
  | "validation-query"
  | "validation-body"
  | "unknown-service"
  | "outside-hours"
  | "conflict";

type Message = { title: string; detail: string };

const messages: Record<Locale, Record<MessageKey, Message>> = {
  es: {
    "tenant-required": {
      title: "Falta la cabecera de tenant",
      detail:
        "Toda peticion debe identificar su negocio con la cabecera x-tenant.",
    },
    "tenant-not-found": {
      title: "Tenant desconocido",
      detail: "No existe un negocio con ese identificador.",
    },
    "rate-limited": {
      title: "Demasiadas peticiones",
      detail:
        "El limite es por tenant: saturar un negocio no degrada a los demas.",
    },
    "malformed-json": {
      title: "Cuerpo invalido",
      detail: "El cuerpo de la peticion no es JSON valido.",
    },
    "validation-query": {
      title: "Parametros invalidos",
      detail: "El parametro `date` es obligatorio y debe tener formato YYYY-MM-DD.",
    },
    "validation-body": {
      title: "Cuerpo invalido",
      detail: "Uno o mas campos no cumplen el contrato de la API.",
    },
    "unknown-service": {
      title: "No se pudo agendar",
      detail: "Ese servicio no pertenece a este negocio.",
    },
    "outside-hours": {
      title: "No se pudo agendar",
      detail: "La cita cae fuera del horario de atencion del negocio.",
    },
    conflict: {
      title: "No se pudo agendar",
      detail: "Ya existe una cita que se solapa con ese horario.",
    },
  },
  en: {
    "tenant-required": {
      title: "Missing tenant header",
      detail: "Every request must identify its business with the x-tenant header.",
    },
    "tenant-not-found": {
      title: "Unknown tenant",
      detail: "No business exists with that identifier.",
    },
    "rate-limited": {
      title: "Too many requests",
      detail:
        "The limit is per tenant: saturating one business does not degrade the others.",
    },
    "malformed-json": {
      title: "Invalid body",
      detail: "The request body is not valid JSON.",
    },
    "validation-query": {
      title: "Invalid parameters",
      detail: "The `date` parameter is required and must be formatted YYYY-MM-DD.",
    },
    "validation-body": {
      title: "Invalid body",
      detail: "One or more fields do not satisfy the API contract.",
    },
    "unknown-service": {
      title: "Could not book",
      detail: "That service does not belong to this business.",
    },
    "outside-hours": {
      title: "Could not book",
      detail: "The appointment falls outside the business's opening hours.",
    },
    conflict: {
      title: "Could not book",
      detail: "An appointment already overlaps that time slot.",
    },
  },
};

/**
 * Negocia el idioma del texto de error. Solo mira la primera preferencia: para
 * un mensaje de error no compensa un negociador completo con q-values.
 */
export function apiLocale(req: Request): Locale {
  const header = req.headers.get("accept-language");
  const first = header?.split(",")[0]?.trim().split("-")[0]?.toLowerCase();
  return first && isLocale(first) ? first : defaultLocale;
}

export function message(locale: Locale, key: MessageKey): Message {
  return messages[locale][key];
}
