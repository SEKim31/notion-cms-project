// 공통 타입 정의 - 모든 타입 re-export

// ============================================
// 데이터베이스 모델 타입
// ============================================
export {
  QuoteStatus,
  type User,
  type CreateUserInput,
  type UpdateUserInput,
  type QuoteItem,
  type Quote,
  type CreateQuoteInput,
  type UpdateQuoteInput,
  type QuoteSummary,
} from "./database"

// ============================================
// API 요청/응답 타입
// ============================================
export {
  type ApiResponse,
  type ApiErrorResponse,
  type PaginatedResponse,
  type PaginationParams,
  type LoginRequest,
  type LoginResponse,
  type RegisterRequest,
  type RegisterResponse,
  type SettingsRequest,
  type SettingsResponse,
  type NotionTestResponse,
  type QuoteListParams,
  type QuoteListResponse,
  type QuoteDetailResponse,
  type SharedQuoteResponse,
  type SyncRequest,
  type SyncResponse,
  type SyncStatusResponse,
  type ShareLinkResponse,
  type RegenerateShareLinkRequest,
  type PdfGenerateRequest,
  type PdfGenerateResponse,
} from "./api"

// ============================================
// 노션 API 관련 타입
// ============================================
export {
  type NotionPropertyType,
  type NotionRichText,
  type NotionDateProperty,
  type NotionSelectOption,
  type NotionDatabaseProperty,
  type NotionPageProperties,
  type NotionPageResponse,
  type NotionDatabaseQueryResponse,
  type NotionDatabaseInfoResponse,
  type NotionQuoteMapping,
  type NotionToQuoteMapper,
  type NotionClientConfig,
  type NotionSyncOptions,
  type NotionPropertyExtractor,
  DEFAULT_NOTION_MAPPING,
} from "./notion"

// ============================================
// 폼 데이터 타입
// ============================================
export {
  type LoginFormData,
  type RegisterFormData,
  type SettingsFormData,
  type ProfileFormData,
  type ChangePasswordFormData,
  type QuoteSearchFormData,
  type FormFieldError,
  type FormSubmitState,
} from "./forms"

// ============================================
// 페이지 관련 타입 (Next.js App Router)
// ============================================

/**
 * 페이지 파라미터 타입
 * Next.js 15+ App Router에서 params와 searchParams가 Promise로 변경됨
 */
export interface PageParams {
  params: Promise<{ [key: string]: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

/**
 * 동적 라우트 파라미터 타입
 */
export interface DynamicRouteParams<T extends Record<string, string>> {
  params: Promise<T>
}

/**
 * 레이아웃 Props 타입
 */
export interface LayoutProps {
  children: React.ReactNode
  params?: Promise<{ [key: string]: string }>
}
