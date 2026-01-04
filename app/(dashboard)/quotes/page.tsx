"use client"

import Link from "next/link"
import { Settings } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { PageHeader } from "@/components/common/page-header"
import { QuoteList } from "@/components/features/quotes"
import { useSyncData } from "@/hooks/use-sync"
import { useQuotes } from "@/hooks/use-quotes"

// 견적서 목록 페이지
export default function QuotesPage() {
  // 동기화 상태 및 액션
  const { isConnected, isLoading: isSyncLoading, lastSyncAt, isSyncing, syncAsync, refetch } = useSyncData()

  // 견적서 목록 조회 (실제 API 사용)
  const { data: quotesData, isLoading: isQuotesLoading, refetch: refetchQuotes } = useQuotes()

  // 동기화 핸들러 (실제 API 연동)
  const handleSync = async () => {
    try {
      const result = await syncAsync(false)
      if (result.success) {
        toast.success(result.message)
        // 동기화 성공 후 견적서 목록 새로고침
        await refetchQuotes()
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

  // 로딩 상태 통합
  const isLoading = isSyncLoading || isQuotesLoading || isSyncing

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
        quotes={quotesData?.data || []}
        isLoading={isLoading}
        isConnected={isConnected}
        lastSyncTime={lastSyncAt}
        onSync={handleSync}
      />
    </div>
  )
}
