# 노션 견적서 뷰어 - API 문서

이 문서는 노션 견적서 뷰어의 API 엔드포인트를 설명합니다.

---

## 목차

1. [인증](#1-인증)
2. [견적서 API](#2-견적서-api)
3. [동기화 API](#3-동기화-api)
4. [설정 API](#4-설정-api)
5. [이메일 발송 API](#5-이메일-발송-api)
6. [PDF API](#6-pdf-api)
7. [공유 API](#7-공유-api)

---

## 1. 인증

모든 보호된 API는 Supabase 인증 세션이 필요합니다.

### 인증 방식

- Cookie 기반 세션 인증
- `supabase-auth-token` 쿠키 사용

### 에러 응답

```json
{
  "success": false,
  "error": "인증이 필요합니다."
}
```

---

## 2. 견적서 API

### 2.1 견적서 목록 조회

```
GET /api/quotes
```

**Query Parameters:**

| 파라미터 | 타입 | 필수 | 설명 |
|---------|------|------|------|
| page | number | N | 페이지 번호 (기본값: 1) |
| limit | number | N | 페이지당 항목 수 (기본값: 10) |
| search | string | N | 검색어 (클라이언트명, 견적번호) |
| status | string | N | 상태 필터 (DRAFT, SENT, VIEWED, APPROVED, REJECTED, EXPIRED, COMPLETED) |
| sort | string | N | 정렬 기준 (createdAt, issueDate, totalAmount) |
| order | string | N | 정렬 순서 (asc, desc) |

**응답:**

```json
{
  "success": true,
  "data": {
    "quotes": [
      {
        "id": "uuid",
        "quoteNumber": "Q-2024-001",
        "clientName": "클라이언트 회사",
        "clientContact": "담당자명",
        "clientEmail": "client@example.com",
        "totalAmount": 1000000,
        "status": "DRAFT",
        "issueDate": "2024-01-15T00:00:00.000Z",
        "validUntil": "2024-02-15T00:00:00.000Z",
        "shareId": "share-uuid",
        "createdAt": "2024-01-15T00:00:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 50,
      "totalPages": 5
    }
  }
}
```

### 2.2 견적서 상세 조회

```
GET /api/quotes/[id]
```

**Path Parameters:**

| 파라미터 | 타입 | 필수 | 설명 |
|---------|------|------|------|
| id | UUID | Y | 견적서 ID |

**응답:**

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "quoteNumber": "Q-2024-001",
    "clientName": "클라이언트 회사",
    "clientContact": "담당자명",
    "clientPhone": "010-1234-5678",
    "clientEmail": "client@example.com",
    "items": [
      {
        "name": "품목명",
        "quantity": 10,
        "unitPrice": 50000,
        "amount": 500000,
        "description": "품목 설명"
      }
    ],
    "totalAmount": 1000000,
    "status": "DRAFT",
    "issueDate": "2024-01-15T00:00:00.000Z",
    "validUntil": "2024-02-15T00:00:00.000Z",
    "notes": "비고 내용",
    "shareId": "share-uuid",
    "sentAt": null,
    "sentTo": null,
    "createdAt": "2024-01-15T00:00:00.000Z",
    "updatedAt": "2024-01-15T00:00:00.000Z"
  }
}
```

---

## 3. 동기화 API

### 3.1 노션 데이터 동기화

```
POST /api/sync
```

**설명:**

노션 데이터베이스의 견적서 데이터를 앱 데이터베이스에 동기화합니다.

**응답:**

```json
{
  "success": true,
  "message": "동기화가 완료되었습니다.",
  "data": {
    "created": 5,
    "updated": 3,
    "total": 8
  }
}
```

**에러 응답:**

```json
{
  "success": false,
  "error": "노션 API 설정이 필요합니다."
}
```

---

## 4. 설정 API

### 4.1 노션 설정 조회

```
GET /api/settings/notion
```

**응답:**

```json
{
  "success": true,
  "data": {
    "hasApiKey": true,
    "hasDatabaseId": true,
    "databaseId": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
  }
}
```

### 4.2 노션 설정 저장

```
POST /api/settings/notion
```

**Request Body:**

```json
{
  "notionApiKey": "ntn_xxxxxxxxxxxxx",
  "notionDatabaseId": "xxxxxxxxxxxxxxxx"
}
```

**응답:**

```json
{
  "success": true,
  "message": "설정이 저장되었습니다."
}
```

### 4.3 노션 연동 테스트

```
POST /api/settings/notion/test
```

**Request Body:**

```json
{
  "notionApiKey": "ntn_xxxxxxxxxxxxx",
  "notionDatabaseId": "xxxxxxxxxxxxxxxx"
}
```

**응답:**

```json
{
  "success": true,
  "message": "노션 연동 테스트 성공",
  "data": {
    "databaseTitle": "견적서 데이터베이스",
    "pageCount": 10
  }
}
```

---

## 5. 이메일 발송 API

### 5.1 견적서 이메일 발송

```
POST /api/quotes/[id]/send-email
```

**Path Parameters:**

| 파라미터 | 타입 | 필수 | 설명 |
|---------|------|------|------|
| id | UUID | Y | 견적서 ID |

**Request Body:**

```json
{
  "to": "client@example.com",
  "subject": "[회사명] 견적서 발송 안내",
  "message": "첨부된 견적서를 확인해주세요."
}
```

| 필드 | 타입 | 필수 | 설명 |
|-----|------|------|------|
| to | string | Y | 수신자 이메일 주소 |
| subject | string | N | 이메일 제목 (기본값 자동 생성) |
| message | string | N | 추가 메시지 |

**응답:**

```json
{
  "success": true,
  "message": "이메일이 성공적으로 발송되었습니다.",
  "emailId": "email-id-from-resend",
  "sentAt": "2024-01-15T10:30:00.000Z"
}
```

**에러 응답:**

| 상태 코드 | 설명 |
|----------|------|
| 400 | 잘못된 요청 (유효하지 않은 이메일 또는 UUID) |
| 401 | 인증 필요 |
| 403 | 권한 없음 (본인 소유 견적서 아님) |
| 404 | 견적서를 찾을 수 없음 |
| 500 | 이메일 발송 실패 |

```json
{
  "success": false,
  "message": "유효한 이메일 주소를 입력해주세요."
}
```

**주의사항:**

- 이메일 발송 성공 시 견적서 상태가 "SENT"로 자동 변경됩니다.
- `sentAt`과 `sentTo` 필드가 업데이트됩니다.
- PDF 파일이 첨부됩니다.

---

## 6. PDF API

### 6.1 견적서 PDF 다운로드 (인증 필요)

```
GET /api/quotes/[id]/pdf
```

**Path Parameters:**

| 파라미터 | 타입 | 필수 | 설명 |
|---------|------|------|------|
| id | UUID | Y | 견적서 ID |

**응답:**

- Content-Type: `application/pdf`
- Content-Disposition: `attachment; filename="견적서-Q-2024-001.pdf"`

### 6.2 공유 견적서 PDF 다운로드 (인증 불필요)

```
GET /api/quotes/share/[shareId]/pdf
```

**Path Parameters:**

| 파라미터 | 타입 | 필수 | 설명 |
|---------|------|------|------|
| shareId | UUID | Y | 공유 ID |

**응답:**

- Content-Type: `application/pdf`
- Content-Disposition: `attachment; filename="견적서-Q-2024-001.pdf"`

---

## 7. 공유 API

### 7.1 공유 견적서 조회 (인증 불필요)

```
GET /api/quotes/share/[shareId]
```

**Path Parameters:**

| 파라미터 | 타입 | 필수 | 설명 |
|---------|------|------|------|
| shareId | UUID | Y | 공유 ID |

**응답:**

견적서 상세 조회와 동일한 형식

### 7.2 공유 링크 생성/재생성

```
POST /api/quotes/[id]/share
```

**Path Parameters:**

| 파라미터 | 타입 | 필수 | 설명 |
|---------|------|------|------|
| id | UUID | Y | 견적서 ID |

**응답:**

```json
{
  "success": true,
  "data": {
    "shareId": "new-share-uuid",
    "shareUrl": "https://domain.com/quote/share/new-share-uuid"
  }
}
```

---

## 에러 코드 참조

| HTTP 상태 코드 | 설명 |
|---------------|------|
| 200 | 성공 |
| 400 | 잘못된 요청 |
| 401 | 인증 필요 |
| 403 | 권한 없음 |
| 404 | 리소스를 찾을 수 없음 |
| 405 | 허용되지 않는 메서드 |
| 500 | 서버 내부 오류 |

---

## TypeScript 타입 정의

자세한 타입 정의는 `types/api.ts` 파일을 참조하세요.

```typescript
// 이메일 발송 요청
interface SendEmailRequest {
  to: string
  subject?: string
  message?: string
}

// 이메일 발송 응답
interface SendEmailResponse {
  success: boolean
  message: string
  emailId?: string
  sentAt?: string
}
```
