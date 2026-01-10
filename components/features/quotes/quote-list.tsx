"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { FileText, Settings } from "lucide-react"

import { Button } from "@/components/ui/button"
import { EmptyState } from "@/components/common/empty-state"
import { QuoteListSkeleton } from "@/components/skeleton/quote-list-skeleton"
import { QuoteCard } from "./quote-card"
import { QuoteListToolbar, SyncStatus } from "./quote-list-toolbar"
import { QuoteSummary, QuoteStatus } from "@/types"

interface QuoteListProps {
  quotes: QuoteSummary[]
  isLoading?: boolean
  isConnected?: boolean
  lastSyncTime?: Date
  onSync?: () => Promise<void>
}

// 견적서 목록 컴포넌트
export function QuoteList({
  quotes,
  isLoading = false,
  isConnected = true,
  lastSyncTime,
  onSync,
}: QuoteListProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedStatuses, setSelectedStatuses] = useState<QuoteStatus[]>([])

  // 필터링된 견적서 목록
  const filteredQuotes = useMemo(() => {
    let result = quotes

    // 검색어 필터
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (quote) =>
          quote.quoteNumber.toLowerCase().includes(query) ||
          quote.clientName.toLowerCase().includes(query)
      )
    }

    // 상태 필터
    if (selectedStatuses.length > 0) {
      result = result.filter((quote) => selectedStatuses.includes(quote.status))
    }

    return result
  }, [quotes, searchQuery, selectedStatuses])

  // 동기화 핸들러
  const handleSync = async () => {
    if (onSync) {
      await onSync()
    } else {
      // 더미 동기화 (1초 대기)
      await new Promise((resolve) => setTimeout(resolve, 1000))
    }
  }

  // 로딩 상태
  if (isLoading) {
    return <QuoteListSkeleton />
  }

  // 노션 연동이 안된 경우
  if (!isConnected) {
    return (
      <div className="flex flex-col items-center gap-4 py-12">
        <EmptyState
          icon={Settings}
          title="노션 연동이 필요합니다"
          description="견적서를 불러오려면 먼저 노션 API 설정을 완료해주세요."
        />
        <Button asChild>
          <Link href="/settings">노션 연동 설정하기</Link>
        </Button>
      </div>
    )
  }

  // 견적서가 없는 경우
  if (quotes.length === 0) {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <SyncStatus lastSyncTime={lastSyncTime} isConnected={isConnected} />
          <Button variant="outline" onClick={handleSync}>
            동기화
          </Button>
        </div>
        <div className="flex flex-col items-center gap-4 py-12">
          <EmptyState
            icon={FileText}
            title="견적서가 없습니다"
            description="노션 데이터베이스에서 견적서를 동기화하거나, 노션에서 새 견적서를 작성해주세요."
          />
          <Button variant="outline" onClick={handleSync}>
            노션에서 동기화하기
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      {/* 동기화 상태 */}
      <SyncStatus lastSyncTime={lastSyncTime} isConnected={isConnected} />

      {/* 검색/필터/동기화 툴바 */}
      <QuoteListToolbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedStatuses={selectedStatuses}
        onStatusChange={setSelectedStatuses}
        onSync={handleSync}
        lastSyncTime={lastSyncTime}
      />

      {/* 검색 결과가 없는 경우 */}
      {filteredQuotes.length === 0 && (
        <div className="flex flex-col items-center gap-4 py-12">
          <EmptyState
            icon={FileText}
            title="검색 결과가 없습니다"
            description="다른 검색어나 필터 조건을 시도해보세요."
          />
          <Button
            variant="outline"
            onClick={() => {
              setSearchQuery("")
              setSelectedStatuses([])
            }}
          >
            필터 초기화
          </Button>
        </div>
      )}

      {/* 견적서 카드 그리드 */}
      {filteredQuotes.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredQuotes.map((quote) => (
            <QuoteCard key={quote.id} quote={quote} />
          ))}
        </div>
      )}

      {/* 검색/필터 결과 정보 */}
      {(searchQuery || selectedStatuses.length > 0) &&
        filteredQuotes.length > 0 && (
          <p className="text-center text-sm text-muted-foreground">
            총 {quotes.length}개 중 {filteredQuotes.length}개 표시
          </p>
        )}
    </div>
  )
}
