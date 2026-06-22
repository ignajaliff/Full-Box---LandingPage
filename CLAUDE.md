# CLAUDE.md — Hoja de ruta del proyecto (Next.js E-commerce)

> Este archivo es leído automáticamente por Claude al iniciar cualquier conversación en este proyecto.
> Contiene el contexto del sistema, las decisiones tomadas y el estado actual del desarrollo.
> **Mantenerlo actualizado es obligatorio** — es la memoria del proyecto entre sesiones.
> Al iniciar un proyecto nuevo: completar todos los campos entre [corchetes] antes de la primera sesión.

---

## Proyecto

**Nombre**: Full Box
**Tipo**: Página web informativa de productos (cajas / packaging). Posible e-commerce a futuro (NO confirmado).
**Cliente**: [a definir]
**Desarrollado por**: [a definir]
**Inicio**: 2026-06-20

### Descripción del sistema

Sitio informativo de Full Box, empresa de cajas de cartón y packaging a medida para
e-commerce, retail e industria. Muestra el catálogo de productos (leído desde Supabase) y
secciones institucionales. **Por ahora NO vende online**: sin carrito, checkout ni pagos.

> Decisión de alcance: la infraestructura inicial es la de un sitio informativo server-rendered,
> NO el stack ecommerce completo. Si el e-commerce se confirma, se incorporan carrito, checkout,
> Mercado Pago, auth y React Query siguiendo las reglas de `ai-pmp/`.

---

## Reglas del proyecto

Este proyecto respeta estrictamente los siguientes documentos. Leerlos antes de hacer cualquier cambio:

* [ai-pmp/rules.txt](ai-pmp/rules.txt) — Stack, arquitectura Server-first y reglas de código
* [ai-pmp/frontend-rules.txt](ai-pmp/frontend-rules.txt) — Server/Client Components, formularios, estado, RBAC, SEO
* [ai-pmp/supabase-rules.txt](ai-pmp/supabase-rules.txt) — @supabase/ssr, RLS, seguridad, queries
* [ai-pmp/ecommerce-rules.txt](ai-pmp/ecommerce-rules.txt) — Catálogo, carrito, checkout, stock, órdenes
* [ai-pmp/payments-rules.txt](ai-pmp/payments-rules.txt) — Integración y seguridad de Mercado Pago
* [ai-pmp/error-handling.txt](ai-pmp/error-handling.txt) — Manejo de errores y estados de carga
* [ai-pmp/naming-rules.txt](ai-pmp/naming-rules.txt) — Convenciones de nombres
* [ai-pmp/git-rules.txt](ai-pmp/git-rules.txt) — Commits y ramas

---

## Stack del proyecto

Instalado hoy (sitio informativo):
* Next.js 16.2.9 (App Router, Turbopack) + React 19.2.4 + TypeScript strict
* Tailwind CSS v4 (`@tailwindcss/postcss`) + tw-animate-css + shadcn/ui (base-color `neutral`)
* Supabase vía `@supabase/ssr` (browser + server client). Solo lectura del catálogo por ahora.
* lucide-react, class-variance-authority, clsx, tailwind-merge, @radix-ui/react-slot

NO instalado todavía (se agrega solo si se confirma el e-commerce):
* TanStack React Query, React Hook Form + Zod, Mercado Pago, auth/`proxy.ts`, RLS de `user_roles`

