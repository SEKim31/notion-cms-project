import { NextRequest, NextResponse } from "next/server"
import { createClient, createAdminClient } from "@/lib/supabase/server"
import { registerSchema } from "@/lib/validations/auth"

/**
 * POST /api/auth/register
 * 회원가입 API
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // 1. 요청 데이터 검증
    const validationResult = registerSchema.safeParse(body)

    if (!validationResult.success) {
      console.error("유효성 검사 실패:", validationResult.error.issues)
      return NextResponse.json(
        {
          error: "입력 데이터가 올바르지 않습니다.",
          details: validationResult.error.issues,
        },
        { status: 400 }
      )
    }

    const { email, password, companyName, name } = validationResult.data

    // 2. Supabase Auth 회원가입
    const supabase = await createClient()
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: name,
          company_name: companyName,
        },
      },
    })

    if (authError) {
      console.error("회원가입 에러:", authError)
      return NextResponse.json(
        { error: authError.message },
        { status: 400 }
      )
    }

    if (!authData.user) {
      return NextResponse.json(
        { error: "회원가입에 실패했습니다." },
        { status: 500 }
      )
    }

    // 3. users 테이블에 추가 정보 저장 (RLS 우회를 위해 admin 클라이언트 사용)
    // Note: name은 Supabase Auth의 user_metadata에 저장됨
    const adminClient = await createAdminClient()
    const { error: dbError } = await adminClient.from("users").insert({
      id: authData.user.id,
      email,
      company_name: companyName,
    })

    if (dbError) {
      console.error("사용자 정보 저장 에러:", dbError)

      // Note: users 테이블 삽입 실패 시 auth 사용자 정리는
      // Supabase Database Webhook이나 수동 관리 필요
      // admin.deleteUser는 서비스 역할 키 필요

      return NextResponse.json(
        { error: "사용자 정보 저장에 실패했습니다." },
        { status: 500 }
      )
    }

    return NextResponse.json(
      {
        message: "회원가입이 완료되었습니다.",
        user: {
          id: authData.user.id,
          email: authData.user.email,
        },
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("회원가입 처리 에러:", error)
    return NextResponse.json(
      { error: "서버 오류가 발생했습니다." },
      { status: 500 }
    )
  }
}
