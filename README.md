# Full Box

Sitio web informativo de **Full Box** — cajas de cartón y packaging a medida.
Por ahora es un sitio informativo (catálogo leído desde Supabase). Posible e-commerce a futuro.

## Stack

- Next.js 16 (App Router, Turbopack) + React 19 + TypeScript strict
- Tailwind CSS v4 + shadcn/ui (base-color `neutral`)
- Supabase (`@supabase/ssr`) — solo lectura del catálogo por ahora

Las reglas de arquitectura y código del proyecto están en [`ai-pmp/`](ai-pmp/) y la hoja de
ruta viva en [`CLAUDE.md`](CLAUDE.md). Leerlas antes de tocar código.

## Puesta en marcha

```bash
npm install
cp .env.example .env.local   # completar con las credenciales de Supabase
npm run dev                  # http://localhost:3000
```

## Comandos

```bash
npm run dev         # servidor de desarrollo
npm run build       # build de producción
npm run typecheck   # tsc --noEmit
npm run lint        # eslint
```

## Estructura

```
src/
  app/                  rutas, layouts, páginas (Server Components por defecto)
  features/             módulos por dominio
    landing/            sección Hero y home
    productos/          DAL del catálogo (queries.ts), tipos
  shared/components/ui/ componentes shadcn/ui (dumb)
  lib/                  utils (cn), format-currency
  integrations/supabase browser + server client, tipos de la base
```
