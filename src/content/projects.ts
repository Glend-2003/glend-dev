import type { Localized } from "@/i18n/config";

export type Decision = {
  /** La decision tomada. */
  title: Localized<string>;
  /** Por que se tomo. */
  why: Localized<string>;
  /** Que se descarto y a cambio de que. Esto es lo que lee un tech lead. */
  insteadOf: Localized<string>;
};

export type ProjectKind = "product" | "client" | "work" | "academic";

export const kindLabels: Record<ProjectKind, Localized<string>> = {
  product: { es: "Producto", en: "Product" },
  client: { es: "Cliente", en: "Client" },
  work: { es: "Laboral", en: "Professional" },
  academic: { es: "Academico", en: "Academic" },
};

export type Project = {
  slug: string;
  name: string;
  year: string;
  kind: ProjectKind;
  stack: string[];
  tagline: Localized<string>;
  /** El contexto real: que problema existia antes del sistema. */
  problem: Localized<string>;
  /** Las restricciones que hicieron dificil el problema. */
  constraints: Localized<string[]>;
  decisions: Decision[];
  /** Resultados observables. Sin metricas inventadas. */
  outcomes: Localized<string[]>;
  /** Lo que haria distinto hoy. Nada proyecta seniority como esto. */
  retrospective: Localized<string>;
  featured?: boolean;
};

