// 이메일 발송 유틸리티
// Resend API를 사용한 이메일 발송 기능

import { Resend } from "resend"

// Resend 클라이언트 초기화 (lazy initialization)
let resendClient: Resend | null = null

function getResendClient(): Resend {
  if (!resendClient) {
    const apiKey = process.env.RESEND_API_KEY
    if (!apiKey) {
      throw new Error("RESEND_API_KEY 환경 변수가 설정되지 않았습니다.")
    }
    resendClient = new Resend(apiKey)
  }
  return resendClient
}

/**
 * 이메일 첨부 파일 타입
 */
export interface EmailAttachment {
  filename: string
  content: Buffer | string // Buffer 또는 base64 문자열
  contentType?: string
}

/**
 * 이메일 발송 파라미터
 */
export interface SendEmailParams {
  to: string | string[] // 수신자 이메일 (단일 또는 복수)
  subject: string // 이메일 제목
  html: string // HTML 본문
  text?: string // 텍스트 본문 (선택, 폴백용)
  attachments?: EmailAttachment[] // 첨부 파일 (선택)
  replyTo?: string // 답장 받을 이메일 (선택)
}

/**
 * 이메일 발송 결과 타입
 */
export interface SendEmailResult {
  success: boolean
  id?: string // Resend 이메일 ID
  error?: string // 에러 메시지
}

/**
 * 이메일 발송 함수
 *
 * @param params - 이메일 발송 파라미터
 * @returns 발송 결과
 *
 * @example
 * ```ts
 * const result = await sendEmail({
 *   to: "client@example.com",
 *   subject: "견적서 발송",
 *   html: "<h1>견적서</h1>...",
 *   attachments: [{ filename: "견적서.pdf", content: pdfBuffer }]
 * })
 * ```
 */
export async function sendEmail(params: SendEmailParams): Promise<SendEmailResult> {
  try {
    const resend = getResendClient()

    // 발신자 이메일 (환경 변수에서 가져옴)
    const fromEmail = process.env.EMAIL_FROM || "onboarding@resend.dev"

    // Resend 첨부 파일 형식으로 변환
    const attachments = params.attachments?.map((attachment) => {
      const rawContent = attachment.content
      const content: Buffer = typeof rawContent === "string"
        ? Buffer.from(rawContent, "base64")
        : rawContent
      return {
        filename: attachment.filename,
        content,
        contentType: attachment.contentType,
      }
    })

    // 이메일 발송
    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: params.to,
      subject: params.subject,
      html: params.html,
      text: params.text,
      attachments,
      replyTo: params.replyTo,
    })

    if (error) {
      // Rate Limit 에러 처리
      if (error.message?.includes("rate limit")) {
        return {
          success: false,
          error: "이메일 발송 한도를 초과했습니다. 잠시 후 다시 시도해주세요.",
        }
      }

      // 기타 에러
      return {
        success: false,
        error: error.message || "이메일 발송에 실패했습니다.",
      }
    }

    return {
      success: true,
      id: data?.id,
    }
  } catch (error) {
    console.error("이메일 발송 오류:", error)

    // 환경 변수 미설정 에러
    if (error instanceof Error && error.message.includes("RESEND_API_KEY")) {
      return {
        success: false,
        error: "이메일 서비스가 설정되지 않았습니다. 관리자에게 문의하세요.",
      }
    }

    return {
      success: false,
      error: error instanceof Error ? error.message : "이메일 발송 중 오류가 발생했습니다.",
    }
  }
}

/**
 * 이메일 서비스 설정 여부 확인
 */
export function isEmailServiceConfigured(): boolean {
  return !!process.env.RESEND_API_KEY
}
