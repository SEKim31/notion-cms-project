# Task 025: Vercel 배포 및 프로덕션 설정

## 개요

노션 견적서 뷰어 MVP를 Vercel에 배포하고 프로덕션 환경을 설정합니다.

## 관련 기능

- 모든 MVP 기능의 프로덕션 배포

## 현재 상태

- Phase 1-7 개발 완료
- Phase 8 테스트/최적화 완료 (Task 023, 024)
- 로컬 개발 환경에서 정상 동작 확인됨

## 구현 단계

### 1단계: 빌드 검증 ✅
- [x] 프로덕션 빌드 테스트 (`npm run build`)
- [x] 빌드 오류 해결
- [x] 번들 크기 확인

### 2단계: 환경 변수 문서화 ✅
- [x] `.env.example` 파일 생성
- [x] 필수 환경 변수 목록 정리
- [x] 환경 변수 설명 주석 추가

### 3단계: Vercel 배포 가이드 ✅
- [x] 배포 전 체크리스트 작성
- [x] Vercel 환경 변수 설정 가이드
- [x] 도메인 설정 가이드

### 4단계: 프로덕션 빌드 최종 검증 ✅
- [x] 빌드 성공 확인
- [x] 정적 분석 통과 확인 (경고만 존재, 오류 없음)
- [x] 배포 준비 완료

## 필수 환경 변수

| 변수명 | 설명 | 필수 여부 |
|--------|------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase 프로젝트 URL | 필수 |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase 익명 키 | 필수 |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase 서비스 롤 키 | 필수 |
| `ENCRYPTION_KEY` | API 키 암호화용 키 | 필수 |
| `NOTION_API_KEY` | 노션 API 키 (환경변수 방식) | 선택 |
| `NOTION_DATABASE_ID` | 노션 데이터베이스 ID | 선택 |

## 수락 기준

- [x] 프로덕션 빌드 오류 없음
- [x] `.env.example` 파일 생성됨
- [x] 배포 가이드 문서 작성됨
- [x] Vercel CLI 또는 Git 연동으로 배포 가능 상태

## 생성된 파일

- `.env.example` - 환경 변수 예시 파일
- `docs/DEPLOYMENT.md` - Vercel 배포 가이드 문서

## 참고 자료

- [Vercel Next.js 배포 문서](https://vercel.com/docs/frameworks/nextjs)
- [Supabase 환경 변수 설정](https://supabase.com/docs/guides/getting-started)
