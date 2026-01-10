// 노션 페이지 → Quote 변환 매퍼
// 노션 속성 값 추출 유틸리티

import type {
  QueryDatabaseResponse,
  PageObjectResponse,
} from "@notionhq/client/build/src/api-endpoints"
import type {
  NotionQuoteMapping,
  CreateQuoteInput,
  QuoteItem,
} from "@/types"
import { QuoteStatus, DEFAULT_NOTION_MAPPING } from "@/types"

// 노션 페이지 타입
type NotionPage = PageObjectResponse

// 노션 속성 타입
type NotionProperties = NotionPage["properties"]
type NotionProperty = NotionProperties[string]

/**
 * 노션 속성에서 Title 값 추출
 */
export function getTitle(property: NotionProperty | undefined): string {
  if (!property || property.type !== "title") return ""
  return property.title.map((t) => t.plain_text).join("")
}

/**
 * 노션 속성에서 Rich Text 값 추출
 */
export function getRichText(property: NotionProperty | undefined): string {
  if (!property || property.type !== "rich_text") return ""
  return property.rich_text.map((t) => t.plain_text).join("")
}

/**
 * 노션 속성에서 Number 값 추출
 */
export function getNumber(property: NotionProperty | undefined): number | null {
  if (!property || property.type !== "number") return null
  return property.number
}

/**
 * 노션 속성에서 Select 값 추출
 */
export function getSelect(property: NotionProperty | undefined): string | null {
  if (!property || property.type !== "select") return null
  return property.select?.name ?? null
}

/**
 * 노션 속성에서 Date 값 추출
 */
export function getDate(property: NotionProperty | undefined): Date | null {
  if (!property || property.type !== "date") return null
  const dateStr = property.date?.start
  if (!dateStr) return null
  return new Date(dateStr)
}

/**
 * 노션 속성에서 Checkbox 값 추출
 */
export function getCheckbox(property: NotionProperty | undefined): boolean {
  if (!property || property.type !== "checkbox") return false
  return property.checkbox
}

/**
 * 노션 속성에서 URL 값 추출
 */
export function getUrl(property: NotionProperty | undefined): string | null {
  if (!property || property.type !== "url") return null
  return property.url
}

/**
 * 노션 속성에서 Email 값 추출
 */
export function getEmail(property: NotionProperty | undefined): string | null {
  if (!property || property.type !== "email") return null
  return property.email
}

/**
 * 노션 속성에서 Phone 값 추출
 */
export function getPhone(property: NotionProperty | undefined): string | null {
  if (!property || property.type !== "phone_number") return null
  return property.phone_number
}

/**
 * 속성명으로 속성 조회 (대소문자 무시)
 */
function getPropertyByName(
  properties: NotionProperties,
  name: string
): NotionProperty | undefined {
  // 정확히 일치하는 속성 먼저 찾기
  if (properties[name]) {
    return properties[name]
  }

  // 대소문자 무시하고 찾기
  const lowerName = name.toLowerCase()
  for (const [key, value] of Object.entries(properties)) {
    if (key.toLowerCase() === lowerName) {
      return value
    }
  }

  return undefined
}

/**
 * 노션 페이지를 Quote 생성 입력으로 변환
 * @param page - 노션 페이지 객체
 * @param userId - 사용자 ID
 * @param mapping - 속성 매핑 설정 (선택)
 * @returns Quote 생성 입력 데이터
 */
