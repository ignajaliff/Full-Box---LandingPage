import { Navbar } from "@/features/landing/components/Navbar"
import { Hero } from "@/features/landing/components/Hero"
import { CatalogoDestacado } from "@/features/landing/components/CatalogoDestacado"
import { Fabrica } from "@/features/landing/components/Fabrica"
import { Clientes } from "@/features/landing/components/Clientes"
import { Contacto } from "@/features/landing/components/Contacto"
import { Footer } from "@/features/landing/components/Footer"

/** Revalida cada 5 min: los cambios del sistema de gestión se reflejan solos. */
export const revalidate = 300

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <Hero />
        <CatalogoDestacado />
        <Fabrica />
        <Clientes />
        <Contacto />
      </main>
      <Footer />
    </>
  )
}
