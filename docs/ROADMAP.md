# 노션 견적서 뷰어 개발 로드맵

노션에서 작성한 견적서를 클라이언트가 웹에서 확인하고, PDF 다운로드 및 이메일 발송까지 한 번에 처리할 수 있는 시스템

## 개요

**노션 견적서 뷰어**는 견적서를 발행하는 사업자와 견적서를 받아보는 클라이언트를 위한 서비스로 다음 기능을 제공합니다:

- **노션 API 연동**: 노션 데이터베이스에서 견적서 데이터를 자동으로 동기화
- **견적서 웹 뷰어**: 사업자와 클라이언트 모두 웹에서 견적서 내용을 확인
- **공유 링크 생성**: 비로그인 클라이언트가 접근할 수 있는 고유 URL 제공
- **PDF 다운로드**: 견적서를 PDF 파일로 변환하여 오프라인 보관 및 인쇄 지원
- **이메일 자동 발송**: 앱 내에서 고객에게 견적서를 직접 이메일로 발송 (v2)
- **상태 동기화**: 노션 데이터베이스의 상태값을 앱에 실시간 반영 (v2)

---

## 개발 워크플로우

1. **작업 계획**
   - 기존 코드베이스를 학습하고 현재 상태를 파악
   - 새로운 작업을 포함하도록 `ROADMAP.md` 업데이트
   - 우선순위 작업은 마지막 완료된 작업 다음에 삽입

2. **작업 생성**
   - 기존 코드베이스를 학습하고 현재 상태를 파악
   - `/tasks` 디렉토리에 새 작업 파일 생성
   - 명명 형식: `XXX-description.md` (예: `001-setup.md`)
   - 고수준 명세서, 관련 파일, 수락 기준, 구현 단계 포함
   - API/비즈니스 로직 작업 시 "## 테스트 체크리스트" 섹션 필수 포함 (Playwright MCP 테스트 시나리오 작성)

3. **작업 구현**
   - 작업 파일의 명세서를 따름
   - 기능과 기능성 구현
   - **API 연동 및 비즈니스 로직 구현 시 Playwright MCP로 테스트 수행 필수**
   - 각 단계 후 작업 파일 내 단계 진행 상황 업데이트
   - 구현 완료 후 Playwright MCP를 사용한 E2E 테스트 실행
   - 테스트 통과 확인 후 다음 단계로 진행
   - 각 단계 완료 후 중단하고 추가 지시를 기다림

4. **로드맵 업데이트**
   - 로드맵에서 완료된 작업을 완료로 표시

---

## MVP 완료 현황 (v1)

### Phase 1: 애플리케이션 골격 구축 - 완료

- **Task 001: 프로젝트 초기 설정 및 라우팅 구조** - 완료
  - Next.js 16 App Router 기반 전체 라우트 구조 생성
  - Route Groups 적용: (marketing), (auth), (dashboard)
  - 공통 레이아웃 컴포넌트 골격 구현

- **Task 002: shadcn/ui 기반 공통 컴포넌트 구축** - 완료
  - Button, Card, Input, Form 등 기본 UI 컴포넌트 설치
  - 레이아웃 컴포넌트 (Header, Sidebar, MainNav) 구현
  - 공통 컴포넌트 (Logo, ThemeToggle, LoadingSpinner) 구현

- **Task 003: 상태 관리 및 Provider 설정** - 완료
  - ThemeProvider, QueryProvider, NuqsProvider 구성
  - 다크모드 지원 (next-themes)
  - 폼 검증 스키마 (Zod) 기초 구성

---

### Phase 2: 타입 정의 및 데이터 모델 설계 - 완료

- **Task 004: 타입 정의 및 인터페이스 설계** - 완료
  - See: `/tasks/004-type-definitions.md`
  - TypeScript 인터페이스 정의 (User, Quote, QuoteItem)
  - API 응답 타입 및 폼 데이터 타입 정의
  - 노션 API 응답 타입 매핑