export const projects: Project[] = [
  {
    slug: "kapibook",
    name: "KapiBook",
    year: "2025",
    kind: "product",
    stack: ["NestJS", "React", "MySQL", "Multi-tenancy", "WhatsApp API", "SMTP"],
    featured: true,
    tagline: {
      es: "Sistema de citas para varios negocios. Dar de alta uno nuevo es una operacion de datos, no un despliegue.",
      en: "Appointment system for multiple businesses. Onboarding a new one is a data operation, not a deployment.",
    },
    problem: {
      es: "Varios negocios de servicios (barberias, clinicas, talleres) gestionaban citas por WhatsApp y cuaderno. Cada uno queria su propia marca, sus propios horarios y la certeza de que sus datos no se mezclaran con los de otro negocio.",
      en: "Several service businesses (barbershops, clinics, workshops) managed appointments over WhatsApp and on paper. Each wanted its own branding, its own hours, and the certainty that its data would never mix with another business's.",
    },
    constraints: {
      es: [
        "Aislamiento de datos verificable: un negocio no puede leer nada de otro, ni por error de programacion.",
        "Alta de un negocio nuevo sin desplegar codigo.",
        "Notificaciones por correo y WhatsApp con reintentos, porque una cita no notificada es una cita perdida.",
        "Un solo equipo pequeno manteniendolo: la operacion tenia que ser simple.",
      ],
      en: [
        "Verifiable data isolation: one business cannot read anything from another, not even through a programming mistake.",
        "Onboarding a new business without deploying code.",
        "Email and WhatsApp notifications with retries, because an unnotified appointment is a lost appointment.",
        "A single small team maintaining it: operations had to stay simple.",
      ],
    },
    decisions: [
      {
        title: {
          es: "Base de datos por tenant en vez de columna tenant_id",
          en: "A database per tenant instead of a tenant_id column",
        },
        why: {
          es: "El aislamiento deja de depender de que cada consulta recuerde filtrar. Un bug de programacion no puede filtrar datos entre negocios, y respaldar o migrar un cliente es una operacion independiente.",
          en: "Isolation stops depending on every query remembering to filter. A programming bug cannot leak data across businesses, and backing up or migrating one client becomes an independent operation.",
        },
        insteadOf: {
          es: "Esquema compartido con tenant_id, que es mas barato de operar pero convierte cada consulta en un riesgo de fuga y cada respaldo en un problema.",
          en: "A shared schema with tenant_id, cheaper to operate but turning every query into a leak risk and every backup into a problem.",
        },
      },
      {
        title: {
          es: "Resolucion de tenant en middleware, conexion inyectada por request",
          en: "Tenant resolution in middleware, connection injected per request",
        },
        why: {
          es: "El resto de la aplicacion se escribe como si fuera mono-tenant. La complejidad vive en un solo lugar auditable en vez de repartirse por todo el codigo.",
          en: "The rest of the application is written as if it were single-tenant. The complexity lives in one auditable place instead of being spread across the codebase.",
        },
        insteadOf: {
          es: "Pasar el tenant como parametro por las capas de servicio, que ensucia todas las firmas y se olvida justo donde importa.",
          en: "Threading the tenant as a parameter through the service layers, which pollutes every signature and gets forgotten exactly where it matters.",
        },
      },
      {
        title: {
          es: "Notificaciones como trabajos encolados, no en el request",
          en: "Notifications as queued jobs, not inside the request",
        },
        why: {
          es: "Crear una cita responde rapido y no falla porque el proveedor de WhatsApp este caido. El envio se reintenta.",
          en: "Creating an appointment responds fast and does not fail because the WhatsApp provider is down. Delivery is retried.",
        },
        insteadOf: {
          es: "Enviar el correo dentro del handler HTTP, que acopla la disponibilidad del sistema a la de un tercero.",
          en: "Sending the email inside the HTTP handler, which couples the system's availability to a third party's.",
        },
      },
    ],
    outcomes: {
      es: [
        "Alta de un negocio nuevo como operacion de datos, sin desplegar.",
        "Panel administrativo para profesionales, horarios y servicios por negocio.",
        "Confirmaciones y recordatorios por correo y WhatsApp.",
      ],
      en: [
        "Onboarding a new business as a data operation, with no deployment.",
        "Admin panel for professionals, schedules, and services per business.",
        "Confirmations and reminders over email and WhatsApp.",
      ],
    },
    retrospective: {
      es: "Base por tenant fue la decision correcta para el aislamiento, pero subestime el coste de las migraciones: aplicar un cambio de esquema a N bases necesita un runner con estado y reporte, no un script suelto. Hoy lo construiria desde el dia uno, junto con un test de integracion que intente explicitamente leer datos de otro tenant y espere fallar.",
      en: "A database per tenant was the right call for isolation, but I underestimated the cost of migrations: applying a schema change across N databases needs a stateful runner with reporting, not a loose script. Today I would build that on day one, along with an integration test that explicitly tries to read another tenant's data and expects to fail.",
    },
  },
  {
    slug: "skilllink",
    name: "SkillLink",
    year: "2025",
    kind: "product",
    stack: ["React", "PHP", "MySQL", "Geolocation", "Realtime chat"],
    featured: true,
    tagline: {
      es: "Marketplace geolocalizado de profesionales de servicios, web y movil.",
      en: "Geolocated marketplace for service professionals, web and mobile.",
    },
    problem: {
      es: "Encontrar un plomero o electricista de confianza depende de recomendaciones de boca en boca. Del otro lado, el profesional independiente no tiene forma de mostrar sus titulaciones ni de administrar su agenda.",
      en: "Finding a plumber or electrician you can trust depends on word of mouth. On the other side, the independent professional has no way to show their credentials or manage their schedule.",
    },
    constraints: {
      es: [
        "Busqueda por cercania util con volumen bajo de profesionales: sin resultados vacios.",
        "Confianza verificable, no solo estrellas: titulaciones asociadas al profesional.",
        "Chat y agenda en el mismo flujo, porque la conversacion es la que produce la cita.",
        "Misma logica para web y movil.",
      ],
      en: [
        "Proximity search that stays useful with low professional density: no empty results.",
        "Verifiable trust, not just stars: credentials attached to the professional.",
        "Chat and scheduling in the same flow, because the conversation is what produces the booking.",
        "The same logic for web and mobile.",
      ],
    },
    decisions: [
      {
        title: {
          es: "Radio de busqueda expansivo en vez de radio fijo",
          en: "An expanding search radius instead of a fixed one",
        },
        why: {
          es: "Con inventario bajo, un radio fijo devuelve pantallas vacias y el usuario se va. El radio crece hasta encontrar un minimo de resultados y la UI dice a que distancia esta cada uno.",
          en: "With low inventory a fixed radius returns empty screens and the user leaves. The radius grows until it finds a minimum number of results, and the UI states how far away each one is.",
        },
        insteadOf: {
          es: "Radio fijo de N km, mas simple de implementar y peor en el unico momento que importa: la primera busqueda del usuario nuevo.",
          en: "A fixed N-km radius, simpler to implement and worse at the only moment that matters: a new user's first search.",
        },
      },
      {
        title: {
          es: "Titulaciones como entidad propia, no como texto del perfil",
          en: "Credentials as a first-class entity, not profile text",
        },
        why: {
          es: "Permite verificarlas, fecharlas y filtrar por ellas. La confianza es el producto real de un marketplace de servicios.",
          en: "It makes them verifiable, datable, and filterable. Trust is the real product of a services marketplace.",
        },
        insteadOf: {
          es: "Un campo libre de 'certificaciones' en el perfil, imposible de verificar y de filtrar.",
          en: "A free-text 'certifications' field on the profile, impossible to verify or filter.",
        },
      },
      {
        title: {
          es: "Agenda derivada de disponibilidad + reservas, no de slots pregenerados",
          en: "Availability derived from hours plus bookings, not pregenerated slots",
        },
        why: {
          es: "Cambiar el horario de un profesional no obliga a regenerar ni reconciliar miles de filas de slots.",
          en: "Changing a professional's hours never forces regenerating or reconciling thousands of slot rows.",
        },
        insteadOf: {
          es: "Generar slots concretos por adelantado, facil de consultar y doloroso de mantener cuando la disponibilidad cambia.",
          en: "Generating concrete slots up front — easy to query and painful to maintain whenever availability changes.",
        },
      },
    ],
    outcomes: {
      es: [
        "Busqueda por geolocalizacion con perfiles, servicios y titulaciones.",
        "Chat integrado y agenda de citas en el mismo flujo.",
        "Cliente web y movil sobre la misma API.",
      ],
      en: [
        "Geolocation search with profiles, services, and credentials.",
        "Integrated chat and appointment scheduling in a single flow.",
        "Web and mobile clients over the same API.",
      ],
    },
    retrospective: {
      es: "El calculo de distancia se resolvio en la aplicacion. Con mas volumen habria que empujarlo a indices espaciales en la base de datos; hacerlo antes de tener el volumen habria sido optimizar a ciegas, pero deje el limite documentado en vez de descubrirlo en produccion.",
      en: "Distance was computed in the application layer. At higher volume it would need to move to spatial indexes in the database; doing that before having the volume would have been optimizing blind, but I documented the limit rather than discovering it in production.",
    },
  },
  {
    slug: "licensing-app",
    name: "Licensing App",
    year: "2026",
    kind: "work",
    stack: ["PHP", "React", "MySQL", "Docker", "Linux", "Multi-domain"],
    featured: true,
    tagline: {
      es: "Gestion de licencias y permisos operativos. Trabajo actual en produccion.",
      en: "Operational licensing and permit management. Current work, in production.",
    },
    problem: {
      es: "Operar un negocio de catering regulado exige mantener vigente un conjunto de licencias y permisos con fechas, jurisdicciones y responsables distintos. Vencer una licencia detiene la operacion.",
      en: "Running a regulated catering business requires keeping a set of licenses and permits current, each with its own dates, jurisdictions, and owners. One expired license halts operations.",
    },
    constraints: {
      es: [
        "Sistema en produccion con usuarios reales: los cambios se despliegan sin ventana de mantenimiento.",
        "Todo Pull Request pasa por revision de QA antes de produccion.",
        "Varios dominios servidos desde una misma base de codigo.",
        "Equipo distribuido y en ingles: los requerimientos se levantan en reuniones con el cliente.",
      ],
      en: [
        "A production system with real users: changes ship without a maintenance window.",
        "Every Pull Request goes through QA review before production.",
        "Several domains served from a single codebase.",
        "A distributed, English-speaking team: requirements are gathered in client meetings.",
      ],
    },
    decisions: [
      {
        title: {
          es: "Ramas por funcionalidad, integracion en develop, promocion por main",
          en: "Feature branches, integration in develop, promotion through main",
        },
        why: {
          es: "Da un punto de control unico antes de produccion y hace que revertir sea una operacion de git, no una arqueologia. Lo implante en el flujo del equipo.",
          en: "It gives one control point before production and makes reverting a git operation rather than archaeology. I introduced it into the team's workflow.",
        },
        insteadOf: {
          es: "Commits directos a la rama principal, mas rapido por desarrollador y sin ningun lugar donde QA pueda detener un cambio malo.",
          en: "Committing straight to the main branch — faster per developer, and with nowhere for QA to stop a bad change.",
        },
      },
      {
        title: {
          es: "Docker como entorno de desarrollo, identico al de produccion",
          en: "Docker as the development environment, identical to production",
        },
        why: {
          es: "Elimina la clase entera de fallos 'en mi maquina funciona' y hace que un desarrollador nuevo arranque el mismo dia.",
          en: "It eliminates the entire 'works on my machine' class of failures and gets a new developer running the same day.",
        },
        insteadOf: {
          es: "Entornos locales instalados a mano, que divergen en silencio hasta que rompen un despliegue.",
          en: "Hand-installed local environments, which drift silently until they break a deployment.",
        },
      },
    ],
    outcomes: {
      es: [
        "Funcionalidades entregadas en produccion bajo revision de QA.",
        "Flujo de ramas adoptado por el equipo.",
        "Requerimientos levantados directamente con clientes de habla inglesa.",
      ],
      en: [
        "Features shipped to production under QA review.",
        "Branching workflow adopted by the team.",
        "Requirements gathered directly with English-speaking clients.",
      ],
    },
    retrospective: {
      es: "Es el proyecto donde mas aprendi que la parte dificil no es escribir la funcionalidad, sino entregarla sin romper lo que ya funciona. El detalle del dominio del cliente es confidencial; aqui documento el enfoque de ingenieria, no sus datos.",
      en: "This is the project where I learned most that the hard part is not writing the feature, but shipping it without breaking what already works. The client's domain detail is confidential; what I document here is the engineering approach, not their data.",
    },
  },
  {
    slug: "carniceria-la-bendicion",
    name: "Carniceria La Bendicion",
    year: "2024",
    kind: "client",
    stack: ["PHP", "MySQL", "Bootstrap"],
    tagline: {
      es: "E-commerce y panel de administracion para un negocio local real.",
      en: "E-commerce and admin panel for a real local business.",
    },
    problem: {
      es: "Una carniceria de barrio tomaba pedidos por telefono y WhatsApp. Se perdian pedidos, no habia registro y el inventario vivia en la cabeza del dueno.",
      en: "A neighborhood butcher shop took orders by phone and WhatsApp. Orders got lost, nothing was recorded, and inventory lived in the owner's head.",
    },
    constraints: {
      es: [
        "El panel lo usa gente que no es tecnica: si necesita capacitacion, fracasa.",
        "Presupuesto y hosting de negocio pequeno: nada que cueste una cuota mensual alta.",
        "Productos que se venden por peso, no por unidad.",
      ],
      en: [
        "The panel is used by non-technical people: if it needs training, it fails.",
        "Small-business budget and hosting: nothing with a high monthly fee.",
        "Products sold by weight, not by unit.",
      ],
    },
    decisions: [
      {
        title: {
          es: "Precio por unidad de medida en el modelo, no en la vista",
          en: "Price per unit of measure in the model, not in the view",
        },
        why: {
          es: "Un producto vendido por kilo y otro por unidad son el mismo concepto con distinta unidad. Modelarlo en los datos evita que cada pantalla reinvente el calculo del total.",
          en: "A product sold by the kilo and one sold by the unit are the same concept with a different unit. Modeling that in the data keeps every screen from reinventing the total calculation.",
        },
        insteadOf: {
          es: "Tratar todo como unidades y arreglar el caso del peso en el frontend, que garantiza que dos pantallas terminen calculando distinto.",
          en: "Treating everything as units and patching the weight case in the frontend, which guarantees two screens eventually compute different totals.",
        },
      },
      {
        title: {
          es: "Stack PHP + MySQL sobre hosting compartido",
          en: "A PHP + MySQL stack on shared hosting",
        },
        why: {
          es: "Es lo que el negocio puede pagar y mantener. La eleccion tecnica correcta es la que sigue viva cuando yo ya no estoy.",
          en: "It is what the business can pay for and maintain. The right technical choice is the one still alive after I am gone.",
        },
        insteadOf: {
          es: "Un stack moderno con contenedores y CI, mas comodo para mi y una carga que el cliente no puede sostener.",
          en: "A modern stack with containers and CI — more comfortable for me, and a burden the client cannot sustain.",
        },
      },
    ],
    outcomes: {
      es: [
        "Modulo de pedidos para clientes finales.",
        "Panel de administracion de productos, categorias, usuarios y pedidos.",
      ],
      en: [
        "Ordering module for end customers.",
        "Admin panel for products, categories, users, and orders.",
      ],
    },
    retrospective: {
      es: "El proyecto que mas me enseno sobre restricciones no tecnicas. Tuve que elegir la opcion aburrida a proposito, y fue la correcta.",
      en: "The project that taught me most about non-technical constraints. I had to choose the boring option on purpose, and it was the right one.",
    },
  },
  {
    slug: "ticowallet",
    name: "TicoWallet",
    year: "2024",
    kind: "academic",
    stack: ["Kotlin", ".NET", "SQL Server"],
    tagline: {
      es: "App financiera movil nativa con backend .NET.",
      en: "Native mobile finance app with a .NET backend.",
    },
    problem: {
      es: "Llevar control de gastos personales en una app movil nativa, con un backend que sostenga la sincronizacion entre dispositivo y servidor.",
      en: "Tracking personal expenses in a native mobile app, with a backend that supports synchronization between device and server.",
    },
    constraints: {
      es: [
        "El dispositivo movil puede estar sin conexion cuando el usuario registra un gasto.",
        "El dinero no admite errores de redondeo.",
      ],
      en: [
        "The mobile device may be offline when the user records an expense.",
        "Money does not tolerate rounding errors.",
      ],
    },
    decisions: [
      {
        title: {
          es: "Montos en enteros de la unidad minima, nunca en punto flotante",
          en: "Amounts as integers of the smallest unit, never floating point",
        },
        why: {
          es: "Los decimales binarios no representan dinero de forma exacta y el error se acumula en cada suma.",
          en: "Binary decimals cannot represent money exactly, and the error compounds with every addition.",
        },
        insteadOf: {
          es: "Usar float o double porque es el tipo por defecto, y descubrir el desfase cuando ya hay datos reales.",
          en: "Using float or double because it is the default type, and discovering the drift once there is real data.",
        },
      },
    ],
    outcomes: {
      es: ["App movil nativa en Kotlin sobre API .NET y SQL Server."],
      en: ["Native Kotlin mobile app over a .NET API and SQL Server."],
    },
    retrospective: {
      es: "Proyecto academico, y lo etiqueto como tal. Su valor fue tocar un stack Microsoft y movil nativo de punta a punta.",
      en: "An academic project, and I label it as such. Its value was touching a Microsoft and native-mobile stack end to end.",
    },
  },
];

export const featuredProjects = projects.filter((p) => p.featured);

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}
