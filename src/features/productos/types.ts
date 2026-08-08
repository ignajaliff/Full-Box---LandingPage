import { type Database } from "@/integrations/supabase/types"

/** Fila de la tabla `productos` tal como la devuelve Supabase. */
export type Producto = Database["public"]["Tables"]["productos"]["Row"]

/**
 * Producto con las tres dimensiones cargadas.
 * El buscador por medidas y el cotizador solo operan sobre estos:
 * un producto sin largo/ancho/alto no se puede comparar numéricamente.
 */
export type ProductoConMedidas = Producto & {
  largo: number
  ancho: number
  alto: number
}

export function tieneMedidas(p: Producto): p is ProductoConMedidas {
  return p.largo !== null && p.ancho !== null && p.alto !== null
}

/** "30 × 20 × 15 cm" — usa el texto de la base y cae a las dimensiones. */
export function formatMedidas(p: Producto): string {
  if (p.medida?.trim()) return p.medida
  if (tieneMedidas(p)) return `${p.largo} × ${p.ancho} × ${p.alto} cm`
  return "Medidas a consultar"
}

/** Un tramo de compra por volumen: a más unidades, menor precio unitario. */
export type TramoPrecio = {
  desde: number
  etiqueta: string
  precioUnitario: number
  descuento: number
}

/**
 * Tramos de precio de un producto, según los descuentos cargados en la base.
 * Devuelve [] si el producto no tiene precio.
 */
export function getTramos(p: Producto): TramoPrecio[] {
  if (p.precio === null) return []
  const base = p.precio
  const min = p.unidad_minima

  const escalones = [
    { desde: min, descuento: 0 },
    { desde: 100, descuento: p.desc_x100 },
    { desde: 250, descuento: p.desc_x250 },
    { desde: 500, descuento: p.desc_x500 },
  ]

  return escalones
    // Si la unidad mínima supera un escalón, ese escalón no aplica.
    .filter((e, i) => i === 0 || e.desde > min)
    .map((e, i, arr) => ({
      desde: e.desde,
      etiqueta: i === arr.length - 1 ? `${e.desde}+ u.` : `${e.desde} u.`,
      descuento: e.descuento,
      precioUnitario: Math.round((base * (100 - e.descuento)) / 100),
    }))
}

/**
 * Precio estimado de una caja a medida.
 * Base + cartón necesario (área de las 6 caras). Redondeo a $10.
 * TODO Full Box: ajustar BASE/RATE a los costos reales.
 */
export function estimarPrecio(dim: {
  largo: number
  ancho: number
  alto: number
}): number {
  const { largo, ancho, alto } = dim
  const area = 2 * (largo * ancho + largo * alto + ancho * alto) // cm² de cartón
  const BASE = 80
  const RATE = 0.08
  return Math.round((BASE + area * RATE) / 10) * 10
}
