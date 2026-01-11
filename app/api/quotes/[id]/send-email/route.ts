// 견적서 이메일 발송 API
// POST /api/quotes/[id]/send-email

import { NextRequest, NextResponse } from "next/server"
import { renderToBuffer } from "@react-pdf/renderer"
import { render } from "@react-email/render"

import { createClient } from "@/lib/supabase/server"
import { QuoteDocument, registerFonts } from "@/lib/pdf"
import { sendEmail } from "@/lib/email/sender"
import { QuoteEmailTemplate } from "@/lib/email/templates/quote-email"
import { getNotionClient, updateNotionPageStatus } from "@/lib/notion"
import { getEnvNotionApiKey } from "@/lib/notion/client"
import type { Quote, QuoteItem } from "@/types/database"
import { QuoteStatus } from "@/types/database"
import type { SendEmailRequest, SendEmailResponse } from "@/types/api"
import { formatAmount, formatDate } from "@/lib/mock/quotes"

// 타임아웃 설정: PDF 생성 + 이메일 발송에 시간이 걸릴 수 있음
export const maxDuration = 30

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse<SendEmailResponse>> {
  try {
    const { id } = await params
    const supabase = await createClient()

    // 1. 인증 확인
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { success: false, message: "인증이 필요합니다." },
        { status: 401 }
      )
    }

    // 2. UUID 형식 검증
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    if (!uuidRegex.test(id)) {
      return NextResponse.json(
        { success: false, message: "유효하지 않은 견적서 ID입니다." },
        { status: 400 }
      )
    }

    // 3. Request body 파싱
    let body: SendEmailRequest
    try {
      body = await request.json()
    } catch {
      return NextResponse.json(
        { success: false, message: "잘못된 요청 형식입니다." },
        { status: 400 }
      )
    }

    // 이메일 주소 검증
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!body.to || !emailRegex.test(body.to)) {
      return NextResponse.json(
        { success: false, message: "유효한 이메일 주소를 입력해주세요." },
        { status: 400 }
      )
    }

    // 4. 견적서 조회
    const { data: quoteData, error: quoteError } = await supabase
      .from("quotes")
      .select("*")
      .eq("id", id)
      .single()

    if (quoteError || !quoteData) {
      return NextResponse.json(
        { success: false, message: "견적서를 찾을 수 없습니다." },
        { status: 404 }
      )
    }

    // 5. 권한 검증: 본인 소유 견적서만 이메일 발송 가능
    if (quoteData.user_id !== user.id) {
      return NextResponse.json(
        { success: false, message: "이 견적서에 대한 접근 권한이 없습니다." },
        { status: 403 }
      )
    }

    // 6. 사용자 회사명 및 노션 API 키 조회
    const { data: userData } = await supabase
      .from("users")
      .select("company_name, notion_api_key")
      .eq("id", user.id)
      .single()

    const companyName = userData?.company_name || "발행자"
    // 환경 변수 API 키 우선, 없으면 사용자 설정 사용
    const notionApiKey = getEnvNotionApiKey() || userData?.notion_api_key

    // 7. DB 컬럼명 → 타입 필드명 변환
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

    // 8. PDF 생성
    registerFonts()
    const pdfBuffer = await renderToBuffer(
      QuoteDocument({ quote, companyName })
    )

    // 9. 공유 URL 생성
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
    const shareUrl = `${baseUrl}/quote/share/${quote.shareId}`

    // 10. 이메일 템플릿 렌더링
    const emailHtml = await render(
      QuoteEmailTemplate({
        companyName,
        clientName: quote.clientName,
        quoteNumber: quote.quoteNumber,
        totalAmount: formatAmount(quote.totalAmount),
        validUntil: quote.validUntil ? formatDate(quote.validUntil) : "별도 문의",
        shareUrl,
        customMessage: body.message,
      })
    )

    // 11. 이메일 제목 설정
    const subject = body.subject || `[${companyName}] 견적서 발송 안내 (${quote.quoteNumber})`

    // 12. 이메일 발송
    const result = await sendEmail({
      to: body.to,
      subject,
      html: emailHtml,
      attachments: [
        {
          filename: `견적서-${quote.quoteNumber}.pdf`,
          content: pdfBuffer,
          contentType: "application/pdf",
        },
      ],
      replyTo: user.email || undefined,
    })

    if (!result.success) {
      return NextResponse.json(
        { success: false, message: result.error || "이메일 발송에 실패했습니다." },
        { status: 500 }
      )
    }

    // 13. 발송 성공 시 상태 및 발송 정보 업데이트 (앱 DB)
    const sentAt = new Date().toISOString()
    await supabase
      .from("quotes")
      .update({
        status: "SENT",
        sent_at: sentAt,
        sent_to: body.to,
        updated_at: sentAt,
      })
      .eq("id", id)

    // 14. 노션 데이터베이스 상태 업데이트
    let notionUpdateResult: { success: boolean; error?: string } | null = null
    if (notionApiKey && quote.notionPageId) {
      try {
        const notionClient = getNotionClient(notionApiKey)
        notionUpdateResult = await updateNotionPageStatus(
          notionClient,
          quote.notionPageId,
          QuoteStatus.SENT
        )

        if (!notionUpdateResult.success) {
          console.warn(
            `[노션 상태 업데이트 경고] ${notionUpdateResult.error}`
          )
        }
      } catch (notionError) {
        // 노션 업데이트 실패는 이메일 발송 성공에 영향을 주지 않음
        console.error("[노션 상태 업데이트 실패]", notionError)
        notionUpdateResult = {
          success: false,
          error: notionError instanceof Error ? notionError.message : "알 수 없는 오류",
        }
      }
    }

    // 15. 성공 응답
    const responseMessage = notionUpdateResult?.success === false
      ? `이메일이 발송되었습니다. (노션 상태 업데이트 실패: ${notionUpdateResult.error})`
      : "이메일이 성공적으로 발송되었습니다."

    return NextResponse.json({
      success: true,
      message: responseMessage,
      emailId: result.id,
      sentAt: new Date().toISOString(),
      notionUpdated: notionUpdateResult?.success ?? false,
    })
  } catch (error) {
    console.error("이메일 발송 오류:", error)
    return NextResponse.json(
      { success: false, message: "이메일 발송 중 오류가 발생했습니다." },
      { status: 500 }
    )
  }
}
