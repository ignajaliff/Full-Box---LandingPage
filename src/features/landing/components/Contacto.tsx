import { Clock, Mail, MapPin, MessageCircle, Navigation, Phone } from "lucide-react"

import { Button } from "@/shared/components/ui/button"
import { EMPRESA, linkWhatsApp } from "../data/contenido"

const DIRECCION_COMPLETA = `${EMPRESA.direccion}, ${EMPRESA.ciudad}, ${EMPRESA.provincia}`
const MAPA_QUERY = encodeURIComponent(DIRECCION_COMPLETA)
const MAPA_EMBED = `https://www.google.com/maps?q=${MAPA_QUERY}&output=embed`
const MAPA_LINK = `https://www.google.com/maps/dir/?api=1&destination=${MAPA_QUERY}`

export function Contacto() {
  return (
    <section id="contacto" className="bg-background">
      <div className="mx-auto max-w-7xl px-6 py-20 md:py-24">
        <div className="mb-12 flex flex-col items-center gap-4 text-center">
          <span className="text-xs font-semibold uppercase tracking-[0.16em] text-acento">
            Contacto
          </span>
          <h2 className="text-balance text-4xl font-extrabold tracking-tight md:text-5xl">
            Encontranos
          </h2>
          <p className="mx-auto max-w-2xl text-pretty text-muted-foreground">
            Estamos en {EMPRESA.direccion}, {EMPRESA.ciudad}. Acercate a la
            fábrica o escribinos: te atendemos en el día.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {/* Datos de contacto */}
          <div className="flex flex-col gap-4">
            <ul className="flex flex-col gap-4">
              <ContactoItem
                icon={MapPin}
                label="Dirección"
                valor={`${EMPRESA.direccion}, ${EMPRESA.ciudad}`}
                href={MAPA_LINK}
                externo
              />
              <ContactoItem
                icon={MessageCircle}
                label="Teléfono WhatsApp"
                valor={EMPRESA.telefono}
                href={linkWhatsApp("¡Hola! Quiero hacer una consulta.")}
                externo
              />
              <ContactoItem
                icon={Phone}
                label="Teléfono fijo"
                valor={EMPRESA.telefonoFijo}
                href={`tel:+54${EMPRESA.telefonoFijo.replace(/[\s-]/g, "")}`}
              />
              <ContactoItem
                icon={Mail}
                label="Email"
                valor={EMPRESA.email}
                href={`mailto:${EMPRESA.email}`}
              />
              <ContactoItem icon={Clock} label="Horario" valor={EMPRESA.horario} />
            </ul>

            <div className="mt-2 flex flex-wrap gap-3">
              <Button
                asChild
                className="bg-acento text-acento-foreground hover:bg-acento/90"
              >
                <a href={MAPA_LINK} target="_blank" rel="noopener noreferrer">
                  <Navigation className="size-4" aria-hidden />
                  Cómo llegar
                </a>
              </Button>
              <Button asChild variant="outline">
                <a
                  href={linkWhatsApp("¡Hola! Quiero hacer una consulta.")}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MessageCircle className="size-4" aria-hidden />
                  Escribinos
                </a>
              </Button>
            </div>
          </div>

          {/* Mapa */}
          <div className="overflow-hidden rounded-xl border">
            <iframe
              src={MAPA_EMBED}
              title={`Ubicación de ${EMPRESA.nombre} en ${DIRECCION_COMPLETA}`}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="h-full min-h-[300px] w-full"
            />
          </div>
        </div>
      </div>
    </section>
  )
}

function ContactoItem({
  icon: Icon,
  label,
  valor,
  href,
  externo = false,
}: {
  icon: typeof Phone
  label: string
  valor: string
  href?: string
  /** Abre en pestaña nueva (mapas). tel:/mailto: no lo necesitan. */
  externo?: boolean
}) {
  const contenido = (
    <>
      <span className="flex size-11 shrink-0 items-center justify-center rounded-md bg-muted text-foreground">
        <Icon className="size-5" aria-hidden />
      </span>
      <span className="flex flex-col">
        <span className="text-xs uppercase tracking-wider text-muted-foreground">
          {label}
        </span>
        <span className="font-medium">{valor}</span>
      </span>
    </>
  )

  return (
    <li>
      {href ? (
        <a
          href={href}
          {...(externo && { target: "_blank", rel: "noopener noreferrer" })}
          className="flex items-center gap-3 rounded-lg transition-opacity hover:opacity-70"
        >
          {contenido}
        </a>
      ) : (
        <span className="flex items-center gap-3">{contenido}</span>
      )}
    </li>
  )
}
