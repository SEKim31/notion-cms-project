"use client"

import { useState } from "react"
import { RefreshCw, Search, SlidersHorizontal, Check } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { QuoteStatus } from "@/types"
import { getStatusLabel } from "@/lib/mock/quotes"
import { cn } from "@/lib/utils"

interface QuoteListToolbarProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  selectedStatuses: QuoteStatus[]
  onStatusChange: (statuses: QuoteStatus[]) => void
  onSync: () => Promise<void>
  lastSyncTime?: Date
}

// 견적서 목록 툴바 (검색, 필터, 동기화)
export function QuoteListToolbar({
  searchQuery,
  onSearchChange,
  selectedStatuses,
  onStatusChange,
  onSync,
  lastSyncTime,
}: QuoteListToolbarProps) {
  const [isSyncing, setIsSyncing] = useState(false)

  // 동기화 실행
  const handleSync = async () => {
    setIsSyncing(true)
    try {
      await onSync()
      toast.success("노션 데이터가 동기화되었습니다.")
    } catch (error) {
      toast.error("동기화에 실패했습니다. 다시 시도해주세요.")
    } finally {
      setIsSyncing(false)
    }
  }

  // 상태 필터 토글
  const toggleStatus = (status: QuoteStatus) => {
    if (selectedStatuses.includes(status)) {
      onStatusChange(selectedStatuses.filter((s) => s !== status))
    } else {
      onStatusChange([...selectedStatuses, status])
    }
  }

  // 모든 상태 선택/해제
  const allStatuses = Object.values(QuoteStatus)
  const isAllSelected = selectedStatuses.length === allStatuses.length
  const hasFilters = selectedStatuses.length > 0 && !isAllSelected

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      {/* 검색 입력 */}
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="견적서 번호, 클라이언트명으로 검색..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="flex items-center gap-2">
        {/* 상태 필터 */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2">
              <SlidersHorizontal className="h-4 w-4" />
              필터
              {hasFilters && (
                <Badge variant="secondary" className="ml-1 h-5 px-1.5">
                  {selectedStatuses.length}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel>상태 필터</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuCheckboxItem
              checked={isAllSelected || selectedStatuses.length === 0}
              onCheckedChange={() => {
                if (isAllSelected || selectedStatuses.length === 0) {
                  onStatusChange([])
                } else {
                  onStatusChange(allStatuses)
                }
              }}
            >
              전체
            </DropdownMenuCheckboxItem>
            <DropdownMenuSeparator />
            {allStatuses.map((status) => (
              <DropdownMenuCheckboxItem
                key={status}
                checked={selectedStatuses.includes(status)}
                onCheckedChange={() => toggleStatus(status)}
              >
                {getStatusLabel(status)}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* 동기화 버튼 */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={handleSync}
            disabled={isSyncing}
            className="gap-2"
          >
            <RefreshCw
              className={cn("h-4 w-4", isSyncing && "animate-spin")}
            />
            {isSyncing ? "동기화 중..." : "동기화"}
          </Button>
        </div>
      </div>

      {/* 마지막 동기화 시간 (모바일에서는 아래에 표시) */}
      {lastSyncTime && (
        <div className="flex items-center gap-1 text-xs text-muted-foreground sm:hidden">
          <Check className="h-3 w-3" />
          마지막 동기화:{" "}
          {new Intl.DateTimeFormat("ko-KR", {
            hour: "2-digit",
            minute: "2-digit",
          }).format(lastSyncTime)}
        </div>
      )}
    </div>
  )
}

// 동기화 상태 표시 컴포넌트
export function SyncStatus({
  lastSyncTime,
  isConnected,
}: {
  lastSyncTime?: Date
  isConnected: boolean
}) {
  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      <div
        className={cn(
          "h-2 w-2 rounded-full",
          isConnected ? "bg-green-500" : "bg-yellow-500"
        )}
      />
      {isConnected ? (
        lastSyncTime ? (
          <span>
            마지막 동기화:{" "}
            {new Intl.DateTimeFormat("ko-KR", {
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            }).format(lastSyncTime)}
          </span>
        ) : (
          <span>노션 연동됨</span>
        )
      ) : (
        <span>노션 연동 필요</span>
      )}
    </div>
  )
}
