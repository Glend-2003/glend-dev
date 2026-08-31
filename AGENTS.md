# Notas para agentes

- Español sin tildes en el contenido del código para evitar problemas de
  codificación en shells y editores; el texto visible sí usa acentuación normal
  cuando es seguro. Mantener consistencia con lo existente.
- `npm run check` (typecheck + lint + tests) debe pasar antes de cualquier commit.
- TypeScript estricto con `noUncheckedIndexedAccess`: no silenciar con `!` ni `any`.
- Server Components por defecto. Solo `api-playground.tsx` es cliente.
- Sin métricas inventadas en el contenido. Si un dato no se puede verificar, no
  se publica.
- No añadir dependencias sin una razón clara; el stack se mantiene mínimo.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
