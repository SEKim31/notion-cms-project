// 견적서 더미 데이터
// 개발 환경에서 UI 테스트용으로 사용

import { Quote, QuoteSummary, QuoteStatus, QuoteItem } from "@/types"

/**
 * 샘플 품목 목록 생성
 */
function generateSampleItems(): QuoteItem[] {
  const items: QuoteItem[] = [
    {
      name: "웹사이트 기획 및 디자인",
      quantity: 1,
      unitPrice: 2000000,
      amount: 2000000,
      description: "메인 페이지 + 서브 페이지 5개",
    },
    {
      name: "프론트엔드 개발",
      quantity: 1,
      unitPrice: 3000000,
      amount: 3000000,
      description: "React 기반 반응형 웹 개발",
    },
    {
      name: "백엔드 개발",
      quantity: 1,
      unitPrice: 2500000,
      amount: 2500000,
      description: "API 서버 및 데이터베이스 구축",
    },
    {
      name: "유지보수 (월)",
      quantity: 3,
      unitPrice: 300000,
      amount: 900000,
      description: "3개월 무상 유지보수",
    },
  ]
  return items
}

/**
 * 금액 포맷팅
 */
export function formatAmount(amount: number): string {
  return new Intl.NumberFormat("ko-KR").format(amount) + "원"
}

/**
 * 날짜 포맷팅
 */
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(date))
}

/**
 * 상태별 배지 스타일
 */
export function getStatusBadgeVariant(
  status: QuoteStatus
): "default" | "secondary" | "destructive" | "outline" {
  switch (status) {
    case QuoteStatus.DRAFT:
      return "secondary"
    case QuoteStatus.SENT:
      return "default"
    case QuoteStatus.VIEWED:
      return "outline"
    case QuoteStatus.EXPIRED:
      return "destructive"
    default:
      return "default"
  }
}

/**
 * 상태 한글 표시
 */
export function getStatusLabel(status: QuoteStatus): string {
  switch (status) {
    case QuoteStatus.DRAFT:
      return "작성 중"
    case QuoteStatus.SENT:
      return "발송됨"
    case QuoteStatus.VIEWED:
      return "조회됨"
    case QuoteStatus.EXPIRED:
      return "만료됨"
    default:
      return status
  }
}

/**
 * 더미 견적서 목록 데이터
 */
