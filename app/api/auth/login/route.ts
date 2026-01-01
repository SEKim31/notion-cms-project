import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { loginSchema } from "@/lib/validations/auth"

/**
 * POST /api/auth/login
 * 로그인 API
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // 1. 요청 데이터 검증
    const validationResult = loginSchema.safeParse(body)

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: "입력 데이터가 올바르지 않습니다.",
          details: validationResult.error.issues,
        },
        { status: 400 }
      )
    }

    const { email, password } = validationResult.data

    // 2. Supabase Auth 로그인
    const supabase = await createClient()
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      console.error("로그인 에러:", error)
      return NextResponse.json(
        { error: "이메일 또는 비밀번호가 올바르지 않습니다." },
        { status: 401 }
      )
    }

    if (!data.user) {
      return NextResponse.json(
        { error: "로그인에 실패했습니다." },
        { status: 500 }
      )
    }

    // 3. 사용자 정보 조회
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("id, email, company_name")
      .eq("id", data.user.id)
      .single()

    if (userError) {
      console.error("사용자 정보 조회 에러:", userError)
    }

    return NextResponse.json(
      {
        message: "로그인 성공",
        user: {
          id: data.user.id,
          email: data.user.email,
          companyName: userData?.company_name || null,
        },
      },
      { status: 200 }
    )
  } catch (error) {
    console.error("로그인 처리 에러:", error)
    return NextResponse.json(
      { error: "서버 오류가 발생했습니다." },
      { status: 500 }
    )
  }
}
