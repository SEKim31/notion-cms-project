"use client"

// 견적서 목록 조회 React Query 훅

import { useQuery, useQueryClient } from "@tanstack/react-query"

import { CACHE_CONFIG, queryKeys } from "@/lib/query"
import type { QuoteListResponse, QuoteListParams, ApiResponse } from "@/types/api"

/**
 * 견적서 목록 조회 함수
 */
async function fetchQuotes(params: QuoteListParams = {}): Promise<QuoteListResponse> {
  const searchParams = new URLSearchParams()

  if (params.page) searchParams.set("page", params.page.toString())
  if (params.limit) searchParams.set("limit", params.limit.toString())
  if (params.search) searchParams.set("search", params.search)
  if (params.status) searchParams.set("status", params.status)
  if (params.sortBy) searchParams.set("sortBy", params.sortBy)
  if (params.sortOrder) searchParams.set("sortOrder", params.sortOrder)

  const url = `/api/quotes${searchParams.toString() ? `?${searchParams.toString()}` : ""}`

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error("로그인이 필요합니다.")
    }
    throw new Error("견적서 목록을 불러오는데 실패했습니다.")
  }

  const result: ApiResponse<QuoteListResponse> = await response.json()

  if (!result.success || !result.data) {
    throw new Error(result.error || "견적서 목록을 불러오는데 실패했습니다.")
  }

  return result.data
}

/**
 * 견적서 목록 조회 훅
 */
export function useQuotes(params: QuoteListParams = {}) {
  return useQuery({
    queryKey: queryKeys.quotes.list(params),
    queryFn: () => fetchQuotes(params),
    staleTime: CACHE_CONFIG.quotes.list.staleTime,
    gcTime: CACHE_CONFIG.quotes.list.gcTime,
    refetchOnWindowFocus: false,
  })
}

/**
 * 견적서 목록 프리페치 (SSR 또는 미리 로딩)
 */
export function usePrefetchQuotes() {
  const queryClient = useQueryClient()

  return (params: QuoteListParams = {}) => {
    return queryClient.prefetchQuery({
      queryKey: queryKeys.quotes.list(params),
      queryFn: () => fetchQuotes(params),
      staleTime: CACHE_CONFIG.quotes.list.staleTime,
    })
  }
}

/**
 * 견적서 목록 무효화 (동기화 후 새로고침용)
 */
export function useInvalidateQuotes() {
  const queryClient = useQueryClient()

  return () => {
    queryClient.invalidateQueries({ queryKey: queryKeys.quotes.all })
  }
}
