// 동기화 상태 관리 모듈
// 마지막 동기화 시간, 동기화 결과 등 관리

import { createClient } from "@/lib/supabase/server"
import type { SyncStatusResponse } from "@/types/api"

/**
 * 동기화 상태 정보 타입
 */
export interface SyncState {
  userId: string
  lastSyncAt: Date | null
  isConnected: boolean
  totalQuotes: number
  lastSyncResult?: {
    success: boolean
    syncedCount: number
    newCount: number
    updatedCount: number
    deletedCount: number
    errors: string[]
  }
}

/**
 * 사용자의 동기화 상태 조회
 * @param userId - 사용자 ID
 * @returns 동기화 상태 정보
 */
export async function getSyncStatus(userId: string): Promise<SyncStatusResponse> {
  const supabase = await createClient()

  // 사용자 노션 설정 확인
  const { data: user, error: userError } = await supabase
    .from("users")
    .select("notion_api_key, notion_database_id, last_sync_at")
    .eq("id", userId)
    .single()

  if (userError || !user) {
    return {
      lastSyncAt: null,
      isConnected: false,
      totalQuotes: 0,
    }
  }

  const isConnected = !!user.notion_api_key && !!user.notion_database_id

  // 견적서 개수 조회
  const { count, error: countError } = await supabase
    .from("quotes")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId)

  if (countError) {
    console.error("견적서 개수 조회 오류:", countError)
  }

  return {
    lastSyncAt: user.last_sync_at ? new Date(user.last_sync_at) : null,
    isConnected,
    totalQuotes: count ?? 0,
  }
}

/**
 * 마지막 동기화 시간 업데이트
 * @param userId - 사용자 ID
 */
export async function updateLastSyncTime(userId: string): Promise<void> {
  const supabase = await createClient()

  const { error } = await supabase
    .from("users")
    .update({
      last_sync_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq("id", userId)

  if (error) {
    console.error("마지막 동기화 시간 업데이트 오류:", error)
    throw new Error("동기화 시간 업데이트 실패")
  }
}

/**
 * 동기화 결과 타입
 */
export interface SyncResult {
  success: boolean
  message: string
  syncedCount: number
  newCount: number
  updatedCount: number
  deletedCount: number
  errors: string[]
}

/**
 * 빈 동기화 결과 생성
 */
export function createEmptySyncResult(): SyncResult {
  return {
    success: true,
    message: "",
    syncedCount: 0,
    newCount: 0,
    updatedCount: 0,
    deletedCount: 0,
    errors: [],
  }
}

/**
 * 동기화 결과 병합
 * @param results - 개별 동기화 결과 배열
 * @returns 병합된 동기화 결과
 */
export function mergeSyncResults(results: SyncResult[]): SyncResult {
  const merged = createEmptySyncResult()

  for (const result of results) {
    merged.syncedCount += result.syncedCount
    merged.newCount += result.newCount
    merged.updatedCount += result.updatedCount
    merged.deletedCount += result.deletedCount
    merged.errors.push(...result.errors)

    if (!result.success) {
      merged.success = false
    }
  }

  // 최종 메시지 생성
  if (merged.success) {
    const parts: string[] = []
    if (merged.newCount > 0) parts.push(`${merged.newCount}개 추가`)
    if (merged.updatedCount > 0) parts.push(`${merged.updatedCount}개 업데이트`)
    if (merged.deletedCount > 0) parts.push(`${merged.deletedCount}개 삭제`)

    merged.message =
      parts.length > 0
        ? `동기화 완료: ${parts.join(", ")}`
        : "동기화 완료: 변경 사항 없음"
  } else {
    merged.message = `동기화 중 ${merged.errors.length}개의 오류 발생`
  }

  return merged
}

/**
 * 동기화 진행 상태 타입
 */
export interface SyncProgress {
  phase: "fetching" | "processing" | "saving" | "complete" | "error"
  current: number
  total: number
  message: string
}

/**
 * 동기화 진행 상태 생성 헬퍼
 */
export const SyncProgressHelper = {
  fetching(message: string = "노션에서 데이터 가져오는 중..."): SyncProgress {
    return { phase: "fetching", current: 0, total: 0, message }
  },

  processing(current: number, total: number): SyncProgress {
    return {
      phase: "processing",
      current,
      total,
      message: `견적서 처리 중... (${current}/${total})`,
    }
  },

  saving(current: number, total: number): SyncProgress {
    return {
      phase: "saving",
      current,
      total,
      message: `데이터 저장 중... (${current}/${total})`,
    }
  },

  complete(syncedCount: number): SyncProgress {
    return {
      phase: "complete",
      current: syncedCount,
      total: syncedCount,
      message: `동기화 완료: ${syncedCount}개 견적서`,
    }
  },

  error(message: string): SyncProgress {
    return { phase: "error", current: 0, total: 0, message }
  },
}
