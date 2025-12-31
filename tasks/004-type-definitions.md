# Task 004: 타입 정의 및 인터페이스 설계

## 개요

프로젝트 전반에서 사용할 TypeScript 인터페이스와 타입을 정의합니다.
데이터 모델, API 응답, 폼 데이터, 노션 API 응답 등의 타입을 체계적으로 구성합니다.

## 관련 파일

- `types/index.ts` - 공통 타입 (기존 파일 확장)
- `types/database.ts` - 데이터베이스 모델 타입
- `types/api.ts` - API 요청/응답 타입
- `types/notion.ts` - 노션 API 관련 타입
- `types/forms.ts` - 폼 데이터 타입

## 구현 사항

- [ ] User 인터페이스 정의
- [ ] Quote 인터페이스 정의
- [ ] QuoteItem 인터페이스 정의
- [ ] 노션 API 응답 타입 매핑
- [ ] API 응답 제네릭 타입 정의
- [ ] 폼 데이터 타입 정의

## 상세 구현 단계

### 1단계: 데이터베이스 모델 타입 (types/database.ts)

- [ ] User 인터페이스 정의
  ```typescript
  interface User {
    id: string
    email: string
    companyName: string
    notionApiKey?: string
    notionDatabaseId?: string
    createdAt: Date
    updatedAt: Date
  }
  ```

- [ ] Quote 인터페이스 정의
  ```typescript
  interface Quote {
    id: string
    userId: string
    notionPageId: string
    quoteNumber: string
    clientName: string
    clientContact: string
    clientPhone: string
    items: QuoteItem[]
    totalAmount: number
    issueDate: Date
    validUntil: Date
    notes?: string
    shareId: string
    createdAt: Date
    updatedAt: Date
  }
  ```

- [ ] QuoteItem 인터페이스 정의
  ```typescript
  interface QuoteItem {
    name: string
    quantity: number
    unitPrice: number
    amount: number
    description?: string
  }
  ```

### 2단계: API 타입 (types/api.ts)

- [ ] API 응답 제네릭 타입 확장
- [ ] 견적서 목록 응답 타입
- [ ] 견적서 상세 응답 타입
- [ ] 동기화 요청/응답 타입
- [ ] 설정 저장 요청/응답 타입

### 3단계: 노션 API 타입 (types/notion.ts)

- [ ] 노션 데이터베이스 속성 타입
- [ ] 노션 페이지 응답 타입
- [ ] 노션 → Quote 변환 함수 타입

### 4단계: 폼 데이터 타입 (types/forms.ts)

- [ ] 로그인 폼 데이터 타입
- [ ] 회원가입 폼 데이터 타입
- [ ] 설정 폼 데이터 타입

### 5단계: 타입 내보내기 정리

- [ ] types/index.ts에서 모든 타입 re-export
- [ ] 기존 타입과 새 타입 통합

## 수락 기준

- [ ] 모든 데이터 모델에 대한 TypeScript 인터페이스가 정의됨
- [ ] API 응답 타입이 일관성 있게 정의됨
- [ ] 타입 간 참조가 올바르게 설정됨
- [ ] ESLint/TypeScript 컴파일 에러 없음

## 참고 사항

- 관련 PRD 섹션: 데이터 모델
- 의존 작업: 없음 (첫 번째 우선순위 작업)
- 관련 기능 ID: 전체 (모든 기능에서 타입 사용)

---

## 변경 사항 요약

> 작업 완료 후 기록
