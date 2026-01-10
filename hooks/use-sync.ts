"use client"

// 동기화 관련 React Query 훅

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import { CACHE_CONFIG, queryKeys } from "@/lib/query"
import type { SyncResponse, SyncStatusResponse, ApiResponse } from "@/types/api"

/**
 * 동기화 상태 조회 함수
 */
async function fetchSyncStatus(): Promise<SyncStatusResponse> {
  const response = await fetch("/api/sync", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })

  if (!response.ok) {
    throw new Error("동기화 상태 조회 실패")
  }

  const result: ApiResponse<SyncStatusResponse> = await response.json()

  if (!result.success || !result.data) {
    throw new Error(result.error || "동기화 상태 조회 실패")
  }

  return result.data
}

/**
 * 동기화 실행 함수
 */
async function executeSync(force: boolean = false): Promise<SyncResponse> {
  const response = await fetch("/api/sync", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ force }),
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.error || "동기화 실패")
  }

  const result: ApiResponse<SyncResponse> = await response.json()

  if (!result.success || !result.data) {
    throw new Error(result.error || "동기화 실패")
  }

  return result.data
}

/**
 * 동기화 상태 조회 훅
 */
export function useSyncStatus() {
  return useQuery({
    queryKey: queryKeys.sync.status(),
    queryFn: fetchSyncStatus,
    staleTime: CACHE_CONFIG.sync.staleTime,
    gcTime: CACHE_CONFIG.sync.gcTime,
    refetchOnWindowFocus: false,
  })
}

/**
 * 동기화 실행 훅
 */
export function useSync() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (force: boolean = false) => executeSync(force),
    onSuccess: () => {
      // 동기화 성공 시 관련 쿼리 무효화
      queryClient.invalidateQueries({ queryKey: queryKeys.sync.all })
      queryClient.invalidateQueries({ queryKey: queryKeys.quotes.all })
    },
  })
}

/**
 * 동기화 관련 데이터를 한번에 사용하는 훅
 */
export function useSyncData() {
  const statusQuery = useSyncStatus()
  const syncMutation = useSync()

  return {
    // 상태 데이터
    status: statusQuery.data,
    isLoading: statusQuery.isLoading,
    isConnected: statusQuery.data?.isConnected ?? false,
    lastSyncAt: statusQuery.data?.lastSyncAt
      ? new Date(statusQuery.data.lastSyncAt)
      : undefined,
    totalQuotes: statusQuery.data?.totalQuotes ?? 0,

    // 동기화 실행
    sync: syncMutation.mutate,
    syncAsync: syncMutation.mutateAsync,
    isSyncing: syncMutation.isPending,
    syncError: syncMutation.error,
    syncResult: syncMutation.data,

    // 상태 새로고침
    refetch: statusQuery.refetch,
  }
}
