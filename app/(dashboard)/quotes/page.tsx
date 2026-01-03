"use client"

import Link from "next/link"
import { Settings } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { PageHeader } from "@/components/common/page-header"
import { QuoteList } from "@/components/features/quotes"
import { getMockQuoteSummaries } from "@/lib/mock/quotes"
import { useSyncData } from "@/hooks/use-sync"

// 견적서 목록 페이지
export default function QuotesPage() {
  // 동기화 상태 및 액션
  const { isConnected, lastSyncAt, isSyncing, syncAsync, refetch } = useSyncData()

  // TODO: 실제 데이터는 Supabase에서 가져오기 (Task 017에서 구현 예정)
  // 현재는 더미 데이터 사용
  const quotes = getMockQuoteSummaries()

  // 동기화 핸들러 (실제 API 연동)
  const handleSync = async () => {
    try {
      const result = await syncAsync(false)
      if (result.success) {
        toast.success(result.message)
      } else {
        toast.error(result.message || "동기화에 실패했습니다.")
      }
      // 동기화 후 상태 새로고침
      await refetch()
    } catch (error) {
      const message = error instanceof Error ? error.message : "동기화에 실패했습니다."
      toast.error(message)
      throw error // QuoteListToolbar에서 에러 처리하도록 전파
    }
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
        isLoading={isSyncing}
        isConnected={isConnected}
        lastSyncTime={lastSyncAt}
        onSync={handleSync}
      />
    </div>
  )
}
