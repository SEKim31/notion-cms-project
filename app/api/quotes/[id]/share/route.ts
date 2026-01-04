// 공유 링크 관리 API
// POST /api/quotes/[id]/share - shareId 재생성

import { NextRequest, NextResponse } from "next/server"
import { v4 as uuidv4 } from "uuid"
import { createClient } from "@/lib/supabase/server"
import type { ShareLinkResponse, ApiResponse } from "@/types/api"

interface RouteParams {
  params: Promise<{ id: string }>
}

/**
 * 새로운 shareId 생성
 * UUID v4에서 하이픈 제거 후 앞 16자리 사용
 */
function generateShareId(): string {
  return uuidv4().replace(/-/g, "").slice(0, 16)
}

/**
 * POST /api/quotes/[id]/share
 * 공유 링크 재생성 (기존 링크 무효화)
 */
export async function POST(
  request: NextRequest,
  { params }: RouteParams
): Promise<NextResponse<ApiResponse<ShareLinkResponse | null>>> {
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
      .select("id, user_id, share_id")
      .eq("id", id)
      .single()

    if (quoteError || !quoteData) {
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

    // 권한 검증: 본인 소유 견적서만 재생성 가능
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

    // 새 shareId 생성
    const newShareId = generateShareId()

    // DB 업데이트
    const { error: updateError } = await supabase
      .from("quotes")
      .update({
        share_id: newShareId,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)

    if (updateError) {
      console.error("shareId 업데이트 오류:", updateError)
      return NextResponse.json<ApiResponse<null>>(
        {
          data: null,
          success: false,
          error: "공유 링크 재생성에 실패했습니다.",
        },
        { status: 500 }
      )
    }

    const response: ShareLinkResponse = {
      shareId: newShareId,
      shareUrl: `/quote/share/${newShareId}`,
    }

    return NextResponse.json<ApiResponse<ShareLinkResponse>>({
      data: response,
      success: true,
      message: "공유 링크가 재생성되었습니다. 기존 링크는 더 이상 유효하지 않습니다.",
    })
  } catch (error) {
    console.error("공유 링크 재생성 API 오류:", error)
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
 * GET /api/quotes/[id]/share
 * 현재 공유 링크 조회
 */
export async function GET(
  request: NextRequest,
  { params }: RouteParams
): Promise<NextResponse<ApiResponse<ShareLinkResponse | null>>> {
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
      .select("id, user_id, share_id")
      .eq("id", id)
      .single()

    if (quoteError || !quoteData) {
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
      return NextResponse.json<ApiResponse<null>>(
        {
          data: null,
          success: false,
          error: "견적서를 불러오는데 실패했습니다.",
        },
        { status: 500 }
      )
    }

    // 권한 검증
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

    const response: ShareLinkResponse = {
      shareId: quoteData.share_id,
      shareUrl: `/quote/share/${quoteData.share_id}`,
    }

    return NextResponse.json<ApiResponse<ShareLinkResponse>>({
      data: response,
      success: true,
    })
  } catch (error) {
    console.error("공유 링크 조회 API 오류:", error)
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
