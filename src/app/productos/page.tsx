import type { Metadata } from "next"

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

export default async function ProductosPage() {
  const productos = await getProductos()

  return (
    <>
      <Navbar />
      <main className="flex-1">
        <section className="bg-white">
          <div className="mx-auto flex max-w-6xl flex-col items-center gap-5 px-6 py-14 text-center md:py-16">
            <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
              Todas las medidas existentes
            </h1>
            <p className="mx-auto max-w-2xl text-muted-foreground">
              Buscá por largo, ancho y alto, o por tipo de caja. ¿No está la
              medida que necesitás? La fabricamos a medida.
            </p>
          </div>
        </section>

        <section>
          <div className="mx-auto max-w-6xl px-6 py-12">
            <CatalogoBuscador productos={productos} />
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
