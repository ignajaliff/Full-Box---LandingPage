import type { Metadata } from "next"

import { Navbar } from "@/features/landing/components/Navbar"
import { Footer } from "@/features/landing/components/Footer"
import { CatalogoBuscador } from "@/features/productos/components/CatalogoBuscador"
import { PRODUCTOS_DEMO } from "@/features/productos/data/demo"

export const metadata: Metadata = {
  title: "Catálogo de cajas",
  description:
    "Todas las medidas de cajas de cartón disponibles en Full Box. Buscá por largo, ancho y alto.",
}

export default function ProductosPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <section className="border-b bg-white">
          <div className="mx-auto flex max-w-6xl flex-col gap-3 px-6 py-14 text-center md:py-16">
            <span className="mx-auto text-sm font-semibold uppercase tracking-[0.2em] text-brand-blue">
              Catálogo completo
            </span>
            <h1 className="font-display text-4xl font-bold tracking-tight md:text-5xl">
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
            <CatalogoBuscador productos={PRODUCTOS_DEMO} />
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
