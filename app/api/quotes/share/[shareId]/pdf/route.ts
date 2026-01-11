import { NextRequest, NextResponse } from "next/server"
import { renderToBuffer } from "@react-pdf/renderer"

import { createAdminClient } from "@/lib/supabase/server"
import { QuoteDocument, registerFonts } from "@/lib/pdf"
import type { Quote, QuoteItem, QuoteStatus } from "@/types/database"

// 공유 견적서 PDF 생성 API (클라이언트용, 인증 불필요)
// GET /api/quotes/share/[shareId]/pdf
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ shareId: string }> }
) {
  try {
    const { shareId } = await params

    // shareId 형식 검증 (16자리 hex)
    const shareIdRegex = /^[0-9a-f]{16}$/i
    if (!shareId || !shareIdRegex.test(shareId)) {
      return NextResponse.json(
        { error: "유효하지 않은 공유 링크입니다." },
        { status: 400 }
      )
    }

    // RLS 우회를 위해 Admin 클라이언트 사용 (공개 페이지)
    const supabase = await createAdminClient()

    // shareId로 견적서 조회 (소유자 회사명 포함)
    const { data: quoteData, error: quoteError } = await supabase
      .from("quotes")
      .select("*, users!inner(company_name)")
      .eq("share_id", shareId)
      .single()

    if (quoteError || !quoteData) {
      return NextResponse.json(
        { error: "견적서를 찾을 수 없습니다." },
        { status: 404 }
      )
    }

    // 소유자 회사명 추출
    const userData = quoteData.users as { company_name: string }
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
      sentAt: quoteData.sent_at ? new Date(quoteData.sent_at) : null,
      sentTo: quoteData.sent_to,
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
