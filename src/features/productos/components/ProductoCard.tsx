import Image from "next/image"
import Link from "next/link"

import { formatCurrency } from "@/lib/format-currency"
import { formatMedidas, type Producto } from "../types"

/** Tarjeta de producto reutilizada en la home y en el catálogo. */
export function ProductoCard({ producto }: { producto: Producto }) {
  const href = producto.slug ? `/productos/${producto.slug}` : null

  const contenido = (
    <>
      <div className="relative flex aspect-square items-center justify-center bg-muted/40 p-4">
        <Image
          src={producto.imagen_url ?? "/producto-ejemplo.png"}
          alt={producto.nombre}
          width={600}
          height={600}
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
          className="max-h-full w-auto object-contain transition-transform duration-300 group-hover:scale-105"
        />
        {producto.categoria && (
          <span className="absolute left-3 top-3 rounded-full border bg-background px-2.5 py-1 text-[11px] font-medium text-muted-foreground">
            {producto.categoria}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-1.5 p-4">
        <h3 className="text-sm font-semibold leading-snug">{producto.nombre}</h3>
        <span className="text-xs text-muted-foreground">
          {formatMedidas(producto)}
        </span>

        <div className="mt-auto flex items-center justify-between gap-2 pt-3">
          <span className="flex flex-col">
            {producto.precio !== null ? (
              <>
                <span className="text-[10.5px] text-muted-foreground">desde</span>
                <span className="text-base font-bold">
                  {formatCurrency(producto.precio)}
                </span>
              </>
            ) : (
              <span className="text-sm font-medium text-muted-foreground">
                Consultar
              </span>
            )}
          </span>
          {href && (
            <span className="inline-flex h-9 items-center justify-center rounded-full bg-cardboard px-4 text-xs font-semibold text-cardboard-foreground transition-opacity group-hover:opacity-90">
              Ver
            </span>
          )}
        </div>
      </div>
    </>
  )

  const clases =
    "group flex flex-col overflow-hidden rounded-2xl border bg-card text-card-foreground transition-all duration-300 hover:border-cardboard/40 hover:shadow-lg"

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
