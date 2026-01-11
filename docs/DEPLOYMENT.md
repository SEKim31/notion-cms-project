# 노션 견적서 뷰어 - Vercel 배포 가이드

## 사전 요구 사항

1. **Vercel 계정**: https://vercel.com/signup
2. **Supabase 프로젝트**: https://app.supabase.com
3. **노션 Integration**: https://www.notion.so/my-integrations

---

## 배포 전 체크리스트

- [ ] 로컬에서 `npm run build` 성공 확인
- [ ] Supabase 테이블 및 RLS 정책 설정 완료
- [ ] 노션 Integration 생성 및 데이터베이스 연결 완료
- [ ] 환경 변수 값 준비 완료

---

## 배포 방법

### 방법 1: Vercel Dashboard (권장)

1. **GitHub 저장소 연결**
   - Vercel Dashboard에서 "Import Project" 클릭
   - GitHub 저장소 선택 및 권한 부여

2. **프로젝트 설정**
   - Framework Preset: Next.js (자동 감지됨)
   - Root Directory: `./` (기본값)
   - Build Command: `npm run build` (기본값)
   - Output Directory: `.next` (자동 설정됨)

3. **환경 변수 설정**
   아래 환경 변수를 Vercel Dashboard에서 설정:

   **필수 환경 변수:**

   | 변수명 | 설명 | 환경 |
   |--------|------|------|
   | `NEXT_PUBLIC_SUPABASE_URL` | Supabase 프로젝트 URL | Production, Preview |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase 익명 키 | Production, Preview |
   | `SUPABASE_SERVICE_ROLE_KEY` | Supabase 서비스 롤 키 | Production, Preview |
   | `ENCRYPTION_KEY` | API 키 암호화용 키 | Production, Preview |

   **선택 환경 변수 (노션 연동):**

   | 변수명 | 설명 | 환경 |
   |--------|------|------|
   | `NOTION_API_KEY` | 노션 API 키 | Production |
   | `NOTION_DATABASE_ID` | 노션 데이터베이스 ID | Production |

   **선택 환경 변수 (v2 이메일 발송):**

   | 변수명 | 설명 | 환경 |
   |--------|------|------|
   | `RESEND_API_KEY` | Resend 이메일 서비스 API 키 | Production |
   | `EMAIL_FROM` | 발신자 이메일 주소 | Production |
   | `NEXT_PUBLIC_APP_URL` | 앱 기본 URL (공유 링크용) | Production |

4. **배포**
   - "Deploy" 버튼 클릭
   - 빌드 로그 확인 및 완료 대기

### 방법 2: Vercel CLI

```bash
# Vercel CLI 설치
npm i -g vercel

# 프로젝트 디렉토리에서 실행
vercel

# 프로덕션 배포
vercel --prod
```

---

## 환경 변수 설정 상세

### Supabase 설정

1. Supabase Dashboard → Settings → API 이동
2. 다음 값을 복사:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role** → `SUPABASE_SERVICE_ROLE_KEY`

### 암호화 키 생성

```bash
# 터미널에서 32바이트 base64 키 생성
openssl rand -base64 32
```

생성된 값을 `ENCRYPTION_KEY`에 설정합니다.

### 노션 API 설정

1. https://www.notion.so/my-integrations 에서 새 Integration 생성
2. Integration Token을 `NOTION_API_KEY`에 설정
3. 노션 데이터베이스 페이지에서:
   - 우측 상단 ⋮ 메뉴 → "연결" → 생성한 Integration 추가
   - 데이터베이스 URL에서 32자리 ID를 `NOTION_DATABASE_ID`에 설정

### 이메일 발송 설정 (v2)

1. https://resend.com 에서 계정 생성
2. API Keys 페이지에서 새 API 키 생성
3. 생성된 키를 `RESEND_API_KEY`에 설정
4. `EMAIL_FROM` 설정:
   - **무료 티어**: `onboarding@resend.dev` 사용
   - **프로덕션**: 도메인 인증 후 실제 이메일 주소 사용
5. `NEXT_PUBLIC_APP_URL`을 배포된 도메인으로 설정:
   - 예: `https://your-app.vercel.app`

---

## 도메인 설정

### 커스텀 도메인 연결

1. Vercel Dashboard → Project → Settings → Domains
2. 도메인 입력 및 추가
3. DNS 설정:
   - **A 레코드**: `76.76.19.19`
   - **CNAME 레코드**: `cname.vercel-dns.com`

### SSL 인증서

- Vercel에서 자동으로 Let's Encrypt SSL 인증서 발급
- 추가 설정 불필요

---

## 배포 후 확인 사항

1. **기본 기능 테스트 (v1)**
   - [ ] 홈페이지 로딩 확인
   - [ ] 회원가입/로그인 정상 동작
   - [ ] 노션 동기화 정상 동작
   - [ ] 견적서 목록/상세 조회 정상
   - [ ] 공유 링크 접근 가능
   - [ ] PDF 다운로드 정상

2. **v2 기능 테스트**
   - [ ] 견적서 상태 배지 표시 확인
   - [ ] 상태별 필터링 동작 확인
   - [ ] 이메일 발송 버튼 표시 확인
   - [ ] 이메일 발송 다이얼로그 동작
   - [ ] 이메일 발송 후 상태 변경 확인

3. **성능 확인**
   - [ ] Vercel Analytics에서 성능 지표 확인
   - [ ] 초기 로딩 시간 3초 이내 확인

4. **보안 확인**
   - [ ] 환경 변수가 클라이언트에 노출되지 않음
   - [ ] 인증 없이 대시보드 접근 불가
   - [ ] 다른 사용자의 견적서에 접근 불가

---

## 문제 해결

### 빌드 실패

1. **TypeScript 오류**
   ```bash
   npm run build
   ```
   로컬에서 빌드 테스트 후 오류 수정

2. **환경 변수 누락**
   - Vercel Dashboard에서 모든 필수 환경 변수가 설정되었는지 확인
   - `NEXT_PUBLIC_` 접두사가 올바른지 확인

### 런타임 오류

1. **Supabase 연결 실패**
   - Supabase 프로젝트 URL과 키가 올바른지 확인
   - RLS 정책이 올바르게 설정되었는지 확인

2. **노션 동기화 실패**
   - Integration이 데이터베이스에 연결되었는지 확인
   - API 키와 데이터베이스 ID가 올바른지 확인

---

## 유지보수

### 자동 배포

- main 브랜치 푸시 시 자동 프로덕션 배포
- PR 생성 시 Preview 환경 자동 생성

### 롤백

1. Vercel Dashboard → Deployments
2. 이전 배포 선택 → "Promote to Production"

### 로그 확인

1. Vercel Dashboard → Logs
2. 함수 실행 로그 및 에러 확인 가능
