import { type Database, type Json } from "@/integrations/supabase/types"

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
  /** % de ahorro respecto del precio base (0 en el tramo de la unidad mínima). */
  descuento: number
}

/** Como lo guarda el sistema de gestión en `productos.tramos_precio`. */
type TramoCargado = { cantidad: number; precio: number }

/**
 * `tramos_precio` llega como Json genérico: se valida la forma antes de
 * usarlo (lo que no tenga {cantidad, precio} numéricos se descarta) y se
 * devuelve ordenado por cantidad.
 */
function leerTramosPrecio(json: Json): TramoCargado[] {
  if (!Array.isArray(json)) return []

  const tramos: TramoCargado[] = []
  for (const item of json) {
    if (typeof item !== "object" || item === null || Array.isArray(item)) {
      continue
    }
    const { cantidad, precio } = item
    if (typeof cantidad === "number" && typeof precio === "number") {
      tramos.push({ cantidad, precio })
    }
  }

  return tramos.sort((a, b) => a.cantidad - b.cantidad)
}

/**
 * Tramos de precio de un producto: el precio base desde la unidad mínima y,
 * detrás, cada tramo que el sistema de gestión cargó en `tramos_precio`
 * (hasta 4, «desde N unidades, precio unitario X»). Devuelve [] si el
 * producto no tiene precio.
 */
export function getTramos(p: Producto): TramoPrecio[] {
  if (p.precio === null) return []
  const base = p.precio
  const min = p.unidad_minima

  const escalones = [
    { desde: min, precio: base },
    ...leerTramosPrecio(p.tramos_precio)
      // La base ya lo exige, pero un tramo bajo el mínimo no tendría sentido.
      .filter((t) => t.cantidad > min)
      .map((t) => ({ desde: t.cantidad, precio: t.precio })),
  ]

  return escalones.map((e, i, arr) => ({
    desde: e.desde,
    etiqueta: i === arr.length - 1 ? `${e.desde}+ u.` : `${e.desde} u.`,
    precioUnitario: e.precio,
    // Ahorro contra el precio base; nunca negativo por si un tramo lo supera.
    descuento:
      base > 0 ? Math.max(0, Math.round(((base - e.precio) / base) * 100)) : 0,
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
