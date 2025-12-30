"use client"

import { ThemeProvider } from "./theme-provider"
import { QueryProvider } from "./query-provider"
import { NuqsProvider } from "./nuqs-provider"

interface ProvidersProps {
  children: React.ReactNode
}

// 모든 Provider를 통합하여 제공
export function Providers({ children }: ProvidersProps) {
  return (
    <ThemeProvider>
      <QueryProvider>
        <NuqsProvider>{children}</NuqsProvider>
      </QueryProvider>
    </ThemeProvider>
  )
}
