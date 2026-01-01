// 서버용 Supabase 클라이언트
// 서버 컴포넌트, API 라우트, 서버 액션에서 사용

import { createServerClient, type CookieOptions } from "@supabase/ssr"
import { cookies } from "next/headers"

/**
 * 서버용 Supabase 클라이언트 생성
 * 쿠키 기반 세션 관리
 */
export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // 서버 컴포넌트에서 쿠키 설정 시도 시 무시
            // 미들웨어에서 세션 갱신을 처리함
          }
        },
      },
    }
  )
}

/**
 * 서비스 역할 키를 사용하는 관리자 클라이언트
 * RLS 정책을 우회해야 할 때 사용 (주의: 보안에 유의)
 */
export async function createAdminClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // 무시
          }
        },
      },
    }
  )
}
