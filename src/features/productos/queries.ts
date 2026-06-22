import { createClient } from "@/integrations/supabase/server"
import { type Producto } from "./types"

/**
 * DAL del catálogo (lecturas server). Se llama desde Server Components.
 * El RLS de Supabase respalda estas queries (catálogo público de solo lectura).
 */

/** Productos activos, ordenados por fecha de alta. */
export async function getProductos(): Promise<Producto[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("productos")
    .select("*")
    .eq("activo", true)
    .order("created_at", { ascending: false })

  if (error) throw error
  return data
}

/** Productos destacados para la home. */
export async function getProductosDestacados(): Promise<Producto[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("productos")
    .select("*")
    .eq("activo", true)
    .eq("destacado", true)
    .order("created_at", { ascending: false })

  if (error) throw error
  return data
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
