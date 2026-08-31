import type { Localized } from "@/i18n/config";

export const profile = {
  name: "Glend Rojas Alvarado",
  location: "Heredia, Costa Rica",
  email: "glendrojas1040@gmail.com",
  github: "https://github.com/Glend-2003",
  /**
   * Un PDF por idioma. Se sirven desde public/, asi que en Cloudflare son
   * assets estaticos: no ejecutan el Worker ni consumen cuota de peticiones.
   */
  cv: {
    es: "/cv/glend-rojas-cv-es.pdf",
    en: "/cv/glend-rojas-cv-en.pdf",
  } satisfies Localized<string>,
  linkedin: "https://www.linkedin.com/in/glendrojas",
  role: {
    es: "Ingeniero de Software · Backend-leaning Full Stack",
    en: "Software Engineer · Backend-leaning Full Stack",
  } satisfies Localized<string>,
  /**
   * El titular nombra trabajo concreto en vez de vender una frase de efecto:
   * un sistema real en produccion y otro que el visitante puede abrir. Las
   * afirmaciones se sostienen en los case studies, no en el adjetivo.
   */
  pitch: {
    es: "Desarrollo backends. Ahora mismo, un sistema de licencias en produccion; antes, KapiBook, un sistema de citas con la base de datos aislada por negocio.",
    en: "I build backends. Right now, a licensing system in production; before that, KapiBook, an appointment system with a database isolated per business.",
  } satisfies Localized<string>,
  summary: {
    es: "Ingeniero en Sistemas de Informacion (UNA, Costa Rica). Trabajo full stack con PHP, React y MySQL sobre Linux y Docker en Orlando Caterers & Commissary, en flujos Scrum con revision de Pull Requests antes de produccion. Prefiero el lado del servidor. Ahi se decide el modelo de datos, que es lo que mas cuesta cambiar cuando el sistema ya tiene usuarios.",
    en: "Information Systems Engineer (UNA, Costa Rica). I work full stack with PHP, React, and MySQL on Linux and Docker at Orlando Caterers & Commissary, in Scrum workflows with Pull Request review before production. I prefer the server side. That is where the data model gets decided, and the data model is the hardest thing to change once a system has users.",
  } satisfies Localized<string>,
  languages: [
    {
      name: { es: "Espanol", en: "Spanish" },
      level: { es: "Nativo", en: "Native" },
    },
    {
      name: { es: "Ingles", en: "English" },
      level: {
        es: "B2 — reuniones tecnicas con clientes en EE. UU.",
        en: "B2 — technical meetings with clients in the US",
      },
    },
  ],
  certifications: [
    {
      name: {
        es: "Scrum Foundation Professional Certification (SFPC)",
        en: "Scrum Foundation Professional Certification (SFPC)",
      },
      org: "CertiProf",
      year: 2024,
    },
    {
      name: { es: "English for IT 1", en: "English for IT 1" },
      org: "Cisco Networking Academy / OpenEDG",
      year: 2025,
    },
  ],
} as const;

export type SkillGroup = {
  label: Localized<string>;
  /** Sin porcentajes. El nivel se declara en palabras y se demuestra en los proyectos. */
  items: { name: string; note?: Localized<string> }[];
};

export const skills: SkillGroup[] = [
  {
    label: { es: "Backend", en: "Backend" },
    items: [
      {
        name: "NestJS",
        note: { es: "KapiBook, multi-tenant", en: "KapiBook, multi-tenant" },
      },
      { name: "Laravel / PHP", note: { es: "produccion diaria", en: "daily in production" } },
      { name: "Spring Boot" },
      { name: ".NET" },
      { name: "Django" },
    ],
  },
  {
    label: { es: "Datos", en: "Data" },
    items: [
      {
        name: "MySQL",
        note: {
          es: "modelado y consultas en produccion",
          en: "modeling and queries in production",
        },
      },
      { name: "SQL Server" },
      { name: "MongoDB" },
      { name: "Oracle" },
      { name: "SQLite" },
    ],
  },
  {
    label: { es: "Frontend", en: "Frontend" },
    items: [
      { name: "React", note: { es: "produccion diaria", en: "daily in production" } },
      { name: "Next.js", note: { es: "App Router, RSC", en: "App Router, RSC" } },
      { name: "Angular" },
      { name: "TypeScript" },
      { name: "Tailwind CSS" },
    ],
  },
  {
    label: { es: "Plataforma", en: "Platform" },
    items: [
      { name: "Docker" },
      { name: "Linux" },
      {
        name: "Git / GitHub",
        note: {
          es: "trunk-based con ramas por feature",
          en: "trunk-based with feature branches",
        },
      },
      { name: "Scrum / Kanban" },
      { name: "Pull Request review" },
    ],
  },
];

export type TimelineEntry = {
  period: Localized<string>;
  title: Localized<string>;
  org: Localized<string>;
  points: Localized<string[]>;
};

export const timeline: TimelineEntry[] = [
  {
    period: { es: "Dic. 2025 — Actualidad", en: "Dec. 2025 — Present" },
    title: {
      es: "Desarrollador de Software Full Stack",
      en: "Full Stack Software Developer",
    },
    org: {
      es: "Orlando Caterers & Commissary · Remoto, Orlando FL",
      en: "Orlando Caterers & Commissary · Remote, Orlando FL",
    },
    points: {
      es: [
        "Funcionalidades full stack con PHP, React y MySQL sobre Linux y Docker.",
        "Scrum y Kanban, con revision de Pull Requests por QA antes de produccion.",
        "Implante un flujo de ramas por funcionalidad con integracion en develop y promocion por main.",
        "Sitios multidominio y reuniones de requerimientos con clientes de habla inglesa.",
      ],
      en: [
        "Full stack features with PHP, React, and MySQL on Linux and Docker.",
        "Scrum and Kanban, with QA review of Pull Requests before production.",
        "Introduced a feature-branch workflow integrating into develop and promoting through main.",
        "Multi-domain sites, and requirements meetings with English-speaking clients.",
      ],
    },
  },
  {
    period: { es: "2022 — Jun. 2026", en: "2022 — Jun. 2026" },
    title: {
      es: "Bachillerato en Ingenieria en Sistemas de Informacion",
      en: "B.Sc. in Information Systems Engineering",
    },
    org: {
      es: "Universidad Nacional de Costa Rica · Heredia",
      en: "Universidad Nacional de Costa Rica · Heredia",
    },
    points: {
      es: [
        "Estudios concluidos en junio de 2026; titulo a recibir en noviembre de 2026.",
        "Programacion orientada a objetos, patrones arquitectonicos (MVC, MVVM), bases de datos y metodologias agiles.",
      ],
      en: [
        "Coursework completed in June 2026; degree conferred in November 2026.",
        "Object-oriented programming, architectural patterns (MVC, MVVM), databases, and agile methodologies.",
      ],
    },
  },
];
