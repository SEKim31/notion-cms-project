# Supabase 프로젝트 설정 가이드

이 문서는 노션 견적서 뷰어 MVP를 위한 Supabase 프로젝트 설정 방법을 안내합니다.

## 1. Supabase 프로젝트 생성

1. [Supabase 대시보드](https://supabase.com/dashboard)에 로그인합니다.
2. "New Project" 버튼을 클릭합니다.
3. 프로젝트 정보를 입력합니다:
   - **Name**: `notion-quote-viewer` (원하는 이름)
   - **Database Password**: 안전한 비밀번호 설정
   - **Region**: 가장 가까운 리전 선택 (예: Northeast Asia - Tokyo)
4. "Create new project" 버튼을 클릭하고 프로젝트 생성을 기다립니다.

## 2. 환경 변수 설정

1. Supabase 대시보드에서 **Settings > API**로 이동합니다.
2. 다음 값들을 복사합니다:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role** → `SUPABASE_SERVICE_ROLE_KEY` (보안 주의!)

3. 프로젝트 루트에 `.env.local` 파일을 생성하고 값을 입력합니다:

```bash
# Supabase 설정
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# 서비스 역할 키 (서버 사이드 전용, 절대 클라이언트에 노출하지 마세요!)
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# 암호화 키 (노션 API 키 암호화용, 32바이트)
# 생성 명령어: openssl rand -base64 32
ENCRYPTION_KEY=your-32-byte-encryption-key-here
```

## 3. 데이터베이스 테이블 생성

Supabase 대시보드의 **SQL Editor**에서 다음 SQL 파일들을 순서대로 실행합니다:

### 3.1. Users 테이블 생성
파일: `supabase/migrations/001_create_users_table.sql`

### 3.2. Quotes 테이블 생성
파일: `supabase/migrations/002_create_quotes_table.sql`

### 3.3. RLS 정책 설정
파일: `supabase/migrations/003_create_rls_policies.sql`

**실행 순서가 중요합니다!** 001 → 002 → 003 순서로 실행하세요.

## 4. Authentication 설정

1. Supabase 대시보드에서 **Authentication > Providers**로 이동합니다.
2. **Email** 프로바이더가 활성화되어 있는지 확인합니다.
3. 필요시 **Confirm email** 옵션을 비활성화합니다 (개발 환경):
   - **Authentication > Settings > Email > Confirm email** 끄기

## 5. 설정 확인

### 테이블 확인
Supabase 대시보드에서 **Table Editor**로 이동하여 다음 테이블이 생성되었는지 확인합니다:
- `users`
- `quotes`

### RLS 정책 확인
**Authentication > Policies**에서 다음 정책이 설정되었는지 확인합니다:
- `users_select_own`, `users_insert_own`, `users_update_own`, `users_delete_own`
- `quotes_select_own`, `quotes_select_by_share_id`, `quotes_insert_own`, `quotes_update_own`, `quotes_delete_own`

## 6. 타입 생성 (선택사항)

Supabase CLI를 사용하여 TypeScript 타입을 자동 생성할 수 있습니다:

```bash
# Supabase CLI 설치
npm install -g supabase

# 로그인
supabase login

# 타입 생성
export SUPABASE_PROJECT_ID=your-project-id
npm run supabase:types
```

## 7. 연결 테스트

개발 서버를 실행하고 연결을 테스트합니다:

```bash
npm run dev
```

브라우저에서 `http://localhost:3000`에 접속하여 오류가 없는지 확인합니다.

## 트러블슈팅

### "Invalid API key" 오류
- `.env.local` 파일에 환경 변수가 올바르게 설정되었는지 확인합니다.
- 개발 서버를 재시작합니다.

### "relation does not exist" 오류
- SQL 마이그레이션을 순서대로 실행했는지 확인합니다.

### RLS 정책 오류
- `auth.uid()`가 올바르게 작동하는지 확인합니다.
- 사용자가 로그인되어 있는지 확인합니다.

## 참고 링크

- [Supabase 공식 문서](https://supabase.com/docs)
- [Next.js + Supabase 가이드](https://supabase.com/docs/guides/auth/server-side/nextjs)
- [Supabase Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
