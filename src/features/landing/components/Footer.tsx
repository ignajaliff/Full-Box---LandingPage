import Image from "next/image"
import { Clock, Mail, MapPin, Phone } from "lucide-react"

import { EMPRESA } from "../data/contenido"

const LINKS = [
  { href: "/productos", label: "Catálogo" },
  { href: "/#fabrica", label: "A medida" },
  { href: "/#clientes", label: "Clientes" },
  { href: "/#contacto", label: "Contacto" },
] as const

export function Footer() {
  return (
    <footer className="border-t bg-white">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-14 md:grid-cols-[1.4fr_1fr_1fr]">
        {/* Marca */}
        <div className="flex flex-col gap-4">
          {/* self-start es necesario: el padre es flex-col y su align-items
              por defecto (stretch) estira la imagen a lo ancho de la columna. */}
          <Image
            src="/logogrisoscuro.png"
            alt={EMPRESA.nombre}
            width={597}
            height={294}
            className="h-9 w-auto self-start"
          />
          <p className="max-w-xs text-sm text-muted-foreground">
            {EMPRESA.tagline} en {EMPRESA.provincia}. Más de 30 años fabricando
            packaging resistente y prolijo.
          </p>
        </div>

        {/* Navegación */}
        <nav className="flex flex-col gap-3">
          <h2 className="text-sm font-semibold">Secciones</h2>
          {LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="w-fit text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Contacto */}
        <div className="flex flex-col gap-3">
          <h2 className="text-sm font-semibold">Contacto</h2>
          <ul className="flex flex-col gap-3 text-sm text-muted-foreground">
            <li className="flex items-start gap-2.5">
              <MapPin className="mt-0.5 size-4 shrink-0 text-cardboard" aria-hidden />
              {EMPRESA.direccion}, {EMPRESA.ciudad}
            </li>
            <li className="flex items-start gap-2.5">
              <Phone className="mt-0.5 size-4 shrink-0 text-cardboard" aria-hidden />
              <a
                href={`tel:${EMPRESA.telefono.replace(/\s|-/g, "")}`}
                className="transition-colors hover:text-foreground"
              >
                {EMPRESA.telefono}
              </a>
            </li>
            <li className="flex items-start gap-2.5">
              <Mail className="mt-0.5 size-4 shrink-0 text-cardboard" aria-hidden />
              <a
                href={`mailto:${EMPRESA.email}`}
                className="break-all transition-colors hover:text-foreground"
              >
                {EMPRESA.email}
              </a>
            </li>
            <li className="flex items-start gap-2.5">
              <Clock className="mt-0.5 size-4 shrink-0 text-cardboard" aria-hidden />
              {EMPRESA.horario}
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t">
        <p className="mx-auto max-w-6xl px-6 py-5 text-xs text-muted-foreground">
          © {new Date().getFullYear()} {EMPRESA.nombre}. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  )
}