export const MOCK_QUOTES: Quote[] = [
  {
    id: "1",
    userId: "user-1",
    notionPageId: "notion-page-1",
    quoteNumber: "Q-2024-001",
    clientName: "(주)테크스타트업",
    clientContact: "김개발",
    clientPhone: "010-1234-5678",
    clientEmail: "dev@techstartup.com",
    items: generateSampleItems(),
    totalAmount: 8400000,
    issueDate: new Date("2024-12-15"),
    validUntil: new Date("2025-01-15"),
    notes: "부가세 별도\n결제조건: 계약금 50%, 잔금 50% (완료 후)",
    shareId: "share-abc123",
    status: QuoteStatus.SENT,
    createdAt: new Date("2024-12-15"),
    updatedAt: new Date("2024-12-15"),
  },
  {
    id: "2",
    userId: "user-1",
    notionPageId: "notion-page-2",
    quoteNumber: "Q-2024-002",
    clientName: "디자인랩 스튜디오",
    clientContact: "박디자인",
    clientPhone: "010-2345-6789",
    clientEmail: "design@designlab.kr",
    items: [
      {
        name: "브랜딩 컨설팅",
        quantity: 1,
        unitPrice: 1500000,
        amount: 1500000,
      },
      {
        name: "로고 디자인",
        quantity: 1,
        unitPrice: 800000,
        amount: 800000,
      },
      {
        name: "명함 디자인",
        quantity: 1,
        unitPrice: 200000,
        amount: 200000,
      },
    ],
    totalAmount: 2500000,
    issueDate: new Date("2024-12-20"),
    validUntil: new Date("2025-01-20"),
    notes: "부가세 포함",
    shareId: "share-def456",
    status: QuoteStatus.VIEWED,
    createdAt: new Date("2024-12-20"),
    updatedAt: new Date("2024-12-22"),
  },
  {
    id: "3",
    userId: "user-1",
    notionPageId: "notion-page-3",
    quoteNumber: "Q-2024-003",
    clientName: "푸드테크 코리아",
    clientContact: "이사업",
    clientPhone: "010-3456-7890",
    clientEmail: "business@foodtech.kr",
    items: [
      {
        name: "모바일 앱 기획",
        quantity: 1,
        unitPrice: 3000000,
        amount: 3000000,
      },
      {
        name: "iOS 앱 개발",
        quantity: 1,
        unitPrice: 8000000,
        amount: 8000000,
      },
      {
        name: "Android 앱 개발",
        quantity: 1,
        unitPrice: 8000000,
        amount: 8000000,
      },
      {
        name: "서버 인프라 구축",
        quantity: 1,
        unitPrice: 2000000,
        amount: 2000000,
      },
    ],
    totalAmount: 21000000,
    issueDate: new Date("2024-12-25"),
    validUntil: new Date("2025-01-25"),
    notes: "부가세 별도\n개발 기간: 약 3개월",
    shareId: "share-ghi789",
    status: QuoteStatus.DRAFT,
    createdAt: new Date("2024-12-25"),
    updatedAt: new Date("2024-12-25"),
  },
  {
    id: "4",
    userId: "user-1",
    notionPageId: "notion-page-4",
    quoteNumber: "Q-2024-004",
    clientName: "글로벌 무역상사",
    clientContact: "최무역",
    clientPhone: "010-4567-8901",
    clientEmail: "trade@globaltrade.com",
    items: [
      {
        name: "ERP 시스템 커스터마이징",
        quantity: 1,
        unitPrice: 15000000,
        amount: 15000000,
      },
      {
        name: "데이터 마이그레이션",
        quantity: 1,
        unitPrice: 3000000,
        amount: 3000000,
      },
      {
        name: "사용자 교육",
        quantity: 2,
        unitPrice: 500000,
        amount: 1000000,
      },
    ],
    totalAmount: 19000000,
    issueDate: new Date("2024-11-10"),
    validUntil: new Date("2024-12-10"),
    notes: "부가세 별도",
    shareId: "share-jkl012",
    status: QuoteStatus.EXPIRED,
    createdAt: new Date("2024-11-10"),
    updatedAt: new Date("2024-12-11"),
  },
  {
    id: "5",
    userId: "user-1",
    notionPageId: "notion-page-5",
    quoteNumber: "Q-2024-005",
    clientName: "에듀플러스 아카데미",
    clientContact: "정교육",
    clientPhone: "010-5678-9012",
    clientEmail: "edu@eduplus.co.kr",
    items: [
      {
        name: "LMS 플랫폼 개발",
        quantity: 1,
        unitPrice: 12000000,
        amount: 12000000,
      },
      {
        name: "실시간 화상 강의 모듈",
        quantity: 1,
        unitPrice: 5000000,
        amount: 5000000,
      },
      {
        name: "콘텐츠 관리 시스템",
        quantity: 1,
        unitPrice: 3000000,
        amount: 3000000,
      },
    ],
    totalAmount: 20000000,
    issueDate: new Date("2024-12-28"),
    validUntil: new Date("2025-01-28"),
    notes: "부가세 포함\n호스팅 비용 별도",
    shareId: "share-mno345",
    status: QuoteStatus.SENT,
    createdAt: new Date("2024-12-28"),
    updatedAt: new Date("2024-12-28"),
  },
]

/**
 * 견적서 목록 조회 (요약 데이터)
 */
export function getMockQuoteSummaries(): QuoteSummary[] {
  return MOCK_QUOTES.map((quote) => ({
    id: quote.id,
    quoteNumber: quote.quoteNumber,
    clientName: quote.clientName,
    totalAmount: quote.totalAmount,
    issueDate: quote.issueDate,
    status: quote.status,
    shareId: quote.shareId,
  }))
}

/**
 * 견적서 상세 조회
 */
export function getMockQuoteById(id: string): Quote | undefined {
  return MOCK_QUOTES.find((quote) => quote.id === id)
}

/**
 * 공유 ID로 견적서 조회
 */
export function getMockQuoteByShareId(shareId: string): Quote | undefined {
  return MOCK_QUOTES.find((quote) => quote.shareId === shareId)
}
