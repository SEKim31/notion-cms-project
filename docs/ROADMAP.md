# 노션 견적서 뷰어 MVP 개발 로드맵

노션에서 작성한 견적서를 클라이언트가 웹에서 확인하고 PDF로 다운로드할 수 있는 시스템

## 개요

**노션 견적서 뷰어**는 견적서를 발행하는 사업자와 견적서를 받아보는 클라이언트를 위한 서비스로 다음 기능을 제공합니다:

- **노션 API 연동**: 노션 데이터베이스에서 견적서 데이터를 자동으로 동기화
- **견적서 웹 뷰어**: 사업자와 클라이언트 모두 웹에서 견적서 내용을 확인
- **공유 링크 생성**: 비로그인 클라이언트가 접근할 수 있는 고유 URL 제공
- **PDF 다운로드**: 견적서를 PDF 파일로 변환하여 오프라인 보관 및 인쇄 지원

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

## 개발 단계

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

### Phase 2: 타입 정의 및 데이터 모델 설계

- **Task 004: 타입 정의 및 인터페이스 설계** - 우선순위
  - See: `/tasks/004-type-definitions.md`
  - TypeScript 인터페이스 정의 (User, Quote, QuoteItem)
  - API 응답 타입 및 폼 데이터 타입 정의
  - 노션 API 응답 타입 매핑

- **Task 005: 데이터베이스 스키마 설계**
  - See: `/tasks/005-database-schema.md`
  - Supabase 테이블 스키마 설계 (users, quotes)
  - 관계 및 인덱스 정의
  - RLS(Row Level Security) 정책 설계

---

### Phase 3: UI/UX 완성 (더미 데이터 활용)

- **Task 006: 인증 페이지 UI 구현**
  - See: `/tasks/006-auth-pages-ui.md`
  - 로그인 페이지 폼 및 레이아웃 완성
  - 회원가입 페이지 폼 및 유효성 검사 UI
  - 인증 관련 에러 메시지 표시 UI

- **Task 007: 대시보드 레이아웃 및 설정 페이지 UI**
  - See: `/tasks/007-dashboard-settings-ui.md`
  - 대시보드 사이드바 네비게이션 완성
  - 설정 페이지 UI (노션 API 키, 데이터베이스 ID 입력 폼)
  - 연동 상태 표시 컴포넌트

- **Task 008: 견적서 목록 페이지 UI 구현**
  - See: `/tasks/008-quote-list-ui.md`
  - 견적서 카드 목록 컴포넌트 (더미 데이터)
  - 검색 및 필터링 UI
  - 동기화 버튼 및 상태 표시
  - 공유 링크 복사 버튼

- **Task 009: 견적서 상세 페이지 UI 구현**
  - See: `/tasks/009-quote-detail-ui.md`
  - 견적서 헤더 (회사 정보, 견적서 번호, 날짜)
  - 클라이언트 정보 섹션
  - 품목 테이블 컴포넌트
  - 총합계 및 비고 섹션
  - PDF 다운로드 버튼 UI

- **Task 010: 공유 견적서 페이지 UI 구현**
  - See: `/tasks/010-shared-quote-ui.md`
  - 공개 페이지 전용 레이아웃
  - 견적서 뷰어 컴포넌트 (읽기 전용)
  - PDF 다운로드 버튼

- **Task 011: 더미 데이터 및 Mock 유틸리티 작성**
  - See: `/tasks/011-mock-data.md`
  - 견적서 더미 데이터 생성 유틸리티
  - API 응답 Mock 데이터
  - 개발 환경 전용 시딩 스크립트

---

### Phase 4: 백엔드 인프라 및 인증 구현

- **Task 012: Supabase 프로젝트 설정 및 테이블 생성**
  - See: `/tasks/012-supabase-setup.md`
  - Supabase 프로젝트 연동 및 환경 변수 설정
  - users, quotes 테이블 생성 (SQL 마이그레이션)
  - RLS 정책 적용

- **Task 013: 인증 시스템 구현 (F010)**
  - See: `/tasks/013-authentication.md`
  - Supabase Auth 연동
  - 회원가입/로그인/로그아웃 API 연결
  - 보호된 라우트 미들웨어 구현
  - 세션 관리 및 사용자 상태 Provider
  - **테스트 체크리스트**: Playwright MCP를 활용한 인증 플로우 E2E 테스트

---

### Phase 5: 노션 연동 및 데이터 동기화

- **Task 014: 노션 API 클라이언트 설정**
  - See: `/tasks/014-notion-client.md`
  - @notionhq/client 설정 및 유틸리티 함수
  - 노션 데이터베이스 쿼리 함수 구현
  - 페이지네이션 및 Rate Limit 처리

- **Task 015: 노션 연동 설정 페이지 구현 (F011)**
  - See: `/tasks/015-notion-settings.md`
  - API 키 암호화 저장 로직
  - 데이터베이스 ID 저장 및 검증
  - 연동 테스트 API 엔드포인트
  - 설정 저장 API 연결
  - **테스트 체크리스트**: Playwright MCP를 활용한 설정 저장/불러오기 테스트

- **Task 016: 데이터 동기화 구현 (F012)**
  - See: `/tasks/016-data-sync.md`
  - 노션 → DB 동기화 API 엔드포인트
  - 노션 페이지 속성 → Quote 모델 매핑
  - 수동 동기화 트리거 구현
  - 동기화 상태 및 히스토리 관리
  - **테스트 체크리스트**: Playwright MCP를 활용한 동기화 정합성 테스트

