import { describe, expect, it } from "vitest";
import { getDictionary } from "./dictionaries";
import { isLocale, locales } from "./config";
import { projects } from "@/content/projects";
import { profile, skills, timeline } from "@/content/profile";

describe("locales", () => {
  it("reconoce solo los idiomas soportados", () => {
    expect(isLocale("es")).toBe(true);
    expect(isLocale("en")).toBe(true);
    expect(isLocale("fr")).toBe(false);
    expect(isLocale("")).toBe(false);
  });
});

/**
 * El compilador ya garantiza que no falte ninguna CLAVE. Estos tests cubren lo
 * que el tipo no puede ver: que ninguna traduccion se dejo vacia o pegada del
 * otro idioma por descuido.
 */
describe("cobertura de traduccion", () => {
  it("ningun texto del diccionario queda vacio", () => {
    for (const locale of locales) {
      const empty: string[] = [];
      const walk = (node: unknown, path: string) => {
        if (typeof node === "string") {
          if (node.trim() === "") empty.push(path);
          return;
        }
        if (Array.isArray(node)) {
          node.forEach((v, i) => walk(v, `${path}[${i}]`));
          return;
        }
        if (node && typeof node === "object") {
          for (const [k, v] of Object.entries(node)) walk(v, `${path}.${k}`);
        }
      };
      walk(getDictionary(locale), locale);
      expect(empty).toEqual([]);
    }
  });

  it("cada proyecto esta traducido en los dos idiomas", () => {
    for (const p of projects) {
      for (const locale of locales) {
        expect(p.tagline[locale].length).toBeGreaterThan(0);
        expect(p.problem[locale].length).toBeGreaterThan(0);
        expect(p.retrospective[locale].length).toBeGreaterThan(0);
        expect(p.constraints[locale].length).toBeGreaterThan(0);
        expect(p.outcomes[locale].length).toBeGreaterThan(0);
      }
      // Las listas deben tener el mismo numero de elementos en ambos idiomas.
      expect(p.constraints.es).toHaveLength(p.constraints.en.length);
      expect(p.outcomes.es).toHaveLength(p.outcomes.en.length);

      for (const d of p.decisions) {
        for (const locale of locales) {
          expect(d.title[locale].length).toBeGreaterThan(0);
          expect(d.why[locale].length).toBeGreaterThan(0);
          expect(d.insteadOf[locale].length).toBeGreaterThan(0);
        }
      }
    }
  });

  it("el perfil esta traducido en los dos idiomas", () => {
    for (const locale of locales) {
      expect(profile.pitch[locale].length).toBeGreaterThan(0);
      expect(profile.summary[locale].length).toBeGreaterThan(0);
      expect(profile.role[locale].length).toBeGreaterThan(0);
    }
    for (const t of timeline) {
      expect(t.points.es).toHaveLength(t.points.en.length);
    }
    for (const g of skills) {
      expect(g.label.es.length).toBeGreaterThan(0);
      expect(g.label.en.length).toBeGreaterThan(0);
    }
  });

  it("los textos largos difieren realmente entre idiomas", () => {
    // Una traduccion identica al espanol casi siempre es un copiar-pegar olvidado.
    for (const p of projects) {
      expect(p.problem.en).not.toBe(p.problem.es);
      expect(p.tagline.en).not.toBe(p.tagline.es);
    }
    expect(profile.pitch.en).not.toBe(profile.pitch.es);
    expect(profile.summary.en).not.toBe(profile.summary.es);
  });
});

/**
 * Los enlaces de contacto son la unica parte del sitio cuyo fallo no se ve:
 * un href a "https://github.com/" renderiza igual de bien y lleva a ninguna
 * parte. Se verifican aqui para que no dependa de que alguien los pulse.
 */
describe("enlaces de contacto", () => {
  it("apuntan a perfiles concretos, no a la raiz del sitio", () => {
    expect(profile.github).toMatch(/^https:\/\/github\.com\/.+/);
    expect(profile.linkedin).toMatch(/^https:\/\/www\.linkedin\.com\/in\/.+/);
  });

  it("usan https explicito", () => {
    // Sin esquema, Next lo trataria como ruta relativa del propio sitio.
    for (const url of [profile.github, profile.linkedin]) {
      expect(url.startsWith("https://")).toBe(true);
    }
  });

  it("el correo es una direccion valida", () => {
    expect(profile.email).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
  });
});

/**
 * Un enlace roto al CV es el peor fallo posible del sitio: el visitante que lo
 * pulsa es exactamente el que mas interesa. Se comprueba que el archivo existe
 * en disco, no solo que la ruta este escrita.
 */
describe("CV descargable", () => {
  it("existe un PDF por idioma y no esta vacio", async () => {
    const { statSync } = await import("node:fs");
    const path = await import("node:path");

    for (const locale of locales) {
      const href = profile.cv[locale];
      expect(href.endsWith(".pdf")).toBe(true);

      const file = path.join(process.cwd(), "public", href);
      const stat = statSync(file);
      expect(stat.isFile()).toBe(true);
      // Un PDF de una pagina ronda los 50 KB; por debajo de 10 KB algo fallo.
      expect(stat.size).toBeGreaterThan(10_000);
    }
  });

  it("cada idioma apunta a un archivo distinto", () => {
    expect(profile.cv.es).not.toBe(profile.cv.en);
  });
});
