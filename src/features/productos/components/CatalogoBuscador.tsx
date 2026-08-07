"use client"

import { useMemo, useState } from "react"
import { Ruler, Search, X } from "lucide-react"

import { Button } from "@/shared/components/ui/button"
import { ProductoCard } from "./ProductoCard"
import { tieneMedidas, type Producto } from "../types"

/** Tolerancia en cm: una medida ingresada matchea productos a ±TOLERANCIA. */
const TOLERANCIA = 5

const inputClass =
  "h-11 w-full rounded-md border bg-background px-3 text-sm outline-none transition-colors focus-visible:border-foreground/40 focus-visible:ring-[3px] focus-visible:ring-foreground/10"

type Props = { productos: Producto[] }

export function CatalogoBuscador({ productos }: Props) {
  const [texto, setTexto] = useState("")
  const [largo, setLargo] = useState("")
  const [ancho, setAncho] = useState("")
  const [alto, setAlto] = useState("")

  const hayMedidas = Boolean(largo || ancho || alto)
  const hayFiltros = Boolean(texto) || hayMedidas

  const resultados = useMemo(() => {
    const q = texto.trim().toLowerCase()
    const cerca = (valor: number | null, objetivo: string) => {
      if (objetivo === "") return true
      if (valor === null) return false
      return Math.abs(valor - Number(objetivo)) <= TOLERANCIA
    }

    return productos.filter((p) => {
      const textoOk =
        !q ||
        [p.nombre, p.categoria, p.descripcion, p.medida].some((s) =>
          s?.toLowerCase().includes(q),
        )
      // Con filtro de medidas, un producto sin dimensiones no puede compararse.
      if (hayMedidas && !tieneMedidas(p)) return false
      return (
        textoOk &&
        cerca(p.largo, largo) &&
        cerca(p.ancho, ancho) &&
        cerca(p.alto, alto)
      )
    })
  }, [productos, texto, largo, ancho, alto, hayMedidas])

  function limpiar() {
    setTexto("")
    setLargo("")
    setAncho("")
    setAlto("")
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Buscador por medidas */}
      <div className="sticky top-16 z-30 rounded-xl border bg-card/95 p-4 shadow-sm backdrop-blur md:p-5">
        <div className="grid gap-3 md:grid-cols-[1.6fr_repeat(3,1fr)]">
          <label className="flex flex-col gap-1">
            <span className="text-xs font-medium text-muted-foreground">Producto</span>
            <span className="relative">
              <Search
                className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden
              />
              <input
                type="text"
                value={texto}
                onChange={(e) => setTexto(e.target.value)}
                placeholder="Buscar: vino, e-commerce, mudanza…"
                className={`${inputClass} pl-9`}
              />
            </span>
          </label>

          <MedidaInput etiqueta="Largo (cm)" value={largo} onChange={setLargo} />
          <MedidaInput etiqueta="Ancho (cm)" value={ancho} onChange={setAncho} />
          <MedidaInput etiqueta="Alto (cm)" value={alto} onChange={setAlto} />
        </div>

        <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
          <p className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
            <Ruler className="size-4" aria-hidden />
            {hayFiltros
              ? `${resultados.length} ${resultados.length === 1 ? "medida" : "medidas"}${hayMedidas ? ` (±${TOLERANCIA} cm)` : ""}`
              : `${productos.length} ${productos.length === 1 ? "medida disponible" : "medidas disponibles"}`}
          </p>
          {hayFiltros && (
            <Button variant="ghost" size="sm" onClick={limpiar}>
              <X className="size-4" aria-hidden />
              Limpiar
            </Button>
          )}
        </div>
      </div>

      {/* Resultados */}
      {resultados.length > 0 ? (
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {resultados.map((producto) => (
            <ProductoCard key={producto.id} producto={producto} />
          ))}
        </ul>
      ) : (
        <div className="rounded-xl border border-dashed bg-muted/30 py-16 text-center">
          <p className="font-medium">No encontramos una caja con esas medidas.</p>
          <p className="mt-1 text-sm text-muted-foreground">
            La fabricamos a medida: escribinos y la cotizamos para vos.
          </p>
        </div>
      )}
    </div>
  )
}

function MedidaInput({
  etiqueta,
  value,
  onChange,
}: {
  etiqueta: string
  value: string
  onChange: (v: string) => void
}) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-xs font-medium text-muted-foreground">{etiqueta}</span>
      <input
        type="number"
        min={0}
        inputMode="numeric"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="—"
        className={inputClass}
      />
    </label>
  )
}
