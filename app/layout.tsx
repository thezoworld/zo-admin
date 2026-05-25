import { Jost, Archivo, Libre_Caslon_Text, Geist_Mono } from "next/font/google"

import "./globals.css"
import { QueryProvider } from "@/components/providers/query-provider"
import { ThemeProvider } from "@/components/theme-provider"
import { TooltipProvider } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

const jost = Jost({
  subsets: ["latin"],
  variable: "--font-jost",
  weight: ["300", "400", "500", "600", "700", "800", "900"],
})

const archivo = Archivo({
  subsets: ["latin"],
  variable: "--font-archivo",
  weight: ["400", "500", "600", "700", "800"],
})

const caslon = Libre_Caslon_Text({
  subsets: ["latin"],
  variable: "--font-caslon",
  weight: ["400"],
  style: ["normal", "italic"],
})

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "font-sans antialiased",
        jost.variable,
        archivo.variable,
        caslon.variable,
        fontMono.variable
      )}
    >
      <body>
        <QueryProvider>
          <ThemeProvider>
            <TooltipProvider>{children}</TooltipProvider>
          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  )
}
