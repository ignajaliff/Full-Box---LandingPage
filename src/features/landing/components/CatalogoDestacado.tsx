import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { Button } from "@/shared/components/ui/button"
import { ProductoCard } from "@/features/productos/components/ProductoCard"
import { getDestacados } from "@/features/productos/data/demo"

export function CatalogoDestacado() {
  const destacados = getDestacados(4)

  return (
    <section id="catalogo" className="border-b">
      <div className="mx-auto max-w-6xl px-6 py-20">
        <div className="mb-12 flex flex-col gap-3 text-center">
          <span className="mx-auto text-sm font-semibold uppercase tracking-[0.2em] text-brand-blue">
            Los más pedidos
          </span>
          <h2 className="font-display text-4xl font-bold tracking-tight md:text-5xl">
            Las cajas que más nos piden
          </h2>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            Modelos listos con stock: cajas para vinos, envíos de e-commerce y
            presentación retail. ¿Buscás una medida puntual? Están todas en el catálogo.
          </p>
        </div>

        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {destacados.map((producto) => (
            <ProductoCard key={producto.slug} producto={producto} />
          ))}
        </ul>

        <div className="mt-12 flex justify-center">
          <Button asChild size="lg">
            <Link href="/productos">
              Ver todas las medidas existentes
              <ArrowRight className="size-4" aria-hidden />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
