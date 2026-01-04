// 공유 견적서 조회 API (공개 API, 인증 불필요)
// GET /api/quotes/share/[shareId] - shareId로 견적서 조회

import { NextRequest, NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/server"
import type { SharedQuoteResponse, ApiResponse } from "@/types/api"
import type { Quote, QuoteStatus, QuoteItem } from "@/types/database"

interface RouteParams {
  params: Promise<{ shareId: string }>
}

/**
 * 공유 견적서 조회
 * - 인증 불필요 (공개 API)
 * - shareId로 견적서 조회
 * - 견적서 소유자의 회사명도 함께 반환
 */
export async function GET(
  request: NextRequest,
  { params }: RouteParams
): Promise<NextResponse<ApiResponse<SharedQuoteResponse | null>>> {
  try {
    const { shareId } = await params

    // shareId 형식 검증 (16자리 hex)
    const shareIdRegex = /^[0-9a-f]{16}$/i
    if (!shareId || !shareIdRegex.test(shareId)) {
      return NextResponse.json<ApiResponse<null>>(
        {
          data: null,
          success: false,
          error: "잘못된 공유 링크입니다.",
        },
        { status: 400 }
      )
    }

    // RLS 우회를 위해 Admin 클라이언트 사용
    // 공유 링크는 인증 없이 접근해야 하므로
    const supabase = await createAdminClient()

    // shareId로 견적서 조회
    const { data: quoteData, error: quoteError } = await supabase
      .from("quotes")
      .select("*, users!inner(company_name)")
      .eq("share_id", shareId)
      .single()

    if (quoteError || !quoteData) {
      // PGRST116: row not found
      if (quoteError?.code === "PGRST116") {
        return NextResponse.json<ApiResponse<null>>(
          {
            data: null,
            success: false,
            error: "존재하지 않는 견적서입니다.",
          },
          { status: 404 }
        )
      }
      console.error("공유 견적서 조회 오류:", quoteError)
      return NextResponse.json<ApiResponse<null>>(
        {
          data: null,
          success: false,
          error: "견적서를 불러오는데 실패했습니다.",
        },
        { status: 500 }
      )
    }

    // DB 컬럼명 → 타입 필드명 변환
    const quote: Quote = {
      id: quoteData.id,
      userId: quoteData.user_id,
      notionPageId: quoteData.notion_page_id,
      quoteNumber: quoteData.quote_number,
      clientName: quoteData.client_name,
      clientContact: quoteData.client_contact,
      clientPhone: quoteData.client_phone,
      clientEmail: quoteData.client_email,
      items: (quoteData.items || []) as QuoteItem[],
      totalAmount: quoteData.total_amount,
      issueDate: new Date(quoteData.issue_date),
      validUntil: quoteData.valid_until ? new Date(quoteData.valid_until) : null,
      notes: quoteData.notes,
      shareId: quoteData.share_id,
      status: quoteData.status as QuoteStatus,
      createdAt: new Date(quoteData.created_at),
      updatedAt: new Date(quoteData.updated_at),
    }

    // 타입 단언을 통해 users 데이터 추출
    const userData = quoteData.users as { company_name: string }
    const companyName = userData?.company_name || "발행자"

    const response: SharedQuoteResponse = {
      quote,
      companyName,
    }

    return NextResponse.json<ApiResponse<SharedQuoteResponse>>({
      data: response,
      success: true,
    })
  } catch (error) {
    console.error("공유 견적서 조회 API 오류:", error)
    return NextResponse.json<ApiResponse<null>>(
      {
        data: null,
        success: false,
        error: "서버 오류가 발생했습니다.",
      },
      { status: 500 }
    )
  }
}
