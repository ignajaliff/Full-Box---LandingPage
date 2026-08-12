import type { Metadata } from "next"
import Link from "next/link"

import { Navbar } from "@/features/landing/components/Navbar"
import { Footer } from "@/features/landing/components/Footer"
import { CatalogoBuscador } from "@/features/productos/components/CatalogoBuscador"
import { getProductos } from "@/features/productos/queries"

export const metadata: Metadata = {
  title: "Catálogo de cajas",
  description:
    "Todas las medidas de cajas de cartón disponibles en Full Box. Buscá por largo, ancho y alto.",
}

/** Revalida cada 5 min: los cambios del sistema de gestión se reflejan solos. */
export const revalidate = 300

export default async function ProductosPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>
}) {
  const [productos, { q }] = await Promise.all([getProductos(), searchParams])

  return (
    <>
      <Navbar />
      <main className="flex-1 bg-muted/30">
        <div className="mx-auto max-w-[1280px] px-6 pb-3 pt-6 md:px-7">
          <p className="mb-4 text-[12.5px] text-muted-foreground">
            <Link href="/" className="transition-colors hover:text-foreground">
              Inicio
            </Link>{" "}
            · Catálogo
          </p>
          <h1 className="mb-2 text-[38px] font-bold leading-tight tracking-tight">
            Todas las medidas existentes
          </h1>
          <p className="max-w-[44em] text-[15px] text-muted-foreground">
            Buscá por largo, ancho y alto, o por tipo de caja. ¿No está la
            medida que necesitás? La fabricamos a medida.
          </p>
        </div>

        <div className="mx-auto max-w-[1280px] px-6 pb-20 pt-5 md:px-7">
          {/* key: al cambiar `?q=` se remonta el buscador para que el estado
              interno tome el término nuevo. */}
          <CatalogoBuscador
            key={q ?? ""}
            productos={productos}
            busquedaInicial={q ?? ""}
          />
        </div>
      </main>
      <Footer />
    </>
  )
}
