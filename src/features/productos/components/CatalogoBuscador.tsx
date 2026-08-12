"use client"

import { useMemo, useState } from "react"

import { ProductoCard } from "./ProductoCard"
import { tieneMedidas, type Producto } from "../types"
import { formatCurrency } from "@/lib/format-currency"

/** Tolerancia en cm: una medida ingresada matchea productos a ±TOLERANCIA. */
const TOLERANCIA = 5

const inputClass =
  "h-[42px] w-full rounded-[10px] border bg-muted/40 px-3 text-sm outline-none transition-colors focus-visible:border-acento focus-visible:ring-[3px] focus-visible:ring-acento/20"

type Orden = "nombre" | "precio-asc" | "precio-desc" | "volumen"

type Props = {
  productos: Producto[]
  /** Término inicial: viene del buscador del header vía `?q=`. */
  busquedaInicial?: string
}

export function CatalogoBuscador({ productos, busquedaInicial = "" }: Props) {
  const [texto, setTexto] = useState(busquedaInicial)
  const [largo, setLargo] = useState("")
  const [ancho, setAncho] = useState("")
  const [alto, setAlto] = useState("")
  const [categoria, setCategoria] = useState<string | null>(null)
  const [rango, setRango] = useState("todos")
  const [orden, setOrden] = useState<Orden>("nombre")

  /** Categorías presentes en el catálogo, con su conteo. */
  const categorias = useMemo(() => {
    const cuenta = new Map<string, number>()
    for (const p of productos) {
      if (p.categoria) cuenta.set(p.categoria, (cuenta.get(p.categoria) ?? 0) + 1)
    }
    return [...cuenta.entries()]
      .sort((a, b) => a[0].localeCompare(b[0], "es"))
      .map(([nombre, count]) => ({ nombre, count }))
  }, [productos])

  /** Rangos calculados desde los precios reales (terciles redondeados). */
  const rangos = useMemo(() => {
    const precios = productos
      .map((p) => p.precio)
      .filter((n): n is number => n !== null)
      .sort((a, b) => a - b)

    const todos = { id: "todos", nombre: "Todos los precios", test: () => true }
    if (precios.length < 3) return [todos]

    const redondear = (n: number) => Math.round(n / 100) * 100
    const bajo = redondear(precios[Math.floor(precios.length / 3)])
    const alto_ = redondear(precios[Math.floor((precios.length * 2) / 3)])
    if (bajo >= alto_) return [todos]

    return [
      todos,
      {
        id: "a",
        nombre: `Hasta ${formatCurrency(bajo)}`,
        test: (p: Producto) => p.precio !== null && p.precio <= bajo,
      },
      {
        id: "b",
        nombre: `${formatCurrency(bajo)} a ${formatCurrency(alto_)}`,
        test: (p: Producto) =>
          p.precio !== null && p.precio > bajo && p.precio <= alto_,
      },
      {
        id: "c",
        nombre: `Más de ${formatCurrency(alto_)}`,
        test: (p: Producto) => p.precio !== null && p.precio > alto_,
      },
    ]
  }, [productos])

  const hayMedidas = Boolean(largo || ancho || alto)
  const hayFiltros =
    Boolean(texto) || hayMedidas || categoria !== null || rango !== "todos"

  const resultados = useMemo(() => {
    const q = texto.trim().toLowerCase()
    const cerca = (valor: number | null, objetivo: string) => {
      if (objetivo === "") return true
      if (valor === null) return false
      return Math.abs(valor - Number(objetivo)) <= TOLERANCIA
    }
    const test = rangos.find((r) => r.id === rango)?.test ?? (() => true)

    const filtrados = productos.filter((p) => {
      const textoOk =
        !q ||
        [p.nombre, p.categoria, p.descripcion, p.medida].some((s) =>
          s?.toLowerCase().includes(q),
        )
      if (hayMedidas && !tieneMedidas(p)) return false
      return (
        textoOk &&
        (!categoria || p.categoria === categoria) &&
        test(p) &&
        cerca(p.largo, largo) &&
        cerca(p.ancho, ancho) &&
        cerca(p.alto, alto)
      )
    })

    const volumen = (p: Producto) =>
      (p.largo ?? 0) * (p.ancho ?? 0) * (p.alto ?? 0)
    const precio = (p: Producto) => p.precio ?? Infinity

    return [...filtrados].sort((a, b) => {
      if (orden === "precio-asc") return precio(a) - precio(b)
      if (orden === "precio-desc") return precio(b) - precio(a)
      if (orden === "volumen") return volumen(a) - volumen(b)
      return a.nombre.localeCompare(b.nombre, "es")
    })
  }, [productos, texto, largo, ancho, alto, categoria, rango, orden, rangos, hayMedidas])

  function limpiar() {
    setTexto("")
    setLargo("")
    setAncho("")
    setAlto("")
    setCategoria(null)
    setRango("todos")
  }

  const resumen = hayFiltros
    ? `${resultados.length} ${resultados.length === 1 ? "medida" : "medidas"}${hayMedidas ? ` (±${TOLERANCIA} cm)` : ""}`
    : `${productos.length} ${productos.length === 1 ? "medida disponible" : "medidas disponibles"}`

  return (
    <div className="grid items-start gap-7 lg:grid-cols-[264px_1fr]">
      {/* Sidebar de filtros */}
      <aside className="flex flex-col gap-[18px] rounded-[18px] border bg-card p-[22px] lg:sticky lg:top-[110px]">
        <div className="flex flex-col gap-3">
          <h2 className="text-[13px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
            Medidas (cm)
          </h2>
          <MedidaInput etiqueta="Largo" value={largo} onChange={setLargo} />
          <MedidaInput etiqueta="Ancho" value={ancho} onChange={setAncho} />
          <MedidaInput etiqueta="Alto" value={alto} onChange={setAlto} />
          <p className="text-[11.5px] leading-relaxed text-muted-foreground">
            Tolerancia ±{TOLERANCIA} cm sobre cada dimensión.
          </p>
        </div>

        {categorias.length > 0 && (
          <>
            <Divisor />
            <div className="flex flex-col gap-2.5">
              <h2 className="mb-0.5 text-[13px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
                Categoría
              </h2>
              <Chip
                activo={categoria === null}
                onClick={() => setCategoria(null)}
                cuenta={productos.length}
              >
                Todas
              </Chip>
              {categorias.map((c) => (
                <Chip
                  key={c.nombre}
                  activo={categoria === c.nombre}
                  onClick={() => setCategoria(c.nombre)}
                  cuenta={c.count}
                >
                  {c.nombre}
                </Chip>
              ))}
            </div>
          </>
        )}

        {rangos.length > 1 && (
          <>
            <Divisor />
            <div className="flex flex-col gap-2.5">
              <h2 className="text-[13px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
                Precio
              </h2>
              {rangos.map((r) => (
                <Chip
                  key={r.id}
                  activo={rango === r.id}
                  onClick={() => setRango(r.id)}
                >
                  {r.nombre}
                </Chip>
              ))}
            </div>
          </>
        )}

        <button
          type="button"
          onClick={limpiar}
          className="h-[42px] rounded-full border bg-background text-[13.5px] font-semibold transition-colors hover:bg-muted"
        >
          Limpiar filtros
        </button>
      </aside>

      {/* Resultados */}
      <div className="flex flex-col gap-[18px]">
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-[14px] border bg-card px-[18px] py-3.5">
          <label className="relative min-w-[200px] flex-1">
            <span className="sr-only">Buscar producto</span>
            <input
              type="text"
              value={texto}
              onChange={(e) => setTexto(e.target.value)}
              placeholder="Buscar: vino, e-commerce, mudanza…"
              className="h-9 w-full max-w-xs rounded-[10px] border bg-muted/40 px-3 text-sm outline-none transition-colors focus-visible:border-acento focus-visible:ring-[3px] focus-visible:ring-acento/20"
            />
          </label>

          <p className="text-sm text-muted-foreground">{resumen}</p>

          <div className="flex items-center gap-2.5">
            <span className="text-[13px] text-muted-foreground">Ordenar por</span>
            <select
              value={orden}
              onChange={(e) => setOrden(e.target.value as Orden)}
              className="h-[38px] rounded-[10px] border bg-muted/40 px-3 text-[13.5px] outline-none transition-colors focus-visible:border-acento"
            >
              <option value="nombre">Nombre</option>
              <option value="precio-asc">Precio: menor a mayor</option>
              <option value="precio-desc">Precio: mayor a menor</option>
              <option value="volumen">Tamaño</option>
            </select>
          </div>
        </div>

        {resultados.length > 0 ? (
          <ul className="grid gap-[18px] sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
            {resultados.map((producto) => (
              <ProductoCard key={producto.id} producto={producto} />
            ))}
          </ul>
        ) : (
          <div className="rounded-[14px] border border-dashed bg-muted/30 py-16 text-center">
            <p className="font-medium">No encontramos una caja con esas medidas.</p>
            <p className="mt-1 text-sm text-muted-foreground">
              La fabricamos a medida: escribinos y la cotizamos para vos.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

function Divisor() {
  return <div className="h-px bg-border" />
}

function Chip({
  activo,
  onClick,
  cuenta,
  children,
}: {
  activo: boolean
  onClick: () => void
  cuenta?: number
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex h-[38px] w-full items-center justify-between gap-2 rounded-[10px] border px-3.5 text-left text-[13.5px] transition-colors ${
        activo
          ? "border-acento bg-acento-soft font-semibold text-acento"
          : "font-medium hover:bg-muted"
      }`}
    >
      <span>{children}</span>
      {cuenta !== undefined && (
        <span className="text-xs text-muted-foreground">{cuenta}</span>
      )}
    </button>
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
    <label className="flex flex-col gap-1.5">
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
