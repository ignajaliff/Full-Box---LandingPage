import { createClient, createStaticClient } from "@/integrations/supabase/server"
import { type Producto } from "./types"

/**
 * DAL del catálogo (lecturas server). Se llama desde Server Components.
 * El RLS de Supabase respalda estas queries: la política pública solo
 * expone las filas con `activo = true`.
 */

/** Productos activos, ordenados por nombre. */
export async function getProductos(): Promise<Producto[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("productos")
    .select("*")
    .eq("activo", true)
    .order("nombre", { ascending: true })

  if (error) throw error
  return data ?? []
}

/** Productos destacados para la home. */
export async function getProductosDestacados(limit = 4): Promise<Producto[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("productos")
    .select("*")
    .eq("activo", true)
    .eq("destacado", true)
    .order("nombre", { ascending: true })
    .limit(limit)

  if (error) throw error
  return data ?? []
}

/** Detalle por slug. Devuelve null si no existe (la página decide el notFound()). */
export async function getProductoBySlug(slug: string): Promise<Producto | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("productos")
    .select("*")
    .eq("slug", slug)
    .eq("activo", true)
    .maybeSingle()

  if (error) throw error
  return data
}

/**
 * Productos parecidos a uno dado: misma categoría primero, después el resto,
 * ordenados por cercanía de volumen. Para la sección "medidas parecidas".
 */
export async function getProductosSimilares(
  producto: Producto,
  limit = 5,
): Promise<Producto[]> {
  const todos = await getProductos()
  const volumen = (p: Producto) =>
    (p.largo ?? 0) * (p.ancho ?? 0) * (p.alto ?? 0)
  const vBase = volumen(producto)

  return todos
    .filter((p) => p.id !== producto.id)
    .sort((a, b) => {
      const catA = a.categoria === producto.categoria ? 0 : 1
      const catB = b.categoria === producto.categoria ? 0 : 1
      if (catA !== catB) return catA - catB
      return Math.abs(volumen(a) - vBase) - Math.abs(volumen(b) - vBase)
    })
    .slice(0, limit)
}

/**
 * Slugs activos, para prerenderizar las fichas.
 * Usa el cliente sin cookies: corre en build time, sin request.
 */
export async function getProductoSlugs(): Promise<string[]> {
  const supabase = createStaticClient()
  const { data, error } = await supabase
    .from("productos")
    .select("slug")
    .eq("activo", true)
    .not("slug", "is", null)

  if (error) throw error
  return (data ?? []).map((p) => p.slug).filter((s): s is string => Boolean(s))
}
