// 견적서 상세 조회 API
// GET /api/quotes/[id] - 로그인한 사용자의 특정 견적서 상세 조회

import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import type { QuoteDetailResponse, ApiResponse } from "@/types/api"
import type { Quote, QuoteStatus, QuoteItem } from "@/types/database"

interface RouteParams {
  params: Promise<{ id: string }>
}

/**
 * 견적서 상세 조회
 * - 인증 필수
 * - 본인 소유 견적서만 조회 가능
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
    const supabase = await createClient()

    // 현재 로그인한 사용자 확인
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json<ApiResponse<null>>(
        {
          data: null,
          success: false,
          error: "로그인이 필요합니다.",
        },
        { status: 401 }
      )
    }

    // UUID 형식 검증
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    if (!uuidRegex.test(id)) {
      return NextResponse.json<ApiResponse<null>>(
        {
          data: null,
          success: false,
          error: "잘못된 견적서 ID 형식입니다.",
        },
        { status: 400 }
      )
    }

    // 견적서 조회
    const { data: quoteData, error: quoteError } = await supabase
      .from("quotes")
      .select("*")
      .eq("id", id)
      .single()

    if (quoteError || !quoteData) {
      // PGRST116: row not found
      if (quoteError?.code === "PGRST116") {
        return NextResponse.json<ApiResponse<null>>(
          {
            data: null,
            success: false,
            error: "견적서를 찾을 수 없습니다.",
          },
          { status: 404 }
        )
      }
      console.error("견적서 조회 오류:", quoteError)
      return NextResponse.json<ApiResponse<null>>(
        {
          data: null,
          success: false,
          error: "견적서를 불러오는데 실패했습니다.",
        },
        { status: 500 }
      )
    }

    // 권한 검증: 본인 소유 견적서만 조회 가능
    if (quoteData.user_id !== user.id) {
      return NextResponse.json<ApiResponse<null>>(
        {
          data: null,
          success: false,
          error: "이 견적서에 대한 접근 권한이 없습니다.",
        },
        { status: 403 }
      )
    }

    // 사용자 회사명 조회
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("company_name")
      .eq("id", user.id)
      .single()

    if (userError) {
      console.error("사용자 정보 조회 오류:", userError)
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
      sentAt: quoteData.sent_at ? new Date(quoteData.sent_at) : null,
      sentTo: quoteData.sent_to,
      createdAt: new Date(quoteData.created_at),
      updatedAt: new Date(quoteData.updated_at),
    }

    const response: QuoteDetailResponse = {
      quote,
      user: {
        companyName: userData?.company_name || "",
      },
    }

    return NextResponse.json<ApiResponse<QuoteDetailResponse>>({
      data: response,
      success: true,
    })
  } catch (error) {
    console.error("견적서 상세 조회 API 오류:", error)
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