- **Task 005: 데이터베이스 스키마 설계** - 완료
  - See: `/tasks/005-database-schema.md`
  - Supabase 테이블 스키마 설계 (users, quotes)
  - 관계 및 인덱스 정의
  - RLS(Row Level Security) 정책 설계

---

### Phase 3: UI/UX 완성 (더미 데이터 활용) - 완료

- **Task 006: 인증 페이지 UI 구현** - 완료
  - See: `/tasks/006-auth-pages-ui.md`
  - 로그인 페이지 폼 및 레이아웃 완성
  - 회원가입 페이지 폼 및 유효성 검사 UI
  - 인증 관련 에러 메시지 표시 UI

- **Task 007: 대시보드 레이아웃 및 설정 페이지 UI** - 완료
  - See: `/tasks/007-dashboard-settings-ui.md`
  - 대시보드 사이드바 네비게이션 완성
  - 설정 페이지 UI (노션 API 키, 데이터베이스 ID 입력 폼)
  - 연동 상태 표시 컴포넌트

- **Task 008: 견적서 목록 페이지 UI 구현** - 완료
  - See: `/tasks/008-quote-list-ui.md`
  - 견적서 카드 목록 컴포넌트 (더미 데이터)
  - 검색 및 필터링 UI
  - 동기화 버튼 및 상태 표시
  - 공유 링크 복사 버튼

- **Task 009: 견적서 상세 페이지 UI 구현** - 완료
  - See: `/tasks/009-quote-detail-ui.md`
  - 견적서 헤더 (회사 정보, 견적서 번호, 날짜)
  - 클라이언트 정보 섹션
  - 품목 테이블 컴포넌트
  - 총합계 및 비고 섹션
  - PDF 다운로드 버튼 UI

- **Task 010: 공유 견적서 페이지 UI 구현** - 완료
  - See: `/tasks/010-shared-quote-ui.md`
  - 공개 페이지 전용 레이아웃
  - 견적서 뷰어 컴포넌트 (읽기 전용)
  - PDF 다운로드 버튼

- **Task 011: 더미 데이터 및 Mock 유틸리티 작성** - 완료
  - See: `/tasks/011-mock-data.md`
  - 견적서 더미 데이터 생성 유틸리티 (`lib/mock/quotes.ts`)
  - 포맷팅 유틸리티 (금액, 날짜, 상태)
  - 5개 샘플 견적서 데이터

---

### Phase 4: 백엔드 인프라 및 인증 구현 - 완료

- **Task 012: Supabase 프로젝트 설정 및 테이블 생성** - 완료
  - See: `/tasks/012-supabase-setup.md`
  - Supabase 프로젝트 연동 및 환경 변수 설정
  - users, quotes 테이블 생성 (SQL 마이그레이션)
  - RLS 정책 적용

- **Task 013: 인증 시스템 구현 (F010)** - 완료
  - See: `/tasks/013-authentication.md`
  - Supabase Auth 연동
  - 회원가입/로그인/로그아웃 API 연결
  - 보호된 라우트 미들웨어 구현
  - 세션 관리 및 사용자 상태 Provider
  - **테스트 체크리스트**: Playwright MCP를 활용한 인증 플로우 E2E 테스트

---

### Phase 5: 노션 연동 및 데이터 동기화 - 완료

- **Task 014: 노션 API 클라이언트 설정** - 완료
  - See: `/tasks/014-notion-client.md`
  - @notionhq/client 설정 및 유틸리티 함수
  - 노션 데이터베이스 쿼리 함수 구현
  - 페이지네이션 및 Rate Limit 처리

- **Task 015: 노션 연동 설정 페이지 구현 (F011)** - 완료
  - See: `/tasks/015-notion-settings.md`
  - API 키 암호화 저장 로직
  - 데이터베이스 ID 저장 및 검증
  - 연동 테스트 API 엔드포인트
  - 설정 저장 API 연결
  - **테스트 체크리스트**: Playwright MCP를 활용한 설정 저장/불러오기 테스트

