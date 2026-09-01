import Image from "next/image"
import Link from "next/link"
import { ArrowRight, MessageCircle } from "lucide-react"

import { Button } from "@/shared/components/ui/button"
import { STATS, linkWhatsApp } from "../data/contenido"

export function Hero() {
  return (
    <section
      id="inicio"
      /*
        Sin overflow-hidden: las animaciones slide-in desplazan los elementos
        fuera del borde y un recorte acá los cortaba al entrar.

        El hero invierte la paleta: el amarillo es el fondo, no el detalle.
        Sobre él nada puede ir en amarillo, así que los acentos pasan a
        charcoal y los botones invierten el contraste.

        Ocupa la pantalla menos la cabecera (que es sticky y sí ocupa lugar
        en el flujo), así la sección siguiente queda justo fuera de la vista.
        svh y no vh: en móvil vh cuenta la barra del navegador y empujaría
        las credenciales fuera de la pantalla.
        min-h y no h: si el contenido crece (texto más largo, zoom), la
        sección se estira en vez de recortarlo.

        El min-h solo se aplica desde 700px de alto (min-h-[700px] del
        media query `sm` no sirve: mide ancho). Por debajo, la cabecera se
        come 155px y el contenido no entra: forzar la altura solo lo
        comprimiría, así que se deja fluir.
      */
      className="relative flex flex-col bg-acento [@media(min-height:700px)]:min-h-[calc(100svh-var(--altura-cabecera))]"
    >
      {/* flex-1 + justify-center: el bloque superior reparte el aire sobrante
          y queda ópticamente centrado sin importar el alto de pantalla. */}
      <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col justify-center px-5 py-4 sm:px-6 md:py-8">
        <div className="grid items-center gap-6 md:grid-cols-[1fr_1.3fr] md:gap-10">
          {/* Columna izquierda — mensaje y acciones. */}
          <div className="relative z-10 flex flex-col items-center gap-4 text-center md:items-start md:gap-5 md:text-left">
            <span className="animate-in fade-in slide-in-from-bottom-3 rounded-full bg-foreground/10 px-3.5 py-1.5 text-[11px] font-medium text-foreground duration-700 sm:px-4 sm:text-xs">
              Antes <strong className="font-semibold">Cartonera Oeste</strong> · hoy{" "}
              <strong className="font-semibold">Full Box</strong>
            </span>

            <h1
              className="max-w-xl animate-in fade-in slide-in-from-bottom-4 text-balance text-[32px] font-extrabold leading-[1.1] tracking-tight duration-700 sm:text-5xl md:text-6xl"
              style={{ animationDelay: "80ms" }}
            >
              Tu próxima caja
              {/* Sobre amarillo el resalte lo da el blanco, no el acento. */}
              <span className="block text-background">empieza acá</span>
            </h1>

            <p
              className="max-w-sm animate-in fade-in slide-in-from-bottom-4 text-pretty text-[13px] leading-relaxed text-foreground/75 duration-700 sm:text-sm md:text-base"
              style={{ animationDelay: "160ms" }}
            >
              Más de 50 años fabricando packaging resistente y prolijo, con tu
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
                className="h-11 w-full bg-foreground text-background hover:bg-foreground/90 sm:w-auto md:px-6 md:text-base"
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
                className="h-11 w-full border-foreground/30 bg-transparent hover:bg-foreground/5 sm:w-auto md:px-6 md:text-base"
              >
                <Link href="/productos">
                  Ver catálogo
                  <ArrowRight className="size-4" aria-hidden />
                </Link>
              </Button>
            </div>
          </div>

          {/*
            La foto va en su propio recuadro, por encima del amarillo. El PNG
            es opaco (trae su fondo claro quemado), así que en vez de fingir
            transparencia se presenta como tarjeta: bordes redondeados y
            sombra la despegan del fondo.
          */}
          <div
            className="animate-in fade-in zoom-in-95 overflow-hidden rounded-2xl bg-[#f5f5f5] shadow-xl ring-1 ring-foreground/10 duration-1000"
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
      <dl className="border-t border-foreground/20">
        <div className="mx-auto grid max-w-7xl grid-cols-2 px-5 sm:px-6 md:grid-cols-4">
          {STATS.map((stat, i) => (
            <div
              key={stat.etiqueta}
              className={`flex flex-col items-center gap-0.5 px-2 py-2.5 text-center md:gap-1 md:px-4 md:py-5 ${
                i > 0 ? "md:border-l md:border-foreground/20" : ""
              } ${i % 2 === 1 ? "border-l border-foreground/20" : ""} ${
                /* En 2×2 la fila de abajo necesita su borde superior. */
                i > 1 ? "border-t border-foreground/20 md:border-t-0" : ""
              }`}
            >
              <dt className="text-xl font-bold tracking-tight sm:text-2xl md:text-3xl">
                {stat.valor}
              </dt>
              <dd className="text-[11px] leading-snug text-foreground/70 sm:text-xs md:text-sm">
                {stat.etiqueta}
              </dd>
            </div>
          ))}
        </div>
      </dl>
    </section>
  )
}
