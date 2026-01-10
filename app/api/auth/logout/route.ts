import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

/**
 * POST /api/auth/logout
 * 로그아웃 API
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Supabase Auth 로그아웃
    const { error } = await supabase.auth.signOut()

    if (error) {
      console.error("로그아웃 에러:", error)
      return NextResponse.json(
        { error: "로그아웃에 실패했습니다." },
        { status: 500 }
      )
    }

    // 응답 생성
    const response = NextResponse.json(
      { message: "로그아웃되었습니다." },
      { status: 200 }
    )

    // Supabase 인증 관련 쿠키를 명시적으로 삭제
    // 쿠키 이름 패턴: sb-{project-ref}-auth-token (청크 포함: .0, .1 등)
    const cookiesToDelete = request.cookies.getAll()
      .filter(cookie => cookie.name.startsWith("sb-"))

    cookiesToDelete.forEach(cookie => {
      // 프로덕션 환경에서도 쿠키가 삭제되도록 옵션 명시
      response.cookies.set(cookie.name, "", {
        path: "/",
        expires: new Date(0),
        maxAge: 0,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
      })
    })

    return response
  } catch (error) {
    console.error("로그아웃 처리 에러:", error)
    return NextResponse.json(
      { error: "서버 오류가 발생했습니다." },
      { status: 500 }
    )
  }
}
