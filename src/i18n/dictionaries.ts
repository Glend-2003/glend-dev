import type { Locale } from "./config";

/**
 * El diccionario espanol es la fuente de verdad de la forma. `Dictionary` se
 * deriva de el, asi que cualquier clave que falte en ingles es un error de
 * compilacion, no un hueco que se descubre en produccion.
 */
const es = {
  nav: {
    projects: "proyectos",
    playground: "playground",
    about: "sobre-mi",
    ariaLabel: "Principal",
    skipToContent: "Saltar al contenido",
    languageLabel: "Idioma",
  },
  home: {
    availability: "disponible para roles backend",
    ctaPlayground: "Probar una API en vivo →",
    ctaProjects: "Ver case studies",
    featured: "Proyectos destacados",
    readDecisions: "Leer decisiones tecnicas →",
    stack: "Stack",
    stackIntro:
      "Sin barras de porcentaje. Cada herramienta se lista con el contexto en el que la use de verdad; lo demas es exposicion honesta, no dominio.",
  },
  projects: {
    title: "Case studies",
    metaDescription:
      "Case studies con el problema, las restricciones, las decisiones tecnicas y lo que haria distinto hoy.",
    intro:
      "Cada proyecto documenta el problema, las restricciones reales, las decisiones que tome —y las que descarte a cambio— y lo que haria distinto hoy. Las capturas de pantalla no cuentan nada de eso.",
    back: "← proyectos",
    problem: "El problema",
    constraints: "Restricciones",
    decisions: "Decisiones tecnicas",
    insteadOf: "En vez de:",
    outcome: "Resultado",
    retrospective: "Retrospectiva",
  },
  playground: {
    eyebrow: "Pieza central",
    title: "API multi-tenant, ejecutable",
    metaDescription:
      "Una API multi-tenant real, ejecutable desde el navegador: aislamiento por tenant, validacion, errores RFC 7807 y rate limiting.",
    intro1:
      "Esto no es una captura de pantalla. Es la misma arquitectura que sostiene KapiBook, reducida a lo esencial y corriendo en este servidor: cada negocio en su propio almacen, un unico punto que resuelve el tenant, y un dominio que ni siquiera puede alcanzar los datos de otro.",
    intro2Before: "Intenta romperlo. La peticion ",
    intro2After: " esta ahi justamente para eso.",
    tenant: "Tenant",
    request: "Peticion",
    run: "Ejecutar peticion →",
    running: "ejecutando…",
    noResponse: "Sin respuesta todavia. Ejecuta una peticion.",
    noTenantHeader: "(sin cabecera x-tenant)",
    whatItShows: "Que demuestra",
    knownLimit: "Limite conocido:",
    knownLimitBody:
      "la demo guarda el estado en memoria del proceso, asi que en serverless una cita puede no verse desde otra instancia. Es deliberado: sustituir el almacen por una conexion por tenant no cambia una sola linea del dominio, que es justamente lo que la arquitectura debia demostrar.",
    tenants: {
      "barberia-nostromo": "Barberia Nostromo",
      "clinica-santa-elena": "Clinica Santa Elena",
    },
    endpoints: {
      services: {
        label: "Listar servicios",
        teaches:
          "Cambia de tenant y vuelve a ejecutar: el catalogo es distinto porque cada negocio vive en su propio almacen.",
      },
      availability: {
        label: "Consultar disponibilidad",
        teaches:
          "Los slots no estan guardados en ninguna tabla: se derivan del horario del negocio menos las citas existentes.",
      },
      book: {
        label: "Agendar una cita",
        teaches:
          "Ejecutalo dos veces seguidas: la segunda devuelve 409 porque la cita se solapa. Los errores siguen RFC 7807.",
      },
      "cross-tenant": {
        label: "Intentar fuga entre tenants",
        teaches:
          "Reserva el servicio `general`, que pertenece a la clinica. Con la barberia seleccionada devuelve 409 unknown-service: el aislamiento es estructural, no una validacion opcional.",
      },
      list: {
        label: "Listar citas del tenant",
        teaches:
          "Solo devuelve lo agendado para el negocio de la cabecera. Nunca hay una consulta que pueda ver los dos.",
      },
      "no-tenant": {
        label: "Omitir la cabecera de tenant",
        teaches:
          "Sin `x-tenant` la peticion se rechaza en la puerta con 400. Ningun handler llega a ejecutarse sin un tenant resuelto.",
      },
    },
    principles: [
      {
        t: "Aislamiento estructural",
        d: "El mapa de tenants vive en un solo modulo. El dominio recibe un almacen ya resuelto y no tiene referencia a los demas. Un bug no puede filtrar datos porque no hay nada que filtrar.",
      },
      {
        t: "Contratos validados en el borde",
        d: "Cada cuerpo y cada query pasa por un esquema Zod antes de tocar el dominio. Lo que llega al codigo de negocio ya esta tipado y es valido.",
      },
      {
        t: "Errores que sirven para programar",
        d: "application/problem+json (RFC 7807). Un cliente puede ramificar sobre `type`; el humano lee `detail`. Nada de devolver 200 con {error: ...}.",
      },
      {
        t: "Disponibilidad derivada",
        d: "Los slots se calculan desde horario menos citas. Cambiar el horario del negocio no obliga a regenerar ni reconciliar filas.",
      },
      {
        t: "Rate limiting por tenant",
        d: "El limite se aplica por negocio y se reporta en cabeceras x-ratelimit-*. Saturar un tenant no degrada a los demas.",
      },
      {
        t: "Reglas verificadas con tests",
        d: "El aislamiento entre tenants, el solapamiento de citas y el horario estan cubiertos por tests que corren en CI. La afirmacion es comprobable, no una promesa.",
      },
    ],
  },
  about: {
    metaTitle: "Sobre mi",
    write: "Escribirme",
    timeline: "Trayectoria",
    certsAndLangs: "Certificaciones e idiomas",
    certifications: "Certificaciones",
    languages: "Idiomas",
  },
  notFound: {
    title: "Pagina no encontrada",
    body: "La ruta que buscas no existe en este sitio.",
    home: "← Volver al inicio",
  },
};

