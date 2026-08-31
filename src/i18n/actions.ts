"use server";

import { cookies } from "next/headers";
import { LOCALE_COOKIE, isLocale } from "./config";

/**
 * La preferencia de idioma se persiste en el servidor, no manipulando
 * document.cookie desde el cliente. Asi el middleware la lee en la siguiente
 * visita a una URL sin idioma y la entrada es validada: el argumento viene del
 * cliente y no se escribe en la cookie sin comprobarlo.
 */
export async function setLocale(locale: string): Promise<void> {
  if (!isLocale(locale)) return;

  const store = await cookies();
  store.set(LOCALE_COOKIE, locale, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
  });
}
