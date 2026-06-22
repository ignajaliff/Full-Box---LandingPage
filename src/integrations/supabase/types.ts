/**
 * Tipos de la base de datos de Supabase.
 *
 * Por ahora escrito a mano. Cuando la base esté creada, regenerar con el MCP:
 *   generate_typescript_types  (o `supabase gen types typescript`)
 * y reemplazar este archivo por la salida.
 */
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      productos: {
        Row: {
          id: string
          slug: string
          nombre: string
          descripcion: string | null
          precio: number | null
          imagen_url: string | null
          categoria: string | null
          destacado: boolean
          activo: boolean
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id?: string
          slug: string
          nombre: string
          descripcion?: string | null
          precio?: number | null
          imagen_url?: string | null
          categoria?: string | null
          destacado?: boolean
          activo?: boolean
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          slug?: string
          nombre?: string
          descripcion?: string | null
          precio?: number | null
          imagen_url?: string | null
          categoria?: string | null
          destacado?: boolean
          activo?: boolean
          created_at?: string
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: Record<never, never>
    Functions: Record<never, never>
    Enums: Record<never, never>
    CompositeTypes: Record<never, never>
  }
}
