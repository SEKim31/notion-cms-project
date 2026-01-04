# Task 018: 견적서 상세 조회 구현 (F003)

## 개요
사업자가 개별 견적서의 상세 정보를 조회할 수 있는 API와 페이지 연동을 구현합니다.

## 관련 기능
- **F001**: 노션 API 연동
- **F003**: 견적서 상세 보기

## 관련 파일
- `app/api/quotes/[id]/route.ts` (생성)
- `app/(dashboard)/quotes/[id]/page.tsx` (수정)
- `hooks/use-quote.ts` (생성)
- `types/api.ts` (참조)
- `types/database.ts` (참조)

## 수락 기준
1. `GET /api/quotes/[id]` API 엔드포인트가 정상 동작
2. 로그인한 사용자만 API 접근 가능
3. 본인 소유 견적서만 조회 가능 (권한 검증)
4. 견적서 상세 페이지가 실제 API 데이터로 렌더링
5. 존재하지 않는 견적서 접근 시 404 처리
6. 로딩 및 에러 상태 처리

## 구현 단계

### 1단계: API 엔드포인트 구현 - [x]
- `app/api/quotes/[id]/route.ts` 생성
- GET 메서드 구현
  - 인증 확인 (401 Unauthorized)
  - 견적서 조회
  - 권한 확인 (403 Forbidden) - 본인 견적서만
  - 사용자 회사명 포함하여 응답
- 응답 형식: `ApiResponse<QuoteDetailResponse>`

### 2단계: useQuote 훅 생성 - [x]
- `hooks/use-quote.ts` 생성
- React Query 기반 단일 견적서 조회
- 쿼리 키: `['quote', id]`
- 에러 핸들링 (401, 403, 404)

### 3단계: 상세 페이지 연동 - [x]
- `app/(dashboard)/quotes/[id]/page.tsx` 수정
- 더미 데이터 → 실제 API 호출로 교체
- 로딩 UI (Skeleton) 추가
- 에러 처리 (notFound, 권한 에러)

### 4단계: E2E 테스트 - [x]
- Playwright MCP를 활용한 테스트
- 테스트 시나리오 실행

## API 명세

### GET /api/quotes/[id]

**요청**
- Headers: `Cookie` (세션 인증)
- Path Parameter: `id` - 견적서 UUID

**응답 (200 OK)**
```json
{
  "success": true,
  "data": {
    "quote": {
      "id": "uuid",
      "userId": "uuid",
      "notionPageId": "string",
      "quoteNumber": "Q-2024-001",
      "clientName": "ABC Corp",
      "clientContact": "홍길동",
      "clientPhone": "010-1234-5678",
      "clientEmail": "hong@abc.com",
      "items": [
        {
          "name": "웹 개발",
          "quantity": 1,
          "unitPrice": 5000000,
          "amount": 5000000,
          "description": "반응형 웹사이트"
        }
      ],
      "totalAmount": 5000000,
      "issueDate": "2024-01-15",
      "validUntil": "2024-02-15",
      "notes": "부가세 별도",
      "shareId": "abc123",
      "status": "SENT",
      "createdAt": "2024-01-15T00:00:00Z",
      "updatedAt": "2024-01-15T00:00:00Z"
    },
    "user": {
      "companyName": "테크 솔루션즈"
    }
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

1. **인증 테스트**
   - [x] 비로그인 상태에서 상세 페이지 접근 시 로그인 페이지로 리다이렉트
   - [x] 로그인 후 상세 페이지 정상 접근

2. **견적서 조회 테스트**
   - [x] 본인 견적서 상세 정보 정상 표시
   - [x] 견적서 헤더 정보 (번호, 날짜, 상태) 확인
   - [x] 클라이언트 정보 확인
   - [x] 품목 테이블 정상 표시
   - [x] 합계 금액 정상 표시

3. **권한 테스트**
   - [x] 다른 사용자의 견적서 접근 시 403 또는 404 응답

4. **에러 처리 테스트**
   - [x] 존재하지 않는 견적서 ID로 접근 시 404 페이지 표시
   - [x] 잘못된 형식의 ID로 접근 시 적절한 에러 처리

## 참고 사항
- ~~현재 더미 데이터 사용 중 (`getMockQuoteById`)~~ → 실제 Supabase API 연동 완료
- Quote 타입에 모든 필드 정의됨 (`types/database.ts`)
- QuoteDetailResponse 타입 정의됨 (`types/api.ts`)

## 완료일
- 2026-01-03
