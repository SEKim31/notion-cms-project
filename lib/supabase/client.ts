// 브라우저용 Supabase 클라이언트
// 클라이언트 컴포넌트에서 사용

import { createBrowserClient } from "@supabase/ssr"

/**
 * 브라우저용 Supabase 클라이언트 생성
 * 싱글톤 패턴으로 클라이언트 재사용
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

// 싱글톤 클라이언트 (선택적 사용)
let browserClient: ReturnType<typeof createClient> | null = null

export function getClient() {
  if (!browserClient) {
    browserClient = createClient()
  }
  return browserClient
}
