import Image from "next/image"
import { Ruler } from "lucide-react"

import { formatCurrency } from "@/lib/format-currency"
import { formatMedidas, type Producto } from "../types"

/** Tarjeta de producto reutilizada en la home y en el catálogo completo. */
export function ProductoCard({ producto }: { producto: Producto }) {
  return (
    <li className="group flex flex-col overflow-hidden rounded-xl border bg-card text-card-foreground transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      <div className="relative aspect-[4/3] overflow-hidden bg-white">
        {/* TODO Full Box: cargar imagen_url por producto desde el sistema de gestión */}
        <Image
          src={producto.imagen_url ?? "/producto-ejemplo.png"}
          alt={producto.nombre}
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
          className="object-contain transition-transform duration-300 group-hover:scale-105"
        />
        {producto.categoria && (
          <span className="absolute left-3 top-3 bg-foreground px-3 py-1 text-xs font-medium text-background">
            {producto.categoria}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <h3 className="font-semibold">{producto.nombre}</h3>
        {producto.descripcion && (
          <p className="text-sm text-muted-foreground">{producto.descripcion}</p>
        )}

        <div className="mt-auto flex items-center justify-between gap-3 border-t pt-4">
          <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
            <Ruler className="size-4 shrink-0" aria-hidden />
            {formatMedidas(producto)}
          </span>
          <span className="shrink-0 text-right">
            {producto.precio !== null ? (
              <>
                <span className="block text-xs text-muted-foreground">desde</span>
                <span className="font-bold">{formatCurrency(producto.precio)}</span>
              </>
            ) : (
              <span className="text-sm font-medium text-muted-foreground">
                Consultar
              </span>
            )}
          </span>
        </div>
      </div>
    </li>
  )
}
