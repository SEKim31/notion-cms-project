// 견적서 목록 조회 API
// GET /api/quotes - 로그인한 사용자의 견적서 목록 조회

import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import type { QuoteListResponse, QuoteListParams, ApiResponse } from "@/types/api"
import type { QuoteSummary, QuoteStatus } from "@/types/database"

/**
 * 견적서 목록 조회
 * 페이지네이션, 검색, 정렬, 필터 지원
 */
export async function GET(request: NextRequest) {
  try {
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

    // URL 파라미터 파싱
    const searchParams = request.nextUrl.searchParams
    const params: QuoteListParams = {
      page: parseInt(searchParams.get("page") || "1"),
      limit: parseInt(searchParams.get("limit") || "10"),
      search: searchParams.get("search") || undefined,
      status: searchParams.get("status") || undefined,
      sortBy: (searchParams.get("sortBy") as QuoteListParams["sortBy"]) || "issueDate",
      sortOrder: (searchParams.get("sortOrder") as QuoteListParams["sortOrder"]) || "desc",
    }

    // 페이지네이션 계산
    const page = Math.max(1, params.page || 1)
    const limit = Math.min(50, Math.max(1, params.limit || 10))
    const offset = (page - 1) * limit

    // 기본 쿼리 빌드
    let query = supabase
      .from("quotes")
      .select("id, quote_number, client_name, total_amount, issue_date, status, share_id", {
        count: "exact",
      })
      .eq("user_id", user.id)

    // 검색 필터 (견적서 번호 또는 클라이언트명)
    if (params.search) {
      query = query.or(
        `quote_number.ilike.%${params.search}%,client_name.ilike.%${params.search}%`
      )
    }

    // 상태 필터
    if (params.status) {
      query = query.eq("status", params.status)
    }

    // 정렬
    const sortColumn = getSortColumn(params.sortBy || "issueDate")
    const ascending = params.sortOrder === "asc"
    query = query.order(sortColumn, { ascending })

    // 페이지네이션
    query = query.range(offset, offset + limit - 1)

    // 쿼리 실행
    const { data, count, error } = await query

    if (error) {
      console.error("견적서 목록 조회 오류:", error)
      return NextResponse.json<ApiResponse<null>>(
        {
          data: null,
          success: false,
          error: "견적서 목록을 불러오는데 실패했습니다.",
        },
        { status: 500 }
      )
    }

    // 데이터 변환 (DB 컬럼명 → 타입 필드명)
    const quotes: QuoteSummary[] = (data || []).map((row) => ({
      id: row.id,
      quoteNumber: row.quote_number,
      clientName: row.client_name,
      totalAmount: row.total_amount,
      issueDate: new Date(row.issue_date),
      status: row.status as QuoteStatus,
      shareId: row.share_id,
    }))

    // 페이지네이션 메타데이터
    const total = count || 0
    const totalPages = Math.ceil(total / limit)

    const response: QuoteListResponse = {
      data: quotes,
      total,
      page,
      limit,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    }

    return NextResponse.json<ApiResponse<QuoteListResponse>>({
      data: response,
      success: true,
    })
  } catch (error) {
    console.error("견적서 목록 API 오류:", error)
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

/**
 * 정렬 컬럼 변환
 * 타입 필드명 → DB 컬럼명
 */
function getSortColumn(sortBy: string): string {
  switch (sortBy) {
    case "issueDate":
      return "issue_date"
    case "createdAt":
      return "created_at"
    case "totalAmount":
      return "total_amount"
    default:
      return "issue_date"
  }
}
