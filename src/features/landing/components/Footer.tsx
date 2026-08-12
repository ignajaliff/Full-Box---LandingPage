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
    <footer className="bg-[#333333] text-[#f5f1e1]">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 md:grid-cols-[1.4fr_1fr_1fr]">
        {/* Marca */}
        <div className="flex flex-col gap-4">
          {/* self-start es necesario: el padre es flex-col y su align-items
              por defecto (stretch) estira la imagen a lo ancho de la columna.
              brightness+invert: el logo es oscuro y acá el fondo es charcoal. */}
          <Image
            src="/logogrisoscuro.png"
            alt={EMPRESA.nombre}
            width={597}
            height={294}
            className="h-9 w-auto self-start brightness-0 invert"
          />
          <p className="max-w-xs text-sm text-[#f5f1e1]/60">
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
              className="w-fit text-sm text-[#f5f1e1]/60 transition-colors hover:text-acento"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Contacto */}
        <div className="flex flex-col gap-3">
          <h2 className="text-sm font-semibold">Contacto</h2>
          <ul className="flex flex-col gap-3 text-sm text-[#f5f1e1]/60">
            <li className="flex items-start gap-2.5">
              <MapPin className="mt-0.5 size-4 shrink-0 text-acento" aria-hidden />
              {EMPRESA.direccion}, {EMPRESA.ciudad}
            </li>
            <li className="flex items-start gap-2.5">
              <Phone className="mt-0.5 size-4 shrink-0 text-acento" aria-hidden />
              <a
                href={`tel:${EMPRESA.telefono.replace(/\s|-/g, "")}`}
                className="transition-colors hover:text-acento"
              >
                {EMPRESA.telefono}
              </a>
            </li>
            <li className="flex items-start gap-2.5">
              <Mail className="mt-0.5 size-4 shrink-0 text-acento" aria-hidden />
              <a
                href={`mailto:${EMPRESA.email}`}
                className="break-all transition-colors hover:text-acento"
              >
                {EMPRESA.email}
              </a>
            </li>
            <li className="flex items-start gap-2.5">
              <Clock className="mt-0.5 size-4 shrink-0 text-acento" aria-hidden />
              {EMPRESA.horario}
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-[#f5f1e1]/15">
        <p className="mx-auto max-w-7xl px-6 py-5 text-xs text-[#f5f1e1]/50">
          © {new Date().getFullYear()} {EMPRESA.nombre}. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  )
}
