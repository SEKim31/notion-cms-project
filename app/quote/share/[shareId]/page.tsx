import { notFound } from "next/navigation"

import {
  QuoteHeader,
  ClientInfoCard,
  QuoteItemsTable,
  QuoteNotesCard,
  SharedQuoteActions,
} from "@/components/features/quotes"
import { createAdminClient } from "@/lib/supabase/server"
import type { PageParams } from "@/types"
import type { Quote, QuoteStatus, QuoteItem } from "@/types/database"

// 공유 견적서 페이지 (클라이언트용, 인증 불필요)
export default async function SharedQuotePage({ params }: PageParams) {
  const { shareId } = await params

  // shareId 형식 검증 (16자리 hex)
  const shareIdRegex = /^[0-9a-f]{16}$/i
  if (!shareId || !shareIdRegex.test(shareId)) {
    notFound()
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
    notFound()
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

  // 소유자 회사명 추출
  const userData = quoteData.users as { company_name: string }
  const companyName = userData?.company_name || "발행자"

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="container max-w-4xl py-8 sm:py-12">
        <div className="flex flex-col gap-8">
          {/* 헤더 */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold sm:text-3xl">견적서</h1>
              <p className="text-muted-foreground">
                {quote.quoteNumber} - {companyName}
              </p>
            </div>
            <SharedQuoteActions
              shareId={quote.shareId}
              quoteNumber={quote.quoteNumber}
            />
          </div>

          <div className="grid gap-6">
            {/* 견적서 헤더 정보 */}
            <QuoteHeader quote={quote} companyName={companyName} />

            {/* 클라이언트 정보 */}
            <ClientInfoCard quote={quote} />

            {/* 품목 테이블 */}
            <QuoteItemsTable
              items={quote.items}
              totalAmount={quote.totalAmount}
            />

            {/* 비고 */}
            <QuoteNotesCard notes={quote.notes} />
          </div>

          {/* 하단 다운로드 버튼 */}
          <div className="flex justify-center border-t pt-8">
            <SharedQuoteActions
              shareId={quote.shareId}
              quoteNumber={quote.quoteNumber}
            />
          </div>

          {/* 푸터 안내 */}
          <div className="text-center text-sm text-muted-foreground">
            <p>
              이 견적서는 {companyName}에서 발행되었습니다.
            </p>
            <p className="mt-1">
              문의사항이 있으시면 발행자에게 직접 연락해주세요.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
