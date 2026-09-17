"use client"

import { useEffect, useState } from "react"

import { Chip, Medida, Opcion } from "./FiltrosMobileUI"

/**
 * Filtros del catálogo en mobile: una fila de chips que se desliza y, al
 * tocar uno, un panel que sube desde abajo con las opciones.
 *
 * Es el patrón de las tiendas grandes, y resuelve algo concreto: la barra
 * lateral apilada obligaba a scrollear todos los filtros antes de ver la
 * primera caja. Acá los filtros ocupan una línea y el detalle aparece sólo
 * cuando se pide.
 *
 * El panel escribe sobre un borrador y recién `Aplicar` lo vuelca al estado
 * real: así tocar opciones no reordena la grilla debajo mientras se elige.
 */

export type Rango = { id: string; nombre: string }

type Props = {
  categorias: { nombre: string; count: number }[]
  rangos: Rango[]
  total: number
  /** Estado real de los filtros, ya aplicado. */
  valores: {
    largo: string
    ancho: string
    alto: string
    categoria: string | null
    rango: string
  }
  tolerancia: number
  onAplicar: (v: Props["valores"]) => void
  onLimpiar: () => void
}

/** Cuál de los paneles está abierto. */
type Panel = "medidas" | "categoria" | "precio" | null

export function FiltrosMobile({
  categorias,
  rangos,
  total,
  valores,
  tolerancia,
  onAplicar,
  onLimpiar,
}: Props) {
  const [panel, setPanel] = useState<Panel>(null)
  // Borrador: lo que se está eligiendo, todavía sin aplicar.
  const [borrador, setBorrador] = useState(valores)

  // Al abrir un panel, parte de lo que hoy está aplicado.
  function abrir(p: Exclude<Panel, null>) {
    setBorrador(valores)
    setPanel(p)
  }

  function aplicar() {
    onAplicar(borrador)
    setPanel(null)
  }

  // El fondo no debe scrollear mientras el panel está arriba.
  useEffect(() => {
    if (!panel) return
    const previo = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = previo
    }
  }, [panel])

  // Cerrar con Escape, como cualquier diálogo.
  useEffect(() => {
    if (!panel) return
    function alTeclear(e: KeyboardEvent) {
      if (e.key === "Escape") setPanel(null)
    }
    window.addEventListener("keydown", alTeclear)
    return () => window.removeEventListener("keydown", alTeclear)
  }, [panel])

  const hayMedidas = Boolean(valores.largo || valores.ancho || valores.alto)
  const rangoActivo = rangos.find((r) => r.id === valores.rango)
  const hayFiltros =
    hayMedidas || valores.categoria !== null || valores.rango !== "todos"

  return (
    <div className="lg:hidden">
      {/* Fila de chips. Se desliza en horizontal: con cuatro filtros no
          entran en el ancho de un teléfono. */}
      <div className="-mx-6 overflow-x-auto px-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="flex w-max gap-2 pb-1">
          {hayFiltros && (
            <button
              type="button"
              onClick={onLimpiar}
              className="flex h-10 shrink-0 items-center gap-1.5 rounded-full border border-acento bg-acento-soft px-4 text-[13.5px] font-semibold text-acento"
            >
              Limpiar
              <span aria-hidden>×</span>
            </button>
          )}

          <Chip
            activo={hayMedidas}
            onClick={() => abrir("medidas")}
            etiqueta={
              hayMedidas
                ? `${[valores.largo, valores.ancho, valores.alto]
                    .map((v) => v || "—")
                    .join("×")} cm`
                : "Medidas"
            }
          />
          {categorias.length > 0 && (
            <Chip
              activo={valores.categoria !== null}
              onClick={() => abrir("categoria")}
              etiqueta={valores.categoria ?? "Categoría"}
            />
          )}
          {rangos.length > 1 && (
            <Chip
              activo={valores.rango !== "todos"}
              onClick={() => abrir("precio")}
              etiqueta={
                valores.rango !== "todos" && rangoActivo
                  ? rangoActivo.nombre
                  : "Precio"
              }
            />
          )}
        </div>
      </div>

      {panel && (
        <>
          {/* Fondo: oscurece y cierra al tocarlo. */}
          <button
            type="button"
            aria-label="Cerrar filtros"
            onClick={() => setPanel(null)}
            className="fixed inset-0 z-40 animate-in fade-in bg-foreground/40 duration-200"
          />

          <div
            role="dialog"
            aria-modal="true"
            aria-label={TITULOS[panel]}
            className="fixed inset-x-0 bottom-0 z-50 flex max-h-[80vh] animate-in slide-in-from-bottom flex-col rounded-t-3xl bg-background duration-300"
          >
            <div className="flex items-center justify-between border-b px-5 py-4">
              <h2 className="text-[17px] font-bold">{TITULOS[panel]}</h2>
              <button
                type="button"
                onClick={() => setPanel(null)}
                aria-label="Cerrar"
                className="flex size-9 items-center justify-center rounded-full bg-muted text-lg text-muted-foreground transition-colors hover:bg-muted/70"
              >
                ×
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-4">
              {panel === "medidas" && (
                <div className="flex flex-col gap-4">
                  <div className="grid grid-cols-3 gap-3">
                    <Medida
                      etiqueta="Largo"
                      value={borrador.largo}
                      onChange={(v) => setBorrador({ ...borrador, largo: v })}
                    />
                    <Medida
                      etiqueta="Ancho"
                      value={borrador.ancho}
                      onChange={(v) => setBorrador({ ...borrador, ancho: v })}
                    />
                    <Medida
                      etiqueta="Alto"
                      value={borrador.alto}
                      onChange={(v) => setBorrador({ ...borrador, alto: v })}
                    />
                  </div>
                  <p className="text-[12.5px] leading-relaxed text-muted-foreground">
                    Buscamos cajas con una tolerancia de ±{tolerancia} cm sobre
                    cada dimensión. Podés completar sólo las que te importen.
                  </p>
                </div>
              )}

              {panel === "categoria" && (
                <ul className="flex flex-col gap-2">
                  <li>
                    <Opcion
                      activo={borrador.categoria === null}
                      onClick={() =>
                        setBorrador({ ...borrador, categoria: null })
                      }
                      cuenta={total}
                    >
                      Todas
                    </Opcion>
                  </li>
                  {categorias.map((c) => (
                    <li key={c.nombre}>
                      <Opcion
                        activo={borrador.categoria === c.nombre}
                        onClick={() =>
                          setBorrador({ ...borrador, categoria: c.nombre })
                        }
                        cuenta={c.count}
                      >
                        {c.nombre}
                      </Opcion>
                    </li>
                  ))}
                </ul>
              )}

              {panel === "precio" && (
                <ul className="flex flex-col gap-2">
                  {rangos.map((r) => (
                    <li key={r.id}>
                      <Opcion
                        activo={borrador.rango === r.id}
                        onClick={() => setBorrador({ ...borrador, rango: r.id })}
                      >
                        {r.nombre}
                      </Opcion>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* pb extra: deja aire sobre la barra del navegador en iOS. */}
            <div className="border-t px-5 pb-6 pt-4">
              <button
                type="button"
                onClick={aplicar}
                className="h-12 w-full rounded-full bg-foreground text-[15px] font-semibold text-background transition-opacity hover:opacity-90"
              >
                Aplicar
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

const TITULOS: Record<Exclude<Panel, null>, string> = {
  medidas: "Filtrar por medidas",
  categoria: "Filtrar por categoría",
  precio: "Filtrar por precio",
}
