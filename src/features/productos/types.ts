import { type Database } from "@/integrations/supabase/types"

/** Fila de la tabla `productos` tal como la devuelve Supabase. */
export type Producto = Database["public"]["Tables"]["productos"]["Row"]