- **Task 016: 데이터 동기화 구현 (F012)** - 완료
  - See: `/tasks/016-data-sync.md`
  - 노션 -> DB 동기화 API 엔드포인트 (`POST /api/sync`)
  - 노션 페이지 속성 -> Quote 모델 매핑 (`lib/notion/mapper.ts`)
  - 수동 동기화 트리거 구현 (동기화 버튼 UI 연동)
  - 동기화 상태 관리 (`lib/sync/status.ts`, `hooks/use-sync.ts`)
  - 환경 변수 및 DB 설정 모두 지원
  - **테스트 체크리스트**: Playwright MCP를 활용한 동기화 정합성 테스트

---

### Phase 6: 견적서 핵심 기능 구현 - 완료

- **Task 017: 견적서 목록 조회 API 구현 (F001, F002)** - 완료
  - See: `/tasks/017-quote-list-api.md`
  - 견적서 목록 조회 API 엔드포인트 (`GET /api/quotes`)
  - React Query 연동 (`useQuotes` 훅)
  - 페이지네이션, 검색, 필터, 정렬 처리
  - 더미 데이터를 실제 API로 교체
  - **테스트 체크리스트**: Playwright MCP를 활용한 목록 조회 API 테스트

- **Task 018: 견적서 상세 조회 구현 (F003)** - 완료
  - See: `/tasks/018-quote-detail-api.md`
  - 견적서 상세 조회 API 엔드포인트 (`GET /api/quotes/[id]`)
  - 사업자용 상세 페이지 데이터 연동 (더미 데이터 -> Supabase)
  - 권한 검증 (본인 견적서만 조회)
  - `useQuote` React Query 훅 구현
  - **테스트 체크리스트**: Playwright MCP를 활용한 상세 조회 및 권한 테스트

- **Task 019: 공유 링크 생성 구현 (F005)** - 완료
  - See: `/tasks/019-share-link.md`
  - UUID 기반 shareId 생성 로직 (동기화 시 자동 생성)
  - 공유 링크 생성/재생성 API (`POST /api/quotes/[id]/share`)
  - 클립보드 복사 기능 구현 (`hooks/use-share.ts`)
  - 재생성 확인 다이얼로그 UI
  - **테스트 체크리스트**: API 권한 테스트 완료

- **Task 020: 공유 견적서 페이지 구현 (F003)** - 완료
  - See: `/tasks/020-shared-quote-page.md`
  - shareId 기반 견적서 조회 API (`GET /api/quotes/share/[shareId]`)
  - 공개 페이지 데이터 연동 (Supabase Admin Client)
  - 존재하지 않는 링크 처리 (404 페이지)
  - **테스트 체크리스트**: API 에러 처리 테스트 완료

---

### Phase 7: PDF 생성 기능 구현 - 완료

- **Task 021: PDF 템플릿 컴포넌트 작성** - 완료
  - See: `/tasks/021-pdf-template.md`
  - @react-pdf/renderer 설치 및 설정
  - Noto Sans KR 한글 폰트 임베딩
  - 견적서 PDF 레이아웃 컴포넌트 (`lib/pdf/quote-document.tsx`)
  - 스타일링 (헤더, 클라이언트 정보, 품목 테이블, 합계, 비고)

- **Task 022: PDF 다운로드 구현 (F004)** - 완료
  - See: `/tasks/022-pdf-download.md`
  - PDF 생성 API (`GET /api/quotes/[id]/pdf`, `GET /api/quotes/share/[shareId]/pdf`)
  - 다운로드 훅 (`usePdfDownload`, `useSharedPdfDownload`)
  - 로딩 상태 및 에러 처리 (toast 메시지)
  - 공유 페이지에서도 PDF 다운로드 지원

---

### Phase 8: 테스트, 최적화 및 배포 - 완료

