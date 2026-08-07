"use client"

import Image from "next/image"
import { useEffect, useState } from "react"

import { EMPRESA } from "../data/contenido"

const LINKS = [
  { href: "/productos", label: "Catálogo" },
  { href: "/#fabrica", label: "A medida" },
  { href: "/#clientes", label: "Clientes" },
  { href: "/#contacto", label: "Contacto" },
] as const

export function Navbar() {
  // La línea separadora aparece recién al hacer scroll.
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <header
      className={`sticky top-0 z-50 bg-background/80 backdrop-blur transition-shadow ${
        scrolled ? "border-b" : "border-b border-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-4">
        <a href="/" className="flex items-center" aria-label={EMPRESA.nombre}>
          <Image
            src="/logogrisoscuro.png"
            alt={EMPRESA.nombre}
            width={597}
            height={294}
            priority
            className="h-9 w-auto"
          />
        </a>

        <nav className="hidden items-center gap-8 md:flex">
          {LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-foreground transition-opacity hover:opacity-70"
            >
              {link.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  )
}
