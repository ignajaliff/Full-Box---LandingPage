import Image from "next/image"

import { CLIENTES } from "../data/contenido"

/**
 * Clientes en una cinta que se desplaza sola.
 *
 * Los logos van sueltos sobre el fondo, sin tarjeta y siempre a plena
 * visibilidad. Son marcas reales que respaldan a Full Box: atenuarlas
 * las volvía decorativas y costaba reconocerlas mientras la cinta pasa.
 *
 * La lista se repite hasta llenar el ancho porque son pocas marcas: con una
 * sola pasada la pista era más angosta que la pantalla y el desplazamiento
 * del 50% dejaba un claro visible.
 */

/** Veces que se repite la lista dentro de UNA pista, antes de duplicarla. */
const REPETICIONES = 4

export function Clientes() {
  return (
    <section id="clientes" className="bg-background">
      <div className="mx-auto max-w-7xl px-6 pt-20 md:pt-24">
        <div className="mb-12 flex flex-col items-center gap-4 text-center">
          <span className="text-xs font-semibold uppercase tracking-[0.16em] text-acento">
            Confianza
          </span>
          <h2 className="max-w-2xl text-balance text-4xl font-extrabold tracking-tight md:text-5xl">
            Empresas que confían en nosotros
          </h2>
          <p className="mx-auto max-w-2xl text-pretty text-muted-foreground">
            Bodegas, canteras y productores de Mendoza que embalan con
            nuestras cajas.
          </p>
        </div>
      </div>

      {/*
        La cinta sale del contenedor con ancho máximo y ocupa todo el
        viewport: una marquesina que corta a los 1280px se lee como un
        carrusel encajonado, no como una cinta continua.
      */}
      <div className="pb-20 md:pb-24">
        <FilaLogos duracion="50s" />
      </div>
    </section>
  )
}

type FilaProps = {
  duracion: string
}

function FilaLogos({ duracion }: FilaProps) {
  // La lista repetida llena el ancho; la pista completa se duplica después
  // para que el loop cierre sin salto (el -50% cae justo en la copia).
  const marcas = Array.from({ length: REPETICIONES }, () => CLIENTES).flat()

  return (
    <div
      className="logos-fila overflow-hidden"
      style={{ "--duracion": duracion } as React.CSSProperties}
    >
      {/* Los degradados de los costados desvanecen la cinta contra el fondo
          en vez de cortarla en seco contra el borde de la pantalla. */}
      <div className="relative">
        <div className="flex w-max">
          {[0, 1].map((copia) => (
            <ul
              key={copia}
              className="logos-track-izq flex shrink-0 items-center"
              // La segunda pista es un duplicado visual: no se lee dos veces.
              aria-hidden={copia === 1}
            >
              {marcas.map((cliente, i) => (
                <li key={`${cliente.nombre}-${i}`}>
                  <Marca
                    nombre={cliente.nombre}
                    logo={cliente.logo}
                    escala={"escala" in cliente ? cliente.escala : undefined}
                  />
                </li>
              ))}
            </ul>
          ))}
        </div>

        <div
          className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-background to-transparent md:w-32"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-background to-transparent md:w-32"
          aria-hidden
        />
      </div>
    </div>
  )
}

type MarcaProps = {
  nombre: string
  logo: string | null
  /** Factor sobre la altura máxima, para logos que no son apaisados. */
  escala?: number
}

/**
 * Un logo suelto, siempre legible.
 *
 * El ancho fijo mantiene el ritmo de la cinta pareja: sin él, cada marca
 * ocuparía según el largo de su logo y el espaciado quedaría irregular.
 */
function Marca({ nombre, logo, escala = 1 }: MarcaProps) {
  return (
    <div className="logo-item group flex h-32 w-56 items-center justify-center px-6 md:h-40 md:w-72 md:px-10">
      {logo ? (
        /* La altura tope va por variable y no por clase `max-h-*`: Tailwind
           genera esas clases estáticamente y no admite un factor por marca. */
        <Image
          src={logo}
          alt={nombre}
          width={240}
          height={120}
          sizes="240px"
          style={{ maxHeight: `calc(var(--alto-logo) * ${escala})` }}
          className="h-auto w-auto max-w-full object-contain transition-transform duration-300 [--alto-logo:5rem] group-hover:scale-105 md:[--alto-logo:6rem]"
        />
      ) : (
        /* Sin archivo de logo todavía: el nombre ocupa su lugar con el
           mismo tratamiento, así la cinta no queda con un hueco. */
        <span className="text-balance text-center text-base font-bold uppercase leading-tight tracking-wide text-foreground transition-transform duration-300 group-hover:scale-105 md:text-xl">
          {nombre}
        </span>
      )}
    </div>
  )
}