/** La forma canonica. El ingles debe satisfacerla exactamente. */
export type Dictionary = typeof es;

const en: Dictionary = {
  nav: {
    projects: "projects",
    playground: "playground",
    about: "about",
    ariaLabel: "Main",
    skipToContent: "Skip to content",
    languageLabel: "Language",
  },
  home: {
    availability: "open to backend roles",
    ctaPlayground: "Try a live API →",
    ctaProjects: "Read the case studies",
    featured: "Featured projects",
    readDecisions: "Read the technical decisions →",
    stack: "Stack",
    stackIntro:
      "No percentage bars. Every tool is listed with the context where I actually used it; the rest is honest exposure, not mastery.",
  },
  projects: {
    title: "Case studies",
    metaDescription:
      "Case studies covering the problem, the constraints, the technical decisions, and what I would do differently today.",
    intro:
      "Each project documents the problem, the real constraints, the decisions I made — and the ones I traded them for — and what I would do differently today. Screenshots tell you none of that.",
    back: "← projects",
    problem: "The problem",
    constraints: "Constraints",
    decisions: "Technical decisions",
    insteadOf: "Instead of:",
    outcome: "Outcome",
    retrospective: "Retrospective",
  },
  playground: {
    eyebrow: "Centerpiece",
    title: "A multi-tenant API you can run",
    metaDescription:
      "A real multi-tenant API you can run from the browser: per-tenant isolation, validation, RFC 7807 errors, and rate limiting.",
    intro1:
      "This is not a screenshot. It is the same architecture behind KapiBook, reduced to its essentials and running on this server: every business in its own store, a single place that resolves the tenant, and a domain layer that cannot even reach another tenant's data.",
    intro2Before: "Try to break it. The ",
    intro2After: " request exists for exactly that.",
    tenant: "Tenant",
    request: "Request",
    run: "Send request →",
    running: "sending…",
    noResponse: "No response yet. Send a request.",
    noTenantHeader: "(no x-tenant header)",
    whatItShows: "What it demonstrates",
    knownLimit: "Known limit:",
    knownLimitBody:
      "the demo keeps state in process memory, so on serverless an appointment may not be visible from another instance. That is deliberate: swapping the store for a per-tenant connection changes not one line of the domain layer, which is precisely what the architecture had to prove.",
    tenants: {
      "barberia-nostromo": "Nostromo Barbershop",
      "clinica-santa-elena": "Santa Elena Clinic",
    },
    endpoints: {
      services: {
        label: "List services",
        teaches:
          "Switch tenants and run it again: the catalog differs because each business lives in its own store.",
      },
      availability: {
        label: "Check availability",
        teaches:
          "Slots are stored in no table: they are derived from the business hours minus the existing appointments.",
      },
      book: {
        label: "Book an appointment",
        teaches:
          "Run it twice in a row: the second returns 409 because the appointment overlaps. Errors follow RFC 7807.",
      },
      "cross-tenant": {
        label: "Attempt a cross-tenant leak",
        teaches:
          "This books the `general` service, which belongs to the clinic. With the barbershop selected it returns 409 unknown-service: isolation is structural, not an optional check.",
      },
      list: {
        label: "List this tenant's appointments",
        teaches:
          "It only returns what was booked for the business in the header. No query can ever see both.",
      },
      "no-tenant": {
        label: "Omit the tenant header",
        teaches:
          "Without `x-tenant` the request is rejected at the door with 400. No handler ever runs without a resolved tenant.",
      },
    },
    principles: [
      {
        t: "Structural isolation",
        d: "The tenant map lives in a single module. The domain receives an already-resolved store and holds no reference to the others. A bug cannot leak data because there is nothing to leak.",
      },
      {
        t: "Contracts validated at the edge",
        d: "Every body and every query goes through a Zod schema before touching the domain. What reaches the business code is already typed and valid.",
      },
      {
        t: "Errors you can program against",
        d: "application/problem+json (RFC 7807). A client can branch on `type`; a human reads `detail`. No returning 200 with {error: ...}.",
      },
      {
        t: "Derived availability",
        d: "Slots are computed from hours minus appointments. Changing a business's hours never forces regenerating or reconciling rows.",
      },
      {
        t: "Per-tenant rate limiting",
        d: "The limit applies per business and is reported in x-ratelimit-* headers. Saturating one tenant does not degrade the others.",
      },
      {
        t: "Rules covered by tests",
        d: "Tenant isolation, appointment overlap, and business hours are covered by tests that run in CI. The claim is verifiable, not a promise.",
      },
    ],
  },
  about: {
    metaTitle: "About",
    write: "Email me",
    timeline: "Background",
    certsAndLangs: "Certifications and languages",
    certifications: "Certifications",
    languages: "Languages",
  },
  notFound: {
    title: "Page not found",
    body: "The route you are looking for does not exist on this site.",
    home: "← Back home",
  },
};

const dictionaries: Record<Locale, Dictionary> = { es, en };

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}
