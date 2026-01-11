"use client"

// 이메일 발송 React Query 훅

import { useMutation, useQueryClient } from "@tanstack/react-query"
import type { SendEmailRequest, SendEmailResponse, ApiResponse } from "@/types/api"

/**
 * 이메일 발송 에러 타입
 */
export class SendEmailError extends Error {
  constructor(
    message: string,
    public statusCode: number
  ) {
    super(message)
    this.name = "SendEmailError"
  }
}

/**
 * 이메일 발송 파라미터
 */
interface SendEmailParams {
  quoteId: string
  data: SendEmailRequest
}

/**
 * 이메일 발송 API 호출 함수
 */
async function sendEmailApi({ quoteId, data }: SendEmailParams): Promise<SendEmailResponse> {
  const response = await fetch(`/api/quotes/${quoteId}/send-email`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })

  const result: ApiResponse<SendEmailResponse | null> = await response.json()

  if (!response.ok || !result.success) {
    throw new SendEmailError(
      result.error || "이메일 발송에 실패했습니다.",
      response.status
    )
  }

  // result.data가 있으면 사용, 없으면 result에서 필요한 필드 추출
  if (result.data) {
    return result.data
  }

  // API가 data 없이 직접 필드를 반환하는 경우 처리
  return {
    success: result.success,
    message: result.message || "이메일이 발송되었습니다.",
    emailId: (result as unknown as SendEmailResponse).emailId,
    sentAt: (result as unknown as SendEmailResponse).sentAt,
  }
}

/**
 * 이메일 발송 훅
 *
 * @example
 * ```tsx
 * const { mutateAsync: sendEmail, isPending, error } = useSendEmail()
 *
 * const handleSend = async () => {
 *   try {
 *     await sendEmail({
 *       quoteId: "quote-123",
 *       data: {
 *         to: "client@example.com",
 *         subject: "견적서 안내",
 *         message: "첨부된 견적서를 확인해주세요."
 *       }
 *     })
 *   } catch (err) {
 *     // 에러 처리
 *   }
 * }
 * ```
 */
export function useSendEmail() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: sendEmailApi,
    onSuccess: (_data, variables) => {
      // 견적서 상세 쿼리 무효화 (상태가 SENT로 변경되었을 수 있음)
      queryClient.invalidateQueries({ queryKey: ["quote", variables.quoteId] })
      // 견적서 목록 쿼리 무효화
      queryClient.invalidateQueries({ queryKey: ["quotes"] })
    },
  })
}
