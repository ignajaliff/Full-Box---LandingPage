import type { Metadata } from "next";
import { Geist_Mono, Poppins } from "next/font/google";
import "./globals.css";
import { PantallaCarga } from "@/features/landing/components/PantallaCarga";

// Poppins para todo el sitio (cuerpo y títulos).
const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Full Box — Cajas y packaging a medida",
    template: "%s | Full Box",
  },
  description:
    "Diseño y fabricación de cajas de cartón a medida para e-commerce, retail e industria. Resistencia, diseño y entrega a tiempo.",
  // El ícono cuadrado vive en app/icon.svg; Next lo enlaza solo.
  openGraph: {
    title: "Full Box — Cajas y packaging a medida",
    description:
      "Más de 30 años fabricando packaging de cartón en Mendoza. Cajas a medida, con tu marca impresa.",
    type: "website",
    locale: "es_AR",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${poppins.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <PantallaCarga />
        {children}
      </body>
    </html>
  );
}
