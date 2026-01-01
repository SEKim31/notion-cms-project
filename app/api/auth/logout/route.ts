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

    return NextResponse.json(
      { message: "로그아웃되었습니다." },
      { status: 200 }
    )
  } catch (error) {
    console.error("로그아웃 처리 에러:", error)
    return NextResponse.json(
      { error: "서버 오류가 발생했습니다." },
      { status: 500 }
    )
  }
}
