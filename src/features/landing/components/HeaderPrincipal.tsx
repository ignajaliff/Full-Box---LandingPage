"use client"

import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Package, Ruler, Search, UserRound } from "lucide-react"

import { EMPRESA } from "../data/contenido"

/**
 * Fila principal del header: marca, buscador y accesos.
 *
 * Acceder y el carrito son decorativos por ahora — el sitio todavía no vende
 * online (ver CLAUDE.md). Están maquetados para cuando se active el e-commerce.
 */
export function HeaderPrincipal() {
  const router = useRouter()
  const [consulta, setConsulta] = useState("")

  function buscar(evento: React.FormEvent) {
    evento.preventDefault()
    const termino = consulta.trim()
    router.push(termino ? `/productos?q=${encodeURIComponent(termino)}` : "/productos")
  }

  return (
    <div className="border-b bg-background">
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-6 py-3.5 md:gap-8">
        <Link href="/" className="shrink-0" aria-label={EMPRESA.nombre}>
          {/* El logotipo de marca es casi cuadrado (incluye el tagline bajo
              la palabra), así que va más alto que el anterior apaisado para
              que "Full Box" se lea al mismo tamaño óptico. */}
          <Image
            src="/logo-fullbox.png"
            alt={EMPRESA.nombre}
            width={1200}
            height={827}
            priority
            className="h-12 w-auto md:h-14"
          />
        </Link>

        {/* Buscador — ocupa el espacio libre entre la marca y los accesos. */}
        <form
          onSubmit={buscar}
          role="search"
          className="hidden min-w-0 flex-1 md:block"
        >
          <div className="group relative">
            <Search
              className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden
            />
            <input
              type="search"
              value={consulta}
              onChange={(e) => setConsulta(e.target.value)}
              placeholder="Buscá tu producto: caja, medida, e-commerce…"
              aria-label="Buscar productos"
              className="h-11 w-full rounded-full border bg-muted/50 pl-11 pr-24 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-acento focus:bg-background"
            />
            <button
              type="submit"
              className="absolute right-1.5 top-1/2 h-8 -translate-y-1/2 rounded-full bg-acento px-4 text-xs font-semibold text-acento-foreground transition-opacity hover:opacity-90"
            >
              Buscar
            </button>
          </div>
        </form>

        <div className="ml-auto flex items-center gap-1 md:ml-0 md:gap-2">
          <AccesoLink
            href="/#fabrica"
            icono={Ruler}
            titulo="Cotizá tu caja"
            detalle="A medida"
          />
          <AccesoBoton
            icono={UserRound}
            titulo="Acceder"
            detalle="Mi cuenta"
          />
          <AccesoBoton
            icono={Package}
            titulo="Mi pedido"
            detalle="0 productos"
            insignia="0"
          />
        </div>
      </div>

      {/* Buscador en mobile: baja a su propia fila para no comprimir la marca. */}
      <form onSubmit={buscar} role="search" className="px-6 pb-3.5 md:hidden">
        <div className="relative">
          <Search
            className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden
          />
          <input
            type="search"
            value={consulta}
            onChange={(e) => setConsulta(e.target.value)}
            placeholder="Buscá tu producto…"
            aria-label="Buscar productos"
            className="h-11 w-full rounded-full border bg-muted/50 pl-11 pr-4 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-acento focus:bg-background"
          />
        </div>
      </form>
    </div>
  )
}

type AccesoProps = {
  icono: typeof Package
  titulo: string
  detalle: string
  insignia?: string
}

/** Estilo compartido por los tres accesos de la derecha. */
const CLASES_ACCESO =
  "group relative flex items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-left transition-colors hover:bg-muted md:px-3"

function ContenidoAcceso({ icono: Icono, titulo, detalle, insignia }: AccesoProps) {
  return (
    <>
      <span className="relative">
        <Icono
          className="size-5 text-foreground transition-colors group-hover:text-acento"
          aria-hidden
        />
        {insignia && (
          <span className="absolute -right-1.5 -top-1.5 flex size-4 items-center justify-center rounded-full bg-acento text-[10px] font-bold leading-none text-acento-foreground">
            {insignia}
          </span>
        )}
      </span>
      <span className="hidden flex-col leading-tight lg:flex">
        <span className="text-[13px] font-semibold">{titulo}</span>
        <span className="text-[11px] text-muted-foreground">{detalle}</span>
      </span>
    </>
  )
}

function AccesoLink({ href, ...props }: AccesoProps & { href: string }) {
  return (
    <Link href={href} className={CLASES_ACCESO} aria-label={props.titulo}>
      <ContenidoAcceso {...props} />
    </Link>
  )
}

/** Acceso todavía sin destino: maquetado para el e-commerce futuro. */
function AccesoBoton(props: AccesoProps) {
  return (
    <button type="button" className={CLASES_ACCESO} aria-label={props.titulo}>
      <ContenidoAcceso {...props} />
    </button>
  )
}
