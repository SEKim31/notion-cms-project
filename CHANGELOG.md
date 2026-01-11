# Changelog

이 프로젝트의 모든 주요 변경 사항을 이 파일에 기록합니다.

형식은 [Keep a Changelog](https://keepachangelog.com/ko/1.0.0/)를 기반으로 하며,
이 프로젝트는 [Semantic Versioning](https://semver.org/lang/ko/)을 따릅니다.

---

## [2.0.0] - 2025-01-11

### 추가됨 (Added)

#### 견적서 상태 동기화 (Phase 9)
- 노션 데이터베이스 상태(Select) 속성을 앱에 자동 동기화
- 7가지 상태 지원: 작성 중, 작성완료, 발송됨, 조회됨, 승인, 거절, 만료됨
- 상태별 배지 색상 및 스타일 적용
- 견적서 목록 필터에 상태별 필터링 옵션 추가
- `lib/notion/mapper.ts`에 상태 매핑 함수 추가

#### 이메일 자동 발송 (Phase 10)
- 견적서를 PDF로 첨부하여 이메일 발송 기능 구현
- Resend 이메일 서비스 연동
- 이메일 발송 API: `POST /api/quotes/[id]/send-email`
- 반응형 HTML 이메일 템플릿 (@react-email/components 사용)
- 이메일 발송 다이얼로그 UI 컴포넌트
- 발송 성공 시 상태 "발송됨"으로 자동 변경
- 발송 이력 저장 (sentAt, sentTo 필드)

#### 테스트 및 문서화
- 이메일 발송 E2E 테스트 케이스 12개 추가 (`e2e/email.spec.ts`)
- v2 기능 사용자 가이드 (`docs/USER_GUIDE_V2.md`)
- API 문서 (`docs/API.md`)

### 변경됨 (Changed)

- `types/database.ts`: QuoteStatus enum 확장 (7가지 상태)
- `types/api.ts`: SendEmailRequest, SendEmailResponse 타입 추가
- `components/features/quotes/quote-card.tsx`: 동적 상태 배지 표시
- `components/features/quotes/quote-list-toolbar.tsx`: 상태 필터 옵션 추가
- `app/api/sync/route.ts`: 상태 동기화 로직 추가

### 새 파일

```
lib/email/
  sender.ts                    # 이메일 발송 유틸리티
  templates.ts                 # 템플릿 관리
  templates/
    quote-email.tsx           # 견적서 발송 이메일 템플릿

app/api/quotes/[id]/
  send-email/route.ts         # 이메일 발송 API

components/features/quotes/
  send-email-dialog.tsx       # 이메일 발송 다이얼로그

hooks/
  use-send-email.ts           # 이메일 발송 React Query 훅

e2e/
  email.spec.ts               # 이메일 발송 E2E 테스트

docs/
  USER_GUIDE_V2.md            # v2 사용자 가이드
  API.md                      # API 문서
```

---

## [1.0.0] - 2025-01-01

### 추가됨 (Added)

#### 애플리케이션 골격 (Phase 1)
- Next.js 16 App Router 기반 프로젝트 초기 설정
- Route Groups 적용: (marketing), (auth), (dashboard)
- shadcn/ui 기반 공통 컴포넌트 구축
- 다크모드 지원 (next-themes)

#### 타입 정의 및 데이터 모델 (Phase 2)
- TypeScript 인터페이스 정의 (User, Quote, QuoteItem)
- Supabase 테이블 스키마 설계
- RLS(Row Level Security) 정책 적용

#### UI/UX 구현 (Phase 3)
- 인증 페이지 (로그인, 회원가입)
- 대시보드 레이아웃 및 사이드바
- 견적서 목록/상세/공유 페이지
- 설정 페이지 (노션 연동)

#### 백엔드 인프라 (Phase 4)
- Supabase 프로젝트 연동
- 인증 시스템 구현 (회원가입/로그인/로그아웃)
- 보호된 라우트 미들웨어

#### 노션 연동 (Phase 5)
- @notionhq/client를 사용한 노션 API 연동
- 노션 데이터베이스 쿼리 및 페이지네이션
- 데이터 동기화 API (`POST /api/sync`)
- API 키 암호화 저장

#### 견적서 핵심 기능 (Phase 6)
- 견적서 목록 조회 API (`GET /api/quotes`)
- 견적서 상세 조회 API (`GET /api/quotes/[id]`)
- 공유 링크 생성 API (`POST /api/quotes/[id]/share`)
- 공유 견적서 페이지 (`/quote/share/[shareId]`)

#### PDF 생성 (Phase 7)
- @react-pdf/renderer를 사용한 PDF 템플릿
- Noto Sans KR 한글 폰트 임베딩
- PDF 다운로드 API (인증/공유 버전)

#### 테스트 및 최적화 (Phase 8)
- Playwright E2E 테스트 설정 (38개 테스트 케이스)
- React Query 캐싱 전략 최적화
- Skeleton UI 컴포넌트
- 번들 분석 도구 설정

### 기술 스택

- **프론트엔드**: Next.js 16, React 19, TypeScript
- **스타일링**: TailwindCSS v4, shadcn/ui
- **상태 관리**: @tanstack/react-query, nuqs, react-hook-form + Zod
- **백엔드**: Supabase (Auth, PostgreSQL)
- **외부 연동**: @notionhq/client
- **PDF 생성**: @react-pdf/renderer
- **배포**: Vercel

---

## [Unreleased]

### 계획됨

- 실시간 노션 동기화 (Webhook 또는 폴링)
- 견적서 승인/거절 워크플로우
- 다국어 지원 (영어, 일본어)
- 견적서 템플릿 커스터마이징
- 통계 대시보드

---

## 버전 가이드

- **Major (x.0.0)**: 호환되지 않는 API 변경
- **Minor (0.x.0)**: 하위 호환되는 새 기능 추가
- **Patch (0.0.x)**: 하위 호환되는 버그 수정