export function mapNotionPageToQuote(
  page: NotionPage,
  userId: string,
  mapping: NotionQuoteMapping = DEFAULT_NOTION_MAPPING
): CreateQuoteInput {
  const properties = page.properties

  // 속성 값 추출
  const quoteNumber =
    getTitle(getPropertyByName(properties, mapping.quoteNumber)) ||
    getRichText(getPropertyByName(properties, mapping.quoteNumber)) ||
    `Q-${Date.now()}`

  const clientName =
    getTitle(getPropertyByName(properties, mapping.clientName)) ||
    getRichText(getPropertyByName(properties, mapping.clientName)) ||
    "미지정"

  const clientContact = mapping.clientContact
    ? getRichText(getPropertyByName(properties, mapping.clientContact)) ||
      getTitle(getPropertyByName(properties, mapping.clientContact))
    : null

  const clientPhone = mapping.clientPhone
    ? getPhone(getPropertyByName(properties, mapping.clientPhone)) ||
      getRichText(getPropertyByName(properties, mapping.clientPhone))
    : null

  const clientEmail = mapping.clientEmail
    ? getEmail(getPropertyByName(properties, mapping.clientEmail)) ||
      getRichText(getPropertyByName(properties, mapping.clientEmail))
    : null

  const totalAmount =
    getNumber(getPropertyByName(properties, mapping.totalAmount)) ?? 0

  const issueDate =
    getDate(getPropertyByName(properties, mapping.issueDate)) ?? new Date()

  const validUntil = mapping.validUntil
    ? getDate(getPropertyByName(properties, mapping.validUntil))
    : null

  const notes = mapping.notes
    ? getRichText(getPropertyByName(properties, mapping.notes))
    : null

  // 상태값 추출 및 변환
  const notionStatus = mapping.status
    ? getSelect(getPropertyByName(properties, mapping.status))
    : null
  const status = mapNotionStatusToQuoteStatus(notionStatus)

  // 품목은 별도 처리 필요 (관계형 속성 또는 JSON 파싱)
  // 현재는 빈 배열로 처리
  const items: QuoteItem[] = []

  return {
    userId,
    notionPageId: page.id,
    quoteNumber,
    clientName,
    clientContact: clientContact || null,
    clientPhone: clientPhone || null,
    clientEmail: clientEmail || null,
    items,
    totalAmount,
    issueDate,
    validUntil,
    notes: notes || null,
    status,
  }
}

/**
 * 여러 노션 페이지를 Quote 목록으로 변환
 * @param pages - 노션 페이지 목록
 * @param userId - 사용자 ID
 * @param mapping - 속성 매핑 설정 (선택)
 * @returns Quote 생성 입력 데이터 목록
 */
export function mapNotionPagesToQuotes(
  pages: QueryDatabaseResponse["results"],
  userId: string,
  mapping?: NotionQuoteMapping
): CreateQuoteInput[] {
  return pages
    .filter((page): page is NotionPage => page.object === "page")
    .map((page) => mapNotionPageToQuote(page, userId, mapping))
}

/**
 * 노션 품목 테이블을 QuoteItem 배열로 파싱
 * (노션에서 품목을 테이블 또는 리스트로 관리하는 경우)
 * @param itemsText - 품목 텍스트 (줄바꿈으로 구분)
 * @returns QuoteItem 배열
 */
export function parseItemsFromText(itemsText: string): QuoteItem[] {
  if (!itemsText.trim()) {
    return []
  }

  const lines = itemsText.split("\n").filter((line) => line.trim())
  const items: QuoteItem[] = []

  for (const line of lines) {
    // 간단한 파싱: "품목명 | 수량 | 단가" 형식 가정
    const parts = line.split("|").map((p) => p.trim())

    if (parts.length >= 3) {
      const name = parts[0]
      const quantity = parseInt(parts[1], 10) || 1
      const unitPrice = parseInt(parts[2].replace(/[^0-9]/g, ""), 10) || 0
      const amount = quantity * unitPrice
      const description = parts[3] || undefined

      items.push({
        name,
        quantity,
        unitPrice,
        amount,
        description,
      })
    } else if (parts.length === 1 && parts[0]) {
      // 품목명만 있는 경우
      items.push({
        name: parts[0],
        quantity: 1,
        unitPrice: 0,
        amount: 0,
      })
    }
  }

  return items
}

/**
 * JSON 문자열에서 QuoteItem 배열 파싱
 * @param jsonStr - JSON 문자열
 * @returns QuoteItem 배열
 */
export function parseItemsFromJson(jsonStr: string): QuoteItem[] {
  try {
    const parsed = JSON.parse(jsonStr)

    if (!Array.isArray(parsed)) {
      return []
    }

    return parsed
      .filter(
        (item) =>
          item &&
          typeof item === "object" &&
          typeof item.name === "string"
      )
      .map((item) => ({
        name: String(item.name),
        quantity: Number(item.quantity) || 1,
        unitPrice: Number(item.unitPrice) || 0,
        amount: Number(item.amount) || 0,
        description: item.description ? String(item.description) : undefined,
      }))
  } catch {
    return []
  }
}

