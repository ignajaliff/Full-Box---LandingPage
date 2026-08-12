import Image from "next/image"
import Link from "next/link"
import { ArrowRight, MessageCircle } from "lucide-react"

import { Button } from "@/shared/components/ui/button"
import { formatCurrency } from "@/lib/format-currency"
import { getProductosDestacados } from "@/features/productos/queries"
import { formatMedidas } from "@/features/productos/types"
import { STATS, linkWhatsApp } from "../data/contenido"

export async function Hero() {
  const recomendadas = await getProductosDestacados(4)

  return (
    <section id="inicio" className="relative bg-[#f5f5f5] pb-20 md:pb-24">
      {/*
        Sin overflow-hidden: las animaciones slide-in desplazan los elementos
        fuera del borde y un recorte acá los cortaba al entrar.
        El fondo iguala al del PNG (#f5f5f5) para que la foto no muestre su
        borde recortado.
      */}
      <div className="mx-auto max-w-7xl px-5 pt-8 sm:px-6 md:pt-8">
        <div className="grid items-center gap-6 md:grid-cols-[1fr_1.3fr] md:gap-10">
          {/* Columna izquierda — mensaje y acciones. */}
          <div className="relative z-10 flex flex-col items-center gap-4 text-center md:items-start md:gap-5 md:text-left">
            <span className="animate-in fade-in slide-in-from-bottom-3 rounded-full bg-acento-soft px-3.5 py-1.5 text-[11px] font-medium text-acento duration-700 sm:px-4 sm:text-xs">
              Antes <strong className="font-semibold">Cartonera Oeste</strong> · hoy{" "}
              <strong className="font-semibold">Full Box</strong>
            </span>

            <h1
              className="max-w-xl animate-in fade-in slide-in-from-bottom-4 text-balance text-[32px] font-extrabold leading-[1.1] tracking-tight duration-700 sm:text-5xl md:text-6xl"
              style={{ animationDelay: "80ms" }}
            >
              Tu próxima caja
              <span className="block text-acento">empieza acá</span>
            </h1>

            <p
              className="max-w-sm animate-in fade-in slide-in-from-bottom-4 text-pretty text-[13px] leading-relaxed text-muted-foreground duration-700 sm:text-sm md:text-base"
              style={{ animationDelay: "160ms" }}
            >
              Más de 30 años fabricando packaging resistente y prolijo, con tu
              marca impresa.
            </p>

            {/* En mobile los botones se apilan a ancho completo: en fila
                quedaban comprimidos y con el texto al borde. */}
            <div
              className="flex w-full animate-in fade-in slide-in-from-bottom-4 flex-col gap-2.5 duration-700 sm:w-auto sm:flex-row sm:gap-3"
              style={{ animationDelay: "240ms" }}
            >
              <Button
                asChild
                className="h-11 w-full bg-acento text-acento-foreground hover:bg-acento/90 sm:w-auto md:px-6 md:text-base"
              >
                <a
                  href={linkWhatsApp("¡Hola! Quiero cotizar cajas a medida.")}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MessageCircle className="size-4" aria-hidden />
                  Cotizar mi caja
                </a>
              </Button>
              <Button
                asChild
                variant="outline"
                className="h-11 w-full border-foreground/15 bg-transparent sm:w-auto md:px-6 md:text-base"
              >
                <Link href="/productos">
                  Ver catálogo
                  <ArrowRight className="size-4" aria-hidden />
                </Link>
              </Button>
            </div>
          </div>

          {/* Foto de productos. El margen negativo la sangra a los bordes en
              mobile; tiene que igualar al padding del contenedor. */}
          <div
            className="-mx-5 animate-in fade-in zoom-in-95 duration-1000 sm:-mx-6 md:mx-0"
            style={{ animationDelay: "200ms" }}
          >
            <Image
              src="/nuevohero-productos.png"
              alt="Cajas y packaging de cartón con la marca Full Box"
              width={1389}
              height={768}
              priority
              sizes="(min-width: 768px) 60vw, 100vw"
              className="h-auto w-full"
            />
          </div>
        </div>
      </div>

      {/* Credenciales: cierran el bloque superior del hero. */}
      <dl className="mt-2 border-y border-foreground/10 md:mt-0">
        <div className="mx-auto grid max-w-7xl grid-cols-2 px-5 sm:px-6 md:grid-cols-4">
          {STATS.map((stat, i) => (
            <div
              key={stat.etiqueta}
              className={`flex flex-col items-center gap-1 px-2 py-5 text-center md:px-4 ${
                i > 0 ? "md:border-l md:border-foreground/10" : ""
              } ${i % 2 === 1 ? "border-l border-foreground/10" : ""} ${
                /* En 2×2 la fila de abajo necesita su borde superior. */
                i > 1 ? "border-t border-foreground/10 md:border-t-0" : ""
              }`}
            >
              <dt className="text-2xl font-bold tracking-tight md:text-3xl">
                {stat.valor}
              </dt>
              <dd className="text-[11px] leading-snug text-muted-foreground sm:text-xs md:text-sm">
                {stat.etiqueta}
              </dd>
            </div>
          ))}
        </div>
      </dl>

      {/* Cajas recomendadas: cierran el hero y hacen de catálogo destacado. */}
      {recomendadas.length > 0 && (
        <div className="mx-auto mt-10 max-w-7xl px-5 sm:px-6 md:mt-16">
          {/* La línea separa las credenciales de los productos. */}
          <div className="mb-8 h-px bg-foreground/10 md:mb-12" />
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
      )}
    </section>
  )
}
