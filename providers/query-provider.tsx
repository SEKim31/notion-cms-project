"use client"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { useState } from "react"

interface QueryProviderProps {
  children: React.ReactNode
}

// React Query Provider
// 서버 상태 관리, 데이터 페칭, 캐싱을 위한 Provider
export function QueryProvider({ children }: QueryProviderProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // SSR에서 클라이언트로 데이터 전달 시 즉시 stale 처리 방지
            staleTime: 60 * 1000, // 1분
            // 에러 발생 시 재시도 횟수
            retry: 1,
          },
        },
      })
  )

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}
