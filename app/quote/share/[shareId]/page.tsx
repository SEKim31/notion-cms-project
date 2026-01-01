import { notFound } from "next/navigation"

import {
  QuoteHeader,
  ClientInfoCard,
  QuoteItemsTable,
  QuoteNotesCard,
  SharedQuoteActions,
} from "@/components/features/quotes"
import { getMockQuoteByShareId } from "@/lib/mock/quotes"
import type { PageParams } from "@/types"

// 공유 견적서 페이지 (클라이언트용, 인증 불필요)
export default async function SharedQuotePage({ params }: PageParams) {
  const { shareId } = await params

  // TODO: shareId로 견적서 조회 (공개 API)
  // 현재는 더미 데이터 사용
  const quote = getMockQuoteByShareId(shareId)

  if (!quote) {
    notFound()
  }

  // TODO: 발행자 정보는 견적서 데이터에서 가져오기
  const companyName = "테크 솔루션즈"

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
              quoteId={quote.id}
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
              quoteId={quote.id}
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
