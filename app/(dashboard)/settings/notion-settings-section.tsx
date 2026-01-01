"use client"

import { useState, useEffect } from "react"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  NotionSettingsForm,
  ConnectionStatus,
  type ConnectionStatusType,
} from "@/components/features/settings"
import type { ApiResponse } from "@/types/api"

// 설정 조회 응답 타입
interface NotionSettingsData {
  notionApiKey: string
  notionDatabaseId: string
  hasApiKey: boolean
  isConnected: boolean
}

// 설정 조회 API 호출
async function fetchSettings(): Promise<NotionSettingsData | null> {
  const response = await fetch("/api/settings/notion")

  if (response.status === 401) {
    // 인증되지 않은 경우 null 반환
    return null
  }

  const result: ApiResponse<NotionSettingsData | null> = await response.json()

  if (!result.success) {
    throw new Error(result.error || "설정을 불러오는데 실패했습니다.")
  }

  return result.data
}

// 노션 연동 설정 섹션 컴포넌트
export function NotionSettingsSection() {
  const queryClient = useQueryClient()
  const [databaseName, setDatabaseName] = useState<string | undefined>()
  const [lastSyncAt, setLastSyncAt] = useState<Date | null>(null)

  // 설정 조회
  const { data: settings, isLoading, error } = useQuery({
    queryKey: ["notionSettings"],
    queryFn: fetchSettings,
    retry: false,
    staleTime: 1000 * 60 * 5, // 5분
  })

  // 연동 상태 결정
  const getConnectionStatus = (): ConnectionStatusType => {
    if (isLoading) return "loading"
    if (error) return "error"
    if (!settings) return "disconnected"
    if (settings.isConnected) return "connected"
    return "disconnected"
  }

  const connectionStatus = getConnectionStatus()

  // 연동 상태 새로고침
  async function handleRefresh() {
    // 설정 캐시 무효화하여 다시 조회
    await queryClient.invalidateQueries({ queryKey: ["notionSettings"] })
  }

  // 설정 저장 성공 시
  function handleSettingsSaved(savedDatabaseName?: string) {
    if (savedDatabaseName) {
      setDatabaseName(savedDatabaseName)
    }
    setLastSyncAt(new Date())
    // 설정 다시 조회
    queryClient.invalidateQueries({ queryKey: ["notionSettings"] })
  }

  // 초기 데이터베이스 이름 설정 (연결된 경우)
  useEffect(() => {
    if (settings?.isConnected && !databaseName) {
      // 연결됨 상태이지만 데이터베이스 이름을 아직 모르는 경우
      // 연동 테스트를 통해 얻은 이름이 있으면 표시
    }
  }, [settings, databaseName])

  return (
    <Card>
      <CardHeader>
        <CardTitle>노션 연동 설정</CardTitle>
        <CardDescription>
          노션 데이터베이스와 연동하여 견적서를 동기화합니다.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* 연동 상태 표시 */}
        <ConnectionStatus
          status={connectionStatus}
          databaseName={connectionStatus === "connected" ? databaseName : undefined}
          lastSyncAt={connectionStatus === "connected" ? lastSyncAt : null}
          onRefresh={handleRefresh}
          isRefreshing={isLoading}
        />

        {/* 설정 폼 */}
        <NotionSettingsForm
          initialData={
            settings
              ? {
                  notionApiKey: "", // 마스킹된 값은 표시하지 않음
                  notionDatabaseId: settings.notionDatabaseId,
                }
              : undefined
          }
          onSuccess={handleSettingsSaved}
        />

        {/* 인증 필요 안내 */}
        {!isLoading && !settings && (
          <p className="text-sm text-muted-foreground">
            노션 연동 설정을 저장하려면 로그인이 필요합니다.
          </p>
        )}
      </CardContent>
    </Card>
  )
}
