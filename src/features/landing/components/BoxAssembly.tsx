/**
 * Caja de cartón que se pliega sola, en bucle (CSS 3D puro, sin JS).
 * El "net" plano (frente + paredes + tapa) se arma con la variable --fold
 * animada de 0° a 90°. Estilos en globals.css (.box-scene / .panel / .face-*).
 * Decorativa: aria-hidden.
 */
export function BoxAssembly() {
  return (
    <div className="box-scene" aria-hidden>
      <div className="box-3d">
        <div className="panel face-front">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logocajahero.png" alt="" className="box-logo" />
        </div>
        <div className="panel face-top" />
        <div className="panel face-bottom" />
        <div className="panel face-left" />
        <div className="panel face-right">
          <div className="panel face-back" />
        </div>
      </div>
    </div>
  )
}
