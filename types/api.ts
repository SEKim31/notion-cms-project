// API 요청/응답 타입 정의

import type { Quote, QuoteSummary, User } from "./database"

/**
 * 기본 API 응답 타입
 */
export interface ApiResponse<T> {
  data: T
  success: boolean
  message?: string
  error?: string
}

/**
 * 에러 응답 타입
 */
export interface ApiErrorResponse {
  success: false
  error: string
  message?: string
  statusCode?: number
}

/**
 * 페이지네이션 응답 타입
 */
export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
  hasNextPage: boolean
  hasPrevPage: boolean
}

/**
 * 페이지네이션 요청 파라미터
 */
export interface PaginationParams {
  page?: number
  limit?: number
}

// ============================================
// 인증 관련 API 타입
// ============================================

/**
 * 로그인 요청
 */
export interface LoginRequest {
  email: string
  password: string
}

/**
 * 로그인 응답
 */
export interface LoginResponse {
  user: User
  accessToken: string
}

/**
 * 회원가입 요청
 */
export interface RegisterRequest {
  email: string
  password: string
  companyName: string
}

/**
 * 회원가입 응답
 */
export interface RegisterResponse {
  user: User
  message: string
}

// ============================================
// 설정 관련 API 타입
// ============================================

/**
 * 노션 연동 설정 요청
 */
export interface SettingsRequest {
  notionApiKey: string
  notionDatabaseId: string
}

/**
 * 노션 연동 설정 응답
 */
export interface SettingsResponse {
  success: boolean
  message: string
  isConnected: boolean
}

/**
 * 노션 연동 테스트 응답
 */
export interface NotionTestResponse {
  success: boolean
  message: string
  databaseName?: string
  pageCount?: number
}

// ============================================
// 견적서 관련 API 타입
// ============================================

/**
 * 견적서 목록 조회 요청 파라미터
 */
export interface QuoteListParams extends PaginationParams {
  search?: string
  status?: string
  sortBy?: "issueDate" | "createdAt" | "totalAmount"
  sortOrder?: "asc" | "desc"
}

/**
 * 견적서 목록 조회 응답
 */
export type QuoteListResponse = PaginatedResponse<QuoteSummary>

/**
 * 견적서 상세 조회 응답
 */
export interface QuoteDetailResponse {
  quote: Quote
  user: Pick<User, "companyName">
}

/**
 * 공유 견적서 조회 응답
 */
export interface SharedQuoteResponse {
  quote: Quote
  companyName: string
}

// ============================================
// 동기화 관련 API 타입
// ============================================

/**
 * 동기화 요청
 */
export interface SyncRequest {
  force?: boolean // 강제 동기화 여부
}

/**
 * 동기화 응답
 */
export interface SyncResponse {
  success: boolean
  message: string
  syncedCount: number // 동기화된 견적서 수
  newCount: number // 새로 추가된 견적서 수
  updatedCount: number // 업데이트된 견적서 수
  lastSyncAt: Date // 마지막 동기화 시간
}

/**
 * 동기화 상태 조회 응답
 */
export interface SyncStatusResponse {
  lastSyncAt: Date | null
  isConnected: boolean
  totalQuotes: number
}

// ============================================
// 공유 링크 관련 API 타입
// ============================================

/**
 * 공유 링크 생성 응답
 */
export interface ShareLinkResponse {
  shareId: string
  shareUrl: string
}

/**
 * 공유 링크 재생성 요청
 */
export interface RegenerateShareLinkRequest {
  quoteId: string
}

// ============================================
// PDF 관련 API 타입
// ============================================

/**
 * PDF 생성 요청
 */
export interface PdfGenerateRequest {
  quoteId: string
}

/**
 * PDF 생성 응답
 */
export interface PdfGenerateResponse {
  success: boolean
  pdfUrl?: string
  fileName?: string
}

// ============================================
// 이메일 발송 관련 API 타입
// ============================================

/**
 * 이메일 발송 요청
 */
export interface SendEmailRequest {
  to: string // 수신자 이메일
  subject?: string // 이메일 제목 (기본값: 견적서 발송 안내)
  message?: string // 추가 메시지 (선택)
}

/**
 * 이메일 발송 응답
 */
export interface SendEmailResponse {
  success: boolean
  message: string
  emailId?: string // Resend 이메일 ID
  sentAt?: string // 발송 시간 (ISO 8601)
}
