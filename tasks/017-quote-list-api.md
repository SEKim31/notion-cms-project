# Task 017: 견적서 목록 조회 API 구현 (F001, F002)

## 개요
Supabase에서 견적서 목록을 조회하는 API를 구현하고, 현재 더미 데이터를 사용하는 quotes 페이지를 실제 API 데이터로 교체합니다.

## 관련 기능
- **F001**: 노션 API 연동 (동기화된 데이터 조회)
- **F002**: 견적서 목록 조회

## 구현 범위

### 1. API 엔드포인트
- `GET /api/quotes` - 견적서 목록 조회
  - 페이지네이션 지원 (page, limit)
  - 검색 지원 (search: 견적서 번호, 클라이언트명)
  - 정렬 지원 (sortBy, sortOrder)
  - 상태 필터 (status)

### 2. React Query 훅
- `useQuotes` - 견적서 목록 조회 훅
- React Query 캐싱 및 리페칭 설정

### 3. 페이지 연동
- quotes 페이지에서 더미 데이터 → 실제 API 교체
- 동기화 후 자동 리페칭

## 관련 파일

### API
- `app/api/quotes/route.ts` - 견적서 목록 API (신규)

### 훅
- `hooks/use-quotes.ts` - React Query 훅 (신규)

### 페이지
- `app/(dashboard)/quotes/page.tsx` - 더미 데이터 → API 교체

## 구현 단계

### Step 1: API 엔드포인트 구현 ✅
- [x] GET /api/quotes 구현
- [x] 인증 검증 (로그인 사용자만)
- [x] 페이지네이션 처리
- [x] 검색 및 필터 처리

### Step 2: React Query 훅 구현 ✅
- [x] useQuotes 훅 작성
- [x] 캐싱 전략 설정

### Step 3: 페이지 연동 ✅
- [x] quotes 페이지 API 연동
- [x] 로딩/에러 상태 처리
- [x] 동기화 후 리페칭

### Step 4: 테스트 ✅
- [x] API 엔드포인트 테스트
- [x] Playwright MCP E2E 테스트

## 검증 기준

1. **기능 검증**
   - 로그인한 사용자의 견적서만 조회됨
   - 페이지네이션이 정상 동작
   - 동기화 후 목록이 갱신됨

2. **에러 처리**
   - 비로그인 시 401 응답
   - 데이터 조회 실패 시 에러 메시지

3. **UI/UX**
   - 로딩 상태 표시
   - 데이터 없을 때 빈 상태 표시

## 테스트 체크리스트

### Playwright MCP 테스트 시나리오

1. **목록 조회**
   - 로그인 후 /quotes 페이지 접속
   - 동기화된 견적서 목록 확인

2. **동기화 후 갱신**
   - 동기화 버튼 클릭
   - 목록 자동 갱신 확인

## 완료 상태
- **API 구현**: ✅ 완료
- **훅 구현**: ✅ 완료
- **페이지 연동**: ✅ 완료
- **테스트**: ✅ 완료 (Playwright MCP E2E 테스트)

## 수정 이력
- 2026-01-03: Task 017 구현 완료
  - `GET /api/quotes` API 엔드포인트 구현
  - `useQuotes` React Query 훅 구현
  - quotes 페이지에서 더미 데이터 → 실제 API 데이터로 교체