- **Task 023: 통합 테스트 및 E2E 테스트** - 완료
  - See: `/tasks/023-integration-tests.md`
  - Playwright 설정 및 테스트 유틸리티 구축
  - 인증 플로우 E2E 테스트 (12개 테스트)
  - 견적서 목록/상세 테스트 (10개 테스트)
  - 공유 기능/PDF/동기화 테스트 (16개 테스트)
  - API 권한 및 보호된 라우트 검증
  - **총 38개 테스트 케이스 작성 완료**

- **Task 024: 성능 최적화** - 완료
  - See: `/tasks/024-performance.md`
  - @next/bundle-analyzer 설치 및 optimizePackageImports 적용
  - React Query 캐싱 전략 최적화 (쿼리별 staleTime/gcTime, 쿼리 키 팩토리)
  - Skeleton UI 컴포넌트 (QuoteList, QuoteDetail, Settings)
  - 페이지별 loading.tsx 생성

- **Task 025: Vercel 배포 및 프로덕션 설정** - 완료
  - See: `/tasks/025-deployment.md`
  - 프로덕션 빌드 검증 완료 (lint 통과, 빌드 성공)
  - `.env.example` 환경 변수 문서화
  - `docs/DEPLOYMENT.md` 배포 가이드 작성
  - Vercel 배포 준비 완료

---

## 고도화 개발 (v2)

### Phase 9: 견적서 상태 동기화 - 완료

노션 데이터베이스의 상태 속성을 앱에 연동하여 견적서 카드의 상태 배지에 동적으로 반영

- **Task 026: 노션 상태 속성 매핑 확장** - 완료
  - 노션 데이터베이스 상태(Select) 속성 추출 로직 구현
  - `lib/notion/mapper.ts`에 상태 매핑 함수 추가
  - 지원 상태값 정의: 작성중, 작성완료, 발송완료, 승인, 거절 등
  - 상태값 한글/영문 매핑 및 검증 로직
  - **관련 파일**:
    - `lib/notion/mapper.ts` (수정)
    - `types/database.ts` (QuoteStatus enum 확장)
    - `types/notion.ts` (매핑 설정 확장)

- **Task 027: 상태 동기화 로직 구현** - 완료
  - 동기화 시 노션 상태값을 DB에 반영하도록 sync API 수정
  - `POST /api/sync` 엔드포인트에서 상태 필드 업데이트
  - 기존 견적서의 상태값 마이그레이션 처리
  - **테스트 체크리스트**: Playwright MCP를 활용한 상태 동기화 테스트
  - **관련 파일**:
    - `app/api/sync/route.ts` (수정)
    - `lib/supabase/quotes.ts` (수정)

- **Task 028: 상태 배지 UI 동적 연동** - 완료
  - QuoteCard 컴포넌트에서 실제 상태값 표시
  - 상태별 배지 색상 및 스타일 정의 확장
  - QuoteStatus enum에 신규 상태 추가 (PENDING, APPROVED, REJECTED 등)
  - 목록 필터에 상태별 필터링 옵션 추가
  - **관련 파일**:
    - `components/features/quotes/quote-card.tsx` (수정)
    - `lib/mock/quotes.ts` (getStatusBadgeVariant, getStatusLabel 확장)
    - `components/features/quotes/quote-list-toolbar.tsx` (필터 옵션 추가)

---

### Phase 10: 이메일 자동 발송 기능 - 대기

견적서를 PDF로 첨부하여 클라이언트 이메일로 직접 발송하는 기능 구현

- **Task 029: 이메일 발송 인프라 설정**
  - 이메일 서비스 선정 및 연동 (Resend, SendGrid, 또는 AWS SES)
  - 환경 변수 설정 (API 키, 발신자 이메일 등)
  - 이메일 발송 유틸리티 함수 구현 (`lib/email/sender.ts`)
  - Rate Limit 및 에러 핸들링 구현
  - **관련 파일**:
    - `lib/email/sender.ts` (신규 생성)
    - `lib/email/templates.ts` (신규 생성)
    - `.env.example` (환경 변수 추가)

