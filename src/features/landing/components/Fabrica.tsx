import { Cotizador } from "@/features/productos/components/Cotizador"
import { getProductos } from "@/features/productos/queries"
import { PROCESO } from "../data/contenido"

export async function Fabrica() {
  const productos = await getProductos()

  return (
    <section id="fabrica" className="bg-white">
      <div className="mx-auto max-w-6xl px-6 py-20">
        <div className="mb-16 grid gap-10 md:grid-cols-2 md:items-center md:gap-16">
          {/* Izquierda — título y bajada */}
          <div className="flex flex-col items-start gap-5 text-left">
            <h2 className="text-4xl font-bold tracking-tight md:text-5xl">
              Cajas hechas para tu producto
            </h2>
            <p className="max-w-md text-muted-foreground">
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
                  i > 0 ? "border-t" : ""
                }`}
              >
                <span className="w-14 shrink-0 text-3xl font-extrabold tracking-tight text-cardboard">
                  {item.paso}
                </span>
                <div className="flex flex-col gap-1">
                  <h3 className="font-semibold">{item.titulo}</h3>
                  <p className="text-sm text-muted-foreground">{item.texto}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <div className="mx-auto max-w-3xl">
          <Cotizador productos={productos} />
        </div>
      </div>
    </section>
  )
}
