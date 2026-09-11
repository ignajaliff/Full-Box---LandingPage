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
| Landing / Hero | UI lista | — | Hero con foto real + insights, responsive |
| Catálogo | Completo | productos | Conectado a Supabase (lectura pública). Home + `/productos` con buscador por medidas y cotizador |
| Auth | Pendiente | user_roles | solo si hay e-commerce |
| Carrito | Pendiente | — | solo si hay e-commerce |
| Checkout / Pagos | Pendiente | ordenes, items_orden | solo si hay e-commerce |
| Admin | Pendiente | — | solo si hay e-commerce |

Estados: `Pendiente` / `En desarrollo` / `UI lista` / `Completo`

---

## Base de datos — Tablas creadas

Proyecto Supabase: **`full_box`** (id `bwjppaihfaxcertrzsbr`, región sa-east-1).

```
- user_roles → roles (solo 'admin'). Usado por el sistema de gestión.
- productos  → catálogo. Compartida entre la landing (solo lectura) y el
               sistema de gestión (escritura).
```

**`productos`** — columnas:
`id uuid pk, nombre text, medida text, slug text unique, categoria text,
descripcion text, largo/ancho/alto numeric(6,1), precio numeric(12,2) null,
unidad_minima int, tramos_precio jsonb, tipo_carton text, plazo_entrega text,
admite_impresion bool, imagen_url text, destacado bool, activo bool,
created_at, updated_at`

* **`tramos_precio`** (2026-09-11): hasta 4 tramos `{cantidad, precio}` — desde esa
  cantidad, ese precio unitario. Los carga el sistema de gestión y la base los valida
  (`tramos_precio_validos`: ≤ 4, cantidad entera > unidad_minima, creciente, precio ≥ 0).
  Reemplazan a `desc_x100/x250/x500` (descuentos fijos en 100/250/500), que **siguen
  existiendo con default 0 solo hasta que esta landing esté desplegada leyendo
  `tramos_precio`**; después se borran desde el sistema (ver su
  `supabase/tramos_precio.sql`, PASO 2).

* **RLS**: `anon`+`authenticated` pueden SELECT solo `activo = true`
  (política `catalogo publico lee productos activos`). La escritura sigue
  restringida a `tiene_rol('admin')` — el sistema de gestión.
* **Triggers**: `set_updated_at` (moddatetime) y `productos_normalizar_trg`, que
  sincroniza el texto `medida` desde largo/ancho/alto y autogenera `slug` desde
  `nombre` (con sufijo numérico si se repite).
* `largo/ancho/alto` son **necesarios** para el buscador por medidas y el
  cotizador: un producto sin las tres dimensiones no aparece en esas búsquedas.

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
* **Tramos de precio desde `tramos_precio`** (2026-09-11): `getTramos()` en
  `features/productos/types.ts` arma la lista con el precio base desde la unidad mínima y,
  detrás, cada tramo cargado (validando la forma del Json con `leerTramosPrecio`, porque el
  tipo generado es `Json` genérico). Devuelve la MISMA forma de antes (`desde`, `etiqueta`,
  `precioUnitario`, `descuento`) para que `FichaCompra` no cambie; `descuento` ahora se calcula
  como % de ahorro contra el precio base (antes venía de la base). Ya no lee `desc_x*`.

---

## Estado actual del desarrollo

**Última sesión**: 2026-09-11 — la ficha de producto lee los tramos de precio desde
`productos.tramos_precio` (hasta 4 tramos cargados en el sistema de gestión) en vez de los
tres descuentos fijos `desc_x*`. Tipos de Supabase regenerados (traen también remitos, cobros
e items_remito, que la landing no usa). Sin commitear.
**Próximo paso**: **desplegar esta versión** y recién después borrar `desc_x100/x250/x500`
en la base (PASO 2 de `supabase/tramos_precio.sql` del sistema) — si se borran antes del
deploy, la versión publicada muestra precios `NaN`. Luego: fotos reales por producto y revisar
los precios/tramos desde el sistema de gestión.

**Lo que está funcionando**:
* Landing completa y responsive: Hero (a pantalla completa, foto real), catálogo
  destacado, sección "a medida" con cotizador, clientes, "Encontranos" (mapa) y footer.
* **Catálogo conectado a Supabase**: home y `/productos` leen del DAL
  (`features/productos/queries.ts`). Sin datos hardcodeados.
* Buscador por medidas (±5 cm) y cotizador (match exacto / similares / estimado).
* `.env.local` configurado con URL + anon key del proyecto `full_box`.
* `tsc --noEmit` y `npm run build` pasan.

**Lo que está pendiente**:
* Fotos reales por producto: hoy todas usan `/producto-ejemplo.png` como fallback.
* Logos reales de clientes y datos de contacto reales (`features/landing/data/contenido.ts`).

**Problemas conocidos o deuda técnica**:
* **Precios placeholder**: los 5 productos tienen precios estimados por fórmula, no reales.
  Actualizar desde el sistema de gestión.
* Un producto **sin largo/ancho/alto** no aparece en el buscador por medidas ni en el
  cotizador. El sistema de gestión ya permite cargar todo (dimensiones, precio, tramos,
  foto), pero las dimensiones son opcionales al crear.
* Los tramos migrados desde `desc_x*` eran los defaults de la tabla (8/15/22 %), no precios
  pensados: conviene revisarlos producto por producto desde el sistema.
* Advisors preexistentes (no introducidos por la landing): `tiene_rol` es SECURITY DEFINER
  ejecutable por `authenticated`, y falta activar leaked-password protection en Auth.

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
