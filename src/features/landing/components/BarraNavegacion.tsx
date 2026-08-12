"use client"

import Link from "next/link"
import { useRef, useState } from "react"
import { ArrowRight, ChevronDown, Flame } from "lucide-react"

import { type CategoriaMenu } from "@/features/productos/queries"

/**
 * Navegación con mega-menú. Las entradas con `categorias` despliegan un panel
 * ancho al pasar el mouse o al enfocar con teclado; el resto son links sueltos.
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
    { id: "cajas", label: "Cajas de cartón", href: "/productos", categorias },
    { id: "medida", label: "Cajas a medida", href: "/#fabrica" },
    { id: "catalogo", label: "Catálogo completo", href: "/productos" },
    { id: "nosotros", label: "Nosotros", href: "/#clientes" },
    { id: "encontranos", label: "Dónde encontrarnos", href: "/#contacto" },
    { id: "faq", label: "Preguntas frecuentes", href: "/#faq" },
    { id: "contacto", label: "Contacto", href: "/#contacto" },
  ]

  return (
    <nav
      className="relative hidden border-b bg-background md:block"
      onMouseLeave={cerrarDiferido}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-center px-6">
        {entradas.map((entrada) => {
          const desplegable = (entrada.categorias?.length ?? 0) > 0
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

      {entradas.map((entrada) =>
        (entrada.categorias?.length ?? 0) > 0 && abierto === entrada.id ? (
          <PanelCategorias
            key={entrada.id}
            categorias={entrada.categorias!}
            onMouseEnter={() => abrir(entrada.id)}
          />
        ) : null,
      )}
    </nav>
  )
}

type Entrada = {
  id: string
  label: string
  href: string
  icono?: boolean
  categorias?: CategoriaMenu[]
}

/** Panel desplegable: una columna por categoría con sus productos. */
function PanelCategorias({
  categorias,
  onMouseEnter,
}: {
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
