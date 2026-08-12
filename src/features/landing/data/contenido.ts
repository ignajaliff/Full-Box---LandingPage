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

/**
 * Mensajes de la barra superior. Rotan en marquesina continua.
 * TODO Full Box: confirmar plazos y condiciones reales antes de publicar.
 */
export const ANUNCIOS = [
  "Somos fabricantes mayoristas",
  "Retiro en sucursal en 24/48 hs",
  "Cartón 100% natural y reciclable",
  "Fabricación a medida sin cargo de diseño",
  "Más de 30 años en Mendoza",
  "Envíos a toda la provincia y el país",
] as const

/**
 * Credenciales de la franja del hero.
 * TODO Full Box: confirmar cantidad de clientes y plazo real de entrega.
 */
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

/**
 * Preguntas frecuentes. Alimentan la sección #faq de la home.
 * TODO Full Box: validar mínimos, plazos y formas de pago con el cliente.
 */
export const FAQ = [
  {
    pregunta: "¿Cuál es la cantidad mínima de compra?",
    respuesta:
      "Trabajamos como mayoristas: la mínima varía según el modelo de caja. En los productos del catálogo figura la unidad mínima, y a partir de 100 unidades el precio por unidad baja.",
  },
  {
    pregunta: "¿Cuánto tardan en entregar?",
    respuesta:
      "Los modelos con stock se retiran en sucursal en 24 a 48 horas. Las cajas a medida llevan alrededor de 72 horas desde que aprobás el diseño.",
  },
  {
    pregunta: "¿Pueden imprimir mi logo en las cajas?",
    respuesta:
      "Sí. Imprimimos tu marca sobre el cartón. Mandanos el logo en buena calidad y te pasamos una muestra antes de producir.",
  },
  {
    pregunta: "¿Fabrican cajas con medidas especiales?",
    respuesta:
      "Es lo que más hacemos. Contanos qué producto vas a embalar y diseñamos la caja exacta, sin cargo extra por el diseño.",
  },
  {
    pregunta: "¿Hacen envíos fuera de Mendoza?",
    respuesta:
      "Sí, enviamos a toda la provincia y al resto del país. El costo depende del destino y del volumen del pedido.",
  },
  {
    pregunta: "¿El cartón es reciclable?",
    respuesta:
      "Todo nuestro cartón es 100% natural y reciclable. No usamos plastificados que compliquen su reutilización.",
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
