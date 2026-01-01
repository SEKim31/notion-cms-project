"use client"

import Link from "next/link"
import { Settings } from "lucide-react"

import { Button } from "@/components/ui/button"
import { PageHeader } from "@/components/common/page-header"
import { QuoteList } from "@/components/features/quotes"
import { getMockQuoteSummaries } from "@/lib/mock/quotes"

// 견적서 목록 페이지
export default function QuotesPage() {
  // TODO: 실제 데이터는 Supabase에서 가져오기 (React Query 사용)
  // 현재는 더미 데이터 사용
  const quotes = getMockQuoteSummaries()

  // TODO: 실제 연동 상태는 사용자 설정에서 가져오기
  const isConnected = true
  const lastSyncTime = new Date()

  // 동기화 핸들러 (TODO: 실제 API 연동)
  const handleSync = async () => {
    // 더미 동기화 - 1초 대기
    await new Promise((resolve) => setTimeout(resolve, 1000))
  }

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="견적서 목록"
        description="노션에서 동기화된 견적서를 확인하고 관리합니다."
      >
        <Button variant="outline" asChild>
          <Link href="/settings">
            <Settings className="mr-2 h-4 w-4" />
            노션 설정
          </Link>
        </Button>
      </PageHeader>

      <QuoteList
        quotes={quotes}
        isLoading={false}
        isConnected={isConnected}
        lastSyncTime={lastSyncTime}
        onSync={handleSync}
      />
    </div>
  )
}
