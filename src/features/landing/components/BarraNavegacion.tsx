"use client"

import Link from "next/link"
import { useRef, useState } from "react"
import { ArrowRight, ChevronDown, Flame, Sparkles } from "lucide-react"

import { type CategoriaMenu } from "@/features/productos/queries"

/** Un item del submenú desplegable. */
type SubItem = { label: string; href: string }

type Entrada = {
  id: string
  label: string
  href: string
  /** Ícono de "lo más vendido". */
  icono?: boolean
  /** Ícono de diferencial: producto que casi nadie fabrica. */
  destacado?: boolean
  /** Submenú simple (links fijos). */
  items?: SubItem[]
  /** Mega-menú alimentado por el catálogo real de Supabase. */
  categorias?: CategoriaMenu[]
}

/** Link al catálogo filtrado por término de búsqueda. */
const buscar = (q: string) => `/productos?q=${encodeURIComponent(q)}`

const INSUMOS: SubItem[] = [
  { label: "Cinta", href: buscar("cinta") },
  { label: "Papeles (Bobina / Resma / Rollo)", href: buscar("papel") },
  { label: "Planchas y Esquineros", href: buscar("plancha") },
  { label: "Protección de Embalaje", href: buscar("protección") },
]

/**
 * Navegación con desplegables. "Cajas" usa el mega-menú alimentado por el
 * catálogo real; el resto son submenús de links fijos.
 */
export function BarraNavegacion({ categorias }: { categorias: CategoriaMenu[] }) {
  const [abierto, setAbierto] = useState<string | null>(null)
  // Un cierre diferido evita que el panel parpadee al cruzar el hueco
  // de 1px entre el botón y el panel.
  const cierre = useRef<ReturnType<typeof setTimeout> | null>(null)

  function abrir(id: string) {
    if (cierre.current) clearTimeout(cierre.current)
    setAbierto(id)
  }

  function cerrarDiferido() {
    if (cierre.current) clearTimeout(cierre.current)
    cierre.current = setTimeout(() => setAbierto(null), 120)
  }

  const entradas: Entrada[] = [
    { id: "vendido", label: "Lo más vendido", href: "/productos", icono: true },
    {
      id: "cajas",
      label: "Cajas",
      href: "/productos",
      items: [
        { label: "Corrugado", href: buscar("corrugado") },
        { label: "Simple", href: buscar("simple") },
      ],
      categorias,
    },
    {
      id: "forradas",
      label: "Cajas forradas a medida",
      href: "/#fabrica",
      destacado: true,
    },
    {
      id: "insumos",
      label: "Insumos para embalaje",
      href: "/productos",
      items: INSUMOS,
    },
    { id: "bolsas", label: "Bolsas papel/kraft", href: buscar("bolsa") },
    { id: "contacto", label: "Contacto", href: "/#contacto" },
  ]

  return (
    <nav
      className="relative hidden border-b bg-background md:block"
      onMouseLeave={cerrarDiferido}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-center px-6">
        {entradas.map((entrada) => {
          const desplegable =
            (entrada.items?.length ?? 0) > 0 || (entrada.categorias?.length ?? 0) > 0
          const activo = abierto === entrada.id

          return (
            <div
              key={entrada.id}
              onMouseEnter={() => (desplegable ? abrir(entrada.id) : cerrarDiferido())}
            >
              <Link
                href={entrada.href}
                onFocus={() => (desplegable ? abrir(entrada.id) : setAbierto(null))}
                aria-expanded={desplegable ? activo : undefined}
                className={`flex items-center gap-1.5 whitespace-nowrap border-b-2 px-3 py-3 text-[13px] font-medium transition-colors lg:px-3.5 ${
                  activo
                    ? "border-acento text-acento"
                    : "border-transparent hover:text-acento"
                }`}
              >
                {entrada.icono && (
                  <Flame className="size-3.5 text-acento" aria-hidden />
                )}
                {entrada.destacado && (
                  <Sparkles className="size-3.5 text-acento" aria-hidden />
                )}
                {entrada.label}
                {desplegable && (
                  <ChevronDown
                    className={`size-3.5 transition-transform ${activo ? "rotate-180" : ""}`}
                    aria-hidden
                  />
                )}
              </Link>
            </div>
          )
        })}
      </div>

      {entradas.map((entrada) => {
        if (abierto !== entrada.id) return null

        // "Cajas" combina sus tipos fijos con las categorías del catálogo.
        if ((entrada.categorias?.length ?? 0) > 0) {
          return (
            <PanelCategorias
              key={entrada.id}
              items={entrada.items}
              categorias={entrada.categorias!}
              onMouseEnter={() => abrir(entrada.id)}
            />
          )
        }

        if ((entrada.items?.length ?? 0) > 0) {
          return (
            <PanelSimple
              key={entrada.id}
              items={entrada.items!}
              onMouseEnter={() => abrir(entrada.id)}
            />
          )
        }

        return null
      })}
    </nav>
  )
}

