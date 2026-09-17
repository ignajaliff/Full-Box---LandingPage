"use client"

import { useMemo, useState } from "react"

import { tieneMedidas, type Producto } from "./types"
import { formatCurrency } from "@/lib/format-currency"

/** Tolerancia en cm: una medida ingresada matchea productos a ±TOLERANCIA. */
export const TOLERANCIA = 5

export type Orden = "nombre" | "precio-asc" | "precio-desc" | "volumen"

/**
 * Estado y lógica de filtrado del catálogo.
 *
 * Vive en un hook y no en el componente porque lo consumen dos vistas con
 * la misma fuente de verdad: la barra lateral de desktop y el panel de
 * mobile. Además deja al componente dentro del límite de líneas.
 */
export function useFiltrosCatalogo(
  productos: Producto[],
  busquedaInicial = "",
) {
  const [texto, setTexto] = useState(busquedaInicial)
  const [largo, setLargo] = useState("")
  const [ancho, setAncho] = useState("")
  const [alto, setAlto] = useState("")
  const [categoria, setCategoria] = useState<string | null>(null)
  const [rango, setRango] = useState("todos")
  const [orden, setOrden] = useState<Orden>("nombre")

  /** Categorías presentes en el catálogo, con su conteo. */
  const categorias = useMemo(() => {
    const cuenta = new Map<string, number>()
    for (const p of productos) {
      if (p.categoria) cuenta.set(p.categoria, (cuenta.get(p.categoria) ?? 0) + 1)
    }
    return [...cuenta.entries()]
      .sort((a, b) => a[0].localeCompare(b[0], "es"))
      .map(([nombre, count]) => ({ nombre, count }))
  }, [productos])

  /** Rangos calculados desde los precios reales (terciles redondeados). */
  const rangos = useMemo(() => {
    const precios = productos
      .map((p) => p.precio)
      .filter((n): n is number => n !== null)
      .sort((a, b) => a - b)

    const todos = { id: "todos", nombre: "Todos los precios", test: () => true }
    if (precios.length < 3) return [todos]

    const redondear = (n: number) => Math.round(n / 100) * 100
    const bajo = redondear(precios[Math.floor(precios.length / 3)])
    const alto_ = redondear(precios[Math.floor((precios.length * 2) / 3)])
    if (bajo >= alto_) return [todos]

    return [
      todos,
      {
        id: "a",
        nombre: `Hasta ${formatCurrency(bajo)}`,
        test: (p: Producto) => p.precio !== null && p.precio <= bajo,
      },
      {
        id: "b",
        nombre: `${formatCurrency(bajo)} a ${formatCurrency(alto_)}`,
        test: (p: Producto) =>
          p.precio !== null && p.precio > bajo && p.precio <= alto_,
      },
      {
        id: "c",
        nombre: `Más de ${formatCurrency(alto_)}`,
        test: (p: Producto) => p.precio !== null && p.precio > alto_,
      },
    ]
  }, [productos])

  const hayMedidas = Boolean(largo || ancho || alto)
  const hayFiltros =
    Boolean(texto) || hayMedidas || categoria !== null || rango !== "todos"

  const resultados = useMemo(() => {
    const q = texto.trim().toLowerCase()
    const cerca = (valor: number | null, objetivo: string) => {
      if (objetivo === "") return true
      if (valor === null) return false
      return Math.abs(valor - Number(objetivo)) <= TOLERANCIA
    }
    const test = rangos.find((r) => r.id === rango)?.test ?? (() => true)

    const filtrados = productos.filter((p) => {
      const textoOk =
        !q ||
        [p.nombre, p.categoria, p.descripcion, p.medida].some((s) =>
          s?.toLowerCase().includes(q),
        )
      if (hayMedidas && !tieneMedidas(p)) return false
      return (
        textoOk &&
        (!categoria || p.categoria === categoria) &&
        test(p) &&
        cerca(p.largo, largo) &&
        cerca(p.ancho, ancho) &&
        cerca(p.alto, alto)
      )
    })

    const volumen = (p: Producto) =>
      (p.largo ?? 0) * (p.ancho ?? 0) * (p.alto ?? 0)
    const precio = (p: Producto) => p.precio ?? Infinity

    return [...filtrados].sort((a, b) => {
      if (orden === "precio-asc") return precio(a) - precio(b)
      if (orden === "precio-desc") return precio(b) - precio(a)
      if (orden === "volumen") return volumen(a) - volumen(b)
      return a.nombre.localeCompare(b.nombre, "es")
    })
  }, [productos, texto, largo, ancho, alto, categoria, rango, orden, rangos, hayMedidas])

  function limpiar() {
    setTexto("")
    setLargo("")
    setAncho("")
    setAlto("")
    setCategoria(null)
    setRango("todos")
  }

  const resumen = hayFiltros
    ? `${resultados.length} ${resultados.length === 1 ? "medida" : "medidas"}${hayMedidas ? ` (±${TOLERANCIA} cm)` : ""}`
    : `${productos.length} ${productos.length === 1 ? "medida disponible" : "medidas disponibles"}`

  return {
    texto, setTexto,
    largo, setLargo,
    ancho, setAncho,
    alto, setAlto,
    categoria, setCategoria,
    rango, setRango,
    orden, setOrden,
    categorias,
    rangos,
    resultados,
    resumen,
    limpiar,
  }
}