/**
 * 속성 추출기 객체
 * NotionPropertyExtractor 인터페이스 구현
 */
export const propertyExtractor = {
  getTitle,
  getRichText,
  getNumber,
  getSelect,
  getDate,
  getCheckbox,
  getUrl,
  getEmail,
  getPhone,
}

/**
 * 노션 상태값 → QuoteStatus 매핑 테이블
 * 한글/영문 상태값을 모두 지원
 */
export const NOTION_STATUS_MAPPING: Record<string, QuoteStatus> = {
  // 한글 매핑 - DRAFT (작성 중)
  "작성중": QuoteStatus.DRAFT,
  "작성 중": QuoteStatus.DRAFT,
  "초안": QuoteStatus.DRAFT,

  // 한글 매핑 - COMPLETED (작성완료)
  "작성완료": QuoteStatus.COMPLETED,
  "작성 완료": QuoteStatus.COMPLETED,
  "완료": QuoteStatus.COMPLETED,

  // 한글 매핑 - SENT (발송됨)
  "발송완료": QuoteStatus.SENT,
  "발송 완료": QuoteStatus.SENT,
  "발송됨": QuoteStatus.SENT,
  "발송": QuoteStatus.SENT,

  // 한글 매핑 - VIEWED (조회됨)
  "조회됨": QuoteStatus.VIEWED,
  "조회": QuoteStatus.VIEWED,
  "확인됨": QuoteStatus.VIEWED,
  "확인": QuoteStatus.VIEWED,

  // 한글 매핑 - APPROVED (승인)
  "승인": QuoteStatus.APPROVED,
  "승인됨": QuoteStatus.APPROVED,
  "수락": QuoteStatus.APPROVED,
  "수락됨": QuoteStatus.APPROVED,

  // 한글 매핑 - REJECTED (거절)
  "거절": QuoteStatus.REJECTED,
  "거절됨": QuoteStatus.REJECTED,
  "반려": QuoteStatus.REJECTED,
  "반려됨": QuoteStatus.REJECTED,

  // 한글 매핑 - EXPIRED (만료됨)
  "만료": QuoteStatus.EXPIRED,
  "만료됨": QuoteStatus.EXPIRED,

  // 영문 매핑 (소문자)
  "draft": QuoteStatus.DRAFT,
  "completed": QuoteStatus.COMPLETED,
  "sent": QuoteStatus.SENT,
  "viewed": QuoteStatus.VIEWED,
  "approved": QuoteStatus.APPROVED,
  "rejected": QuoteStatus.REJECTED,
  "expired": QuoteStatus.EXPIRED,

  // 영문 매핑 (대문자)
  "DRAFT": QuoteStatus.DRAFT,
  "COMPLETED": QuoteStatus.COMPLETED,
  "SENT": QuoteStatus.SENT,
  "VIEWED": QuoteStatus.VIEWED,
  "APPROVED": QuoteStatus.APPROVED,
  "REJECTED": QuoteStatus.REJECTED,
  "EXPIRED": QuoteStatus.EXPIRED,
}

/**
 * 노션 상태값을 QuoteStatus enum으로 변환
 * @param notionStatus - 노션 Select 속성에서 추출한 상태값
 * @returns QuoteStatus enum 값 (인식 불가 시 DRAFT 반환)
 */
export function mapNotionStatusToQuoteStatus(
  notionStatus: string | null | undefined
): QuoteStatus {
  // null, undefined, 빈 문자열 처리
  if (!notionStatus || notionStatus.trim() === "") {
    return QuoteStatus.DRAFT
  }

  // 공백 제거 후 매핑 테이블 조회
  const normalized = notionStatus.trim()

  // 정확히 일치하는 값 찾기
  if (NOTION_STATUS_MAPPING[normalized]) {
    return NOTION_STATUS_MAPPING[normalized]
  }

  // 소문자로 변환 후 찾기
  const lowerCase = normalized.toLowerCase()
  if (NOTION_STATUS_MAPPING[lowerCase]) {
    return NOTION_STATUS_MAPPING[lowerCase]
  }

  // 매칭 실패 시 기본값 반환
  return QuoteStatus.DRAFT
}
