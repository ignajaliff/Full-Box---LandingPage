import { Clock, MapPin, Navigation, Phone } from "lucide-react"

import { Button } from "@/shared/components/ui/button"
import { EMPRESA } from "../data/contenido"

const MAPA_QUERY = encodeURIComponent(`${EMPRESA.direccion}, ${EMPRESA.ciudad}`)
const MAPA_EMBED = `https://www.google.com/maps?q=${MAPA_QUERY}&output=embed`
const MAPA_LINK = `https://www.google.com/maps/dir/?api=1&destination=${MAPA_QUERY}`

export function Contacto() {
  return (
    <section id="contacto" className="border-b bg-muted/30">
      <div className="mx-auto max-w-6xl px-6 py-20">
        <div className="mb-12 flex flex-col gap-3 text-center">
          <span className="mx-auto text-sm font-semibold uppercase tracking-[0.2em] text-brand-blue">
            Dónde estamos
          </span>
          <h2 className="font-display text-4xl font-bold tracking-tight md:text-5xl">
            Encontranos
          </h2>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            Estamos en {EMPRESA.ciudad}. Acercate a la fábrica o escribinos:
            te atendemos en el día.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {/* Datos de contacto */}
          <div className="flex flex-col gap-4">
            <ul className="flex flex-col gap-4">
              <ContactoItem icon={MapPin} label="Dirección" valor={EMPRESA.direccion} />
              <ContactoItem
                icon={Phone}
                label="Teléfono"
                valor={EMPRESA.telefono}
                href={`tel:${EMPRESA.telefono.replace(/\s|-/g, "")}`}
              />
              <ContactoItem icon={Clock} label="Horario" valor={EMPRESA.horario} />
            </ul>

            <Button asChild className="mt-2 w-fit">
              <a href={MAPA_LINK} target="_blank" rel="noopener noreferrer">
                <Navigation className="size-4" aria-hidden />
                Cómo llegar
              </a>
            </Button>
          </div>

          {/* Mapa */}
          <div className="overflow-hidden rounded-xl border">
            <iframe
              src={MAPA_EMBED}
              title={`Ubicación de ${EMPRESA.nombre} en ${EMPRESA.ciudad}`}
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
}: {
  icon: typeof Phone
  label: string
  valor: string
  href?: string
}) {
  const contenido = (
    <>
      <span className="flex size-11 shrink-0 items-center justify-center rounded-md bg-brand-blue-soft text-brand-blue">
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
          className="flex items-center gap-3 rounded-lg transition-colors hover:text-brand-blue"
        >
          {contenido}
        </a>
      ) : (
        <span className="flex items-center gap-3">{contenido}</span>
      )}
    </li>
  )
}
