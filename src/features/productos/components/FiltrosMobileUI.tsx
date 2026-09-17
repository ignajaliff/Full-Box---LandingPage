"use client"

/**
 * Piezas visuales del panel de filtros de mobile. Viven aparte para que
 * FiltrosMobile quede dentro del límite de líneas del proyecto.
 */

export function Chip({
  activo,
  onClick,
  etiqueta,
}: {
  activo: boolean
  onClick: () => void
  etiqueta: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex h-10 shrink-0 items-center gap-1.5 rounded-full border px-4 text-[13.5px] transition-colors ${
        activo
          ? "border-acento bg-acento-soft font-semibold text-acento"
          : "font-medium hover:bg-muted"
      }`}
    >
      {etiqueta}
      <span className="text-[10px] text-muted-foreground" aria-hidden>
        ▾
      </span>
    </button>
  )
}

export function Opcion({
  activo,
  onClick,
  cuenta,
  children,
}: {
  activo: boolean
  onClick: () => void
  cuenta?: number
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={activo}
      className={`flex h-12 w-full items-center justify-between gap-2 rounded-xl border px-4 text-left text-[14.5px] transition-colors ${
        activo
          ? "border-acento bg-acento-soft font-semibold text-acento"
          : "font-medium"
      }`}
    >
      <span>{children}</span>
      {cuenta !== undefined && (
        <span className="text-[13px] text-muted-foreground">{cuenta}</span>
      )}
    </button>
  )
}

export function Medida({
  etiqueta,
  value,
  onChange,
}: {
  etiqueta: string
  value: string
  onChange: (v: string) => void
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs font-medium text-muted-foreground">
        {etiqueta}
      </span>
      <input
        type="number"
        min={0}
        inputMode="numeric"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="—"
        className="h-12 w-full rounded-xl border bg-muted/40 px-3 text-center text-[15px] outline-none transition-colors focus-visible:border-acento focus-visible:ring-[3px] focus-visible:ring-acento/20"
      />
    </label>
  )
}
