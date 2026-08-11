/**
 * Contenido de la landing. Centralizado a propósito: editás acá y se
 * actualiza toda la página.
 *
 * Los datos de EMPRESA son reales (ficha de Google / Facebook de Full Box SAS,
 * ex Cartonera Oeste). Si cambian, se editan sólo acá.
 */

export const EMPRESA = {
  nombre: "Full Box",
  razonSocial: "Full Box S.A.S.",
  tagline: "Cajas y packaging a medida",
  ciudad: "Ciudad de Mendoza",
  provincia: "Mendoza, Argentina",
  // Sin el "+" ni espacios: formato que pide wa.me. 549 + cód. área (261) + número.
  whatsapp: "5492615333368",
  telefono: "+54 261 533-3368",
  email: "cartoneraoeste@hotmail.com",
  direccion: "Montecaseros 2030",
  horario: "Lunes a viernes de 9 a 17 hs",
} as const

/** Arma un link a WhatsApp con mensaje pre-cargado. */
export function linkWhatsApp(mensaje: string): string {
  return `https://wa.me/${EMPRESA.whatsapp}?text=${encodeURIComponent(mensaje)}`
}

export const STATS = [
  { valor: "+30", etiqueta: "años de trayectoria" },
  { valor: "+500", etiqueta: "clientes activos" },
  { valor: "72 hs", etiqueta: "plazo de entrega" },
  { valor: "A medida", etiqueta: "lo desarrollamos para vos" },
] as const

/** Pasos del proceso de fabricación a medida. */
export const PROCESO = [
  {
    paso: "01",
    titulo: "Nos contás tu necesidad",
    texto: "Producto, cantidades y uso. Te asesoramos sin cargo.",
  },
  {
    paso: "02",
    titulo: "Diseñamos la caja",
    texto: "Medidas exactas, tipo de cartón y opción de impresión de marca.",
  },
  {
    paso: "03",
    titulo: "Fabricamos en planta",
    texto: "Producción propia en Mendoza con control de calidad.",
  },
  {
    paso: "04",
    titulo: "Entregamos a tiempo",
    texto: "Logística a toda la provincia y el país.",
  },
] as const

/** Clientes (placeholder — reemplazar por logos reales). */
export const CLIENTES_DEMO = [
  "Bodega Los Andes",
  "Olivícola Cuyo",
  "Distribuidora Mendoza",
  "Supermercados del Oeste",
  "Frutas del Valle",
  "Logística Andina",
  "Conservas San Martín",
  "Vinos Premium SA",
] as const
