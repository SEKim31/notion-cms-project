import { NextRequest, NextResponse } from "next/server"
import { renderToBuffer } from "@react-pdf/renderer"

import { createClient } from "@/lib/supabase/server"
import { QuoteDocument, registerFonts } from "@/lib/pdf"
import type { Quote, QuoteItem, QuoteStatus } from "@/types/database"

// 견적서 PDF 생성 API (사업자용)
// GET /api/quotes/[id]/pdf
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()

    // 현재 로그인한 사용자 확인
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: "인증이 필요합니다." },
        { status: 401 }
      )
    }

    // UUID 형식 검증
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    if (!uuidRegex.test(id)) {
      return NextResponse.json(
        { error: "유효하지 않은 견적서 ID입니다." },
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
      return NextResponse.json(
        { error: "견적서를 찾을 수 없습니다." },
        { status: 404 }
      )
    }

    // 권한 검증: 본인 소유 견적서만 PDF 생성 가능
    if (quoteData.user_id !== user.id) {
      return NextResponse.json(
        { error: "이 견적서에 대한 접근 권한이 없습니다." },
        { status: 403 }
      )
    }

    // 사용자 회사명 조회
    const { data: userData } = await supabase
      .from("users")
      .select("company_name")
      .eq("id", user.id)
      .single()

    const companyName = userData?.company_name || "발행자"

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

    // 폰트 등록
    registerFonts()

    // PDF 생성
    const pdfBuffer = await renderToBuffer(
      QuoteDocument({ quote, companyName })
    )

    // 파일명 생성 (한글 인코딩 처리)
    const filename = `견적서-${quote.quoteNumber}.pdf`
    const encodedFilename = encodeURIComponent(filename)

    // PDF 응답 반환 (Buffer를 Uint8Array로 변환)
    return new NextResponse(new Uint8Array(pdfBuffer), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${encodedFilename}"; filename*=UTF-8''${encodedFilename}`,
        "Content-Length": pdfBuffer.length.toString(),
      },
    })
  } catch (error) {
    console.error("PDF 생성 오류:", error)
    return NextResponse.json(
      { error: "PDF 생성 중 오류가 발생했습니다." },
      { status: 500 }
    )
  }
}
