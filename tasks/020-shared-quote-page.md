# Task 020: 공유 견적서 페이지 구현 (F003)

## 개요

shareId 기반으로 견적서를 조회하고 공유 페이지에 실제 데이터를 연동합니다.
인증 불필요한 공개 API를 구현하여 외부 사용자(클라이언트)가 견적서를 확인할 수 있도록 합니다.

## 관련 파일

### 수정 대상
- `app/quote/share/[shareId]/page.tsx` - 더미 데이터 → 실제 API 연동

### 생성 대상
- `app/api/quotes/share/[shareId]/route.ts` - shareId 기반 조회 API (공개)
- `app/quote/share/[shareId]/not-found.tsx` - 404 에러 페이지

### 참조 파일
- `types/api.ts` - SharedQuoteResponse 타입 (이미 정의됨)
- `types/database.ts` - Quote, QuoteItem, QuoteStatus 타입
- `lib/supabase/server.ts` - Supabase 클라이언트

## 수락 기준

1. **API 구현**
   - `GET /api/quotes/share/[shareId]` 엔드포인트 구현
   - 인증 불필요 (공개 API)
   - shareId로 견적서 조회
   - 존재하지 않는 shareId는 404 반환

2. **페이지 연동**
   - 더미 데이터 대신 실제 Supabase 데이터 사용
   - 회사명은 견적서 소유자의 company_name에서 가져오기
   - 로딩 상태 표시

3. **에러 처리**
   - 존재하지 않는 shareId → 커스텀 404 페이지
   - API 오류 → 에러 메시지 표시

## 구현 단계

### Step 1: shareId 기반 조회 API 구현
- [x] `app/api/quotes/share/[shareId]/route.ts` 파일 생성
- [x] GET 핸들러 구현 (인증 불필요)
- [x] shareId로 quotes 테이블 조회
- [x] 견적서 소유자의 company_name 함께 조회
- [x] SharedQuoteResponse 형식으로 응답 반환

### Step 2: 공유 페이지 데이터 연동
- [x] 더미 데이터 import 제거
- [x] API 호출로 견적서 데이터 fetch
- [x] companyName 동적 표시
- [x] 로딩 상태 처리

### Step 3: 404 에러 페이지 구현
- [x] `app/quote/share/[shareId]/not-found.tsx` 파일 생성
- [x] 사용자 친화적 에러 메시지 표시
- [x] 홈으로 돌아가기 링크 제공

### Step 4: API 테스트
- [x] 잘못된 형식 shareId → 400 에러 반환
- [x] 존재하지 않는 shareId → 404 에러 반환
- [ ] 유효한 shareId → 견적서 데이터 반환 (수동 테스트 필요)

## 테스트 체크리스트

### API 테스트
- [x] `GET /api/quotes/share/[invalid-format]` → 400 Bad Request
- [x] `GET /api/quotes/share/[not-exist-shareId]` → 404 Not Found
- [ ] `GET /api/quotes/share/[valid-shareId]` → 200 OK (수동 테스트)

### 페이지 테스트
- [ ] 유효한 공유 링크 접속 → 견적서 내용 표시 (수동 테스트)
- [x] 잘못된 공유 링크 접속 → 404 페이지 표시
- [ ] 견적서 정보 정확히 표시 (수동 테스트)
- [ ] 회사명 표시 확인 (수동 테스트)

## 참고 사항

- 공유 API는 RLS 정책에서 제외되어야 함 (share_id 기반 공개 조회)
- 현재 RLS 정책: `(user_id = auth.uid())` - 공유 조회는 서비스 키 사용
- PDF 다운로드 버튼은 Task 022에서 구현
