"use client"

import { useState } from "react"
import { MessageCircle } from "lucide-react"

import { formatCurrency } from "@/lib/format-currency"
import { linkWhatsApp } from "@/features/landing/data/contenido"
import { formatMedidas, getTramos, type Producto } from "../types"

/**
 * Bloque de compra de la ficha: tramos por volumen, cantidad y consulta.
 * Sin carrito: el CTA arma un mensaje de WhatsApp con producto, cantidad y total.
 */
export function FichaCompra({ producto }: { producto: Producto }) {
  const tramos = getTramos(producto)
  const [cantidad, setCantidad] = useState(producto.unidad_minima)

  // El tramo aplicado se deriva de la cantidad: el mayor escalón alcanzado.
  const tramoActivo =
    [...tramos].reverse().find((t) => cantidad >= t.desde) ?? tramos[0]

  const unitario = tramoActivo?.precioUnitario ?? producto.precio
  const subtotal = unitario !== null ? unitario * cantidad : null

  const paso = 10
  const mensaje =
    `¡Hola! Quiero consultar por ${cantidad} u. de "${producto.nombre}" ` +
    `(${formatMedidas(producto)})` +
    (subtotal !== null ? `. Total estimado: ${formatCurrency(subtotal)}.` : ".")

  return (
    <div className="flex flex-col gap-[18px]">
      {/* Precio */}
      {unitario !== null ? (
        <div className="flex flex-wrap items-baseline gap-2.5 border-y py-[18px]">
          <span className="text-[12.5px] text-muted-foreground">desde</span>
          <span className="text-4xl font-bold tracking-tight">
            {formatCurrency(unitario)}
          </span>
          <span className="text-[13px] text-muted-foreground">
            / unidad + IVA
          </span>
          {tramoActivo && tramoActivo.descuento > 0 && (
            <span className="rounded-full bg-acento px-2.5 py-1 text-[11px] font-semibold text-acento-foreground">
              −{tramoActivo.descuento}%
            </span>
          )}
        </div>
      ) : (
        <div className="border-y py-[18px]">
          <span className="text-2xl font-bold">Precio a consultar</span>
        </div>
      )}

      {/* Tramos por volumen */}
      {tramos.length > 1 && (
        <div className="flex flex-col gap-2.5">
          <span className="text-[12.5px] font-semibold text-muted-foreground">
            Cantidad — el precio baja por volumen
          </span>
          <div className="flex flex-wrap gap-2.5">
            {tramos.map((t) => (
              <button
                key={t.desde}
                type="button"
                onClick={() => setCantidad(t.desde)}
                className={`flex flex-col items-start gap-px rounded-xl border px-4 py-2.5 transition-colors ${
                  tramoActivo?.desde === t.desde
                    ? "border-foreground bg-muted/50"
                    : "hover:bg-muted/40"
                }`}
              >
                <span className="text-[13.5px] font-semibold">{t.etiqueta}</span>
                <span className="text-[11.5px] text-muted-foreground">
                  {formatCurrency(t.precioUnitario)} c/u
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Cantidad */}
      <div className="flex items-center gap-3">
        <div className="flex h-[52px] items-center overflow-hidden rounded-xl border bg-background">
          <button
            type="button"
            onClick={() =>
              setCantidad((c) => Math.max(producto.unidad_minima, c - paso))
            }
            aria-label="Restar cantidad"
            className="h-full w-11 text-xl text-muted-foreground transition-colors hover:bg-muted"
          >
            −
          </button>
          <input
            type="number"
            value={cantidad}
            min={producto.unidad_minima}
            onChange={(e) =>
              setCantidad(
                Math.max(producto.unidad_minima, Number(e.target.value) || 0),
              )
            }
            aria-label="Cantidad"
            className="h-full w-16 border-x bg-transparent text-center text-[15px] font-semibold outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none"
          />
          <button
            type="button"
            onClick={() => setCantidad((c) => c + paso)}
            aria-label="Sumar cantidad"
            className="h-full w-11 text-xl text-muted-foreground transition-colors hover:bg-muted"
          >
            +
          </button>
        </div>

        <a
          href={linkWhatsApp(mensaje)}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-[52px] flex-1 items-center justify-center gap-2.5 rounded-[14px] bg-acento px-4 text-[15px] font-semibold text-acento-foreground transition-opacity hover:opacity-90"
        >
          <MessageCircle className="size-[17px] shrink-0" aria-hidden />
          <span className="truncate">
            Consultar
            {subtotal !== null && ` · ${formatCurrency(subtotal)}`}
          </span>
        </a>
      </div>

      <p className="text-xs text-muted-foreground">
        Mínimo {producto.unidad_minima} unidades. El total es estimado: te
        confirmamos el precio final por WhatsApp.
      </p>
    </div>
  )
}
