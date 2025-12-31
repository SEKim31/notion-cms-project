import { notFound } from "next/navigation"
import { Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { PageParams } from "@/types"

// 공유 견적서 페이지 (클라이언트용, 인증 불필요)
export default async function SharedQuotePage({ params }: PageParams) {
  const { shareId } = await params

  // TODO: shareId로 견적서 조회 (공개 API)
  const quote = null

  if (!quote) {
    notFound()
  }

  return (
    <div className="container max-w-4xl py-10">
      <div className="flex flex-col gap-8">
        {/* 헤더 */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">견적서</h1>
            <p className="text-muted-foreground">
              공유된 견적서를 확인하실 수 있습니다.
            </p>
          </div>
          <Button size="lg">
            <Download className="mr-2 h-4 w-4" />
            PDF 다운로드
          </Button>
        </div>

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

          {/* 발행자 정보 */}
          <Card>
            <CardHeader>
              <CardTitle>발행자 정보</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">회사명</p>
                  <p className="font-medium">발행 회사명</p>
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

        {/* 하단 다운로드 버튼 */}
        <div className="flex justify-center">
          <Button size="lg">
            <Download className="mr-2 h-4 w-4" />
            PDF 다운로드
          </Button>
        </div>
      </div>
    </div>
  )
}