---

### Phase 6: 견적서 핵심 기능 구현

- **Task 017: 견적서 목록 조회 API 구현 (F001, F002)**
  - See: `/tasks/017-quote-list-api.md`
  - 견적서 목록 조회 API 엔드포인트
  - React Query 연동 (캐싱, 리페칭)
  - 페이지네이션 처리
  - 더미 데이터를 실제 API로 교체
  - **테스트 체크리스트**: Playwright MCP를 활용한 목록 조회 API 테스트

- **Task 018: 견적서 상세 조회 구현 (F003)**
  - See: `/tasks/018-quote-detail-api.md`
  - 견적서 상세 조회 API 엔드포인트
  - 사업자용 상세 페이지 데이터 연동
  - 권한 검증 (본인 견적서만 조회)
  - **테스트 체크리스트**: Playwright MCP를 활용한 상세 조회 및 권한 테스트

- **Task 019: 공유 링크 생성 구현 (F005)**
  - See: `/tasks/019-share-link.md`
  - UUID 기반 shareId 생성 로직
  - 공유 링크 생성/재생성 API
  - 클립보드 복사 기능 구현
  - **테스트 체크리스트**: Playwright MCP를 활용한 공유 링크 생성 및 접근 테스트

- **Task 020: 공유 견적서 페이지 구현 (F003)**
  - See: `/tasks/020-shared-quote-page.md`
  - shareId 기반 견적서 조회 API
  - 공개 페이지 데이터 연동
  - 존재하지 않는 링크 처리 (404)
  - **테스트 체크리스트**: Playwright MCP를 활용한 공유 페이지 접근 테스트

---

### Phase 7: PDF 생성 기능 구현

- **Task 021: PDF 템플릿 컴포넌트 작성**
  - See: `/tasks/021-pdf-template.md`
  - react-pdf/renderer 설정
  - 견적서 PDF 레이아웃 컴포넌트
  - 한글 폰트 임베딩 처리
  - 스타일링 (회사 정보, 품목 테이블, 합계)

- **Task 022: PDF 다운로드 구현 (F004)**
  - See: `/tasks/022-pdf-download.md`
  - PDF 생성 API 엔드포인트 (서버 사이드)
  - 다운로드 버튼 연동
  - 로딩 상태 및 에러 처리
  - 공유 페이지에서도 PDF 다운로드 지원
  - **테스트 체크리스트**: Playwright MCP를 활용한 PDF 생성 및 다운로드 테스트

---

### Phase 8: 테스트, 최적화 및 배포

- **Task 023: 통합 테스트 및 E2E 테스트**
  - See: `/tasks/023-integration-tests.md`
  - 주요 사용자 플로우 E2E 테스트
  - API 엔드포인트 통합 테스트
  - 에러 핸들링 및 엣지 케이스 테스트
  - **테스트 체크리스트**: Playwright MCP를 활용한 전체 사용자 플로우 검증

- **Task 024: 성능 최적화**
  - See: `/tasks/024-performance.md`
  - React Query 캐싱 전략 최적화
  - 이미지 및 폰트 최적화
  - 코드 스플리팅 및 번들 사이즈 최적화
  - 로딩 상태 및 Skeleton UI 개선

- **Task 025: Vercel 배포 및 프로덕션 설정**
  - See: `/tasks/025-deployment.md`
  - Vercel 프로젝트 설정
  - 환경 변수 설정 (프로덕션)
  - 도메인 연결 및 HTTPS 설정
  - 실제 노션 데이터베이스 연동 테스트

---

## 기능 ID 매핑

| 기능 ID | 기능명 | 관련 Task |
|---------|--------|-----------|
| F001 | 노션 API 연동 | Task 014, 017, 018 |
| F002 | 견적서 목록 조회 | Task 008, 017 |
| F003 | 견적서 상세 보기 | Task 009, 010, 018, 020 |
| F004 | PDF 다운로드 | Task 021, 022 |
| F005 | 공유 링크 생성 | Task 019 |
| F010 | 기본 인증 | Task 006, 013 |
| F011 | 노션 연동 설정 | Task 007, 015 |
| F012 | 데이터 동기화 | Task 016 |

---

## 예상 개발 일정

| Phase | 기간 | 비고 |
|-------|------|------|
| Phase 1 | 완료 | 프로젝트 초기 설정 완료 |
| Phase 2 | 1일 | 타입 정의 및 스키마 설계 |
| Phase 3 | 2-3일 | 더미 데이터 기반 전체 UI 완성 |
| Phase 4 | 1-2일 | Supabase 연동 및 인증 |
| Phase 5 | 2-3일 | 노션 API 연동 핵심 |
| Phase 6 | 2-3일 | 견적서 CRUD 및 공유 기능 |
| Phase 7 | 2-3일 | PDF 생성 기능 |
| Phase 8 | 2-3일 | 테스트 및 배포 |

**총 예상 개발 기간: 12-18일**

---

## 기술 스택 요약

- **프론트엔드**: Next.js 16 (App Router), React 19, TypeScript
- **스타일링**: TailwindCSS v4, shadcn/ui
- **상태 관리**: @tanstack/react-query, nuqs, react-hook-form + Zod
- **백엔드**: Supabase (Auth, PostgreSQL)
- **외부 연동**: @notionhq/client
- **PDF 생성**: react-pdf/renderer
- **배포**: Vercel
