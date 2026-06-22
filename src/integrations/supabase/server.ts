import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { type Database } from "./types"

/**
 * Cliente de Supabase para Server Components, Server Actions y Route Handlers.
 * Reglas absolutas (@supabase/ssr): usar SOLO getAll/setAll, nunca get/set/remove.
 */
export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // Llamado desde un Server Component: ignorar.
            // El proxy.ts refresca la sesión (se agrega cuando haya auth).
          }
        },
      },
    }
  )
}
