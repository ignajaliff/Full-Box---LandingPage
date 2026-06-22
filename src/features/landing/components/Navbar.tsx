import Image from "next/image"
import { MessageCircle } from "lucide-react"

import { Button } from "@/shared/components/ui/button"
import { EMPRESA, linkWhatsApp } from "../data/contenido"

const LINKS = [
  { href: "/productos", label: "Catálogo" },
  { href: "/#fabrica", label: "A medida" },
  { href: "/#clientes", label: "Clientes" },
  { href: "/#contacto", label: "Contacto" },
] as const

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-3">
        <a href="/" className="flex items-center" aria-label={EMPRESA.nombre}>
          <Image
            src="/logofullbox.png"
            alt={EMPRESA.nombre}
            width={754}
            height={331}
            priority
            className="h-9 w-auto"
          />
        </a>

        <nav className="hidden items-center gap-8 md:flex">
          {LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-brand-blue"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <Button asChild size="sm">
          <a
            href={linkWhatsApp("¡Hola! Quiero hacer una consulta sobre cajas.")}
            target="_blank"
            rel="noopener noreferrer"
          >
            <MessageCircle className="size-4" aria-hidden />
            WhatsApp
          </a>
        </Button>
      </div>
    </header>
  )
}
