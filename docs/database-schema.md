# 데이터베이스 스키마 문서

노션 견적서 뷰어 MVP의 Supabase PostgreSQL 데이터베이스 스키마 문서입니다.

## 개요

- **데이터베이스**: PostgreSQL (Supabase)
- **인증**: Supabase Auth
- **보안**: Row Level Security (RLS) 적용

---

## 테이블 구조

### 1. users (사용자)

사업자 계정 정보를 저장하는 테이블입니다.

| 컬럼명 | 타입 | Nullable | 기본값 | 설명 |
|--------|------|----------|--------|------|
| `id` | UUID | NOT NULL | - | PK, Supabase Auth user ID |
| `email` | VARCHAR(255) | NOT NULL | - | 로그인 이메일 (UNIQUE) |
| `company_name` | VARCHAR(255) | NOT NULL | - | 사업자명/회사명 |
| `notion_api_key` | TEXT | NULL | - | 노션 API 키 (암호화 저장) |
| `notion_database_id` | VARCHAR(255) | NULL | - | 노션 데이터베이스 ID |
| `created_at` | TIMESTAMPTZ | NOT NULL | NOW() | 계정 생성일 |
| `updated_at` | TIMESTAMPTZ | NOT NULL | NOW() | 정보 수정일 |

**인덱스:**
- `idx_users_email`: 이메일 검색
- `idx_users_created_at`: 생성일 정렬

**트리거:**
- `set_users_updated_at`: UPDATE 시 `updated_at` 자동 갱신

---

### 2. quotes (견적서)

견적서 데이터를 저장하는 테이블입니다.

| 컬럼명 | 타입 | Nullable | 기본값 | 설명 |
|--------|------|----------|--------|------|
| `id` | UUID | NOT NULL | uuid_generate_v4() | PK |
| `user_id` | UUID | NOT NULL | - | FK → users.id |
| `notion_page_id` | VARCHAR(255) | NOT NULL | - | 노션 페이지 ID (UNIQUE) |
| `quote_number` | VARCHAR(100) | NOT NULL | - | 견적서 번호 |
| `client_name` | VARCHAR(255) | NOT NULL | - | 클라이언트 회사명 |
| `client_contact` | VARCHAR(255) | NULL | - | 클라이언트 담당자 |
| `client_phone` | VARCHAR(50) | NULL | - | 클라이언트 연락처 |
| `client_email` | VARCHAR(255) | NULL | - | 클라이언트 이메일 |
| `items` | JSONB | NOT NULL | '[]' | 품목 목록 |
| `total_amount` | DECIMAL(15,2) | NOT NULL | 0 | 총 금액 |
| `issue_date` | DATE | NOT NULL | - | 발행일 |
| `valid_until` | DATE | NULL | - | 유효기간 |
| `notes` | TEXT | NULL | - | 비고/특이사항 |
| `share_id` | VARCHAR(255) | NOT NULL | uuid_generate_v4() | 공유 링크 ID (UNIQUE) |
| `status` | quote_status | NOT NULL | 'DRAFT' | 견적서 상태 |
| `created_at` | TIMESTAMPTZ | NOT NULL | NOW() | 데이터 생성일 |
| `updated_at` | TIMESTAMPTZ | NOT NULL | NOW() | 마지막 동기화 시간 |

**인덱스:**
- `idx_quotes_user_id`: 사용자별 조회
- `idx_quotes_quote_number`: 견적서 번호 검색
- `idx_quotes_client_name`: 클라이언트명 검색
- `idx_quotes_share_id`: 공유 ID 검색
- `idx_quotes_status`: 상태별 조회
- `idx_quotes_issue_date`: 발행일 정렬
- `idx_quotes_created_at`: 생성일 정렬
- `idx_quotes_user_issue_date`: 복합 인덱스 (사용자별 최신순)

**제약조건:**
- `check_quote_items_valid`: items JSONB 구조 검증

**트리거:**
- `set_quotes_updated_at`: UPDATE 시 `updated_at` 자동 갱신

---

## ENUM 타입

### quote_status (견적서 상태)

| 값 | 설명 |
|----|------|
| `DRAFT` | 작성 중 |
| `SENT` | 발송됨 |
| `VIEWED` | 조회됨 |
| `EXPIRED` | 만료됨 |

---

## JSONB 구조

### items (품목 목록)

```json
[
  {
    "name": "품목명",
    "quantity": 1,
    "unitPrice": 100000,
    "amount": 100000,
    "description": "품목 설명 (선택)"
  }
]
```

| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| `name` | string | O | 품목명 |
| `quantity` | number | O | 수량 |
| `unitPrice` | number | O | 단가 |
| `amount` | number | O | 금액 (수량 × 단가) |
| `description` | string | X | 품목 설명 |

---

## RLS (Row Level Security) 정책

### users 테이블

| 정책명 | 작업 | 조건 | 설명 |
|--------|------|------|------|
| `users_select_own` | SELECT | `auth.uid() = id` | 본인 정보만 조회 |
| `users_insert_own` | INSERT | `auth.uid() = id` | 본인 ID로만 생성 |
| `users_update_own` | UPDATE | `auth.uid() = id` | 본인 정보만 수정 |
| `users_delete_own` | DELETE | `auth.uid() = id` | 본인 계정만 삭제 |

