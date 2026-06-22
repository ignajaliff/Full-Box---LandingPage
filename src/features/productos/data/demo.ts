/**
 * Catálogo de muestra (boceto). Datos hardcodeados hasta conectar Supabase.
 * Dimensiones en cm para que el buscador por medidas funcione.
 * TODO Full Box: reemplazar por la tabla `productos` real (ver queries.ts).
 */

export type ProductoDemo = {
  slug: string
  nombre: string
  categoria: string
  descripcion: string
  largo: number // cm
  ancho: number // cm
  alto: number // cm
  desde: number
  destacado?: boolean
}

export const PRODUCTOS_DEMO: ProductoDemo[] = [
  // Vinos — uno de los más pedidos en Mendoza
  { slug: "caja-vino-6", nombre: "Caja para 6 botellas", categoria: "Vinos", descripcion: "Con divisores internos: protege cada botella.", largo: 32, ancho: 22, alto: 32, desde: 480, destacado: true },
  { slug: "estuche-vino-1", nombre: "Estuche para 1 botella", categoria: "Vinos", descripcion: "Presentación premium, ideal para regalo.", largo: 36, ancho: 11, alto: 11, desde: 210 },
  { slug: "caja-vino-12", nombre: "Caja para 12 botellas", categoria: "Vinos", descripcion: "Doble corrugado para transporte y stock.", largo: 32, ancho: 44, alto: 32, desde: 720 },

  // E-commerce — el rubro que más crece
  { slug: "caja-ecommerce-mediana", nombre: "Caja e-commerce mediana", categoria: "E-commerce", descripcion: "El tamaño más pedido para tiendas online.", largo: 30, ancho: 22, alto: 15, desde: 240, destacado: true },
  { slug: "caja-autoarmable", nombre: "Caja autoarmable", categoria: "E-commerce", descripcion: "Se arma en segundos, sin cinta.", largo: 25, ancho: 18, alto: 10, desde: 200, destacado: true },
  { slug: "caja-ecommerce-chica", nombre: "Caja e-commerce chica", categoria: "E-commerce", descripcion: "Para envíos de productos pequeños.", largo: 20, ancho: 15, alto: 10, desde: 180 },
  { slug: "caja-ecommerce-grande", nombre: "Caja e-commerce grande", categoria: "E-commerce", descripcion: "Para envíos voluminosos y livianos.", largo: 40, ancho: 30, alto: 25, desde: 320 },

  // Retail
  { slug: "caja-con-tapa", nombre: "Caja con tapa premium", categoria: "Retail", descripcion: "Presentación de marca para un buen unboxing.", largo: 25, ancho: 25, alto: 12, desde: 520, destacado: true },
  { slug: "caja-calzado", nombre: "Caja para calzado", categoria: "Retail", descripcion: "Resistente y apilable, lista para vidriera.", largo: 33, ancho: 20, alto: 12, desde: 280 },

  // Gastronomía
  { slug: "caja-delivery", nombre: "Caja gastronómica delivery", categoria: "Gastronomía", descripcion: "Microcorrugado liviano, apta para alimentos.", largo: 32, ancho: 32, alto: 4, desde: 150 },
  { slug: "caja-viandas", nombre: "Caja para viandas", categoria: "Gastronomía", descripcion: "Con asa, para catering y eventos.", largo: 28, ancho: 20, alto: 8, desde: 190 },

  // Industria / mudanza / logística
  { slug: "caja-mudanza", nombre: "Caja reforzada de mudanza", categoria: "Mudanza", descripcion: "Doble corrugado, soporta gran peso y apilado.", largo: 50, ancho: 40, alto: 40, desde: 690 },
  { slug: "caja-archivo", nombre: "Caja archivo de oficina", categoria: "Industria", descripcion: "Para documentación, con porta-etiqueta.", largo: 38, ancho: 28, alto: 27, desde: 310 },
  { slug: "caja-pallet", nombre: "Contenedora para pallet", categoria: "Logística", descripcion: "Gran formato para consolidar carga.", largo: 60, ancho: 40, alto: 50, desde: 980 },
]

/** "32 × 22 × 32 cm" */
export function formatMedidas(p: Pick<ProductoDemo, "largo" | "ancho" | "alto">): string {
  return `${p.largo} × ${p.ancho} × ${p.alto} cm`
}

/** Los más pedidos para la home. */
export function getDestacados(limit = 4): ProductoDemo[] {
  return PRODUCTOS_DEMO.filter((p) => p.destacado).slice(0, limit)
}

type Medidas = Pick<ProductoDemo, "largo" | "ancho" | "alto">

/**
 * Precio estimado de una caja a medida (boceto).
 * Base + cartón necesario (área de las 6 caras). Redondeo a $10.
 * TODO Full Box: ajustar BASE/RATE a los costos reales.
 */
export function estimarPrecio({ largo, ancho, alto }: Medidas): number {
  const area = 2 * (largo * ancho + largo * alto + ancho * alto) // cm² de cartón
  const BASE = 80
  const RATE = 0.08
  return Math.round((BASE + area * RATE) / 10) * 10
}
