"use client"

// 공유 링크 관리 React Query 훅

import { useMutation, useQueryClient } from "@tanstack/react-query"
import type { ShareLinkResponse, ApiResponse } from "@/types/api"

/**
 * 공유 링크 에러 타입
 */
export class ShareError extends Error {
  constructor(
    message: string,
    public statusCode: number
  ) {
    super(message)
    this.name = "ShareError"
  }
}

/**
 * 공유 링크 재생성 함수
 */
async function regenerateShareLink(quoteId: string): Promise<ShareLinkResponse> {
  const response = await fetch(`/api/quotes/${quoteId}/share`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  })

  const result: ApiResponse<ShareLinkResponse | null> = await response.json()

  if (!response.ok || !result.success || !result.data) {
    throw new ShareError(
      result.error || "공유 링크 재생성에 실패했습니다.",
      response.status
    )
  }

  return result.data
}

/**
 * 공유 링크 조회 함수
 */
async function getShareLink(quoteId: string): Promise<ShareLinkResponse> {
  const response = await fetch(`/api/quotes/${quoteId}/share`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })

  const result: ApiResponse<ShareLinkResponse | null> = await response.json()

  if (!response.ok || !result.success || !result.data) {
    throw new ShareError(
      result.error || "공유 링크 조회에 실패했습니다.",
      response.status
    )
  }

  return result.data
}

/**
 * 공유 링크 재생성 훅
 */
export function useRegenerateShareLink() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: regenerateShareLink,
    onSuccess: (data, quoteId) => {
      // 견적서 상세 쿼리 무효화
      queryClient.invalidateQueries({ queryKey: ["quote", quoteId] })
      // 견적서 목록 쿼리 무효화
      queryClient.invalidateQueries({ queryKey: ["quotes"] })
    },
  })
}

/**
 * 클립보드에 공유 링크 복사
 */
export async function copyShareLinkToClipboard(shareId: string): Promise<boolean> {
  const shareUrl = `${window.location.origin}/quote/share/${shareId}`

  try {
    await navigator.clipboard.writeText(shareUrl)
    return true
  } catch (error) {
    console.error("클립보드 복사 실패:", error)
    return false
  }
}

/**
 * 공유 URL 생성 유틸리티
 */
export function getShareUrl(shareId: string): string {
  if (typeof window === "undefined") {
    return `/quote/share/${shareId}`
  }
  return `${window.location.origin}/quote/share/${shareId}`
}