/** Desplegable de links fijos (insumos para embalaje). */
function PanelSimple({
  items,
  onMouseEnter,
}: {
  items: SubItem[]
  onMouseEnter: () => void
}) {
  return (
    <div
      onMouseEnter={onMouseEnter}
      className="absolute inset-x-0 top-full z-40 px-6"
    >
      <div className="mx-auto w-fit animate-in fade-in slide-in-from-top-1 rounded-b-2xl border border-t-0 bg-background p-4 shadow-xl duration-150">
        <ul className="flex min-w-56 flex-col gap-0.5">
          {items.map((item) => (
            <li key={item.label}>
              <Link
                href={item.href}
                className="block rounded-lg px-3 py-2 text-[13px] text-muted-foreground transition-colors hover:bg-crema hover:text-acento"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

/** Panel de "Cajas": tipos fijos + una columna por categoría del catálogo. */
function PanelCategorias({
  items,
  categorias,
  onMouseEnter,
}: {
  items?: SubItem[]
  categorias: CategoriaMenu[]
  onMouseEnter: () => void
}) {
  return (
    <div
      onMouseEnter={onMouseEnter}
      className="absolute inset-x-0 top-full z-40 px-6"
    >
      {/* Tarjeta contenida: se apoya bajo la nav sin ocupar todo el ancho. */}
      <div className="mx-auto w-fit max-w-5xl animate-in fade-in slide-in-from-top-1 rounded-b-2xl border border-t-0 bg-background p-6 shadow-xl duration-150">
        <div className="flex flex-wrap gap-x-10 gap-y-6">
          {/* Tipo de cartón: la división principal del rubro. */}
          {items && items.length > 0 && (
            <div className="flex min-w-40 flex-col gap-2.5">
              <h3 className="border-b pb-2 text-[12px] font-semibold uppercase tracking-wide">
                Tipo de cartón
              </h3>
              <ul className="flex flex-col gap-1.5">
                {items.map((item) => (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      className="text-[13px] text-muted-foreground transition-colors hover:text-acento"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {categorias.slice(0, 3).map((categoria) => (
            <div key={categoria.nombre} className="flex min-w-44 flex-col gap-2.5">
              <h3 className="flex items-baseline gap-2 border-b pb-2 text-[12px] font-semibold uppercase tracking-wide">
                {categoria.nombre}
                <span className="text-[11px] font-normal text-muted-foreground">
                  {categoria.cantidad}
                </span>
              </h3>
              <ul className="flex flex-col gap-1.5">
                {categoria.productos.slice(0, 5).map((producto) => (
                  <li key={producto.id}>
                    <Link
                      href={producto.slug ? `/productos/${producto.slug}` : "/productos"}
                      className="flex flex-col text-[13px] text-muted-foreground transition-colors hover:text-acento"
                    >
                      <span className="leading-snug">{producto.nombre}</span>
                      {producto.medida && (
                        <span className="text-[11px] opacity-70">{producto.medida}</span>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Cierre del panel: invitación al catálogo completo. */}
          <div className="flex max-w-56 flex-col justify-center gap-2 rounded-xl bg-crema p-5">
            <h3 className="text-sm font-bold leading-snug">
              ¿No encontrás tu medida?
            </h3>
            <p className="text-[13px] leading-snug text-muted-foreground">
              Fabricamos la caja exacta que necesita tu producto.
            </p>
            <Link
              href="/#fabrica"
              className="inline-flex w-fit items-center gap-1.5 text-[13px] font-semibold text-acento transition-opacity hover:opacity-80"
            >
              Cotizar a medida
              <ArrowRight className="size-3.5" aria-hidden />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
