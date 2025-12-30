"use client"

import { NuqsAdapter } from "nuqs/adapters/next/app"

interface NuqsProviderProps {
  children: React.ReactNode
}

// URL 상태 관리 Provider
// nuqs를 사용하여 타입 안전한 URL 쿼리 파라미터 관리
export function NuqsProvider({ children }: NuqsProviderProps) {
  return <NuqsAdapter>{children}</NuqsAdapter>
}
