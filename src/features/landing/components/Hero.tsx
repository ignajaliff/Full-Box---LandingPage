import Image from "next/image"
import { ArrowRight, MessageCircle } from "lucide-react"

import { Button } from "@/shared/components/ui/button"
import { STATS, linkWhatsApp } from "../data/contenido"

export function Hero() {
  return (
    <section id="inicio" className="relative overflow-hidden bg-white">
      {/* 100svh menos el navbar (~68px): el hero llena la primera pantalla. */}
      <div className="mx-auto flex min-h-[calc(100svh-68px)] max-w-6xl flex-col justify-between px-6 py-4 md:justify-center md:py-8">
        <div className="grid items-center gap-0 md:flex-1 md:grid-cols-[1fr_1.25fr] md:gap-10">
          {/* Columna izquierda — textos. z-10: la imagen pasa por detrás en mobile. */}
          <div className="relative z-10 flex flex-col items-center gap-4 text-center md:items-start md:gap-6 md:text-left">
            <span className="animate-in fade-in slide-in-from-bottom-3 bg-cardboard px-3 py-1.5 text-xs text-cardboard-foreground duration-700 md:px-4 md:py-2 md:text-sm">
              Antes <strong className="font-semibold">Cartonera Oeste</strong> · hoy{" "}
              <strong className="font-semibold">Full Box</strong>
            </span>

            <h1
              className="max-w-xl animate-in fade-in slide-in-from-bottom-4 text-balance text-3xl font-bold leading-[1.15] tracking-tight duration-700 sm:text-4xl md:text-6xl md:leading-[1.1]"
              style={{ animationDelay: "80ms" }}
            >
              Cajas y packaging de cartón para tu producto
            </h1>

            <p
              className="max-w-md animate-in fade-in slide-in-from-bottom-4 text-pretty text-sm text-muted-foreground duration-700 md:text-base"
              style={{ animationDelay: "160ms" }}
            >
              Más de 30 años fabricando packaging resistente y prolijo, con tu
              marca impresa y entregado en tiempo. Cuidamos cada detalle para
              que tu producto llegue impecable.
            </p>

            <div
              className="flex animate-in fade-in slide-in-from-bottom-4 flex-row gap-3 duration-700"
              style={{ animationDelay: "240ms" }}
            >
              <Button
                asChild
                className="bg-cardboard text-cardboard-foreground hover:bg-cardboard/90 md:h-11 md:px-6 md:text-base"
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
              <Button asChild variant="outline" className="md:h-11 md:px-6 md:text-base">
                <a href="#catalogo">
                  Ver catálogo
                  <ArrowRight className="size-4" aria-hidden />
                </a>
              </Button>
            </div>
          </div>

          {/* Foto. En mobile sube y se mete detrás de los botones. */}
          <div
            className="-mt-6 animate-in fade-in zoom-in-95 duration-1000 sm:-mt-10 md:mt-0"
            style={{ animationDelay: "200ms" }}
          >
            <Image
              src="/hero-productos.png"
              alt="Cajas, bolsas y packaging de cartón con la marca Full Box"
              width={1332}
              height={768}
              priority
              sizes="(min-width: 768px) 56vw, 100vw"
              className="h-auto w-full md:scale-105"
            />
          </div>
        </div>

        {/* Insights: entran en la primera pantalla, apoyados abajo. */}
        <dl
          className="grid animate-in fade-in grid-cols-2 border-t pt-4 duration-1000 md:mt-4 md:grid-cols-4 md:pt-8"
          style={{ animationDelay: "360ms" }}
        >
          {STATS.map((stat, i) => (
            <div
              key={stat.etiqueta}
              className={`flex flex-col items-center gap-0.5 px-2 py-2 text-center md:gap-1 md:px-4 md:py-3 ${
                i > 0 ? "md:border-l" : ""
              } ${i % 2 === 1 ? "border-l md:border-l" : ""}`}
            >
              <dt className="text-xl font-bold tracking-tight sm:text-2xl md:text-4xl">
                {stat.valor}
              </dt>
              <dd className="text-[11px] leading-tight text-muted-foreground sm:text-xs md:text-sm">
                {stat.etiqueta}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