### quotes 테이블

| 정책명 | 작업 | 조건 | 설명 |
|--------|------|------|------|
| `quotes_select_own` | SELECT | `auth.uid() = user_id` | 본인 견적서만 조회 |
| `quotes_select_by_share_id` | SELECT | `true` | 공유 링크로 조회 허용 |
| `quotes_insert_own` | INSERT | `auth.uid() = user_id` | 본인 ID로만 생성 |
| `quotes_update_own` | UPDATE | `auth.uid() = user_id` | 본인 견적서만 수정 |
| `quotes_delete_own` | DELETE | `auth.uid() = user_id` | 본인 견적서만 삭제 |

---

## 보안 함수

### get_shared_quote(share_id)

공유 링크로 견적서를 조회하는 함수입니다. 회사명과 함께 견적서 정보를 반환합니다.

```sql
SELECT * FROM get_shared_quote('share-id-here');
```

### mark_quote_as_viewed(share_id)

공유 링크로 조회 시 견적서 상태를 VIEWED로 변경합니다.

```sql
SELECT mark_quote_as_viewed('share-id-here');
```

---

## ER 다이어그램

```
┌─────────────────────────────────────┐
│              auth.users             │
│         (Supabase Auth 관리)         │
├─────────────────────────────────────┤
│ id (UUID) PK                        │
│ email                               │
│ ...                                 │
└──────────────────┬──────────────────┘
                   │
                   │ 1:1
                   ▼
┌─────────────────────────────────────┐
│              users                  │
├─────────────────────────────────────┤
│ id (UUID) PK, FK → auth.users.id    │
│ email (VARCHAR) UNIQUE              │
│ company_name (VARCHAR)              │
│ notion_api_key (TEXT)               │
│ notion_database_id (VARCHAR)        │
│ created_at (TIMESTAMPTZ)            │
│ updated_at (TIMESTAMPTZ)            │
└──────────────────┬──────────────────┘
                   │
                   │ 1:N
                   ▼
┌─────────────────────────────────────┐
│              quotes                 │
├─────────────────────────────────────┤
│ id (UUID) PK                        │
│ user_id (UUID) FK → users.id        │
│ notion_page_id (VARCHAR) UNIQUE     │
│ quote_number (VARCHAR)              │
│ client_name (VARCHAR)               │
│ client_contact (VARCHAR)            │
│ client_phone (VARCHAR)              │
│ client_email (VARCHAR)              │
│ items (JSONB)                       │
│ total_amount (DECIMAL)              │
│ issue_date (DATE)                   │
│ valid_until (DATE)                  │
│ notes (TEXT)                        │
│ share_id (VARCHAR) UNIQUE           │
│ status (quote_status)               │
│ created_at (TIMESTAMPTZ)            │
│ updated_at (TIMESTAMPTZ)            │
└─────────────────────────────────────┘
```

---

## TypeScript 타입 매핑

테이블 컬럼과 TypeScript 인터페이스(`types/database.ts`)의 매핑:

| SQL 컬럼명 | TypeScript 필드명 | 비고 |
|------------|------------------|------|
| `user_id` | `userId` | snake_case → camelCase |
| `notion_page_id` | `notionPageId` | snake_case → camelCase |
| `quote_number` | `quoteNumber` | snake_case → camelCase |
| `client_name` | `clientName` | snake_case → camelCase |
| `client_contact` | `clientContact` | snake_case → camelCase |
| `client_phone` | `clientPhone` | snake_case → camelCase |
| `client_email` | `clientEmail` | snake_case → camelCase |
| `total_amount` | `totalAmount` | snake_case → camelCase |
| `issue_date` | `issueDate` | snake_case → camelCase |
| `valid_until` | `validUntil` | snake_case → camelCase |
| `share_id` | `shareId` | snake_case → camelCase |
| `created_at` | `createdAt` | snake_case → camelCase |
| `updated_at` | `updatedAt` | snake_case → camelCase |
| `company_name` | `companyName` | snake_case → camelCase |
| `notion_api_key` | `notionApiKey` | snake_case → camelCase |
| `notion_database_id` | `notionDatabaseId` | snake_case → camelCase |

---

## 마이그레이션 파일

| 순서 | 파일명 | 설명 |
|------|--------|------|
| 001 | `001_create_users_table.sql` | users 테이블 및 트리거 생성 |
| 002 | `002_create_quotes_table.sql` | quotes 테이블, ENUM, 제약조건 생성 |
| 003 | `003_create_rls_policies.sql` | RLS 정책 및 보안 함수 생성 |

---

## 주의사항

1. **notion_api_key 암호화**: 애플리케이션 레벨에서 암호화/복호화 처리 필요
2. **share_id 보안**: UUID 형태로 추측 불가능하게 생성
3. **JSONB 검증**: items 컬럼은 구조 검증 제약조건 적용됨
4. **CASCADE 삭제**: 사용자 삭제 시 관련 견적서도 함께 삭제됨
