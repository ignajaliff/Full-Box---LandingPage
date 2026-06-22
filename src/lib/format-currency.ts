const formatter = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
})

/**
 * Formato de moneda centralizado (ver rules.txt — "Dinero y cálculos").
 * Recibe el precio en unidades de la moneda (no en centavos).
 */
export function formatCurrency(value: number): string {
  return formatter.format(value)
}
