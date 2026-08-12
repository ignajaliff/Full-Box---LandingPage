/**
 * Animación de carga: una línea se estira y va dibujando los lados de una
 * caja mientras, en paralelo, se escribe "FULL BOX" debajo.
 *
 * La caja es un trazo continuo que recorre el contorno; el texto usa la
 * misma técnica de stroke-dashoffset sobre las letras, así los dos gestos
 * se leen como el mismo trazo.
 *
 * SVG + CSS, sin JavaScript. Las keyframes viven en globals.css.
 */

const KRAFT = "#a27f6d"

export function CajaAnimada({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 150" className={className} role="presentation">
      <g
        fill="none"
        stroke={KRAFT}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/*
          Contorno de la caja en un trazo: base → derecha → techo → izquierda.
          Trazo fino y esquinas apenas redondeadas: más liviano que un
          contorno grueso, que es lo que hacía verlo tosco.
          Perímetro = 66 + 52 + 66 + 52 = 236.
        */}
        <path
          d="M67 106 H133 V54 H67 V106"
          strokeWidth="2.5"
          className="caja-contorno"
        />

        {/* Pliegue de la tapa: aparece cuando el contorno ya cerró. */}
        <path
          d="M67 68 H133"
          strokeWidth="2.5"
          className="caja-pliegue"
        />

        {/*
          "FULL BOX" dibujado como trazos. Cada letra se escribe con el mismo
          dashoffset; el retraso escalonado las va encadenando.
          Todas comparten dasharray 60, holgado para la letra más larga.
        */}
        <g strokeWidth="2" className="caja-texto">
          {/* F */}
          <path d="M40 126 v18 M40 126 h9 M40 135 h7" style={{ "--i": 0 } as React.CSSProperties} />
          {/* U */}
          <path d="M55 126 v13 a5 5 0 0 0 10 0 v-13" style={{ "--i": 1 } as React.CSSProperties} />
          {/* L */}
          <path d="M72 126 v18 h9" style={{ "--i": 2 } as React.CSSProperties} />
          {/* L */}
          <path d="M87 126 v18 h9" style={{ "--i": 3 } as React.CSSProperties} />

          {/* B */}
          <path
            d="M112 144 v-18 h7 a4.5 4.5 0 0 1 0 9 h-7 m7 0 a4.5 4.5 0 0 1 0 9 h-7"
            style={{ "--i": 4 } as React.CSSProperties}
          />
          {/* O */}
          <path
            d="M130 131 a5.5 6.5 0 0 1 11 0 v7 a5.5 6.5 0 0 1 -11 0 z"
            style={{ "--i": 5 } as React.CSSProperties}
          />
          {/* X */}
          <path d="M148 126 l10 18 m0 -18 l-10 18" style={{ "--i": 6 } as React.CSSProperties} />
        </g>
      </g>
    </svg>
  )
}
