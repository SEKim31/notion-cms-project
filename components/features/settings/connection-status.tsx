"use client"

import { CheckCircle2, XCircle, AlertCircle, Loader2, RefreshCw } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

export type ConnectionStatusType = "connected" | "disconnected" | "error" | "loading"

interface ConnectionStatusProps {
  status: ConnectionStatusType
  databaseName?: string
  lastSyncAt?: Date | null
  onRefresh?: () => void
  isRefreshing?: boolean
}

// 연동 상태에 따른 스타일 및 아이콘
const statusConfig = {
  connected: {
    icon: CheckCircle2,
    label: "연결됨",
    description: "노션 데이터베이스에 정상적으로 연결되어 있습니다.",
    className: "text-green-600 dark:text-green-400",
    bgClassName: "bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800",
  },
  disconnected: {
    icon: XCircle,
    label: "연결 안 됨",
    description: "노션 API 키와 데이터베이스 ID를 설정해주세요.",
    className: "text-gray-500 dark:text-gray-400",
    bgClassName: "bg-gray-50 dark:bg-gray-900/30 border-gray-200 dark:border-gray-800",
  },
  error: {
    icon: AlertCircle,
    label: "연결 오류",
    description: "연결에 문제가 있습니다. 설정을 확인해주세요.",
    className: "text-red-600 dark:text-red-400",
    bgClassName: "bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800",
  },
  loading: {
    icon: Loader2,
    label: "확인 중",
    description: "연결 상태를 확인하고 있습니다...",
    className: "text-blue-600 dark:text-blue-400",
    bgClassName: "bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800",
  },
}

// 마지막 동기화 시간 포맷팅
function formatLastSync(date: Date | null | undefined): string {
  if (!date) return "동기화 기록 없음"

  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / (1000 * 60))
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffMins < 1) return "방금 전"
  if (diffMins < 60) return `${diffMins}분 전`
  if (diffHours < 24) return `${diffHours}시간 전`
  if (diffDays < 7) return `${diffDays}일 전`

  return date.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

// 노션 연동 상태 표시 컴포넌트
export function ConnectionStatus({
  status,
  databaseName,
  lastSyncAt,
  onRefresh,
  isRefreshing,
}: ConnectionStatusProps) {
  const config = statusConfig[status]
  const StatusIcon = config.icon

  return (
    <div
      className={cn(
        "rounded-lg border p-4",
        config.bgClassName
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <StatusIcon
            className={cn(
              "h-5 w-5 mt-0.5",
              config.className,
              status === "loading" && "animate-spin"
            )}
          />
          <div className="space-y-1">
            <p className={cn("font-medium", config.className)}>
              {config.label}
            </p>
            <p className="text-sm text-muted-foreground">
              {config.description}
            </p>
            {status === "connected" && (
              <div className="mt-2 space-y-1">
                {databaseName && (
                  <p className="text-sm">
                    <span className="text-muted-foreground">데이터베이스: </span>
                    <span className="font-medium">{databaseName}</span>
                  </p>
                )}
                <p className="text-sm">
                  <span className="text-muted-foreground">마지막 동기화: </span>
                  <span className="font-medium">{formatLastSync(lastSyncAt)}</span>
                </p>
              </div>
            )}
          </div>
        </div>
        {status === "connected" && onRefresh && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onRefresh}
            disabled={isRefreshing}
            className="text-muted-foreground hover:text-foreground"
          >
            <RefreshCw
              className={cn(
                "h-4 w-4",
                isRefreshing && "animate-spin"
              )}
            />
            <span className="sr-only">새로고침</span>
          </Button>
        )}
      </div>
    </div>
  )
}
