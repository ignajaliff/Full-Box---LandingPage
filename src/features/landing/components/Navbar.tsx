import { getCategoriasMenu } from "@/features/productos/queries"
import { BarraAnuncios } from "./BarraAnuncios"
import { BarraNavegacion } from "./BarraNavegacion"
import { HeaderPrincipal } from "./HeaderPrincipal"

/**
 * Cabecera completa: anuncios, header con buscador y navegación con mega-menú.
 * Server Component: las categorías del menú se leen del catálogo en el server
 * y bajan como props al componente cliente que maneja el desplegable.
 */
export async function Navbar() {
  const categorias = await getCategoriasMenu()

  return (
    <header className="sticky top-0 z-50 bg-background">
      <BarraAnuncios />
      <HeaderPrincipal />
      <BarraNavegacion categorias={categorias} />
    </header>
  )
}
