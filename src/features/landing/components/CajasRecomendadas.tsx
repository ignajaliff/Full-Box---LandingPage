import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { Button } from "@/shared/components/ui/button"
import { formatCurrency } from "@/lib/format-currency"
import { getProductosDestacados } from "@/features/productos/queries"
import { formatMedidas } from "@/features/productos/types"

/**
 * Catálogo destacado. Vive fuera del Hero (que tiene fondo amarillo) para
 * conservar el fondo neutro y los detalles en color acento.
 */
export async function CajasRecomendadas() {
  const recomendadas = await getProductosDestacados(4)
  if (recomendadas.length === 0) return null

  return (
    <section id="recomendadas" className="py-14 md:py-20">
      <div className="mx-auto max-w-7xl px-5 sm:px-6">
        <div className="mb-6 flex flex-col items-center gap-2 text-center md:mb-7 md:gap-2.5">
          <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-acento md:text-xs">
            Lo más vendido
          </span>
          <h2 className="text-balance text-xl font-extrabold tracking-tight sm:text-2xl md:text-3xl">
            Cajas recomendadas
          </h2>
        </div>

        {/* Tarjetas contenidas: el grid no se estira a los 1280px del hero.
            Dos columnas ya en mobile: a una sola quedaban enormes.
            El pb-2 deja lugar a la sombra del hover, que se dibuja fuera
            del borde de la tarjeta y si no quedaba recortada. */}
        <ul className="mx-auto grid max-w-5xl grid-cols-2 gap-3 pb-2 sm:gap-4 lg:grid-cols-4">
          {recomendadas.map((producto) => (
            <li key={producto.id}>
              <Link
                href={producto.slug ? `/productos/${producto.slug}` : "/productos"}
                className="group flex h-full flex-col overflow-hidden rounded-xl border bg-card transition-all duration-300 hover:border-acento/40 hover:shadow-lg"
              >
                {/* object-cover: la foto llena el cuadro en vez de flotar
                    con aire alrededor. */}
                <span className="relative block aspect-square overflow-hidden bg-muted/40">
                  <Image
                    src={producto.imagen_url ?? "/producto-ejemplo.png"}
                    alt=""
                    width={600}
                    height={600}
                    sizes="(min-width: 1024px) 20vw, 50vw"
                    className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </span>

                <span className="flex flex-1 flex-col gap-0.5 p-3 sm:p-3.5">
                  <span className="text-xs font-semibold leading-snug sm:text-[13px]">
                    {producto.nombre}
                  </span>
                  <span className="text-[11px] text-muted-foreground sm:text-xs">
                    {formatMedidas(producto)}
                  </span>
                  <span className="mt-auto flex items-center justify-between gap-2 pt-2.5 sm:pt-3">
                    {producto.precio !== null ? (
                      <span className="flex flex-col leading-tight">
                        <span className="text-[10px] text-muted-foreground">
                          desde
                        </span>
                        <span className="text-sm font-bold sm:text-[15px]">
                          {formatCurrency(producto.precio)}
                        </span>
                      </span>
                    ) : (
                      <span className="text-xs font-medium text-muted-foreground sm:text-[13px]">
                        Consultar
                      </span>
                    )}
                    <span className="inline-flex size-7 shrink-0 items-center justify-center rounded-full bg-acento text-acento-foreground transition-opacity group-hover:opacity-90 sm:size-8">
                      <ArrowRight className="size-3.5" aria-hidden />
                    </span>
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>

        <div className="mt-8 flex justify-center">
          <Button asChild variant="outline" className="border-foreground/15">
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
