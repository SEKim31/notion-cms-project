// 노션 → DB 동기화 API
// POST: 동기화 트리거
// GET: 동기화 상태 조회

import { NextRequest, NextResponse } from "next/server"
import { v4 as uuidv4 } from "uuid"
import { createClient, createAdminClient } from "@/lib/supabase/server"
import { decrypt } from "@/lib/crypto"
import { queryAllPages, isDatabasePage } from "@/lib/notion"
import { mapNotionPageToQuote } from "@/lib/notion/mapper"
import { getSyncStatus, updateLastSyncTime, createEmptySyncResult } from "@/lib/sync"
import { getEnvNotionApiKey, getEnvDatabaseId, hasEnvNotionConfig } from "@/lib/notion/client"
import type { ApiResponse, SyncResponse, SyncStatusResponse } from "@/types/api"
import type { CreateQuoteInput } from "@/types/database"
import type { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints"

/**
 * GET /api/sync
 * 동기화 상태 조회
 */
export async function GET(): Promise<NextResponse<ApiResponse<SyncStatusResponse | null>>> {
  try {
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

    // 동기화 상태 조회
    const status = await getSyncStatus(user.id)

    return NextResponse.json({
      success: true,
      data: status,
    })
  } catch (error) {
    console.error("동기화 상태 조회 오류:", error)
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
 * POST /api/sync
 * 노션 → DB 동기화 실행
 */
export async function POST(
  request: NextRequest
): Promise<NextResponse<ApiResponse<SyncResponse>>> {
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
            syncedCount: 0,
            newCount: 0,
            updatedCount: 0,
            lastSyncAt: new Date(),
          },
          error: "인증이 필요합니다.",
        },
        { status: 401 }
      )
    }

    // 요청 본문 파싱 (force 옵션)
    let force = false
    try {
      const body = await request.json()
      force = body.force === true
    } catch {
      // JSON 파싱 실패 시 기본값 사용
    }

    // 노션 API 키와 데이터베이스 ID 가져오기
    let apiKey: string | null = null
    let databaseId: string | null = null

    // 1. 먼저 환경 변수 확인 (단일 사용자용)
    if (hasEnvNotionConfig()) {
      apiKey = getEnvNotionApiKey()
      databaseId = getEnvDatabaseId()
    } else {
      // 2. 환경 변수가 없으면 DB에서 조회
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("notion_api_key, notion_database_id")
        .eq("id", user.id)
        .single()

      if (userError || !userData) {
        return NextResponse.json(
          {
            success: false,
            data: {
              success: false,
              message: "노션 연동 설정을 먼저 완료해주세요.",
              syncedCount: 0,
              newCount: 0,
              updatedCount: 0,
              lastSyncAt: new Date(),
            },
            error: "노션 연동 설정을 먼저 완료해주세요.",
          },
          { status: 400 }
        )
      }

      if (!userData.notion_api_key || !userData.notion_database_id) {
        return NextResponse.json(
          {
            success: false,
            data: {
              success: false,
              message: "노션 API 키와 데이터베이스 ID를 설정해주세요.",
              syncedCount: 0,
              newCount: 0,
              updatedCount: 0,
              lastSyncAt: new Date(),
            },
            error: "노션 API 키와 데이터베이스 ID를 설정해주세요.",
          },
          { status: 400 }
        )
      }

      // API 키 복호화
      try {
        apiKey = decrypt(userData.notion_api_key)
      } catch (decryptError) {
        console.error("API 키 복호화 오류:", decryptError)
        return NextResponse.json(
          {
            success: false,
            data: {
              success: false,
              message: "API 키 복호화에 실패했습니다.",
              syncedCount: 0,
              newCount: 0,
              updatedCount: 0,
              lastSyncAt: new Date(),
            },
            error: "API 키 복호화에 실패했습니다.",
          },
          { status: 500 }
        )
      }

      databaseId = userData.notion_database_id
    }

    if (!apiKey || !databaseId) {
      return NextResponse.json(
        {
          success: false,
          data: {
            success: false,
            message: "노션 설정이 올바르지 않습니다.",
            syncedCount: 0,
            newCount: 0,
            updatedCount: 0,
            lastSyncAt: new Date(),
          },
          error: "노션 설정이 올바르지 않습니다.",
        },
        { status: 400 }
      )
    }

    // 노션에서 모든 페이지 조회
    console.log("노션에서 데이터 조회 시작...")
    const { pages, totalCount } = await queryAllPages(apiKey, databaseId)
    console.log(`노션에서 ${totalCount}개 페이지 조회 완료`)

    if (totalCount === 0) {
      // 마지막 동기화 시간 업데이트
      await updateLastSyncTime(user.id)

      return NextResponse.json({
        success: true,
        data: {
          success: true,
          message: "동기화할 견적서가 없습니다.",
          syncedCount: 0,
          newCount: 0,
          updatedCount: 0,
          lastSyncAt: new Date(),
        },
      })
    }

    // 기존 견적서 조회 (notionPageId 기준) - RLS 우회를 위해 admin 클라이언트 사용
    const adminClient = await createAdminClient()
    const { data: existingQuotes, error: existingError } = await adminClient
      .from("quotes")
      .select("id, notion_page_id, updated_at")
      .eq("user_id", user.id)

    if (existingError) {
      console.error("기존 견적서 조회 오류:", existingError)
    }

    // 기존 견적서 맵 (notionPageId → quote)
    const existingQuotesMap = new Map(
      (existingQuotes || []).map((q) => [q.notion_page_id, q])
    )

    // 동기화 결과 추적
    const result = createEmptySyncResult()
    const quotesToUpsert: Array<{
      id: string
      user_id: string
      notion_page_id: string
      quote_number: string
      client_name: string
      client_contact: string | null
      client_phone: string | null
      client_email: string | null
      items: unknown
      total_amount: number
      issue_date: string
      valid_until: string | null
      notes: string | null
      share_id: string
      status: string
      updated_at: string
    }> = []

    // 노션 페이지를 Quote로 변환
    for (const page of pages) {
      if (!isDatabasePage(page)) {
        continue
      }

      try {
        // 타입 캐스팅: isDatabasePage가 true이면 PageObjectResponse 타입
        const typedPage = page as PageObjectResponse
        const quoteInput: CreateQuoteInput = mapNotionPageToQuote(typedPage, user.id)
        const existing = existingQuotesMap.get(quoteInput.notionPageId)

        // DB에 저장할 데이터 형식으로 변환
        const quoteData = {
          id: existing?.id || uuidv4(),
          user_id: user.id,
          notion_page_id: quoteInput.notionPageId,
          quote_number: quoteInput.quoteNumber,
          client_name: quoteInput.clientName,
          client_contact: quoteInput.clientContact ?? null,
          client_phone: quoteInput.clientPhone ?? null,
          client_email: quoteInput.clientEmail ?? null,
          items: quoteInput.items,
          total_amount: quoteInput.totalAmount,
          issue_date: quoteInput.issueDate.toISOString().split("T")[0],
          valid_until: quoteInput.validUntil?.toISOString().split("T")[0] ?? null,
          notes: quoteInput.notes ?? null,
          share_id: existing?.id
            ? existingQuotesMap.get(quoteInput.notionPageId)?.id || uuidv4().replace(/-/g, "").slice(0, 16)
            : uuidv4().replace(/-/g, "").slice(0, 16),
          status: quoteInput.status || "DRAFT",
          updated_at: new Date().toISOString(),
        }

        quotesToUpsert.push(quoteData)

        if (existing) {
          result.updatedCount++
        } else {
          result.newCount++
        }
        result.syncedCount++
      } catch (mapError) {
        console.error("페이지 변환 오류:", mapError, page.id)
        result.errors.push(`페이지 ${page.id} 변환 실패`)
      }
    }

    // share_id 수정: 기존 quote가 있으면 해당 share_id 유지
    for (const quote of quotesToUpsert) {
      const existing = existingQuotesMap.get(quote.notion_page_id)
      if (existing) {
        // 기존 share_id 조회
        const { data: existingQuote } = await adminClient
          .from("quotes")
          .select("share_id")
          .eq("id", existing.id)
          .single()

        if (existingQuote?.share_id) {
          quote.share_id = existingQuote.share_id
        }
      }
    }

    // DB에 upsert - RLS 우회를 위해 admin 클라이언트 사용
    if (quotesToUpsert.length > 0) {
      const { error: upsertError } = await adminClient
        .from("quotes")
        .upsert(quotesToUpsert, {
          onConflict: "notion_page_id",
        })

      if (upsertError) {
        console.error("견적서 저장 오류:", upsertError)
        result.success = false
        result.errors.push(`DB 저장 오류: ${upsertError.message}`)
      }
    }

    // 삭제된 페이지 감지 (노션에 없지만 DB에 있는 경우)
    // 현재는 삭제하지 않고 유지 (필요시 구현)

    // 마지막 동기화 시간 업데이트
    await updateLastSyncTime(user.id)

    // 결과 메시지 생성
    const messageParts: string[] = []
    if (result.newCount > 0) messageParts.push(`${result.newCount}개 추가`)
    if (result.updatedCount > 0) messageParts.push(`${result.updatedCount}개 업데이트`)

    result.message =
      messageParts.length > 0
        ? `동기화 완료: ${messageParts.join(", ")}`
        : "동기화 완료: 변경 사항 없음"

    console.log("동기화 완료:", result)

    return NextResponse.json({
      success: result.success,
      data: {
        success: result.success,
        message: result.message,
        syncedCount: result.syncedCount,
        newCount: result.newCount,
        updatedCount: result.updatedCount,
        lastSyncAt: new Date(),
      },
    })
  } catch (error) {
    console.error("동기화 오류:", error)
    const errorMessage = error instanceof Error ? error.message : "알 수 없는 오류"

    return NextResponse.json(
      {
        success: false,
        data: {
          success: false,
          message: `동기화 실패: ${errorMessage}`,
          syncedCount: 0,
          newCount: 0,
          updatedCount: 0,
          lastSyncAt: new Date(),
        },
        error: `동기화 실패: ${errorMessage}`,
      },
      { status: 500 }
    )
  }
}
