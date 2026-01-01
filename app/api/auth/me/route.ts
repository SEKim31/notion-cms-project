import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

/**
 * GET /api/auth/me
 * 현재 로그인된 사용자 정보 조회 API
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()

    // 1. 현재 세션 사용자 확인
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: "인증되지 않은 사용자입니다." },
        { status: 401 }
      )
    }

    // 2. users 테이블에서 사용자 정보 조회
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("id, email, company_name, notion_api_key, notion_database_id, created_at, updated_at")
      .eq("id", user.id)
      .single()

    if (userError) {
      console.error("사용자 정보 조회 에러:", userError)
      return NextResponse.json(
        { error: "사용자 정보를 불러올 수 없습니다." },
        { status: 500 }
      )
    }

    return NextResponse.json(
      {
        user: {
          id: userData.id,
          email: userData.email,
          companyName: userData.company_name,
          hasNotionConfig: !!(userData.notion_api_key && userData.notion_database_id),
          createdAt: userData.created_at,
          updatedAt: userData.updated_at,
        },
      },
      { status: 200 }
    )
  } catch (error) {
    console.error("사용자 정보 조회 처리 에러:", error)
    return NextResponse.json(
      { error: "서버 오류가 발생했습니다." },
      { status: 500 }
    )
  }
}
