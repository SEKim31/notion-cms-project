# Task 016: 데이터 동기화 구현 (F012)

## 개요
노션 데이터베이스에서 견적서 데이터를 가져와 Supabase DB에 동기화하는 기능을 구현합니다.

## 관련 기능
- **F012**: 데이터 동기화 - 노션 데이터베이스와 수동/자동 동기화

## 구현 범위

### 1. 동기화 API 엔드포인트
- `GET /api/sync` - 동기화 상태 조회
- `POST /api/sync` - 동기화 실행 트리거

### 2. 노션 → Quote 데이터 매핑
- 노션 페이지 속성에서 Quote 필드로 변환
- 속성 타입별 추출 함수 (Title, Rich Text, Number, Date, Select 등)
- 커스텀 매핑 지원

### 3. 동기화 로직
- 전체 페이지 조회 (페이지네이션 처리)
- 신규/업데이트 감지 (notionPageId 기준)
- Upsert로 DB에 저장
- 기존 shareId 유지

### 4. 동기화 상태 관리
- 마지막 동기화 시간 추적
- 동기화 결과 (추가/업데이트 개수)
- 에러 핸들링

### 5. UI 연동
- React Query 훅 (`useSyncData`)
- 동기화 버튼 (QuoteListToolbar)
- 로딩 상태 및 결과 토스트 알림

## 관련 파일

### API
- `app/api/sync/route.ts` - 동기화 API 엔드포인트

### 노션 모듈
- `lib/notion/client.ts` - 노션 클라이언트 설정
- `lib/notion/queries.ts` - 데이터베이스 쿼리 함수
- `lib/notion/mapper.ts` - 페이지 → Quote 변환
- `lib/notion/rate-limit.ts` - Rate Limit 처리

### 동기화 모듈
- `lib/sync/status.ts` - 동기화 상태 관리
- `lib/sync/index.ts` - 모듈 re-export

### 훅 및 UI
- `hooks/use-sync.ts` - React Query 훅
- `components/features/quotes/quote-list-toolbar.tsx` - 동기화 버튼

## 구현 단계

### Step 1: 노션 클라이언트 설정 ✅
- [x] @notionhq/client 래퍼 구현
- [x] API 키 검증 유틸리티
- [x] 클라이언트 캐싱

### Step 2: 데이터베이스 쿼리 ✅
- [x] 단일 페이지 쿼리
- [x] 전체 페이지 조회 (페이지네이션)
- [x] Rate Limit 처리 (재시도 로직)
- [x] 수정된 페이지만 조회 (증분 동기화용)

### Step 3: 데이터 매핑 ✅
- [x] 속성 타입별 추출 함수
- [x] mapNotionPageToQuote 함수
- [x] 품목 파싱 (텍스트/JSON)
- [x] 기본 매핑 설정

### Step 4: 동기화 API ✅
- [x] GET /api/sync - 상태 조회
- [x] POST /api/sync - 동기화 실행
- [x] 환경 변수 또는 DB 설정 사용
- [x] 에러 핸들링

### Step 5: 동기화 상태 관리 ✅
- [x] getSyncStatus 함수
- [x] updateLastSyncTime 함수
- [x] SyncResult 타입 정의

### Step 6: UI 연동 ✅
- [x] useSyncData 훅
- [x] 동기화 버튼 연동
- [x] 토스트 알림

### Step 7: 테스트 ✅
- [x] API 엔드포인트 테스트
- [x] 동기화 플로우 E2E 테스트 (Playwright MCP)

## 검증 기준

1. **기능 검증**
   - 노션 데이터베이스에서 견적서 데이터 조회 가능
   - DB에 새 견적서 추가 (신규 페이지)
   - 기존 견적서 업데이트 (수정된 페이지)
   - 동기화 결과 메시지 표시

2. **에러 처리**
   - 노션 연결 설정 없을 때 안내 메시지
   - API 오류 시 에러 메시지 표시
   - Rate Limit 도달 시 자동 재시도

3. **UI/UX**
   - 동기화 버튼 클릭 시 로딩 상태 표시
   - 동기화 완료 시 결과 토스트
   - 마지막 동기화 시간 표시

## 테스트 체크리스트

### Playwright MCP 테스트 시나리오

1. **동기화 상태 조회**
   - 로그인 후 /quotes 페이지 접속
   - 노션 연동 상태 확인 (연동됨/연동 필요)

2. **수동 동기화 실행**
   - 동기화 버튼 클릭
   - 로딩 상태 확인
   - 완료 토스트 메시지 확인

3. **동기화 결과 반영**
   - 동기화 후 견적서 목록 갱신 확인
   - 마지막 동기화 시간 업데이트 확인

## 완료 상태
- **API 구현**: ✅ 완료
- **매핑 로직**: ✅ 완료
- **동기화 상태 관리**: ✅ 완료
- **UI 연동**: ✅ 완료
- **테스트**: ✅ 완료 (Playwright MCP E2E 테스트)

## 수정 이력
- 2026-01-03: `getSyncStatus` 함수에 환경 변수 설정 확인 로직 추가
- 2026-01-03: `updateLastSyncTime` 함수에 `last_sync_at` 컬럼 없는 경우 fallback 처리 추가
- 2026-01-03: quotes 페이지에서 초기 로딩 상태 처리 개선 (`isLoading || isSyncing`)
