# KNOW-HOW Next.js — Kit de arranque de ecommerce

Plantilla base para iniciar ecommerce con Next.js 16 + Supabase + Mercado Pago, y para onboarding del equipo. Esta carpeta NO es un proyecto — es el origen del que se copia todo al arrancar uno.

## Procedimiento al iniciar un proyecto nuevo

1. Crear la carpeta del proyecto y dentro la carpeta `ai-pmp/`
2. Copiar los 8 archivos `.txt` de reglas a `[proyecto]/ai-pmp/`:
   `rules.txt`, `frontend-rules.txt`, `supabase-rules.txt`, `ecommerce-rules.txt`, `payments-rules.txt`, `error-handling.txt`, `naming-rules.txt`, `git-rules.txt`
3. Copiar `CLAUDE.md` a la **raíz** del proyecto (Claude lo lee automáticamente solo si está en la raíz)
4. Completar en `CLAUDE.md` todos los campos entre `[corchetes]`: nombre, cliente, descripción, módulos, roles y nomenclatura de keys
5. Usar el prompt "1. INICIO DE PROYECTO" de `nuvvora-prompts.txt` para la primera sesión

> **Importante**: el `CLAUDE.md` referencia las reglas en `ai-pmp/` — si los `.txt` quedan en otra ruta, la IA no los encuentra y falla en silencio.

## Contenido del kit

| Archivo | Para qué sirve | ¿Se copia al proyecto? |
|---------|----------------|------------------------|
| `CLAUDE.md` | Memoria viva del proyecto, leída por Claude en cada sesión | Sí, a la raíz |
| `rules.txt` | Stack, arquitectura Server-first y reglas de código | Sí, a `ai-pmp/` |
| `frontend-rules.txt` | Server/Client Components, formularios, estado, RBAC, SEO | Sí, a `ai-pmp/` |
| `supabase-rules.txt` | @supabase/ssr, RLS, seguridad, queries | Sí, a `ai-pmp/` |
| `ecommerce-rules.txt` | Catálogo, carrito, checkout, stock, órdenes | Sí, a `ai-pmp/` |
| `payments-rules.txt` | Integración y seguridad de Mercado Pago | Sí, a `ai-pmp/` |
| `error-handling.txt` | Manejo de errores y estados de carga | Sí, a `ai-pmp/` |
| `naming-rules.txt` | Convenciones de nombres | Sí, a `ai-pmp/` |
| `git-rules.txt` | Commits, ramas y .gitignore | Sí, a `ai-pmp/` |
| `nuvvora-prompts.txt` | Prompts base para cada etapa | No — es para uso humano |

## Diferencias clave respecto al kit de React + Vite

Si venís del kit de Vite, esto es lo que cambia de fondo:

* **Server-first**: los componentes son Server por defecto. `"use client"` solo para interactividad. Las lecturas se hacen en el server (DAL), no con React Query.
* **React Query deja de ser el default**: se usa solo para estado de cliente (carrito, optimistic). Las mutaciones van por Server Actions.
* **Auth con `@supabase/ssr`** (tres clientes: browser, server, proxy), no el cliente único de Vite. Usar `getUser()`, nunca `getSession()`, para decisiones de auth.
* **`proxy.ts` reemplaza a `middleware.ts`** (Next 16). Y NO es la barrera de seguridad: la autorización vive en el DAL + RLS (lección de la CVE-2025-29927).
* **Variables de entorno**: prefijo `NEXT_PUBLIC_` (no `VITE_`). Los secretos van SIN prefijo.
* **SEO real**: ISR + `generateStaticParams` + `generateMetadata` para el catálogo. Esto es lo que justifica usar Next para un ecommerce.
* **Pagos**: el total se calcula en el server y el webhook de Mercado Pago se valida por firma y se re-consulta. Es la parte más delicada del sistema.

## Mantenimiento del kit

* Cuando un proyecto descubre una regla que vale para todos, traerla acá — esta carpeta es la fuente de verdad.
* Revisar la sección de stack de `rules.txt` cuando cambien las versiones (Next, Supabase SSR, SDK de Mercado Pago) y anotar la fecha.
* Verificar periódicamente que el patrón de validación del webhook de Mercado Pago sigue vigente en su doc oficial.
* Última revisión general del kit: 2026-06-17 (Next.js 16.2, @supabase/ssr, Mercado Pago Checkout Pro).
```
