import Image from "next/image"

import { EMPRESA } from "../data/contenido"

const LINKS = [
  { href: "/productos", label: "Catálogo" },
  { href: "/#fabrica", label: "A medida" },
  { href: "/#clientes", label: "Clientes" },
  { href: "/#contacto", label: "Contacto" },
] as const

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-10 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col gap-3">
          <Image
            src="/logofullbox.png"
            alt={EMPRESA.nombre}
            width={754}
            height={331}
            className="h-9 w-auto"
          />
          <p className="text-sm text-muted-foreground">
            {EMPRESA.tagline} — {EMPRESA.ciudad}
          </p>
        </div>

        <nav className="flex flex-wrap gap-x-6 gap-y-2">
          {LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
        </nav>
      </div>

      <div className="border-t">
        <p className="mx-auto max-w-6xl px-6 py-4 text-xs text-muted-foreground">
          © {EMPRESA.nombre}. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  )
}
