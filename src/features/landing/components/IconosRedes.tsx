/**
 * Íconos de Instagram y Facebook como SVG inline.
 *
 * lucide-react dejó de incluir logos de marcas (los quitó de su set), así
 * que van dibujados acá. Usan `currentColor`, por lo que toman el color del
 * texto que los rodea igual que cualquier ícono de lucide, y aceptan
 * `className` para que el tamaño se controle desde el componente que los usa.
 */

type Props = { className?: string }

export function IconoInstagram({ className }: Props) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1.1" fill="currentColor" stroke="none" />
    </svg>
  )
}

export function IconoFacebook({ className }: Props) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden
    >
      <path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5.02 3.66 9.18 8.44 9.94v-7.03H7.9v-2.9h2.54V9.85c0-2.52 1.49-3.91 3.77-3.91 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.78-1.63 1.57v1.89h2.78l-.45 2.9h-2.33v7.03C18.34 21.24 22 17.08 22 12.06Z" />
    </svg>
  )
}