- **Task 030: 이메일 발송 API 엔드포인트 구현**
  - 견적서 이메일 발송 API (`POST /api/quotes/[id]/send-email`)
  - 요청 파라미터: 수신자 이메일, 제목, 본문 메시지 (선택)
  - PDF 첨부 파일 생성 및 이메일에 첨부
  - 발송 이력 로깅 (선택적으로 DB 저장)
  - **테스트 체크리스트**: Playwright MCP를 활용한 이메일 발송 API 테스트
  - **관련 파일**:
    - `app/api/quotes/[id]/send-email/route.ts` (신규 생성)
    - `types/api.ts` (SendEmailRequest, SendEmailResponse 타입 추가)

- **Task 031: 이메일 템플릿 디자인**
  - 견적서 발송용 HTML 이메일 템플릿 작성
  - 반응형 이메일 레이아웃 (모바일 호환)
  - 템플릿 변수 치환 (회사명, 견적서 번호, 금액, 공유 링크 등)
  - 다크모드 지원 이메일 스타일
  - **관련 파일**:
    - `lib/email/templates/quote-email.tsx` (신규 생성)
    - `lib/email/templates/base-layout.tsx` (신규 생성)

- **Task 032: 이메일 발송 UI 구현**
  - 견적서 상세 페이지에 "이메일 발송" 버튼 추가
  - 이메일 발송 모달/다이얼로그 컴포넌트
  - 수신자 이메일 입력 폼 (clientEmail 자동 채움)
  - 발송 전 미리보기 기능 (선택)
  - 발송 상태 표시 (로딩, 성공, 실패 toast)
  - **관련 파일**:
    - `components/features/quotes/send-email-dialog.tsx` (신규 생성)
    - `components/features/quotes/quote-actions.tsx` (수정)
    - `hooks/use-send-email.ts` (신규 생성)

- **Task 033: 이메일 발송 후 상태 업데이트**
  - 이메일 발송 성공 시 견적서 상태를 "발송완료"로 자동 변경
  - 노션에 상태 업데이트 반영 (선택적 - Notion API 쓰기 권한 필요)
  - 발송 이력 표시 UI (발송 일시, 수신자 이메일)
  - **테스트 체크리스트**: Playwright MCP를 활용한 이메일 발송 -> 상태 변경 E2E 테스트
  - **관련 파일**:
    - `app/api/quotes/[id]/send-email/route.ts` (수정)
    - `components/features/quotes/quote-header.tsx` (발송 이력 표시 추가)

---

### Phase 11: v2 통합 테스트 및 배포 - 대기

고도화 기능의 통합 테스트 및 프로덕션 배포

- **Task 034: v2 기능 통합 테스트**
  - 상태 동기화 E2E 테스트 케이스 추가
  - 이메일 발송 플로우 E2E 테스트 케이스 추가
  - 기존 테스트와의 회귀 테스트 수행
  - **테스트 체크리스트**: 전체 사용자 시나리오 E2E 테스트

- **Task 035: 문서화 및 배포**
  - v2 기능 사용자 가이드 작성
  - API 문서 업데이트 (이메일 발송 API)
  - CHANGELOG.md 작성
  - Vercel 프로덕션 배포 및 환경 변수 설정

---

## 기능 ID 매핑

### MVP 기능 (v1)

| 기능 ID | 기능명 | 관련 Task | 상태 |
|---------|--------|-----------|------|
| F001 | 노션 API 연동 | Task 014, 017, 018 | 완료 |
| F002 | 견적서 목록 조회 | Task 008, 017 | 완료 |
| F003 | 견적서 상세 보기 | Task 009, 010, 018, 020 | 완료 |
| F004 | PDF 다운로드 | Task 021, 022 | 완료 |
| F005 | 공유 링크 생성 | Task 019 | 완료 |
| F010 | 기본 인증 | Task 006, 013 | 완료 |
| F011 | 노션 연동 설정 | Task 007, 015 | 완료 |
| F012 | 데이터 동기화 | Task 016 | 완료 |

