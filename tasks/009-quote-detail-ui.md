# Task 009: 견적서 상세 페이지 UI 구현

## 상태: ✅ 완료

## 개요
견적서의 전체 내용을 표시하는 상세 페이지 UI 구현 (사업자용 + 클라이언트용 공유 페이지)

## 구현된 기능

### 1. 견적서 헤더 컴포넌트 (`QuoteHeader`)
- 발행 회사명 표시
- 견적서 번호, 발행일, 유효기간
- 상태 배지 표시
- 유효기간 만료 시 경고 표시
- 아이콘과 함께 정보 카드 레이아웃

### 2. 클라이언트 정보 카드 (`ClientInfoCard`)
- 회사명, 담당자, 연락처, 이메일
- 연락처/이메일 클릭 시 전화/이메일 연결
- 연락처 정보가 없는 경우 안내 메시지

### 3. 품목 테이블 (`QuoteItemsTable`)
- 품목명, 수량, 단가, 금액 테이블
- 품목별 설명 표시 (있는 경우)
- 총 금액 합계 표시
- 데스크탑: 테이블 레이아웃
- 모바일: 카드 레이아웃 (반응형)

### 4. 비고 카드 (`QuoteNotesCard`)
- 비고/특이사항 표시
- 줄바꿈 보존 (whitespace-pre-wrap)
- 비고 없으면 카드 숨김

### 5. 액션 버튼 (`QuoteActions`, `SharedQuoteActions`)
- PDF 다운로드 버튼 (로딩 상태 표시)
- 공유 링크 복사 버튼
- 공유 페이지 새 탭에서 열기
- 목록으로 돌아가기 버튼
- 툴팁 안내

### 6. 공유 견적서 페이지
- 인증 불필요한 공개 페이지
- 발행자 정보 표시
- PDF 다운로드 기능
- 푸터 안내 문구

## 생성된 파일

```
components/features/quotes/quote-header.tsx       # 견적서 헤더 정보
components/features/quotes/client-info-card.tsx   # 클라이언트 정보 카드
components/features/quotes/quote-items-table.tsx  # 품목 테이블
components/features/quotes/quote-notes-card.tsx   # 비고 카드
components/features/quotes/quote-actions.tsx      # 액션 버튼 (PDF, 공유)
components/features/quotes/index.ts               # 컴포넌트 내보내기 (업데이트)
components/ui/table.tsx                           # shadcn Table 컴포넌트 (설치)
app/(dashboard)/quotes/[id]/page.tsx              # 상세 페이지 (업데이트)
app/quote/share/[shareId]/page.tsx                # 공유 페이지 (업데이트)
```

## UI 구조

### 사업자용 상세 페이지 (`/quotes/[id]`)
```
PageHeader (제목 + 액션 버튼)
├── QuoteHeader (견적서 기본 정보)
├── ClientInfoCard (클라이언트 정보)
├── QuoteItemsTable (품목 내역 + 합계)
└── QuoteNotesCard (비고)
```

### 클라이언트용 공유 페이지 (`/quote/share/[shareId]`)
```
Header (제목 + PDF 다운로드)
├── QuoteHeader (견적서 기본 정보)
├── ClientInfoCard (클라이언트 정보)
├── QuoteItemsTable (품목 내역 + 합계)
├── QuoteNotesCard (비고)
├── PDF 다운로드 버튼 (하단)
└── 푸터 안내
```

## 기술 스택
- React 19 + TypeScript
- shadcn/ui (Card, Table, Badge, Button, Tooltip)
- Lucide React 아이콘
- Sonner (Toast 알림)

## 반응형 디자인
- 모바일: 카드 형태의 품목 표시
- 태블릿/데스크탑: 테이블 레이아웃
- 액션 버튼 wrap 지원

## 다음 단계
- Task 18: 견적서 상세 조회 API 구현
- Task 20: 공유 견적서 페이지 API 연동
- Task 21-22: PDF 템플릿 및 다운로드 기능 구현
