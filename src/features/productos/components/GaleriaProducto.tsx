"use client"

import Image from "next/image"
import { useEffect, useRef, useState } from "react"

/**
 * Galería del detalle de producto. Cambia de mecánica según el dispositivo:
 *
 * - Mobile: carrusel que se desliza con el dedo (scroll-snap nativo, sin
 *   librería) y puntos abajo. En una pantalla angosta el gesto esperado es
 *   arrastrar, no apuntarle a una miniatura de 60px.
 * - Desde `sm`: miniaturas en columna al costado, que se leen como un
 *   índice y no compiten en peso con la foto principal.
 *
 * Es Client Component porque la foto activa es estado local. Recibe las
 * fotos ya resueltas (ver `fotosDe`), así la página sigue siendo Server
 * Component y no baja el producto entero al cliente.
 *
 * Con una sola foto no se dibujan ni puntos ni miniaturas: sugerirían que
 * falta contenido.
 */
type Props = {
  fotos: string[]
  nombre: string
}

export function GaleriaProducto({ fotos, nombre }: Props) {
  const [activa, setActiva] = useState(0)
  const carrusel = useRef<HTMLDivElement>(null)
  // Evita que el scroll del carrusel pelee con el salto programático:
  // mientras dura el smooth scroll, onScroll no manda.
  const saltando = useRef(false)

  const hayVarias = fotos.length > 1

  /** Deriva la foto activa de la posición del scroll (gesto del dedo). */
  function alDeslizar() {
    const el = carrusel.current
    if (!el || saltando.current) return
    const i = Math.round(el.scrollLeft / el.clientWidth)
    setActiva(Math.min(Math.max(i, 0), fotos.length - 1))
  }

  /** Lleva el carrusel a una foto (punto o miniatura). */
  function irA(i: number) {
    setActiva(i)
    const el = carrusel.current
    if (!el) return
    saltando.current = true
    el.scrollTo({ left: i * el.clientWidth, behavior: "smooth" })
  }

  // Libera el bloqueo cuando el scroll programático terminó.
  useEffect(() => {
    if (!saltando.current) return
    const t = setTimeout(() => {
      saltando.current = false
    }, 400)
    return () => clearTimeout(t)
  }, [activa])

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
      {/* Miniaturas: sólo desde sm. En mobile manda el gesto. */}
      {hayVarias && (
        <ul className="hidden shrink-0 gap-2.5 sm:flex sm:w-[72px] sm:flex-col">
          {fotos.map((foto, i) => (
            <li key={foto}>
              <button
                type="button"
                onClick={() => irA(i)}
                aria-label={`Ver foto ${i + 1} de ${nombre}`}
                aria-current={i === activa}
                className={`flex aspect-square w-full items-center justify-center rounded-xl border bg-card p-2 transition-all hover:border-acento ${
                  i === activa
                    ? "border-acento ring-1 ring-acento"
                    : "opacity-60 hover:opacity-100"
                }`}
              >
                <Image
                  src={foto}
                  alt=""
                  width={160}
                  height={160}
                  sizes="72px"
                  className="max-h-full w-auto object-contain"
                />
              </button>
            </li>
          ))}
        </ul>
      )}

      <div className="flex min-w-0 flex-1 flex-col gap-3">
        {/*
          Mobile: una pista con scroll-snap — cada foto ocupa el ancho
          completo y el dedo la arrastra.
          Desde sm el carrusel se apaga (overflow oculto) y sólo se ve la
          foto activa, que cambia por miniatura.
        */}
        <div
          ref={carrusel}
          onScroll={alDeslizar}
          className="flex snap-x snap-mandatory overflow-x-auto rounded-2xl border bg-card [scrollbar-width:none] sm:overflow-hidden [&::-webkit-scrollbar]:hidden"
        >
          {fotos.map((foto, i) => (
            <div
              key={foto}
              aria-hidden={i !== activa}
              className={`flex w-full shrink-0 snap-center items-center justify-center p-6 md:p-8 ${
                /* Desde sm sólo se muestra la activa: sin carrusel, las
                   demás quedarían apiladas fuera de vista igual, pero
                   ocupando ancho y confundiendo al lector de pantalla. */
                i === activa ? "" : "sm:hidden"
              }`}
            >
              <Image
                src={foto}
                alt={i === activa ? nombre : ""}
                width={900}
                height={900}
                priority={i === 0}
                sizes="(min-width: 1024px) 45vw, 100vw"
                className="max-h-[260px] w-auto object-contain sm:max-h-[300px] md:max-h-[380px]"
              />
            </div>
          ))}
        </div>

        {/*
          Miniaturas en mobile, en lugar de puntos: un punto no dice a qué
          foto lleva. Van chicas (44px) para no robarle alto a la ficha, que
          es el tamaño mínimo que el dedo acierta con comodidad.
        */}
        {hayVarias && (
          <div className="flex justify-center gap-2 sm:hidden">
            {fotos.map((foto, i) => (
              <button
                key={foto}
                type="button"
                onClick={() => irA(i)}
                aria-label={`Ver foto ${i + 1} de ${nombre}`}
                aria-current={i === activa}
                className={`flex size-11 shrink-0 items-center justify-center rounded-lg border bg-card p-1 transition-all ${
                  i === activa
                    ? "border-acento ring-1 ring-acento"
                    : "opacity-50"
                }`}
              >
                <Image
                  src={foto}
                  alt=""
                  width={88}
                  height={88}
                  sizes="44px"
                  className="max-h-full w-auto object-contain"
                />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
