// React Query 캐싱 설정
// 각 쿼리 유형별 staleTime과 gcTime(구 cacheTime) 정의

// 시간 상수 (밀리초)
const MINUTE = 60 * 1000
const HOUR = 60 * MINUTE

/**
 * 쿼리별 캐싱 설정
 * - staleTime: 데이터가 "신선"하다고 간주되는 시간 (이 시간 동안 리페칭 안 함)
 * - gcTime: 캐시에서 데이터를 유지하는 시간 (구 cacheTime)
 */
export const CACHE_CONFIG = {
  // 견적서 목록: 자주 변경될 수 있으므로 짧은 staleTime
  quotes: {
    list: {
      staleTime: 2 * MINUTE,
      gcTime: 10 * MINUTE,
    },
    // 견적서 상세: 개별 데이터는 조금 더 오래 캐시
    detail: {
      staleTime: 5 * MINUTE,
      gcTime: 30 * MINUTE,
    },
  },

  // 설정 정보: 자주 변경되지 않으므로 긴 캐시 시간
  settings: {
    staleTime: 10 * MINUTE,
    gcTime: 1 * HOUR,
  },

  // 동기화 상태: 빠르게 갱신 필요
  sync: {
    staleTime: 1 * MINUTE,
    gcTime: 5 * MINUTE,
  },

  // 사용자 정보: 세션 동안 유지
  user: {
    staleTime: 5 * MINUTE,
    gcTime: 30 * MINUTE,
  },
} as const

/**
 * 쿼리 키 팩토리
 * 일관된 쿼리 키 생성을 위한 헬퍼
 */
export const queryKeys = {
  // 견적서 관련
  quotes: {
    all: ["quotes"] as const,
    lists: () => [...queryKeys.quotes.all, "list"] as const,
    list: <T extends object>(filters: T) =>
      [...queryKeys.quotes.lists(), filters] as const,
    details: () => [...queryKeys.quotes.all, "detail"] as const,
    detail: (id: string) => [...queryKeys.quotes.details(), id] as const,
  },

  // 설정 관련
  settings: {
    all: ["settings"] as const,
    notion: () => [...queryKeys.settings.all, "notion"] as const,
  },

  // 동기화 관련
  sync: {
    all: ["sync"] as const,
    status: () => [...queryKeys.sync.all, "status"] as const,
  },

  // 사용자 관련
  user: {
    all: ["user"] as const,
    current: () => [...queryKeys.user.all, "current"] as const,
  },
} as const
