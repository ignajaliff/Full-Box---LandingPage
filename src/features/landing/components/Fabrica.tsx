import { Cotizador } from "@/features/productos/components/Cotizador"
import { getProductos } from "@/features/productos/queries"
import { PROCESO } from "../data/contenido"

export async function Fabrica() {
  const productos = await getProductos()

  return (
    <section
      id="fabrica"
      className="bg-grid relative bg-[#333333] text-[#f5f1e1]"
    >
      <div className="relative mx-auto max-w-7xl px-6 py-20 md:py-24">
        <div className="mb-16 grid gap-10 md:grid-cols-2 md:items-center md:gap-16">
          {/* Izquierda — título y bajada */}
          <div className="flex flex-col items-start gap-4 text-left">
            <span className="text-xs font-semibold uppercase tracking-[0.16em] text-acento">
              Cajas a medida
            </span>
            <h2 className="text-balance text-4xl font-extrabold tracking-tight md:text-5xl">
              Cajas hechas para tu producto
            </h2>
            <p className="max-w-md text-pretty text-[#f5f1e1]/70">
              ¿Tu producto no entra en una caja estándar? Diseñamos y fabricamos
              la caja perfecta para vos, con tu marca impresa si lo necesitás.
            </p>
          </div>

          {/* Derecha — los 4 pasos apilados */}
          <ol className="flex flex-col">
            {PROCESO.map((item, i) => (
              <li
                key={item.paso}
                className={`flex items-start gap-5 py-4 ${
                  i > 0 ? "border-t border-[#f5f1e1]/15" : ""
                }`}
              >
                <span className="w-14 shrink-0 text-3xl font-extrabold tracking-tight text-acento">
                  {item.paso}
                </span>
                <div className="flex flex-col gap-1">
                  <h3 className="font-semibold">{item.titulo}</h3>
                  <p className="text-sm text-[#f5f1e1]/60">{item.texto}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        {/* El cotizador vuelve a superficie clara: es un formulario y necesita
            los tokens normales para que los inputs se lean. */}
        <div className="mx-auto max-w-3xl rounded-2xl bg-background p-6 text-foreground shadow-xl md:p-8">
          <Cotizador productos={productos} />
        </div>
      </div>
    </section>
  )
}
