import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import path from "node:path";

/**
 * El fondo de escritorio aclara la base con un resplandor, y eso reduce el
 * contraste del texto. Estos tests fijan el minimo AA (4.5:1) sobre la zona
 * MAS iluminada, no sobre el fondo puro: subir el resplandor sin aclarar el
 * texto rompe la build en vez de degradar la legibilidad en silencio.
 */

function srgbToLinear(channel: number): number {
  const c = channel / 255;
  return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
}

function luminance(hex: string): number {
  const h = hex.replace("#", "");
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16));
  return (
    0.2126 * srgbToLinear(r!) + 0.7152 * srgbToLinear(g!) + 0.0722 * srgbToLinear(b!)
  );
}

function contrast(a: string, b: string): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi! + 0.05) / (lo! + 0.05);
}

/** Mezcla plana, como hace color-mix sobre el fondo. */
function mix(fg: string, bg: string, pct: number): string {
  const f = fg.replace("#", "");
  const b = bg.replace("#", "");
  return (
    "#" +
    [0, 2, 4]
      .map((i) => {
        const v = Math.round(
          pct * parseInt(f.slice(i, i + 2), 16) +
            (1 - pct) * parseInt(b.slice(i, i + 2), 16),
        );
        return v.toString(16).padStart(2, "0");
      })
      .join("")
  );
}

const css = readFileSync(path.join(process.cwd(), "src/app/globals.css"), "utf8");

/** Lee un token del bloque :root indicado, para que los tests no se desincronicen. */
function token(name: string, scope: "dark" | "light"): string {
  const block =
    scope === "dark"
      ? css.slice(0, css.indexOf("@media (prefers-color-scheme: light)"))
      : css.slice(css.indexOf("@media (prefers-color-scheme: light)"));
  const m = block.match(new RegExp(`--${name}:\\s*(#[0-9a-f]{6})`, "i"));
  if (!m?.[1]) throw new Error(`token --${name} no encontrado en ${scope}`);
  return m[1];
}

/** Porcentaje del foco de resplandor mas intenso declarado en el CSS. */
function strongestGlowPct(): number {
  const pcts = [...css.matchAll(/color-mix\(in oklab, var\(--accent\) (\d+)%/g)].map(
    (m) => Number(m[1]),
  );
  expect(pcts.length).toBeGreaterThan(0);
  return Math.max(...pcts) / 100;
}

describe("contraste sobre el fondo de escritorio", () => {
  it("el texto cumple AA en tema oscuro, incluso sobre el resplandor", () => {
    const bg = token("bg", "dark");
    const accent = token("accent", "dark");
    const brightest = mix(accent, bg, strongestGlowPct());

    for (const name of ["fg", "fg-muted", "fg-subtle"]) {
      expect(contrast(token(name, "dark"), brightest)).toBeGreaterThanOrEqual(4.5);
    }
  });

  it("el texto cumple AA en tema claro", () => {
    const bg = token("bg", "light");
    for (const name of ["fg", "fg-muted", "fg-subtle"]) {
      expect(contrast(token(name, "light"), bg)).toBeGreaterThanOrEqual(4.5);
    }
  });
});
