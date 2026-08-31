# Portafolio — Glend Rojas Alvarado

Portafolio de ingenieria con sesgo backend. No es una galeria de capturas: la
pieza central es una **API multi-tenant real y ejecutable** desde el navegador.

## Correr en local

```bash
npm install
npm run dev          # http://localhost:3000
```

## Verificacion

```bash
npm run check        # typecheck + lint + tests
npm run build
```

CI ejecuta lo mismo en cada Pull Request (`.github/workflows/ci.yml`).

## Idiomas

El sitio se sirve en espanol e ingles con **rutas por idioma**: `/es/...` y
`/en/...` son URLs reales, prerenderizadas y enlazadas entre si con `hreflang`
mas `x-default`. No hay conmutador de cliente sobre una sola URL.

- `src/middleware.ts` redirige toda URL sin idioma. Prioridad: **cookie del
  usuario > Accept-Language (con q-values) > `es`**.
- El conmutador conserva la ruta actual (`/en/proyectos/kapibook` →
  `/es/proyectos/kapibook`) y persiste la eleccion con una Server Action.
- `src/i18n/dictionaries.ts` deriva el tipo del diccionario del espanol: una
  clave sin traducir **rompe la compilacion**.
- La API no se localiza en la ruta. Negocia el idioma del texto de error por
  `Accept-Language` y lo declara con `content-language`, manteniendo `type`
  estable (ver abajo).

## Estructura

```
src/
├── middleware.ts                 Negociacion de idioma para URLs sin locale
├── app/
│   ├── [locale]/
│   │   ├── page.tsx              Home
│   │   ├── proyectos/[slug]/     Case studies: problema → restricciones →
│   │   │                         decisiones (y las descartadas) → retrospectiva
│   │   ├── playground/           Pieza central: la API multi-tenant en vivo
│   │   └── sobre-mi/
│   └── api/demo/                 Route handlers (sin locale: un solo contrato)
├── components/
│   ├── ui/                       Primitivas del design system
│   ├── api-playground.tsx        Componente cliente del playground
│   └── locale-switcher.tsx       Conmutador de idioma
├── content/                      Contenido tipado y bilingue
├── i18n/                         Config, diccionarios y Server Action
└── lib/demo/                     Dominio de la API: tenants, agenda, HTTP
```

## La API de demostracion

Una reduccion de la arquitectura de KapiBook a lo esencial.

| Metodo | Ruta | Nota |
| --- | --- | --- |
| GET | `/api/demo/tenants` | Unico endpoint sin tenant |
| GET | `/api/demo/services` | Requiere `x-tenant` |
| GET | `/api/demo/availability?date=YYYY-MM-DD` | Slots derivados, no pregenerados |
| GET | `/api/demo/appointments` | Solo las del tenant de la cabecera |
| POST | `/api/demo/appointments` | Valida con Zod, 409 en conflicto |

```bash
curl -H 'x-tenant: barberia-nostromo' localhost:3000/api/demo/services

# Mismo `type`, texto en el idioma pedido:
curl -H 'x-tenant: barberia-nostromo' -H 'accept-language: en' \
     localhost:3000/api/demo/availability?date=nope
```

Principios que aplica:

- **Aislamiento estructural.** El mapa de tenants vive en un solo modulo; el
  dominio recibe un almacen ya resuelto y no puede alcanzar otro.
- **Validacion en el borde** con Zod antes de tocar el dominio.
- **Errores RFC 7807** (`application/problem+json`), con `type` estable y
  `title`/`detail` negociados por `Accept-Language`.
- **Rate limiting por tenant**, reportado en cabeceras `x-ratelimit-*`.
- **Reglas cubiertas por tests** — aislamiento, solapamiento y horario.

Limite conocido: el estado vive en memoria del proceso. Sustituirlo por una
conexion por tenant no cambia una linea del dominio, que es lo que la
arquitectura debia demostrar.

## Despliegue

**Vercel** es el destino por defecto. El repositorio tambien incluye un
`Dockerfile` multi-stage funcional (`output: "standalone"`), asi que el sitio
corre en cualquier host con Docker:

```bash
docker build -t portafolio . && docker run -p 3000:3000 portafolio
```
