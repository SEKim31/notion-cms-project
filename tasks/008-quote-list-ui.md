# Task 008: 견적서 목록 페이지 UI 구현

## 상태: ✅ 완료

## 개요
노션에서 동기화된 견적서를 카드 형태로 표시하고, 검색/필터/동기화 기능을 제공하는 목록 페이지 UI 구현

## 구현된 기능

### 1. 견적서 카드 컴포넌트 (`QuoteCard`)
- 견적서 번호, 클라이언트명, 총 금액, 발행일 표시
- 상태 배지 (작성 중, 발송됨, 조회됨, 만료됨)
- 드롭다운 메뉴 (상세 보기, 공유 링크 복사, 공유 페이지 열기)
- 호버 효과 및 반응형 디자인

### 2. 검색 및 필터링 UI (`QuoteListToolbar`)
- 견적서 번호/클라이언트명 검색
- 상태별 필터링 (체크박스)
- 필터 선택 시 배지로 필터 개수 표시

### 3. 동기화 버튼 및 상태 표시
- 수동 동기화 버튼 (회전 애니메이션)
- 마지막 동기화 시간 표시
- 연동 상태 인디케이터 (녹색/노란색 점)

### 4. 공유 링크 복사 기능
- 클립보드 API 사용
- Toast 알림 (성공/실패)
- 카드 내 버튼 및 드롭다운 메뉴에서 접근 가능

### 5. 빈 상태 및 로딩 UI
- 노션 연동 필요 시 설정 안내
- 견적서 없음 상태 표시
- 검색 결과 없음 상태
- 스켈레톤 로딩 UI

## 생성된 파일

```
lib/mock/quotes.ts                           # 더미 데이터 및 유틸리티 함수
components/features/quotes/quote-card.tsx    # 견적서 카드 컴포넌트
components/features/quotes/quote-list.tsx    # 견적서 목록 컨테이너
components/features/quotes/quote-list-toolbar.tsx  # 검색/필터/동기화 툴바
components/features/quotes/index.ts          # 컴포넌트 내보내기
app/(dashboard)/quotes/page.tsx              # 견적서 목록 페이지 (업데이트)
```

## 더미 데이터

5개의 샘플 견적서 데이터 포함:
- (주)테크스타트업 - 8,400,000원 (SENT)
- 디자인랩 스튜디오 - 2,500,000원 (VIEWED)
- 푸드테크 코리아 - 21,000,000원 (DRAFT)
- 글로벌 무역상사 - 19,000,000원 (EXPIRED)
- 에듀플러스 아카데미 - 20,000,000원 (SENT)

## 기술 스택
- React 19 + TypeScript
- shadcn/ui (Card, Badge, Button, Input, DropdownMenu)
- Lucide React 아이콘
- Sonner (Toast 알림)

## 다음 단계
- Task 12: Supabase 연동 후 실제 데이터로 교체
- Task 17: 견적서 목록 조회 API 구현
