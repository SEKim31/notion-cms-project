// 노션 페이지 업데이트 함수
// 상태값 등 노션 페이지 속성 업데이트

import { Client } from "@notionhq/client"
import { QuoteStatus } from "@/types/database"
import { DEFAULT_NOTION_MAPPING } from "@/types/notion"
import { withRateLimitRetry } from "./rate-limit"

/**
 * QuoteStatus → 노션 상태값 역변환 매핑 테이블
 * 노션에 업데이트할 때 사용할 한글 상태값
 */
export const QUOTE_STATUS_TO_NOTION: Record<QuoteStatus, string> = {
  [QuoteStatus.DRAFT]: "작성중",
  [QuoteStatus.COMPLETED]: "작성완료",
  [QuoteStatus.SENT]: "발송완료",
  [QuoteStatus.VIEWED]: "조회됨",
  [QuoteStatus.APPROVED]: "승인",
  [QuoteStatus.REJECTED]: "거절",
  [QuoteStatus.EXPIRED]: "만료됨",
}

/**
 * QuoteStatus를 노션 상태값으로 변환
 * @param status - QuoteStatus enum 값
 * @returns 노션 Select 속성에 사용할 상태값 문자열
 */
export function mapQuoteStatusToNotionStatus(status: QuoteStatus): string {
  return QUOTE_STATUS_TO_NOTION[status] || "작성중"
}

/**
 * 노션 페이지 상태 업데이트 결과
 */
export interface UpdateNotionStatusResult {
  success: boolean
  error?: string
  pageId?: string
}

/**
 * 노션 페이지의 상태 속성 업데이트
 * @param client - 노션 클라이언트
 * @param pageId - 업데이트할 노션 페이지 ID
 * @param status - 새 상태값 (QuoteStatus)
 * @param statusPropertyName - 상태 속성명 (기본값: "상태")
 * @returns 업데이트 결과
 */
export async function updateNotionPageStatus(
  client: Client,
  pageId: string,
  status: QuoteStatus,
  statusPropertyName: string = DEFAULT_NOTION_MAPPING.status || "상태"
): Promise<UpdateNotionStatusResult> {
  try {
    const notionStatus = mapQuoteStatusToNotionStatus(status)

    // Rate Limit 처리와 함께 페이지 업데이트
    await withRateLimitRetry(async () => {
      await client.pages.update({
        page_id: pageId,
        properties: {
          [statusPropertyName]: {
            select: {
              name: notionStatus,
            },
          },
        },
      })
    })

    console.log(`[노션 상태 업데이트] 페이지: ${pageId}, 상태: ${notionStatus}`)

    return {
      success: true,
      pageId,
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "알 수 없는 오류"
    console.error(`[노션 상태 업데이트 실패] 페이지: ${pageId}, 오류: ${errorMessage}`)

    // 노션 API 오류 상세 로깅
    if (error && typeof error === "object" && "code" in error) {
      const notionError = error as { code: string; message?: string }
      console.error(`  - 노션 오류 코드: ${notionError.code}`)

      // 권한 오류인 경우 명확한 메시지
      if (notionError.code === "unauthorized" || notionError.code === "restricted_resource") {
        return {
          success: false,
          error: "노션 Integration에 페이지 수정 권한이 없습니다. 노션 설정에서 'Update content' 권한을 확인해주세요.",
          pageId,
        }
      }

      // 속성 오류인 경우
      if (notionError.code === "validation_error") {
        return {
          success: false,
          error: `노션 데이터베이스에 '${statusPropertyName}' 속성이 없거나, 해당 상태값이 Select 옵션에 없습니다.`,
          pageId,
        }
      }
    }

    return {
      success: false,
      error: errorMessage,
      pageId,
    }
  }
}

/**
 * 여러 노션 페이지의 상태를 일괄 업데이트
 * @param client - 노션 클라이언트
 * @param updates - 업데이트할 페이지 목록 [{pageId, status}]
 * @param statusPropertyName - 상태 속성명
 * @returns 각 페이지별 업데이트 결과
 */
export async function updateNotionPagesStatus(
  client: Client,
  updates: Array<{ pageId: string; status: QuoteStatus }>,
  statusPropertyName: string = DEFAULT_NOTION_MAPPING.status || "상태"
): Promise<UpdateNotionStatusResult[]> {
  const results: UpdateNotionStatusResult[] = []

  for (const update of updates) {
    const result = await updateNotionPageStatus(
      client,
      update.pageId,
      update.status,
      statusPropertyName
    )
    results.push(result)

    // Rate Limit 방지를 위한 약간의 딜레이
    await new Promise((resolve) => setTimeout(resolve, 100))
  }

  return results
}
