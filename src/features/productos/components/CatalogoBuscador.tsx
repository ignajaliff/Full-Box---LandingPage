"use client"

import { FiltrosMobile } from "./FiltrosMobile"
import { ProductoCard } from "./ProductoCard"
import { type Producto } from "../types"
import {
  TOLERANCIA,
  useFiltrosCatalogo,
  type Orden,
} from "../useFiltrosCatalogo"

const inputClass =
  "h-[42px] w-full rounded-[10px] border bg-muted/40 px-3 text-sm outline-none transition-colors focus-visible:border-acento focus-visible:ring-[3px] focus-visible:ring-acento/20"

type Props = {
  productos: Producto[]
  /** Término inicial: viene del buscador del header vía `?q=`. */
  busquedaInicial?: string
}

export function CatalogoBuscador({ productos, busquedaInicial = "" }: Props) {
  const f = useFiltrosCatalogo(productos, busquedaInicial)
  const {
    texto, setTexto,
    largo, setLargo,
    ancho, setAncho,
    alto, setAlto,
    categoria, setCategoria,
    rango, setRango,
    orden, setOrden,
    categorias, rangos, resultados, resumen, limpiar,
  } = f

  return (
    <div className="grid items-start gap-5 lg:grid-cols-[264px_1fr] lg:gap-7">
      {/* Mobile: chips en línea + panel que sube. Desde lg manda el aside. */}
      <FiltrosMobile
        categorias={categorias}
        rangos={rangos}
        total={productos.length}
        tolerancia={TOLERANCIA}
        valores={{ largo, ancho, alto, categoria, rango }}
        onAplicar={(v) => {
          setLargo(v.largo)
          setAncho(v.ancho)
          setAlto(v.alto)
          setCategoria(v.categoria)
          setRango(v.rango)
        }}
        onLimpiar={limpiar}
      />

      {/* Sidebar de filtros — sólo desde lg. */}
      <aside className="hidden flex-col gap-[18px] rounded-[18px] border bg-card p-[22px] lg:sticky lg:top-[110px] lg:flex">
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
        {/* En mobile el buscador ocupa su propia fila y el orden va al lado
            del resumen: apretados en una sola línea no entraban. */}
        <div className="flex flex-col gap-3 rounded-[14px] border bg-card p-3.5 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:gap-4 sm:px-[18px]">
          <label className="relative sm:min-w-[200px] sm:flex-1">
            <span className="sr-only">Buscar producto</span>
            <input
              type="text"
              value={texto}
              onChange={(e) => setTexto(e.target.value)}
              placeholder="Buscar: vino, e-commerce, mudanza…"
              className="h-10 w-full rounded-[10px] border bg-muted/40 px-3 text-sm outline-none transition-colors focus-visible:border-acento focus-visible:ring-[3px] focus-visible:ring-acento/20 sm:h-9 sm:max-w-xs"
            />
          </label>

          <div className="flex items-center justify-between gap-2.5 sm:contents">
            <p className="text-[13px] text-muted-foreground sm:text-sm">
              {resumen}
            </p>

            <div className="flex items-center gap-2.5">
              <span className="hidden text-[13px] text-muted-foreground sm:inline">
                Ordenar por
              </span>
              <select
                value={orden}
                onChange={(e) => setOrden(e.target.value as Orden)}
                aria-label="Ordenar por"
                className="h-[38px] rounded-[10px] border bg-muted/40 px-2.5 text-[13px] outline-none transition-colors focus-visible:border-acento sm:px-3 sm:text-[13.5px]"
              >
                <option value="nombre">Nombre</option>
                <option value="precio-asc">Precio: menor a mayor</option>
                <option value="precio-desc">Precio: mayor a menor</option>
                <option value="volumen">Tamaño</option>
              </select>
            </div>
          </div>
        </div>

        {resultados.length > 0 ? (
          /* Dos columnas ya en mobile: a una sola las tarjetas quedaban
             enormes y se veía una caja por pantalla. */
          <ul className="grid grid-cols-2 gap-3 sm:gap-[18px] xl:grid-cols-3 2xl:grid-cols-4">
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
