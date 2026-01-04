# Task 022: PDF 다운로드 구현 (F004)

## 개요

견적서를 PDF 파일로 생성하여 다운로드하는 기능 구현. 사업자용 상세 페이지와 클라이언트용 공유 페이지 모두에서 사용 가능.

## 관련 기능

- **F004**: PDF 다운로드

## 선행 작업

- [x] Task 021: PDF 템플릿 컴포넌트 작성 (완료)
  - `lib/pdf/quote-document.tsx` - PDF 문서 컴포넌트
  - `lib/pdf/styles.ts` - 스타일 정의
  - `lib/pdf/fonts.ts` - Noto Sans KR 폰트 설정

## 구현 범위

### 1. PDF 생성 API 엔드포인트

#### 사업자용 API: `GET /api/quotes/[id]/pdf`
- 인증 필수 (로그인한 사용자만)
- 본인 소유 견적서만 PDF 생성 가능
- 응답: `application/pdf` Content-Type으로 PDF 파일 반환

#### 공유용 API: `GET /api/quotes/share/[shareId]/pdf`
- 인증 불필요 (공개 링크)
- shareId로 견적서 조회 후 PDF 생성
- 응답: `application/pdf` Content-Type으로 PDF 파일 반환

### 2. PDF 다운로드 훅

#### `hooks/use-pdf.ts`
```typescript
// PDF 다운로드 함수
export function usePdfDownload()
export function downloadPdf(quoteId: string, filename: string)
export function downloadSharedPdf(shareId: string, filename: string)
```

### 3. 컴포넌트 연동

#### `QuoteActions` 업데이트
- 더미 다운로드 로직 → 실제 API 호출

#### `SharedQuoteActions` 업데이트
- 더미 다운로드 로직 → 실제 API 호출

## 관련 파일

| 파일 | 타입 | 설명 |
|------|------|------|
| `app/api/quotes/[id]/pdf/route.ts` | CREATE | 사업자용 PDF API |
| `app/api/quotes/share/[shareId]/pdf/route.ts` | CREATE | 공유용 PDF API |
| `hooks/use-pdf.ts` | CREATE | PDF 다운로드 훅 |
| `components/features/quotes/quote-actions.tsx` | TO_MODIFY | API 연동 |
| `lib/pdf/quote-document.tsx` | REFERENCE | PDF 템플릿 |
| `lib/pdf/fonts.ts` | REFERENCE | 폰트 설정 |

## 구현 단계

### Step 1: 사업자용 PDF API 구현
- [ ] `app/api/quotes/[id]/pdf/route.ts` 생성
- [ ] 인증 및 권한 검증
- [ ] Supabase에서 견적서 데이터 조회
- [ ] @react-pdf/renderer로 PDF 생성
- [ ] Content-Disposition 헤더로 다운로드 파일명 설정

### Step 2: 공유용 PDF API 구현
- [ ] `app/api/quotes/share/[shareId]/pdf/route.ts` 생성
- [ ] shareId 검증
- [ ] Admin 클라이언트로 견적서 조회
- [ ] PDF 생성 및 반환

### Step 3: PDF 다운로드 훅 구현
- [ ] `hooks/use-pdf.ts` 생성
- [ ] fetch로 blob 다운로드
- [ ] 브라우저 다운로드 트리거

### Step 4: 컴포넌트 연동
- [ ] `QuoteActions`에서 실제 API 호출
- [ ] `SharedQuoteActions`에서 실제 API 호출
- [ ] 에러 처리 (toast 메시지)

## 기술 스택

- **@react-pdf/renderer**: PDF 생성 라이브러리
- **renderToStream/renderToBuffer**: 서버 사이드 PDF 렌더링
- **Noto Sans KR**: 한글 폰트 (public/fonts/)

## 검증 기준

1. 사업자가 본인 견적서를 PDF로 다운로드할 수 있다
2. 클라이언트가 공유 링크에서 PDF를 다운로드할 수 있다
3. 다운로드된 PDF에 한글이 정상 렌더링된다
4. PDF 파일명이 `견적서-{quoteNumber}.pdf` 형식이다
5. 권한 없는 사용자는 PDF 다운로드 불가 (사업자용)
6. 로딩 상태 표시 및 에러 처리가 정상 동작한다

## 테스트 체크리스트

### API 테스트
- [ ] 인증된 사용자가 본인 견적서 PDF 다운로드 성공
- [ ] 인증 없이 사업자용 API 접근 시 401 에러
- [ ] 타인 견적서 PDF 요청 시 403/404 에러
- [ ] 공유 링크로 PDF 다운로드 성공
- [ ] 존재하지 않는 shareId로 요청 시 404 에러

### UI/UX 테스트
- [ ] PDF 다운로드 버튼 클릭 시 로딩 표시
- [ ] 다운로드 완료 시 성공 toast
- [ ] 다운로드 실패 시 에러 toast
- [ ] 브라우저 다운로드 폴더에 파일 저장 확인

## 참고사항

- 폰트 파일 경로: `/public/fonts/NotoSansKR-*.ttf`
- PDF 생성 시간: 약 2-5초 소요 예상
- 서버리스 환경에서 메모리 제한 고려 필요
