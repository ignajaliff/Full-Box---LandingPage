"use client"

import { useEffect } from "react"

/**
 * Publica la altura real de la cabecera en `--altura-cabecera`.
 *
 * El hero ocupa `100svh - var(--altura-cabecera)`. Esa altura no se puede
 * hardcodear: depende de tres barras cuyo alto cambia con la tipografía, el
 * zoom del navegador y el breakpoint (la navegación se oculta en mobile).
 * Medirla evita que el hero quede corto o desborde la pantalla.
 */
export function MedirCabecera({ para }: { para: string }) {
  useEffect(() => {
    const cabecera = document.getElementById(para)
    if (!cabecera) return

    const publicar = () => {
      const alto = cabecera.getBoundingClientRect().height
      document.documentElement.style.setProperty("--altura-cabecera", `${alto}px`)
    }

    publicar()
    const observador = new ResizeObserver(publicar)
    observador.observe(cabecera)
    return () => observador.disconnect()
  }, [para])

  return null
}
