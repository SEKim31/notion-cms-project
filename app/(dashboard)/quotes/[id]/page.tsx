import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, Download, Link2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PageHeader } from "@/components/common/page-header"
import type { PageParams } from "@/types"

// 견적서 상세 페이지
export default async function QuoteDetailPage({ params }: PageParams) {
  const { id } = await params

  // TODO: 실제 데이터는 Supabase에서 가져오기
  const quote = null

  if (!quote) {
    notFound()
  }

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="견적서 상세"
        description={`견적서 번호: ${id}`}
      >
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href="/quotes">
              <ArrowLeft className="mr-2 h-4 w-4" />
              목록으로
            </Link>
          </Button>
          <Button variant="outline">
            <Link2 className="mr-2 h-4 w-4" />
            공유 링크 복사
          </Button>
          <Button>
            <Download className="mr-2 h-4 w-4" />
            PDF 다운로드
          </Button>
        </div>
      </PageHeader>

      <div className="grid gap-6">
        {/* 견적서 헤더 */}
        <Card>
          <CardHeader>
            <CardTitle>견적서 정보</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">견적서 번호</p>
                  <p className="font-medium">Q-2024-001</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">발행일</p>
                  <p className="font-medium">2024-12-30</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">유효기간</p>
                  <p className="font-medium">2025-01-30</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 클라이언트 정보 */}
        <Card>
          <CardHeader>
            <CardTitle>클라이언트 정보</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div>
                <p className="text-sm text-muted-foreground">회사명</p>
                <p className="font-medium">클라이언트 회사명</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">담당자</p>
                <p className="font-medium">홍길동</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">연락처</p>
                <p className="font-medium">010-1234-5678</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 품목 테이블 */}
        <Card>
          <CardHeader>
            <CardTitle>품목 내역</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="p-4 text-left font-medium">품목명</th>
                    <th className="p-4 text-right font-medium">수량</th>
                    <th className="p-4 text-right font-medium">단가</th>
                    <th className="p-4 text-right font-medium">금액</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="p-4">샘플 품목</td>
                    <td className="p-4 text-right">1</td>
                    <td className="p-4 text-right">1,000,000원</td>
                    <td className="p-4 text-right font-medium">1,000,000원</td>
                  </tr>
                  <tr className="bg-muted/50">
                    <td colSpan={3} className="p-4 text-right font-semibold">
                      총 금액
                    </td>
                    <td className="p-4 text-right text-lg font-bold">
                      1,000,000원
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* 비고 */}
        <Card>
          <CardHeader>
            <CardTitle>비고</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              특이사항이나 추가 내용이 여기에 표시됩니다.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
