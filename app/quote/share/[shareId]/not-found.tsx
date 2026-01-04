import Link from "next/link"
import { FileQuestion } from "lucide-react"

import { Button } from "@/components/ui/button"

// 공유 견적서 404 페이지
export default function SharedQuoteNotFound() {
  return (
    <div className="min-h-screen bg-muted/30 flex items-center justify-center">
      <div className="container max-w-md text-center">
        <div className="flex flex-col items-center gap-6">
          {/* 아이콘 */}
          <div className="rounded-full bg-muted p-6">
            <FileQuestion className="h-12 w-12 text-muted-foreground" />
          </div>

          {/* 메시지 */}
          <div className="space-y-2">
            <h1 className="text-2xl font-bold">견적서를 찾을 수 없습니다</h1>
            <p className="text-muted-foreground">
              요청하신 견적서가 존재하지 않거나, 링크가 만료되었을 수 있습니다.
            </p>
          </div>

          {/* 안내 */}
          <div className="text-sm text-muted-foreground space-y-1">
            <p>다음 사항을 확인해 주세요:</p>
            <ul className="list-disc list-inside text-left">
              <li>링크 주소가 올바른지 확인</li>
              <li>발행자에게 새 링크 요청</li>
            </ul>
          </div>

          {/* 홈으로 버튼 */}
          <Button asChild variant="outline">
            <Link href="/">홈으로 돌아가기</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