> **Nomenclatura de keys de Supabase usada en este proyecto: `anon` / `service_role`**
> (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`).

---

## Comandos

```
npm run dev          → servidor de desarrollo (Turbopack)
npm run build        → build de producción (debe pasar sin errores antes de entregar)
npx tsc --noEmit     → verificación de tipos (correr antes de entregar cualquier cambio)
npm run lint         → linter
```

---

## Módulos del sistema

| Módulo | Estado | Tablas Supabase | Notas |
|--------|--------|-----------------|-------|
| Landing / Hero | UI lista | — | Hero inventado en `features/landing` |
| Catálogo | En desarrollo | productos | DAL listo; falta crear la tabla en Supabase y las páginas |
| Auth | Pendiente | user_roles | solo si hay e-commerce |
| Carrito | Pendiente | — | solo si hay e-commerce |
| Checkout / Pagos | Pendiente | ordenes, items_orden | solo si hay e-commerce |
| Admin | Pendiente | — | solo si hay e-commerce |

Estados: `Pendiente` / `En desarrollo` / `UI lista` / `Completo`

---

## Base de datos — Tablas creadas

```
[Ninguna todavía en Supabase]
```

> Próxima: `productos` (catálogo informativo). Schema previsto y reflejado en
> `src/integrations/supabase/types.ts` (escrito a mano hasta crear la tabla):
> `id, slug (unique), nombre, descripcion, precio numeric(12,2) null, imagen_url,
> categoria, destacado bool, activo bool, created_at, updated_at`.
> Al crearla: campos estándar + constraints + trigger `updated_at` + RLS (SELECT público,
> escritura solo service key por ahora) y regenerar `types.ts` con el MCP.

Ejemplo:
```
- user_roles    → roles (admin, gerente, cliente)
- productos     → catálogo (slug, precio, stock)
- categorias    → categorías
- ordenes       → cabecera de orden (estado, total, pago_id)
- items_orden   → detalle (precio_unitario congelado)
```

---

## Roles del sistema

| Rol | Permisos |
|-----|----------|
| admin | Acceso total: productos, órdenes, usuarios |
| gerente | [definir] |
| cliente | Comprar, ver sus propias órdenes |

**Alta de usuarios**: signup abierto crea rol `cliente` (trigger `handle_new_user`). El admin sube roles desde el dashboard / service key.

---

## Checklist de seguridad

- [ ] Tabla `user_roles` con RLS propio: nadie modifica su rol desde el cliente
- [ ] Función `tiene_rol()` con `SECURITY DEFINER`
- [ ] Trigger `handle_new_user` (rol por defecto: `cliente`)
- [ ] Autorización en el DAL con `getUser()` (NUNCA `getSession()`)
- [ ] `proxy.ts` usado solo para redirects de UX, no como barrera de seguridad
- [ ] Toda tabla nueva: RLS + `WITH CHECK` en escritura
- [ ] Toda tabla nueva: trigger `updated_at` + constraints SQL
- [ ] Dinero en `numeric(12,2)` — nunca float
- [ ] Total de orden recalculado en el server, nunca del cliente
- [ ] Stock descontado solo tras pago aprobado, de forma atómica
- [ ] Webhook de Mercado Pago: firma validada + re-consulta del pago + idempotente
- [ ] Secretos (access token MP, service key) sin prefijo `NEXT_PUBLIC_`
- [ ] Después de cada cambio de schema: correr `get_advisors` del MCP

---

## Decisiones técnicas tomadas

Registrar aquí lo que se salga del estándar.
* **Alcance reducido**: arranca como sitio informativo, no e-commerce. Sin React Query, RHF/Zod,
  Mercado Pago ni auth hasta que se confirme la tienda online.
* **Keys de Supabase**: nomenclatura `anon` / `service_role`.
* **shadcn/ui**: componentes UI en `src/shared/components/ui/` (no en `@/components/ui`);
  alias configurados en `components.json`.
* `next.config.ts`: `images.remotePatterns` apunta a `*.supabase.co` (Storage del catálogo).

---

## Estado actual del desarrollo

**Última sesión**: 2026-06-20
**Próximo paso**: crear la tabla `productos` en Supabase (con RLS + trigger), regenerar
`types.ts` con el MCP, y armar las páginas `/productos` y `/productos/[slug]` (ISR) usando el DAL ya escrito.

**Lo que está funcionando**:
* Proyecto Next.js 16 + Tailwind v4 + shadcn scaffolded; `tsc --noEmit` y `npm run build` pasan.
* Estructura por features (`features/`, `shared/`, `lib/`, `data/`, `integrations/`).
* Clientes de Supabase (browser + server) y DAL del catálogo (`features/productos/queries.ts`).
* Home `/` con sección Hero inventada (`features/landing/components/Hero.tsx`), estática.

**Lo que está pendiente**:
* Tabla `productos` real en Supabase + RLS + seed de datos.
* Páginas de catálogo y detalle de producto; navbar/footer.
* Variables de entorno reales en `.env.local` (ver `.env.example`).

**Problemas conocidos o deuda técnica**:
* `types.ts` está escrito a mano (placeholder) hasta crear la tabla y regenerarlo con el MCP.
* `getProductos()` fallará hasta que existan las env vars de Supabase y la tabla `productos`.

---

## Instrucciones para la IA

1. **Antes de escribir código**, leer los documentos de `ai-pmp/`.
2. **No empezar módulos nuevos** sin que el usuario lo indique.
3. **Antes de entregar**: correr `npx tsc --noEmit` y verificar imports/errores. Cambios grandes: `npm run build`.
4. **Server-first**: componentes Server por defecto; `"use client"` solo donde hay interactividad real, lo más abajo posible.
5. **Lecturas** vía DAL en Server Components; **mutaciones** vía Server Actions; **React Query** solo para cliente.
6. **Si hay ambigüedad**, preguntar antes de implementar.
7. **No agregar dependencias** fuera del stack sin consultar.
8. **Actualizar la tabla de módulos** al completar uno.
9. **Límite 300 líneas por archivo** — dividir si se supera.
10. **Nunca leer, imprimir ni commitear `.env`** ni secretos (access token MP, service key).
11. **Después de cambios de schema**, correr `get_advisors` del MCP y corregir alertas.
12. **El total de la orden y el stock se manejan en el server**; el webhook valida firma y re-consulta el pago.
13. **Al terminar una sesión**, actualizar "Estado actual del desarrollo".

---

## Cómo actualizar este archivo

* **Al terminar un módulo** → cambiar su estado en la tabla
* **Al crear una tabla** → agregarla en "Base de datos"
* **Al tomar una decisión técnica** → registrarla
* **Al terminar una sesión** → actualizar "Estado actual del desarrollo"
* **Al definir roles** → completar tabla de roles y checklist
