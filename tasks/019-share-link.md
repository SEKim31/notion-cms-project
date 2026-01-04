# Task 019: 공유 링크 생성 구현 (F005)

## 개요
클라이언트가 접근할 수 있는 고유 공유 링크(shareId)를 생성하고 관리하는 기능을 구현합니다.

## 관련 기능
- **F005**: 공유 링크 생성
- **F003**: 견적서 상세 보기 (공유 페이지)

## 현재 상태 분석

### 이미 구현된 기능
1. **shareId 자동 생성**: 노션 동기화 시 `uuidv4().replace(/-/g, "").slice(0, 16)` 형태로 생성됨
2. **클립보드 복사 기능**: `QuoteActions`, `QuoteCard` 컴포넌트에 구현됨
3. **공유 페이지 라우트**: `/quote/share/[shareId]` 경로 존재 (더미 데이터 사용 중)

### 구현 필요 기능
1. shareId 재생성 API (보안상 링크 변경이 필요한 경우)
2. UI에 재생성 버튼 추가 (선택적)

## 관련 파일
- `app/api/quotes/[id]/share/route.ts` (생성)
- `components/features/quotes/quote-actions.tsx` (수정)
- `hooks/use-share.ts` (생성)
- `types/api.ts` (참조)

## 수락 기준
1. `POST /api/quotes/[id]/share` API로 shareId 재생성 가능
2. 로그인한 사용자만 API 접근 가능
3. 본인 소유 견적서만 shareId 재생성 가능 (권한 검증)
4. 새 shareId 생성 시 기존 공유 링크는 무효화됨
5. UI에서 공유 링크 복사 및 재생성 가능
6. 클립보드 복사 성공/실패 토스트 메시지 표시

## 구현 단계

### 1단계: shareId 재생성 API 구현 - [x]
- `app/api/quotes/[id]/share/route.ts` 생성
- POST 메서드 구현
  - 인증 확인 (401 Unauthorized)
  - 견적서 조회
  - 권한 확인 (403 Forbidden) - 본인 견적서만
  - 새 shareId 생성 및 DB 업데이트
- GET 메서드 구현 (현재 shareId 조회)
- 응답 형식: `ApiResponse<ShareLinkResponse>`

### 2단계: useShare 훅 생성 - [x]
- `hooks/use-share.ts` 생성
- React Query 기반 shareId 재생성 mutation
- 성공 시 견적서 쿼리 무효화
- 클립보드 복사 유틸리티 함수 추가

### 3단계: UI 업데이트 - [x]
- `QuoteActions` 컴포넌트에 재생성 버튼 추가 (RefreshCw 아이콘)
- AlertDialog로 재생성 확인 다이얼로그 구현
- 로딩 및 에러 상태 처리

### 4단계: E2E 테스트 - [x]
- API 테스트 완료 (curl)
  - 비인증 상태 401 응답 확인
  - 잘못된 UUID 형식 처리 확인

## API 명세

### POST /api/quotes/[id]/share

**요청**
- Headers: `Cookie` (세션 인증)
- Path Parameter: `id` - 견적서 UUID

**응답 (200 OK)**
```json
{
  "success": true,
  "data": {
    "shareId": "abc123def456gh78",
    "shareUrl": "/quote/share/abc123def456gh78"
  }
}
```

**에러 응답**
- 401 Unauthorized: 로그인 필요
- 403 Forbidden: 권한 없음 (다른 사용자의 견적서)
- 404 Not Found: 견적서 없음
- 500 Internal Server Error: 서버 오류

## 테스트 체크리스트

### Playwright MCP 테스트 시나리오

1. **클립보드 복사 테스트**
   - [x] 견적서 상세 페이지에서 "공유 링크 복사" 버튼 클릭
   - [x] 토스트 메시지 "공유 링크가 클립보드에 복사되었습니다." 확인
   - [x] 복사된 URL 형식 검증 (`/quote/share/[shareId]`)

2. **공유 링크 재생성 테스트**
   - [x] 공유 링크 재생성 버튼 클릭
   - [x] 확인 다이얼로그 표시
   - [x] 재생성 후 새 shareId 확인
   - [ ] 기존 shareId로 접근 시 404 확인 (Task 020에서 API 연동 후 테스트)

3. **권한 테스트**
   - [x] 비로그인 상태에서 API 호출 시 401 응답
   - [x] 다른 사용자의 견적서 재생성 시도 시 403 응답

4. **공유 페이지 접근 테스트**
   - [ ] 유효한 shareId로 공유 페이지 정상 접근 (Task 020에서 API 연동 후 테스트)
   - [ ] 잘못된 shareId로 접근 시 404 페이지 표시 (Task 020에서 API 연동 후 테스트)

## shareId 생성 규칙
- 형식: UUID v4에서 하이픈 제거 후 앞 16자리 사용
- 예: `abc123def456gh78`
- 추측 불가능한 난수 기반
- 재생성 시 기존 ID 완전 대체 (복구 불가)

## 참고 사항
- 현재 동기화 시 shareId가 자동 생성됨 (`app/api/sync/route.ts`)
- 클립보드 복사는 `navigator.clipboard.writeText()` 사용
- 토스트 알림은 `sonner` 라이브러리 사용

## 완료일
- 2026-01-04
