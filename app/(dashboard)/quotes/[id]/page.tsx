import { notFound, redirect } from "next/navigation"

import { PageHeader } from "@/components/common/page-header"
import {
  QuoteHeader,
  ClientInfoCard,
  QuoteItemsTable,
  QuoteNotesCard,
  QuoteActions,
} from "@/components/features/quotes"
import { createClient } from "@/lib/supabase/server"
import type { PageParams, Quote, QuoteItem, QuoteStatus } from "@/types"

// 견적서 상세 페이지 (사업자용)
export default async function QuoteDetailPage({ params }: PageParams) {
  const { id } = await params
  const supabase = await createClient()

  // 현재 로그인한 사용자 확인
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  // UUID 형식 검증
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
  if (!uuidRegex.test(id)) {
    notFound()
  }

  // 견적서 조회
  const { data: quoteData, error: quoteError } = await supabase
    .from("quotes")
    .select("*")
    .eq("id", id)
    .single()

  if (quoteError || !quoteData) {
    notFound()
  }

  // 권한 검증: 본인 소유 견적서만 조회 가능
  if (quoteData.user_id !== user.id) {
    notFound()
  }

  // 사용자 회사명 조회
  const { data: userData } = await supabase
    .from("users")
    .select("company_name")
    .eq("id", user.id)
    .single()

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

  const companyName = userData?.company_name || ""

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="견적서 상세"
        description={`${quote.quoteNumber} - ${quote.clientName}`}
      >
        <QuoteActions
          quoteId={quote.id}
          shareId={quote.shareId}
          quoteNumber={quote.quoteNumber}
          clientEmail={quote.clientEmail}
        />
      </PageHeader>

      <div className="grid gap-6">
        {/* 견적서 헤더 정보 */}
        <QuoteHeader quote={quote} companyName={companyName} />

        {/* 클라이언트 정보 */}
        <ClientInfoCard quote={quote} />

        {/* 품목 테이블 */}
        <QuoteItemsTable items={quote.items} totalAmount={quote.totalAmount} />

        {/* 비고 */}
        <QuoteNotesCard notes={quote.notes} />
      </div>
    </div>
  )
}
