"use client"

import { useEffect, useState } from "react"

import { CajaAnimada } from "./CajaAnimada"

/**
 * Tiempos de la pantalla. La animación del SVG dura 2.2s; los 300 ms extra
 * dejan ver el dibujo terminado un instante antes de que empiece la salida.
 */
const DURACION_MS = 2500
/** El dibujo se va primero y rápido, para que no se lo vea encimado. */
const SALIDA_CAJA_MS = 250
/** Y recién después se levanta el telón de fondo. */
const SALIDA_FONDO_MS = 450

/**
 * Pantalla de carga de entrada al sitio. Tapa la página al recargar y se
 * retira sola cuando la caja terminó de dibujarse.
 *
 * La salida va en dos capas a propósito: si el contenedor entero bajara su
 * opacidad, la caja se transparentaría junto con el fondo y por un instante
 * se vería el sitio a través del dibujo. Acá el dibujo desaparece primero
 * y el fondo se levanta después, sobre una pantalla ya limpia.
 */
export function PantallaCarga() {
  const [saliendo, setSaliendo] = useState(false)
  const [oculta, setOculta] = useState(false)

  useEffect(() => {
    const aSalir = setTimeout(() => setSaliendo(true), DURACION_MS)
    const aOcultar = setTimeout(
      () => setOculta(true),
      DURACION_MS + SALIDA_CAJA_MS + SALIDA_FONDO_MS,
    )
    return () => {
      clearTimeout(aSalir)
      clearTimeout(aOcultar)
    }
  }, [])

  // Desmontar al final evita que el overlay quede capturando clicks.
  if (oculta) return null

  return (
    <div
      aria-hidden
      className={`fixed inset-0 z-[100] bg-background transition-opacity ease-out ${
        saliendo ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
      style={{
        transitionDuration: `${SALIDA_FONDO_MS}ms`,
        // El fondo espera a que el dibujo se haya ido del todo.
        transitionDelay: saliendo ? `${SALIDA_CAJA_MS}ms` : "0ms",
      }}
    >
      <div
        className={`flex h-full items-center justify-center transition-all ease-out ${
          saliendo ? "scale-95 opacity-0" : "scale-100 opacity-100"
        }`}
        style={{ transitionDuration: `${SALIDA_CAJA_MS}ms` }}
      >
        {/* El "FULL BOX" es parte del SVG: se escribe mientras se dibuja la caja. */}
        <CajaAnimada className="w-64 md:w-80" />
      </div>
    </div>
  )
}
