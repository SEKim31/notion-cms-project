// 데이터베이스 모델 타입 정의
// PRD 데이터 모델 기반 (User, Quote, QuoteItem)

/**
 * 견적서 상태 enum
 */
export enum QuoteStatus {
  DRAFT = "DRAFT", // 작성 중
  SENT = "SENT", // 발송됨
  VIEWED = "VIEWED", // 조회됨
  EXPIRED = "EXPIRED", // 만료됨
}

/**
 * 사용자 (사업자 계정) 인터페이스
 * Supabase users 테이블과 매핑
 */
export interface User {
  id: string // UUID
  email: string // 로그인 이메일 (unique)
  companyName: string // 사업자명/회사명
  notionApiKey?: string | null // 노션 API 키 (암호화 저장)
  notionDatabaseId?: string | null // 노션 데이터베이스 ID
  createdAt: Date // 계정 생성일
  updatedAt: Date // 정보 수정일
}

/**
 * 새 사용자 생성 시 필요한 데이터
 */
export interface CreateUserInput {
  email: string
  companyName: string
}

/**
 * 사용자 정보 업데이트 시 필요한 데이터
 */
export interface UpdateUserInput {
  companyName?: string
  notionApiKey?: string | null
  notionDatabaseId?: string | null
}

/**
 * 품목 상세 인터페이스
 * Quote.items JSON 배열의 각 요소
 */
export interface QuoteItem {
  name: string // 품목명
  quantity: number // 수량
  unitPrice: number // 단가
  amount: number // 금액 (수량 × 단가)
  description?: string // 품목 설명 (선택)
}

/**
 * 견적서 인터페이스
 * Supabase quotes 테이블과 매핑
 */
export interface Quote {
  id: string // UUID
  userId: string // 사업자 ID (→ User.id)
  notionPageId: string // 노션 페이지 ID (원본 연결, unique)
  quoteNumber: string // 견적서 번호
  clientName: string // 클라이언트 회사명
  clientContact?: string | null // 클라이언트 담당자
  clientPhone?: string | null // 클라이언트 연락처
  clientEmail?: string | null // 클라이언트 이메일
  items: QuoteItem[] // 품목 목록 (JSON Array)
  totalAmount: number // 총 금액
  issueDate: Date // 발행일
  validUntil?: Date | null // 유효기간
  notes?: string | null // 비고/특이사항
  shareId: string // 공유 링크 고유 ID (unique)
  status: QuoteStatus // 견적서 상태
  createdAt: Date // 데이터 생성일
  updatedAt: Date // 마지막 동기화 시간
}

/**
 * 새 견적서 생성 시 필요한 데이터
 */
export interface CreateQuoteInput {
  userId: string
  notionPageId: string
  quoteNumber: string
  clientName: string
  clientContact?: string | null
  clientPhone?: string | null
  clientEmail?: string | null
  items: QuoteItem[]
  totalAmount: number
  issueDate: Date
  validUntil?: Date | null
  notes?: string | null
  status?: QuoteStatus
}

/**
 * 견적서 업데이트 시 필요한 데이터
 */
export interface UpdateQuoteInput {
  quoteNumber?: string
  clientName?: string
  clientContact?: string | null
  clientPhone?: string | null
  clientEmail?: string | null
  items?: QuoteItem[]
  totalAmount?: number
  issueDate?: Date
  validUntil?: Date | null
  notes?: string | null
  status?: QuoteStatus
}

/**
 * 견적서 목록 조회용 요약 타입
 */
export interface QuoteSummary {
  id: string
  quoteNumber: string
  clientName: string
  totalAmount: number
  issueDate: Date
  status: QuoteStatus
  shareId: string
}
