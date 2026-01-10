// 노션 API 관련 타입 정의
// @notionhq/client 응답 타입 매핑

import type { CreateQuoteInput } from "./database"

/**
 * 노션 속성 타입 enum
 */
export type NotionPropertyType =
  | "title"
  | "rich_text"
  | "number"
  | "select"
  | "multi_select"
  | "date"
  | "people"
  | "files"
  | "checkbox"
  | "url"
  | "email"
  | "phone_number"
  | "formula"
  | "relation"
  | "rollup"
  | "created_time"
  | "created_by"
  | "last_edited_time"
  | "last_edited_by"

/**
 * 노션 리치 텍스트 타입
 */
export interface NotionRichText {
  type: "text" | "mention" | "equation"
  text?: {
    content: string
    link?: { url: string } | null
  }
  plain_text: string
  annotations?: {
    bold: boolean
    italic: boolean
    strikethrough: boolean
    underline: boolean
    code: boolean
    color: string
  }
}

/**
 * 노션 날짜 속성 타입
 */
export interface NotionDateProperty {
  start: string | null
  end?: string | null
  time_zone?: string | null
}

/**
 * 노션 셀렉트 옵션 타입
 */
export interface NotionSelectOption {
  id: string
  name: string
  color?: string
}

/**
 * 노션 데이터베이스 속성 타입
 */
export interface NotionDatabaseProperty {
  id: string
  type: NotionPropertyType
  name: string
  // 각 타입별 값
  title?: NotionRichText[]
  rich_text?: NotionRichText[]
  number?: number | null
  select?: NotionSelectOption | null
  multi_select?: NotionSelectOption[]
  date?: NotionDateProperty | null
  checkbox?: boolean
  url?: string | null
  email?: string | null
  phone_number?: string | null
  created_time?: string
  last_edited_time?: string
}

/**
 * 노션 페이지 속성 맵
 */
export type NotionPageProperties = Record<string, NotionDatabaseProperty>

/**
 * 노션 페이지 응답 타입
 */
export interface NotionPageResponse {
  id: string
  object: "page"
  created_time: string
  last_edited_time: string
  archived: boolean
  properties: NotionPageProperties
  url: string
  parent: {
    type: "database_id" | "page_id" | "workspace"
    database_id?: string
    page_id?: string
  }
}

/**
 * 노션 데이터베이스 쿼리 응답 타입
 */
export interface NotionDatabaseQueryResponse {
  object: "list"
  results: NotionPageResponse[]
  next_cursor: string | null
  has_more: boolean
  type: "page_or_database"
}

/**
 * 노션 데이터베이스 정보 응답 타입
 */
export interface NotionDatabaseInfoResponse {
  id: string
  object: "database"
  title: NotionRichText[]
  properties: Record<
    string,
    {
      id: string
      type: NotionPropertyType
      name: string
    }
  >
  created_time: string
  last_edited_time: string
  archived: boolean
  url: string
}

/**
 * 노션 → Quote 매핑 설정 타입
 * 노션 데이터베이스 속성명과 Quote 필드 매핑
 */
export interface NotionQuoteMapping {
  quoteNumber: string // 견적서 번호 속성명
  clientName: string // 클라이언트 회사명 속성명
  clientContact?: string // 클라이언트 담당자 속성명
  clientPhone?: string // 클라이언트 연락처 속성명
  clientEmail?: string // 클라이언트 이메일 속성명
  totalAmount: string // 총 금액 속성명
  issueDate: string // 발행일 속성명
  validUntil?: string // 유효기간 속성명
  notes?: string // 비고 속성명
  items?: string // 품목 관련 (relation 또는 별도 처리)
  status?: string // 노션 상태 속성명
}

/**
 * 기본 노션 매핑 설정
 * 노션 데이터베이스의 한글 속성명 기준
 */
export const DEFAULT_NOTION_MAPPING: NotionQuoteMapping = {
  quoteNumber: "견적서 번호",
  clientName: "클라이언트",
  clientContact: "담당자",
  clientPhone: "연락처",
  clientEmail: "이메일",
  totalAmount: "총 금액",
  issueDate: "발행일",
  validUntil: "유효기간",
  notes: "비고",
  status: "상태",
}

/**
 * 노션 페이지 → Quote 변환 함수 시그니처 타입
 */
export type NotionToQuoteMapper = (
  page: NotionPageResponse,
  userId: string,
  mapping?: NotionQuoteMapping
) => CreateQuoteInput

/**
 * 노션 API 클라이언트 설정 타입
 */
export interface NotionClientConfig {
  apiKey: string
  databaseId: string
}

/**
 * 노션 동기화 옵션 타입
 */
export interface NotionSyncOptions {
  force?: boolean // 강제 전체 동기화
  pageSize?: number // 한 번에 가져올 페이지 수 (기본: 100)
  startCursor?: string // 페이지네이션 커서
}

/**
 * 노션 속성 값 추출 유틸리티 타입
 */
export interface NotionPropertyExtractor {
  getTitle: (property: NotionDatabaseProperty) => string
  getRichText: (property: NotionDatabaseProperty) => string
  getNumber: (property: NotionDatabaseProperty) => number | null
  getSelect: (property: NotionDatabaseProperty) => string | null
  getDate: (property: NotionDatabaseProperty) => Date | null
  getCheckbox: (property: NotionDatabaseProperty) => boolean
  getUrl: (property: NotionDatabaseProperty) => string | null
  getEmail: (property: NotionDatabaseProperty) => string | null
  getPhone: (property: NotionDatabaseProperty) => string | null
}
