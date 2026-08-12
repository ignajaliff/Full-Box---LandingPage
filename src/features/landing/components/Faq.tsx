import { ChevronDown, MessageCircle } from "lucide-react"

import { Button } from "@/shared/components/ui/button"
import { FAQ, linkWhatsApp } from "../data/contenido"

/**
 * Preguntas frecuentes. Usa <details>/<summary> nativos: acordeón accesible
 * y con búsqueda del navegador, sin JavaScript ni estado en cliente.
 */
export function Faq() {
  return (
    <section id="faq" className="bg-background">
      <div className="mx-auto max-w-7xl px-6 py-20 md:py-24">
        <div className="grid gap-10 md:grid-cols-[0.8fr_1.2fr] md:gap-16">
          <div className="flex flex-col items-start gap-4">
            <span className="text-xs font-semibold uppercase tracking-[0.16em] text-acento">
              Preguntas frecuentes
            </span>
            <h2 className="text-balance text-4xl font-extrabold tracking-tight md:text-5xl">
              Lo que más nos consultan
            </h2>
            <p className="text-pretty text-muted-foreground">
              ¿Te quedó una duda? Escribinos por WhatsApp y te contestamos en el
              día.
            </p>
            <Button
              asChild
              className="mt-1 bg-acento text-acento-foreground hover:bg-acento/90"
            >
              <a
                href={linkWhatsApp("¡Hola! Tengo una consulta sobre las cajas.")}
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle className="size-4" aria-hidden />
                Hacer una consulta
              </a>
            </Button>
          </div>

          <ul className="flex flex-col">
            {FAQ.map((item) => (
              <li key={item.pregunta} className="border-b first:border-t">
                <details className="group">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 text-left font-semibold transition-colors hover:text-acento [&::-webkit-details-marker]:hidden">
                    {item.pregunta}
                    <ChevronDown
                      className="size-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-180"
                      aria-hidden
                    />
                  </summary>
                  <p className="pb-4 pr-8 text-pretty text-sm leading-relaxed text-muted-foreground">
                    {item.respuesta}
                  </p>
                </details>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