### 고도화 기능 (v2)

| 기능 ID | 기능명 | 관련 Task | 상태 |
|---------|--------|-----------|------|
| F013 | 견적서 상태 동기화 | Task 026, 027, 028 | 완료 |
| F014 | 이메일 자동 발송 | Task 029, 030, 031, 032, 033 | 대기 |

---

## 예상 개발 일정

### MVP (v1) - 완료

| Phase | 기간 | 상태 |
|-------|------|------|
| Phase 1 | 완료 | 프로젝트 초기 설정 완료 |
| Phase 2 | 1일 | 타입 정의 및 스키마 설계 완료 |
| Phase 3 | 2-3일 | 더미 데이터 기반 전체 UI 완성 |
| Phase 4 | 1-2일 | Supabase 연동 및 인증 완료 |
| Phase 5 | 2-3일 | 노션 API 연동 완료 |
| Phase 6 | 2-3일 | 견적서 CRUD 및 공유 기능 완료 |
| Phase 7 | 2-3일 | PDF 생성 기능 완료 |
| Phase 8 | 2-3일 | 테스트 및 배포 완료 |

**MVP 총 개발 기간: 약 15일 (완료)**

### 고도화 (v2) - 예정

| Phase | 기간 | 비고 |
|-------|------|------|
| Phase 9 | 2-3일 | 상태 동기화 (노션 -> 앱) |
| Phase 10 | 4-5일 | 이메일 자동 발송 기능 |
| Phase 11 | 1-2일 | 통합 테스트 및 배포 |

**v2 예상 개발 기간: 7-10일**

---

## 기술 스택 요약

### 기존 스택 (v1)

- **프론트엔드**: Next.js 16 (App Router), React 19, TypeScript
- **스타일링**: TailwindCSS v4, shadcn/ui
- **상태 관리**: @tanstack/react-query, nuqs, react-hook-form + Zod
- **백엔드**: Supabase (Auth, PostgreSQL)
- **외부 연동**: @notionhq/client
- **PDF 생성**: @react-pdf/renderer
- **배포**: Vercel

### 추가 스택 (v2)

- **이메일 발송**: Resend (권장) 또는 SendGrid / AWS SES
- **이메일 템플릿**: @react-email/components (선택)

---

## 주요 변경 파일 요약 (v2)

### 신규 생성 파일

```
lib/email/
  sender.ts              # 이메일 발송 유틸리티
  templates.ts           # 템플릿 관리
  templates/
    quote-email.tsx      # 견적서 발송 이메일 템플릿
    base-layout.tsx      # 기본 이메일 레이아웃

app/api/quotes/[id]/
  send-email/route.ts    # 이메일 발송 API

components/features/quotes/
  send-email-dialog.tsx  # 이메일 발송 다이얼로그

hooks/
  use-send-email.ts      # 이메일 발송 훅
```

### 수정 파일

```
types/
  database.ts            # QuoteStatus enum 확장
  notion.ts              # 상태 매핑 설정 추가
  api.ts                 # 이메일 관련 타입 추가

lib/notion/
  mapper.ts              # 상태 속성 매핑 추가

lib/mock/
  quotes.ts              # 상태 라벨/배지 확장

app/api/
  sync/route.ts          # 상태 동기화 반영

components/features/quotes/
  quote-card.tsx         # 상태 배지 동적 연동
  quote-actions.tsx      # 이메일 발송 버튼 추가
  quote-list-toolbar.tsx # 상태 필터 추가
  quote-header.tsx       # 발송 이력 표시
```

---

## 참고 문서

- PRD: `/docs/PRD.md`
- MVP 로드맵 (v1): `/docs/roadmaps/ROADMAP_v1.md`
- 배포 가이드: `/docs/DEPLOYMENT.md`
