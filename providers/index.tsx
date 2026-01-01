"use client"

import { ThemeProvider } from "./theme-provider"
import { QueryProvider } from "./query-provider"
import { NuqsProvider } from "./nuqs-provider"
import { AuthProvider } from "./auth-provider"

interface ProvidersProps {
  children: React.ReactNode
}

// 모든 Provider를 통합하여 제공
// AuthProvider는 QueryProvider 내부에 위치하여 React Query 사용 가능
export function Providers({ children }: ProvidersProps) {
  return (
    <ThemeProvider>
      <QueryProvider>
        <AuthProvider>
          <NuqsProvider>{children}</NuqsProvider>
        </AuthProvider>
      </QueryProvider>
    </ThemeProvider>
  )
}
