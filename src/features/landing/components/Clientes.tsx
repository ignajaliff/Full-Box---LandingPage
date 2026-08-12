import { CLIENTES_DEMO } from "../data/contenido"

export function Clientes() {
  return (
    <section id="clientes" className="bg-crema">
      <div className="mx-auto max-w-7xl px-6 py-20 md:py-24">
        <div className="mb-12 flex flex-col items-center gap-4 text-center">
          <span className="text-xs font-semibold uppercase tracking-[0.16em] text-acento">
            Clientes
          </span>
          <h2 className="max-w-2xl text-balance text-4xl font-extrabold tracking-tight md:text-5xl">
            Nos eligen empresas de Mendoza
          </h2>
          <p className="mx-auto max-w-2xl text-pretty text-muted-foreground">
            Acompañamos a bodegas, olivícolas, distribuidoras y comercios de
            toda la provincia con su packaging.
          </p>
        </div>

        <ul className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-foreground/10 bg-foreground/10 sm:grid-cols-3 lg:grid-cols-4">
          {CLIENTES_DEMO.map((cliente) => (
            <li
              key={cliente}
              className="flex h-28 items-center justify-center bg-background p-4 text-center text-sm font-semibold uppercase tracking-wide text-muted-foreground transition-colors hover:text-acento"
            >
              {/* TODO Full Box: reemplazar por <Image/> del logo real del cliente */}
              {cliente}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
