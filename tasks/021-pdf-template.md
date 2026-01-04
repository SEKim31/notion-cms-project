# Task 021: PDF 템플릿 컴포넌트 작성

## 개요

react-pdf/renderer를 사용하여 견적서 PDF 템플릿 컴포넌트를 구현합니다.
한글 폰트를 임베딩하여 한글이 정상적으로 출력되도록 합니다.

## 관련 파일

### 생성 대상
- `lib/pdf/fonts.ts` - 폰트 등록 설정
- `lib/pdf/styles.ts` - PDF 스타일 정의
- `lib/pdf/quote-document.tsx` - 견적서 PDF 문서 컴포넌트
- `public/fonts/` - 한글 폰트 파일

### 참조 파일
- `types/database.ts` - Quote, QuoteItem 타입

## 수락 기준

1. **라이브러리 설치**
   - @react-pdf/renderer 설치
   - 타입 정의 확인

2. **한글 폰트 설정**
   - Noto Sans KR 또는 Pretendard 폰트 사용
   - 폰트 파일 public 폴더에 추가
   - react-pdf에 폰트 등록

3. **PDF 템플릿 구현**
   - 견적서 헤더 (회사명, 견적서 번호, 날짜)
   - 클라이언트 정보 섹션
   - 품목 테이블
   - 총합계 금액
   - 비고/특이사항

## 구현 단계

### Step 1: 라이브러리 설치
- [x] @react-pdf/renderer 설치
- [x] 타입 확인

### Step 2: 한글 폰트 설정
- [x] 폰트 파일 다운로드 (Noto Sans KR)
- [x] public/fonts 폴더에 배치
- [x] lib/pdf/fonts.ts 작성

### Step 3: PDF 스타일 정의
- [x] lib/pdf/styles.ts 작성
- [x] 레이아웃 스타일
- [x] 테이블 스타일
- [x] 텍스트 스타일

### Step 4: PDF 문서 컴포넌트
- [x] lib/pdf/quote-document.tsx 작성
- [x] 헤더 섹션
- [x] 클라이언트 정보 섹션
- [x] 품목 테이블 섹션
- [x] 합계 및 비고 섹션

### Step 5: 빌드 테스트
- [x] npm run build 성공 확인
