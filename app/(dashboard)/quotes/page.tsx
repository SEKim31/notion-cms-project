import Link from "next/link"
import { FileText, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { EmptyState } from "@/components/common/empty-state"
import { PageHeader } from "@/components/common/page-header"

// 견적서 목록 페이지
export default function QuotesPage() {
  // TODO: 실제 데이터는 Supabase에서 가져오기
  const quotes: any[] = []

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="견적서 목록"
        description="노션에서 동기화된 견적서를 확인하고 관리합니다."
      >
        <Button asChild>
          <Link href="/settings">
            <Plus className="mr-2 h-4 w-4" />
            노션 연동 설정
          </Link>
        </Button>
      </PageHeader>

      {quotes.length === 0 ? (
        <div className="flex flex-col items-center gap-4 py-12">
          <EmptyState
            icon={FileText}
            title="견적서가 없습니다"
            description="노션 연동 설정을 완료하고 견적서를 동기화하세요."
          />
          <Button asChild>
            <Link href="/settings">노션 연동 설정하기</Link>
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {quotes.map((quote) => (
            <Card key={quote.id} className="p-6">
              <div className="flex flex-col gap-4">
                <div>
                  <h3 className="font-semibold">{quote.quoteNumber}</h3>
                  <p className="text-sm text-muted-foreground">
                    {quote.clientName}
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold">
                    {quote.totalAmount.toLocaleString()}원
                  </span>
                </div>
                <div className="flex gap-2">
                  <Button asChild className="flex-1">
                    <Link href={`/quotes/${quote.id}`}>상세보기</Link>
                  </Button>
                  <Button variant="outline">공유</Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
