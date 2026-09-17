import Image from "next/image"
import Link from "next/link"

import { formatCurrency } from "@/lib/format-currency"
import { formatMedidas, type Producto } from "../types"

/** Tarjeta de producto reutilizada en la home y en el catálogo. */
export function ProductoCard({ producto }: { producto: Producto }) {
  const href = producto.slug ? `/productos/${producto.slug}` : null

  const contenido = (
    <>
      <div className="relative flex aspect-square items-center justify-center bg-muted/40 p-3 sm:p-4">
        <Image
          src={producto.imagen_url ?? "/producto-ejemplo.png"}
          alt={producto.nombre}
          width={600}
          height={600}
          /* Dos columnas ya en mobile: cada tarjeta ocupa ~50vw en todos
             los breakpoints salvo los más anchos. */
          sizes="(min-width: 1024px) 25vw, 50vw"
          className="max-h-full w-auto object-contain transition-transform duration-300 group-hover:scale-105"
        />
        {producto.categoria && (
          <span className="absolute left-2 top-2 rounded-full bg-acento-soft px-2 py-0.5 text-[10px] font-semibold text-acento sm:left-3 sm:top-3 sm:px-2.5 sm:py-1 sm:text-[11px]">
            {producto.categoria}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-1.5 p-3 sm:p-4">
        <h3 className="text-[13px] font-semibold leading-snug sm:text-sm">
          {producto.nombre}
        </h3>
        <span className="text-[11px] text-muted-foreground sm:text-xs">
          {formatMedidas(producto)}
        </span>

        <div className="mt-auto flex items-center justify-between gap-2 pt-2.5 sm:pt-3">
          <span className="flex flex-col">
            {producto.precio !== null ? (
              <>
                <span className="text-[10.5px] text-muted-foreground">desde</span>
                <span className="text-sm font-bold sm:text-base">
                  {formatCurrency(producto.precio)}
                </span>
              </>
            ) : (
              <span className="text-[13px] font-medium text-muted-foreground sm:text-sm">
                Consultar
              </span>
            )}
          </span>
          {href && (
            <span className="inline-flex h-8 shrink-0 items-center justify-center rounded-full bg-acento px-3 text-xs font-semibold text-acento-foreground transition-opacity group-hover:opacity-90 sm:h-9 sm:px-4">
              Ver
            </span>
          )}
        </div>
      </div>
    </>
  )

  const clases =
    "group flex flex-col overflow-hidden rounded-2xl border bg-card text-card-foreground transition-all duration-300 hover:border-acento/40 hover:shadow-lg"

  return (
    <li className="contents">
      {href ? (
        <Link href={href} className={clases}>
          {contenido}
        </Link>
      ) : (
        <div className={clases}>{contenido}</div>
      )}
    </li>
  )
}
