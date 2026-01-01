import { notFound } from "next/navigation"

import { PageHeader } from "@/components/common/page-header"
import {
  QuoteHeader,
  ClientInfoCard,
  QuoteItemsTable,
  QuoteNotesCard,
  QuoteActions,
} from "@/components/features/quotes"
import { getMockQuoteById } from "@/lib/mock/quotes"
import type { PageParams } from "@/types"

// 견적서 상세 페이지 (사업자용)
export default async function QuoteDetailPage({ params }: PageParams) {
  const { id } = await params

  // TODO: 실제 데이터는 Supabase에서 가져오기
  // 현재는 더미 데이터 사용
  const quote = getMockQuoteById(id)

  if (!quote) {
    notFound()
  }

  // TODO: 사업자 정보는 세션에서 가져오기
  const companyName = "테크 솔루션즈"

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="견적서 상세"
        description={`${quote.quoteNumber} - ${quote.clientName}`}
      >
        <QuoteActions quoteId={quote.id} shareId={quote.shareId} />
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
