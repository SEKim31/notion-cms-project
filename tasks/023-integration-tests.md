# Task 023: 통합 테스트 및 E2E 테스트

## 목표

Playwright를 활용하여 주요 사용자 플로우에 대한 E2E 테스트를 작성하고 검증합니다.

## 구현 기능

- **F010**: 기본 인증 (회원가입/로그인/로그아웃)
- **F002**: 견적서 목록 조회
- **F003**: 견적서 상세 보기
- **F004**: PDF 다운로드
- **F005**: 공유 링크 생성
- **F012**: 데이터 동기화

## 테스트 범위

### 1. 인증 플로우 (auth.spec.ts)

- [x] 로그인 페이지 접근
- [x] 잘못된 자격 증명으로 로그인 시도 시 에러 표시
- [x] 회원가입 페이지 접근
- [x] 폼 유효성 검사 동작 확인
- [x] 보호된 라우트 접근 시 로그인 페이지로 리디렉션
- [x] 보호된 API 엔드포인트 인증 검증

### 2. 견적서 목록 (quotes.spec.ts)

- [x] 견적서 목록 페이지 접근 제어
- [x] 홈 페이지 렌더링
- [x] 로그인 버튼 동작
- [x] 견적서 API 권한 검증

### 3. 견적서 상세 (quote-detail.spec.ts)

- [x] 견적서 상세 API 권한 검증
- [x] 견적서 PDF API 권한 검증
- [x] 공유 링크 생성 API 권한 검증
- [x] 공유 페이지 404 처리

### 4. 공유 기능 (share.spec.ts)

- [x] 공유 페이지 에러 처리
- [x] 공유 페이지 URL 라우팅
- [x] 공유 페이지 인증 불필요 확인
- [x] 공유 API 권한 검증

### 5. PDF 다운로드 (pdf.spec.ts)

- [x] 사업자용 PDF API 권한 검증
- [x] 공유용 PDF API 에러 처리
- [x] 공유용 PDF API 인증 불필요 확인
- [x] PDF Content-Type 검증

### 6. 노션 동기화 (sync.spec.ts)

- [x] 동기화 API 권한 검증
- [x] 동기화 API HTTP 메서드 검증
- [x] 노션 설정 API 검증
- [x] 설정 페이지 접근 제어

## 파일 구조

```
e2e/
├── auth.spec.ts           # 인증 플로우 테스트 (12개 테스트)
├── quotes.spec.ts         # 견적서 목록 테스트 (6개 테스트)
├── quote-detail.spec.ts   # 견적서 상세 테스트 (4개 테스트)
├── share.spec.ts          # 공유 기능 테스트 (7개 테스트)
├── pdf.spec.ts            # PDF 다운로드 테스트 (4개 테스트)
├── sync.spec.ts           # 동기화 테스트 (5개 테스트)
└── helpers/
    └── test-utils.ts      # 테스트 유틸리티
```

## 테스트 실행 방법

```bash
# 전체 테스트 실행
npx playwright test

# 특정 파일만 실행
npx playwright test e2e/auth.spec.ts

# UI 모드로 실행
npx playwright test --ui

# 리포트 확인
npx playwright show-report
```

## 수락 기준

1. ✅ 모든 E2E 테스트가 `npx playwright test` 명령으로 실행 가능
2. ✅ 주요 사용자 플로우가 테스트로 커버됨
3. ✅ 테스트 결과 리포트가 생성됨
4. ✅ CI 환경에서 실행 가능한 구성

## 관련 파일

- `playwright.config.ts` - Playwright 설정
- `e2e/*.spec.ts` - 테스트 파일들
- `e2e/helpers/test-utils.ts` - 테스트 헬퍼 함수
- `package.json` - 테스트 스크립트

## 진행 상황

- [x] Playwright 설치 및 브라우저 설정
- [x] playwright.config.ts 생성
- [x] 테스트 유틸리티 작성
- [x] 인증 플로우 테스트 작성
- [x] 견적서 목록/상세 테스트 작성
- [x] 공유 기능 테스트 작성
- [x] PDF 다운로드 테스트 작성
- [x] 동기화 테스트 작성
- [x] 전체 테스트 파일 구조 완성

## 테스트 커버리지 요약

| 테스트 파일 | 테스트 수 | 커버리지 영역 |
|-------------|-----------|---------------|
| auth.spec.ts | 12 | 인증 UI, API 권한 |
| quotes.spec.ts | 6 | 목록 페이지, API 권한 |
| quote-detail.spec.ts | 4 | 상세 API, 공유 페이지 |
| share.spec.ts | 7 | 공유 페이지, API |
| pdf.spec.ts | 4 | PDF API |
| sync.spec.ts | 5 | 동기화/설정 API |
| **총계** | **38** | - |
