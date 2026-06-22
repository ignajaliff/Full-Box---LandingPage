import { Package, Ruler } from "lucide-react"

import { formatCurrency } from "@/lib/format-currency"
import { formatMedidas, type ProductoDemo } from "../data/demo"

/** Tarjeta de producto reutilizada en la home y en el catálogo completo. */
export function ProductoCard({ producto }: { producto: ProductoDemo }) {
  return (
    <li className="group flex flex-col overflow-hidden rounded-xl border bg-card text-card-foreground transition-all duration-300 hover:-translate-y-1 hover:border-brand-blue/40 hover:shadow-lg hover:shadow-brand-blue/5">
      <div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden bg-muted">
        <Package
          className="size-16 text-primary/30 transition-transform duration-300 group-hover:scale-110 group-hover:text-brand-blue/40"
          aria-hidden
        />
        <span className="absolute left-3 top-3 rounded-full bg-brand-blue px-3 py-1 text-xs font-medium text-brand-blue-foreground shadow-sm">
          {producto.categoria}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <h3 className="font-semibold">{producto.nombre}</h3>
        <p className="text-sm text-muted-foreground">{producto.descripcion}</p>

        <div className="mt-auto flex items-center justify-between border-t pt-4">
          <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
            <Ruler className="size-4" aria-hidden />
            {formatMedidas(producto)}
          </span>
          <span className="text-right">
            <span className="block text-xs text-muted-foreground">desde</span>
            <span className="font-display font-bold text-brand-blue">
              {formatCurrency(producto.desde)}
            </span>
          </span>
        </div>
      </div>
    </li>
  )
}
