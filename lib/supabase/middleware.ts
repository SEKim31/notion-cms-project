// 미들웨어용 Supabase 클라이언트
// Next.js 미들웨어에서 세션 갱신에 사용

import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

/**
 * 미들웨어에서 사용할 Supabase 클라이언트 생성
 * 세션 갱신 및 인증 상태 확인용
 */
export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // 중요: createServerClient와 supabase.auth.getUser() 사이에
  // 어떤 로직도 작성하지 마세요. 단순한 실수로 인해
  // 사용자 세션이 무작위로 로그아웃될 수 있습니다.

  const {
    data: { user },
  } = await supabase.auth.getUser()

  return { user, supabaseResponse }
}
