/**
 * Logotipo de Full Box redibujado como trazos, para que se escriba solo
 * con la técnica de stroke-dashoffset.
 *
 * El PNG de la marca (logogrisoscuro.png) no sirve acá: a un bitmap no se
 * le puede animar el trazo. Esto reproduce su estructura — el rectángulo
 * abierto a la derecha, "Full" arriba y "Box" abajo pisando la caja.
 *
 * Criterio tipográfico: un solo grosor para todo, terminaciones redondeadas
 * y una caja geométrica común a todas las letras (mismo alto de x, mismos
 * radios de curva). Mezclar remates cuadrados con curvas era lo que hacía
 * ver el conjunto desprolijo.
 *
 * Cada trazo declara su índice en `--i`; el CSS lo usa para escalonar la
 * escritura. Ver globals.css.
 */

/** Índices de escritura: primero la caja, después Full, después Box. */
const RETRASOS = {
  marco: 0,
  f: 1,
  u: 2,
  l1: 3,
  l2: 4,
  b: 5,
  o: 6,
  x: 7,
} as const

function estilo(i: number) {
  return { "--i": i } as React.CSSProperties
}

export function LogoTrazo({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 300 160"
      className={className}
      role="img"
      aria-label="Full Box"
    >
      <g
        fill="none"
        stroke="currentColor"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* Marco de la caja: abierto a la derecha, como en el logotipo. */}
        <path
          d="M116 40 H14 V146 H62"
          className="logo-trazo"
          style={estilo(RETRASOS.marco)}
        />

        {/* — Full — Mayúscula de 14 a 76; las minúsculas apoyan en 76. */}
        {/* F: lomo, brazo superior y brazo medio. */}
        <path
          d="M116 76 V14 H154 M116 42 H150"
          className="logo-trazo"
          style={estilo(RETRASOS.f)}
        />
        {/* u: dos verticales unidas por la curva del pie, con el ascenso final. */}
        <path
          d="M176 40 V64 a12 12 0 0 0 24 0 V40 M200 64 V76"
          className="logo-trazo"
          style={estilo(RETRASOS.u)}
        />
        {/* l: caída con el gancho, como en el logotipo. */}
        <path
          d="M222 14 V62 a14 14 0 0 0 14 14"
          className="logo-trazo"
          style={estilo(RETRASOS.l1)}
        />
        {/* l: la segunda, idéntica. */}
        <path
          d="M258 14 V62 a14 14 0 0 0 14 14"
          className="logo-trazo"
          style={estilo(RETRASOS.l2)}
        />

        {/* — Box — Alto de 90 a 146, pisando el marco de la caja. */}
        {/* B: lomo y las dos panzas, del mismo radio. */}
        <path
          d="M62 146 V90 H84 a14 14 0 0 1 0 28 H62 m22 0 a14 14 0 0 1 0 28 H62"
          className="logo-trazo"
          style={estilo(RETRASOS.b)}
        />
        {/*
          o: un <circle> en vez de dos arcos —encadenarlos dejaba una costura
          visible que el dibujado marcaba todavía más.
          Radio 20 y apoyada en la línea base (y=126, o sea de 106 a 146):
          en el logotipo la o es una minúscula, más baja que la B y la x.
        */}
        <circle
          cx="134"
          cy="126"
          r="20"
          className="logo-trazo"
          style={estilo(RETRASOS.o)}
        />
        {/* x: minúscula como la o —de 106 a 146, misma línea base. */}
        <path
          d="M168 106 L202 146 M202 106 L168 146"
          className="logo-trazo"
          style={estilo(RETRASOS.x)}
        />
      </g>
    </svg>
  )
}
