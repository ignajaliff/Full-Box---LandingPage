import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"

import { Navbar } from "@/features/landing/components/Navbar"
import { Footer } from "@/features/landing/components/Footer"
import { FichaCompra } from "@/features/productos/components/FichaCompra"
import { ProductoCard } from "@/features/productos/components/ProductoCard"
import {
  getProductoBySlug,
  getProductoSlugs,
  getProductosSimilares,
} from "@/features/productos/queries"
import { formatMedidas } from "@/features/productos/types"
import { PROCESO } from "@/features/landing/data/contenido"

export const revalidate = 300

type Props = { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  const slugs = await getProductoSlugs()
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const producto = await getProductoBySlug(slug)
  if (!producto) return { title: "Producto no encontrado" }

  return {
    title: producto.nombre,
    description:
      producto.descripcion ??
      `${producto.nombre} — ${formatMedidas(producto)}. Fabricación propia en Mendoza.`,
  }
}

export default async function ProductoPage({ params }: Props) {
  const { slug } = await params
  const producto = await getProductoBySlug(slug)
  if (!producto) notFound()

  const similares = await getProductosSimilares(producto, 5)

  const specs = [
    { etiqueta: "Medidas", valor: formatMedidas(producto) },
    { etiqueta: "Cartón", valor: producto.tipo_carton ?? "A consultar" },
    { etiqueta: "Plazo", valor: producto.plazo_entrega ?? "A consultar" },
    {
      etiqueta: "Impresión",
      valor: producto.admite_impresion ? "Tu marca, opcional" : "Sin impresión",
    },
  ]

  return (
    <>
      <Navbar />
      <main className="flex-1 bg-muted/30">
        {/* Breadcrumb */}
        <div className="mx-auto max-w-[1280px] px-6 pt-6 md:px-7">
          <p className="text-[12.5px] text-muted-foreground">
            <Link href="/" className="transition-colors hover:text-foreground">
              Inicio
            </Link>{" "}
            ·{" "}
            <Link
              href="/productos"
              className="transition-colors hover:text-foreground"
            >
              Catálogo
            </Link>
            {producto.categoria && <> · {producto.categoria}</>} ·{" "}
            <span className="text-foreground">{producto.nombre}</span>
          </p>
        </div>

        {/* Galería + info */}
        <div className="mx-auto grid max-w-[1280px] items-start gap-8 px-6 pb-16 pt-6 md:px-7 lg:grid-cols-[1.1fr_1fr] lg:gap-11">
          <div className="flex flex-col gap-3">
            <div className="flex aspect-square items-center justify-center rounded-[20px] border bg-card p-8 md:p-10">
              <Image
                src={producto.imagen_url ?? "/producto-ejemplo.png"}
                alt={producto.nombre}
                width={900}
                height={900}
                priority
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="max-h-full w-auto object-contain"
              />
            </div>
            {/* TODO Full Box: fotos adicionales por producto */}
            <div className="grid grid-cols-4 gap-3">
              <div className="flex aspect-square items-center justify-center rounded-[14px] border-2 border-cardboard bg-card p-3">
                <Image
                  src={producto.imagen_url ?? "/producto-ejemplo.png"}
                  alt=""
                  width={200}
                  height={200}
                  className="max-h-full w-auto object-contain"
                />
              </div>
              {["foto lateral", "caja armada", "marca impresa"].map((t) => (
                <div
                  key={t}
                  className="flex aspect-square items-center justify-center rounded-[14px] border bg-card p-2 text-center font-mono text-[10.5px] leading-tight text-muted-foreground/60"
                >
                  {t}
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-[18px]">
            {producto.categoria && (
              <span className="w-fit text-[11px] uppercase tracking-[0.08em] text-muted-foreground">
                {producto.categoria}
              </span>
            )}
            <h1 className="text-[38px] font-bold leading-[1.12] tracking-tight">
              {producto.nombre}
            </h1>
            {producto.descripcion && (
              <p className="max-w-[34em] text-[15.5px] leading-relaxed text-muted-foreground">
                {producto.descripcion}
              </p>
            )}

            <FichaCompra producto={producto} />

            <ul className="mt-1.5 grid gap-3 sm:grid-cols-2">
              {specs.map((s) => (
                <li
                  key={s.etiqueta}
                  className="flex flex-col gap-0.5 rounded-xl border bg-card px-4 py-3.5"
                >
                  <span className="text-[11px] uppercase tracking-[0.07em] text-muted-foreground">
                    {s.etiqueta}
                  </span>
                  <span className="text-sm font-semibold">{s.valor}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Similares */}
        {similares.length > 0 && (
          <section className="border-t bg-background py-14">
            <div className="mx-auto max-w-[1280px] px-6 md:px-7">
              <h2 className="mb-5 text-[26px] font-bold tracking-tight">
                Medidas parecidas en catálogo
              </h2>
              <ul className="grid gap-4 sm:grid-cols-3 lg:grid-cols-5">
                {similares.map((p) => (
                  <ProductoCard key={p.id} producto={p} />
                ))}
              </ul>
            </div>
          </section>
        )}

        {/* Proceso */}
        <section className="border-t py-14">
          <div className="mx-auto grid max-w-[1280px] gap-5 px-6 md:grid-cols-2 md:px-7 lg:grid-cols-4">
            {PROCESO.map((item) => (
              <div
                key={item.paso}
                className="flex flex-col gap-2 rounded-[18px] border bg-card p-6"
              >
                <span className="text-[26px] font-extrabold tracking-tight text-cardboard">
                  {item.paso}
                </span>
                <h3 className="text-[15px] font-semibold">{item.titulo}</h3>
                <p className="text-[13.5px] leading-relaxed text-muted-foreground">
                  {item.texto}
                </p>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
