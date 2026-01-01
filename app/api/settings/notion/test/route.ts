// 노션 연동 테스트 API
// GET: 환경 변수 기반 연결 테스트 (단일 사용자용)
// POST: 노션 API 키와 데이터베이스 ID로 연결 테스트

import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { testConnection, testConnectionWithEnv } from "@/lib/notion/queries"
import { hasEnvNotionConfig } from "@/lib/notion/client"
import { notionSettingsSchema } from "@/lib/validations/settings"
import type { ApiResponse, NotionTestResponse } from "@/types/api"

/**
 * GET /api/settings/notion/test
 * 환경 변수 기반 노션 연결 테스트 (단일 사용자용)
 */
export async function GET(): Promise<NextResponse<ApiResponse<NotionTestResponse>>> {
  try {
    // 환경 변수 설정 여부 확인
    if (!hasEnvNotionConfig()) {
      return NextResponse.json({
        success: true,
        data: {
          success: false,
          message: "환경 변수에 노션 설정이 없습니다. .env.local 파일에 NOTION_API_KEY와 NOTION_DATABASE_ID를 설정해주세요.",
        },
      })
    }

    // 환경 변수 기반 연결 테스트
    const result = await testConnectionWithEnv()

    if (result.success) {
      return NextResponse.json({
        success: true,
        data: {
          success: true,
          message: "환경 변수 기반 노션 연결이 성공했습니다.",
          databaseName: result.databaseName,
          pageCount: result.pageCount && result.pageCount >= 0 ? result.pageCount : undefined,
        },
      })
    } else {
      return NextResponse.json({
        success: true,
        data: {
          success: false,
          message: result.message,
        },
      })
    }
  } catch (error) {
    console.error("환경 변수 연동 테스트 오류:", error)
    return NextResponse.json(
      {
        success: false,
        data: {
          success: false,
          message: "환경 변수 연동 테스트 중 오류가 발생했습니다.",
        },
        error: error instanceof Error ? error.message : "알 수 없는 오류",
      },
      { status: 500 }
    )
  }
}

/**
 * POST /api/settings/notion/test
 * 노션 연동 테스트 - 제공된 API 키로 데이터베이스 접근 가능 여부 확인
 */
export async function POST(
  request: NextRequest
): Promise<NextResponse<ApiResponse<NotionTestResponse>>> {
  try {
    const supabase = await createClient()

    // 현재 로그인된 사용자 확인
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        {
          success: false,
          data: {
            success: false,
            message: "인증이 필요합니다.",
          },
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
          data: {
            success: false,
            message: errorMessage,
          },
          error: errorMessage,
        },
        { status: 400 }
      )
    }

    const { notionApiKey, notionDatabaseId } = validationResult.data

    // 노션 연동 테스트 (queries 모듈의 testConnection 함수 사용)
    const result = await testConnection(notionApiKey, notionDatabaseId)

    if (result.success) {
      return NextResponse.json({
        success: true,
        data: {
          success: true,
          message: "노션 데이터베이스에 성공적으로 연결되었습니다.",
          databaseName: result.databaseName,
          pageCount: result.pageCount && result.pageCount >= 0 ? result.pageCount : undefined,
        },
      })
    } else {
      // 연결 실패
      return NextResponse.json(
        {
          success: false,
          data: {
            success: false,
            message: result.message,
          },
          error: result.message,
        },
        { status: 400 }
      )
    }
  } catch (error) {
    console.error("연동 테스트 오류:", error)

    // 에러 메시지 추출
    let errorMessage = "서버 오류가 발생했습니다."
    if (error instanceof Error) {
      // 노션 API 에러 메시지 파싱
      if (error.message.includes("unauthorized") || error.message.includes("401")) {
        errorMessage = "API 키가 유효하지 않습니다. 노션 Integration 설정을 확인해주세요."
      } else if (error.message.includes("object_not_found") || error.message.includes("404")) {
        errorMessage = "데이터베이스를 찾을 수 없습니다. ID를 확인하고, Integration이 데이터베이스에 연결되어 있는지 확인해주세요."
      } else if (error.message.includes("rate_limited") || error.message.includes("429")) {
        errorMessage = "요청이 너무 많습니다. 잠시 후 다시 시도해주세요."
      } else {
        errorMessage = error.message
      }
    }

    return NextResponse.json(
      {
        success: false,
        data: {
          success: false,
          message: errorMessage,
        },
        error: errorMessage,
      },
      { status: 500 }
    )
  }
}
