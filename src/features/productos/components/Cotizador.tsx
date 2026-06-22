"use client"

import { useMemo, useState } from "react"
import { CheckCircle2, MessageCircle, Ruler, Sparkles } from "lucide-react"

import { Button } from "@/shared/components/ui/button"
import { formatCurrency } from "@/lib/format-currency"
import { linkWhatsApp } from "@/features/landing/data/contenido"
import {
  PRODUCTOS_DEMO,
  estimarPrecio,
  formatMedidas,
  type ProductoDemo,
} from "../data/demo"

/** Distancia máxima (cm) para considerar una caja "parecida". */
const UMBRAL_SIMILAR = 9

const inputClass =
  "h-11 w-full rounded-md border bg-background px-3 text-sm outline-none transition-colors focus-visible:border-brand-blue focus-visible:ring-[3px] focus-visible:ring-brand-blue/30"

/** Dimensiones ordenadas desc → comparación independiente del orden de carga. */
function ordenar(l: number, a: number, h: number): [number, number, number] {
  return [l, a, h].sort((x, y) => y - x) as [number, number, number]
}

function distancia(a: number[], b: number[]): number {
  return Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2])
}

export function Cotizador() {
  const [largo, setLargo] = useState("")
  const [ancho, setAncho] = useState("")
  const [alto, setAlto] = useState("")

  const completo =
    Number(largo) > 0 && Number(ancho) > 0 && Number(alto) > 0

  const resultado = useMemo(() => {
    if (!completo) return null
    const l = Number(largo)
    const a = Number(ancho)
    const h = Number(alto)
    const objetivo = ordenar(l, a, h)

    const ranking = PRODUCTOS_DEMO.map((p) => ({
      p,
      d: distancia(objetivo, ordenar(p.largo, p.ancho, p.alto)),
    })).sort((x, y) => x.d - y.d)

    const exacto = ranking.find((r) => r.d === 0)?.p ?? null
    const similares = ranking
      .filter((r) => r.d > 0 && r.d <= UMBRAL_SIMILAR)
      .slice(0, 3)
      .map((r) => r.p)

    return {
      exacto,
      similares,
      precio: estimarPrecio({ largo: l, ancho: a, alto: h }),
      medidas: formatMedidas({ largo: l, ancho: a, alto: h }),
    }
  }, [completo, largo, ancho, alto])

  function usar(p: ProductoDemo) {
    setLargo(String(p.largo))
    setAncho(String(p.ancho))
    setAlto(String(p.alto))
  }

  return (
    <div id="cotizador" className="rounded-2xl border bg-card p-6 text-card-foreground md:p-8">
      <div className="flex flex-col gap-2">
        <span className="inline-flex w-fit items-center gap-2 rounded-full border border-cardboard/50 bg-cardboard/10 px-3 py-1 text-xs font-medium text-foreground">
          <Sparkles className="size-3.5 text-cardboard" aria-hidden />
          Cotizador (ejemplo)
        </span>
        <h3 className="font-display text-2xl font-bold tracking-tight">
          Decinos las medidas y te decimos el precio
        </h3>
        <p className="text-sm text-muted-foreground">
          Escribí el tamaño que necesitás. Si ya la fabricamos, te la mostramos;
          si no, te damos un estimado a medida.
        </p>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        <MedidaInput etiqueta="Largo (cm)" value={largo} onChange={setLargo} />
        <MedidaInput etiqueta="Ancho (cm)" value={ancho} onChange={setAncho} />
        <MedidaInput etiqueta="Alto (cm)" value={alto} onChange={setAlto} />
      </div>

      {!completo && (
        <p className="mt-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground">
          <Ruler className="size-4" aria-hidden />
          Completá las tres medidas para ver el resultado.
        </p>
      )}

      {completo && resultado && (
        <div className="mt-6">
          {resultado.exacto ? (
            <ResultadoExacto producto={resultado.exacto} />
          ) : (
            <ResultadoMedida
              medidas={resultado.medidas}
              precio={resultado.precio}
              similares={resultado.similares}
              onUsar={usar}
            />
          )}
        </div>
      )}
    </div>
  )
}

function ResultadoExacto({ producto }: { producto: ProductoDemo }) {
  return (
    <div className="rounded-xl border border-primary/40 bg-primary/5 p-5">
      <span className="inline-flex items-center gap-1.5 rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground">
        <CheckCircle2 className="size-3.5" aria-hidden />
        Ya la fabricamos
      </span>
      <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h4 className="font-semibold">{producto.nombre}</h4>
          <p className="text-sm text-muted-foreground">
            {producto.categoria} · {formatMedidas(producto)}
          </p>
        </div>
        <div className="text-right">
          <span className="block text-xs text-muted-foreground">desde</span>
          <span className="font-display text-2xl font-bold text-brand-blue">
            {formatCurrency(producto.desde)}
          </span>
        </div>
      </div>
      <Button asChild className="mt-4">
        <a
          href={linkWhatsApp(
            `¡Hola! Quiero pedir la ${producto.nombre} (${formatMedidas(producto)}).`,
          )}
          target="_blank"
          rel="noopener noreferrer"
        >
          <MessageCircle className="size-4" aria-hidden />
          Pedir esta caja
        </a>
      </Button>
    </div>
  )
}

function ResultadoMedida({
  medidas,
  precio,
  similares,
  onUsar,
}: {
  medidas: string
  precio: number
  similares: ProductoDemo[]
  onUsar: (p: ProductoDemo) => void
}) {
  return (
    <div className="flex flex-col gap-5">
      <div className="rounded-xl border border-cardboard/50 bg-cardboard/10 p-5">
        <p className="text-sm text-muted-foreground">
          No tenemos exactamente <span className="font-medium text-foreground">{medidas}</span>,
          pero la fabricamos a medida.
        </p>
        <div className="mt-3 flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="block text-xs text-muted-foreground">Precio estimado a medida</span>
            <span className="font-display text-3xl font-bold tracking-tight">
              {formatCurrency(precio)}
            </span>
            <span className="ml-1 text-xs text-muted-foreground">/ unidad aprox.</span>
          </div>
          <Button asChild>
            <a
              href={linkWhatsApp(
                `¡Hola! Quiero cotizar una caja a medida de ${medidas}. Vi un estimado de ${formatCurrency(precio)}.`,
              )}
              target="_blank"
              rel="noopener noreferrer"
            >
              <MessageCircle className="size-4" aria-hidden />
              Cotizar estas medidas
            </a>
          </Button>
        </div>
      </div>

      {similares.length > 0 && (
        <div>
          <p className="mb-3 text-sm font-medium">Medidas parecidas en catálogo</p>
          <ul className="flex flex-col gap-2">
            {similares.map((p) => (
              <li
                key={p.slug}
                className="flex flex-wrap items-center justify-between gap-3 rounded-lg border bg-background p-3"
              >
                <span className="text-sm">
                  <span className="font-medium">{p.nombre}</span>
                  <span className="text-muted-foreground"> · {formatMedidas(p)}</span>
                </span>
                <span className="flex items-center gap-3">
                  <span className="text-sm font-semibold text-brand-blue">
                    {formatCurrency(p.desde)}
                  </span>
                  <Button variant="outline" size="sm" onClick={() => onUsar(p)}>
                    Usar estas medidas
                  </Button>
                </span>
              </li>
            ))}
          </ul>
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
