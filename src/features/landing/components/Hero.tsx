import { ArrowRight, Boxes, MessageCircle } from "lucide-react"

import { Button } from "@/shared/components/ui/button"
import { EMPRESA, STATS, linkWhatsApp } from "../data/contenido"
import { BoxAssembly } from "./BoxAssembly"

export function Hero() {
  return (
    <section id="inicio" className="relative overflow-hidden border-b bg-white">
      <div className="relative mx-auto grid max-w-6xl items-center gap-6 px-6 py-16 md:grid-cols-2 md:gap-10 md:py-28">
        {/* Columna izquierda — textos */}
        <div className="flex flex-col items-center gap-6 text-center md:items-start md:text-left">
          <span className="inline-flex animate-in fade-in slide-in-from-bottom-3 items-center gap-2 rounded-full border border-cardboard/50 bg-cardboard/10 px-4 py-1.5 text-sm font-medium text-foreground duration-700">
            <Boxes className="size-4 text-cardboard" aria-hidden />
            Fábrica de cajas en {EMPRESA.ciudad}
          </span>

          <h1
            className="max-w-xl animate-in fade-in slide-in-from-bottom-4 text-balance font-display text-5xl font-extrabold leading-[1.05] tracking-tight duration-700 md:text-6xl"
            style={{ animationDelay: "80ms" }}
          >
            Cajas de cartón{" "}
            <span className="rounded-md bg-cardboard px-2 text-cardboard-foreground">
              a medida
            </span>{" "}
            de tu producto
          </h1>

          <p
            className="max-w-md animate-in fade-in slide-in-from-bottom-4 text-pretty text-lg text-muted-foreground duration-700"
            style={{ animationDelay: "160ms" }}
          >
            Vos nos pasás las medidas, nosotros fabricamos la caja exacta:
            cartón resistente, tu marca impresa y entrega a tiempo.
          </p>

          <div
            className="flex animate-in fade-in slide-in-from-bottom-4 flex-col gap-3 duration-700 sm:flex-row"
            style={{ animationDelay: "240ms" }}
          >
            <Button asChild size="lg">
              <a
                href={linkWhatsApp("¡Hola! Quiero cotizar cajas a medida.")}
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle className="size-4" aria-hidden />
                Cotizar mi caja
              </a>
            </Button>
            <Button asChild variant="outline" size="lg">
              <a href="#catalogo">
                Ver catálogo
                <ArrowRight className="size-4" aria-hidden />
              </a>
            </Button>
          </div>

          <dl
            className="mt-6 flex animate-in fade-in flex-wrap items-center justify-center gap-x-12 gap-y-4 duration-1000 md:justify-start"
            style={{ animationDelay: "360ms" }}
          >
            {STATS.map((stat) => (
              <div key={stat.etiqueta} className="text-center md:text-left">
                <dt className="font-display text-3xl font-bold tracking-tight text-brand-blue md:text-4xl">
                  {stat.valor}
                </dt>
                <dd className="text-sm text-muted-foreground">{stat.etiqueta}</dd>
              </div>
            ))}
          </dl>
        </div>

        {/* Columna derecha — caja que se arma sola */}
        <div
          className="animate-in fade-in zoom-in-95 duration-1000"
          style={{ animationDelay: "200ms" }}
        >
          <BoxAssembly />
        </div>
      </div>
    </section>
  )
}
