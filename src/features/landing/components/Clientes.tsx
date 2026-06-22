import { CLIENTES_DEMO } from "../data/contenido"

export function Clientes() {
  return (
    <section id="clientes" className="border-b">
      <div className="mx-auto max-w-6xl px-6 py-20">
        <div className="mb-12 flex flex-col gap-3 text-center">
          <span className="mx-auto text-sm font-semibold uppercase tracking-[0.2em] text-brand-blue">
            Clientes
          </span>
          <h2 className="font-display text-4xl font-bold tracking-tight md:text-5xl">
            Nos eligen empresas de Mendoza
          </h2>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            Acompañamos a bodegas, olivícolas, distribuidoras y comercios de
            toda la provincia con su packaging.
          </p>
        </div>

        <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {CLIENTES_DEMO.map((cliente) => (
            <li
              key={cliente}
              className="flex h-24 items-center justify-center rounded-lg border bg-card p-4 text-center text-sm font-medium text-muted-foreground transition-all hover:border-brand-blue/40 hover:text-brand-blue hover:shadow-sm"
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
