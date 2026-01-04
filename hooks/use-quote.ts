"use client"

// 견적서 상세 조회 React Query 훅

import { useQuery, useQueryClient } from "@tanstack/react-query"
import type { QuoteDetailResponse, ApiResponse } from "@/types/api"

/**
 * 견적서 상세 조회 에러 타입
 */
export class QuoteError extends Error {
  constructor(
    message: string,
    public statusCode: number
  ) {
    super(message)
    this.name = "QuoteError"
  }
}

/**
 * 견적서 상세 조회 함수
 */
async function fetchQuote(id: string): Promise<QuoteDetailResponse> {
  const response = await fetch(`/api/quotes/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })

  if (!response.ok) {
    const result: ApiResponse<null> = await response.json()

    if (response.status === 401) {
      throw new QuoteError(result.error || "로그인이 필요합니다.", 401)
    }
    if (response.status === 403) {
      throw new QuoteError(result.error || "접근 권한이 없습니다.", 403)
    }
    if (response.status === 404) {
      throw new QuoteError(result.error || "견적서를 찾을 수 없습니다.", 404)
    }
    throw new QuoteError(result.error || "견적서를 불러오는데 실패했습니다.", response.status)
  }

  const result: ApiResponse<QuoteDetailResponse> = await response.json()

  if (!result.success || !result.data) {
    throw new QuoteError(result.error || "견적서를 불러오는데 실패했습니다.", 500)
  }

  return result.data
}

/**
 * 견적서 상세 조회 훅
 */
export function useQuote(id: string) {
  return useQuery({
    queryKey: ["quote", id],
    queryFn: () => fetchQuote(id),
    staleTime: 1000 * 60 * 5, // 5분간 캐시
    refetchOnWindowFocus: false,
    enabled: !!id, // id가 있을 때만 쿼리 실행
    retry: (failureCount, error) => {
      // 인증, 권한, 404 에러는 재시도하지 않음
      if (error instanceof QuoteError) {
        if ([401, 403, 404].includes(error.statusCode)) {
          return false
        }
      }
      return failureCount < 2
    },
  })
}

/**
 * 견적서 프리페치 (SSR 또는 미리 로딩)
 */
export function usePrefetchQuote() {
  const queryClient = useQueryClient()

  return (id: string) => {
    return queryClient.prefetchQuery({
      queryKey: ["quote", id],
      queryFn: () => fetchQuote(id),
    })
  }
}

/**
 * 견적서 상세 무효화 (수정 후 새로고침용)
 */
export function useInvalidateQuote() {
  const queryClient = useQueryClient()

  return (id?: string) => {
    if (id) {
      queryClient.invalidateQueries({ queryKey: ["quote", id] })
    } else {
      queryClient.invalidateQueries({ queryKey: ["quote"] })
    }
  }
}
