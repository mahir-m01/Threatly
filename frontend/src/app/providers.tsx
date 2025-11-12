"use client"

import { ReactNode } from "react"
import { ThemeProvider } from "next-themes"

type Props = {
  children: ReactNode
}

export function Providers({ children }: Props) {
  return (
    // @ts-ignore
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      {children}
    </ThemeProvider>
  )
}
