import { ANUNCIOS } from "../data/contenido"

/**
 * Franja superior con los diferenciales de Full Box en marquesina.
 * La pista se renderiza dos veces: la animación desplaza -50%, así la copia
 * toma el lugar de la original y el ciclo se cierra sin salto.
 */
export function BarraAnuncios() {
  return (
    <div className="marquee overflow-hidden bg-[#333333] text-[#f5f1e1]">
      <div className="marquee-track flex w-max">
        {[0, 1].map((copia) => (
          <ul
            key={copia}
            className="flex shrink-0 items-center"
            // La segunda pista es un duplicado visual: no debe leerse dos veces.
            aria-hidden={copia === 1}
          >
            {ANUNCIOS.map((anuncio) => (
              <li
                key={anuncio}
                className="flex items-center gap-8 whitespace-nowrap px-8 py-2 text-xs font-medium tracking-wide"
              >
                <span
                  className="size-1.5 shrink-0 rounded-full bg-acento"
                  aria-hidden
                />
                {anuncio}
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  )
}
