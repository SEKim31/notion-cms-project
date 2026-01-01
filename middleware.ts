import { type NextRequest, NextResponse } from "next/server"
import { updateSession } from "@/lib/supabase/middleware"

// 인증이 필요한 경로
const protectedPaths = [
  "/quotes",
  "/settings",
]

// 인증된 사용자가 접근하면 안 되는 경로 (로그인, 회원가입)
const authPaths = [
  "/login",
  "/register",
]

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // 세션 갱신 및 사용자 정보 가져오기
  const { user, supabaseResponse } = await updateSession(request)

  // 보호된 경로 접근 시 인증 확인
  const isProtectedPath = protectedPaths.some(path =>
    pathname.startsWith(path)
  )

  if (isProtectedPath && !user) {
    // 로그인되지 않은 사용자는 로그인 페이지로 리다이렉트
    const redirectUrl = new URL("/login", request.url)
    redirectUrl.searchParams.set("redirectTo", pathname)
    return NextResponse.redirect(redirectUrl)
  }

  // 이미 로그인된 사용자가 인증 페이지 접근 시
  const isAuthPath = authPaths.some(path => pathname === path)

  if (isAuthPath && user) {
    // 로그인된 사용자는 대시보드로 리다이렉트
    return NextResponse.redirect(new URL("/quotes", request.url))
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    /*
     * 다음 경로를 제외한 모든 요청 경로와 매칭:
     * - _next/static (정적 파일)
     * - _next/image (이미지 최적화 파일)
     * - favicon.ico (파비콘)
     * - public 폴더의 파일들
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}
