// 노션 연동 설정 API
// GET: 현재 설정 조회
// POST: 설정 저장

import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { encrypt, decrypt, isEncryptionConfigured } from "@/lib/crypto"
import { notionSettingsSchema } from "@/lib/validations/settings"
import { getEnvNotionApiKey, getEnvDatabaseId, hasEnvNotionConfig } from "@/lib/notion/client"
import type { ApiResponse, SettingsResponse } from "@/types/api"

// 노션 설정 조회 응답 타입
interface NotionSettingsData {
  notionApiKey: string // 마스킹된 API 키
  notionDatabaseId: string
  hasApiKey: boolean
  isConnected: boolean
  source?: "env" | "db" // 설정 소스 표시
}

/**
 * GET /api/settings/notion
 * 현재 노션 연동 설정 조회
 * 환경 변수가 설정되어 있으면 우선 사용 (단일 사용자용)
 */
export async function GET(): Promise<NextResponse<ApiResponse<NotionSettingsData | null>>> {
  try {
    // 1. 먼저 환경 변수 확인 (단일 사용자/간단한 배포용)
    if (hasEnvNotionConfig()) {
      const envApiKey = getEnvNotionApiKey()!
      const envDatabaseId = getEnvDatabaseId()!

      // API 키 마스킹: 앞 8자 + 마스킹 + 뒤 4자
      let maskedApiKey = ""
      if (envApiKey.length > 12) {
        maskedApiKey = `${envApiKey.slice(0, 8)}${"*".repeat(16)}${envApiKey.slice(-4)}`
      } else {
        maskedApiKey = "*".repeat(20)
      }

      return NextResponse.json({
        success: true,
        data: {
          notionApiKey: maskedApiKey,
          notionDatabaseId: envDatabaseId,
          hasApiKey: true,
          isConnected: true,
          source: "env",
        },
      })
    }

    // 2. 환경 변수가 없으면 DB에서 조회 (멀티 사용자용)
    const supabase = await createClient()

    // 현재 로그인된 사용자 확인
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        {
          success: false,
          data: null,
          error: "인증이 필요합니다.",
        },
        { status: 401 }
      )
    }

    // 사용자 설정 조회
    const { data: userData, error: dbError } = await supabase
      .from("users")
      .select("notion_api_key, notion_database_id")
      .eq("id", user.id)
      .single()

    if (dbError) {
      // 사용자 레코드가 없으면 빈 설정 반환
      if (dbError.code === "PGRST116") {
        return NextResponse.json({
          success: true,
          data: {
            notionApiKey: "",
            notionDatabaseId: "",
            hasApiKey: false,
            isConnected: false,
            source: "db",
          },
        })
      }

      console.error("설정 조회 오류:", dbError)
      return NextResponse.json(
        {
          success: false,
          data: null,
          error: "설정 조회 중 오류가 발생했습니다.",
        },
        { status: 500 }
      )
    }

    // API 키 마스킹
    let maskedApiKey = ""
    let hasApiKey = false

    if (userData.notion_api_key) {
      try {
        const decryptedKey = decrypt(userData.notion_api_key)
        // API 키 마스킹: 앞 8자 + 마스킹 + 뒤 4자
        if (decryptedKey.length > 12) {
          maskedApiKey = `${decryptedKey.slice(0, 8)}${"*".repeat(16)}${decryptedKey.slice(-4)}`
        } else {
          maskedApiKey = "*".repeat(20)
        }
        hasApiKey = true
      } catch {
        // 복호화 실패 시 키가 있음만 표시
        maskedApiKey = "*".repeat(20)
        hasApiKey = true
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        notionApiKey: maskedApiKey,
        notionDatabaseId: userData.notion_database_id || "",
        hasApiKey,
        isConnected: hasApiKey && !!userData.notion_database_id,
        source: "db",
      },
    })
  } catch (error) {
    console.error("설정 조회 오류:", error)
    return NextResponse.json(
      {
        success: false,
        data: null,
        error: "서버 오류가 발생했습니다.",
      },
      { status: 500 }
    )
  }
}

/**
 * POST /api/settings/notion
 * 노션 연동 설정 저장
 */
export async function POST(
  request: NextRequest
): Promise<NextResponse<ApiResponse<SettingsResponse>>> {
  try {
    // 암호화 설정 확인
    if (!isEncryptionConfigured()) {
      return NextResponse.json(
        {
          success: false,
          data: { success: false, message: "", isConnected: false },
          error: "암호화 설정이 완료되지 않았습니다. 관리자에게 문의하세요.",
        },
        { status: 500 }
      )
    }

    const supabase = await createClient()

    // 현재 로그인된 사용자 확인
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        {
          success: false,
          data: { success: false, message: "", isConnected: false },
          error: "인증이 필요합니다.",
        },
        { status: 401 }
      )
    }

    // 요청 본문 파싱
    const body = await request.json()

    // 유효성 검사
    const validationResult = notionSettingsSchema.safeParse(body)
    if (!validationResult.success) {
      // Zod 에러 메시지 추출
      const firstIssue = validationResult.error.issues[0]
      const errorMessage = firstIssue?.message || "입력값이 유효하지 않습니다."

      return NextResponse.json(
        {
          success: false,
          data: { success: false, message: "", isConnected: false },
          error: errorMessage,
        },
        { status: 400 }
      )
    }

    const { notionApiKey, notionDatabaseId } = validationResult.data

    // API 키 암호화
    const encryptedApiKey = encrypt(notionApiKey)

    // 데이터베이스 ID 정규화 (하이픈 제거)
    const normalizedDatabaseId = notionDatabaseId.replace(/-/g, "")

    // 설정 저장 (upsert)
    const { error: upsertError } = await supabase
      .from("users")
      .upsert(
        {
          id: user.id,
          email: user.email,
          company_name: user.user_metadata?.company_name || "미설정",
          notion_api_key: encryptedApiKey,
          notion_database_id: normalizedDatabaseId,
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: "id",
        }
      )

    if (upsertError) {
      console.error("설정 저장 오류:", upsertError)
      return NextResponse.json(
        {
          success: false,
          data: { success: false, message: "", isConnected: false },
          error: "설정 저장 중 오류가 발생했습니다.",
        },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: {
        success: true,
        message: "노션 연동 설정이 저장되었습니다.",
        isConnected: true,
      },
    })
  } catch (error) {
    console.error("설정 저장 오류:", error)
    return NextResponse.json(
      {
        success: false,
        data: { success: false, message: "", isConnected: false },
        error: "서버 오류가 발생했습니다.",
      },
      { status: 500 }
    )
  }
}
