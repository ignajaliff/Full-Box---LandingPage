import { Cotizador } from "@/features/productos/components/Cotizador"
import { PROCESO } from "../data/contenido"

export function Fabrica() {
  return (
    <section id="fabrica" className="border-b bg-muted/30">
      <div className="mx-auto max-w-6xl px-6 py-20">
        <div className="mb-12 flex flex-col gap-3 text-center">
          <span className="mx-auto text-sm font-semibold uppercase tracking-[0.2em] text-brand-blue">
            Fabricación a medida
          </span>
          <h2 className="font-display text-4xl font-bold tracking-tight md:text-5xl">
            Cajas hechas para tu producto
          </h2>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            ¿Tu producto no entra en una caja estándar? Diseñamos y fabricamos
            la caja perfecta para vos, con tu marca impresa si lo necesitás.
          </p>
        </div>

        <ol className="mb-16 grid gap-6 md:grid-cols-4">
          {PROCESO.map((item) => (
            <li key={item.paso} className="relative flex flex-col gap-2 border-l-2 border-brand-blue/20 pl-5">
              <span className="font-display text-4xl font-extrabold tracking-tight text-brand-blue">
                {item.paso}
              </span>
              <h3 className="font-semibold">{item.titulo}</h3>
              <p className="text-sm text-muted-foreground">{item.texto}</p>
            </li>
          ))}
        </ol>

        <div className="mx-auto max-w-3xl">
          <Cotizador />
        </div>
      </div>
    </section>
  )
}
