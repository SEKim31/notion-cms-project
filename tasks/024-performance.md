# Task 024: 성능 최적화

## 목표

애플리케이션의 로딩 속도, 번들 사이즈, 사용자 경험을 개선하기 위한 성능 최적화를 수행합니다.

## 현재 상태 분석

### React Query 캐싱
- 기본 staleTime 설정 (1분, 5분)
- 쿼리별 세분화된 캐싱 전략 미흡
- prefetch 훅 구현됨 (usePrefetchQuotes, usePrefetchQuote)

### 번들 사이즈
- @react-pdf/renderer (~180KB) - 모든 페이지에서 로드됨
- @notionhq/client (~90KB) - 서버 전용이어야 함
- Dynamic import 미사용

### 로딩 상태
- 기본 LoadingSpinner, Skeleton 컴포넌트 존재
- 페이지별 Skeleton UI 미구현
- React Suspense 활용 안됨

---

## 구현 항목

### 1. 번들 사이즈 최적화 (우선순위: 높음)

#### 1.1 PDF 컴포넌트 Dynamic Import
- [ ] PDF Document 컴포넌트 lazy loading 적용
- [ ] PDF 다운로드 버튼 클릭 시에만 로드

#### 1.2 Next.js 설정 최적화
- [ ] next.config.ts 번들 분석 설정
- [ ] 서버 전용 모듈 분리 확인

### 2. React Query 캐싱 최적화 (우선순위: 중간)

#### 2.1 쿼리별 캐싱 전략
- [ ] 견적서 목록: staleTime 2분, cacheTime 10분
- [ ] 견적서 상세: staleTime 5분, cacheTime 30분
- [ ] 설정 정보: staleTime 10분, cacheTime 60분

#### 2.2 프리페칭 전략
- [ ] 목록 → 상세 페이지 이동 시 prefetch
- [ ] 대시보드 초기 진입 시 견적서 목록 prefetch

### 3. Skeleton UI 개선 (우선순위: 중간)

#### 3.1 페이지별 Skeleton 컴포넌트
- [ ] QuoteListSkeleton - 견적서 목록 페이지
- [ ] QuoteDetailSkeleton - 견적서 상세 페이지
- [ ] SettingsSkeleton - 설정 페이지

#### 3.2 React Query 로딩 상태 연동
- [ ] isLoading 시 Skeleton 표시
- [ ] isFetching 시 부분 로딩 표시

### 4. Suspense 및 스트리밍 (우선순위: 낮음)

#### 4.1 페이지별 loading.tsx
- [ ] (dashboard)/quotes/loading.tsx
- [ ] (dashboard)/quotes/[id]/loading.tsx
- [ ] (dashboard)/settings/loading.tsx

---

## 파일 구조

```
# 생성/수정할 파일
lib/
├── pdf/
│   └── lazy-loader.ts         # PDF 동적 로딩 유틸리티

components/
├── skeleton/
│   ├── quote-list-skeleton.tsx
│   ├── quote-detail-skeleton.tsx
│   └── settings-skeleton.tsx

hooks/
├── use-quotes.ts              # 캐싱 전략 최적화
├── use-quote.ts               # 캐싱 전략 최적화
└── use-prefetch.ts            # 프리페칭 훅 통합

app/
├── (dashboard)/
│   ├── quotes/
│   │   ├── loading.tsx        # 목록 로딩
│   │   └── [id]/
│   │       └── loading.tsx    # 상세 로딩
│   └── settings/
│       └── loading.tsx        # 설정 로딩

next.config.ts                 # 번들 최적화 설정
```

---

## 상세 구현 단계

### Step 1: 번들 분석 도구 설정

```bash
# 번들 분석기 설치
npm install @next/bundle-analyzer --save-dev
```

**next.config.ts 수정:**
```typescript
import bundleAnalyzer from '@next/bundle-analyzer'

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
})

const nextConfig = {
  // 기존 설정
}

export default withBundleAnalyzer(nextConfig)
```

### Step 2: PDF 동적 로딩

**lib/pdf/lazy-loader.ts:**
```typescript
// PDF 라이브러리를 필요할 때만 로드
export async function loadPdfLibrary() {
  const { pdf } = await import('@react-pdf/renderer')
  const { QuoteDocument } = await import('./quote-document')
  return { pdf, QuoteDocument }
}
```

### Step 3: React Query 캐싱 상수 정의

**lib/query/cache-config.ts:**
```typescript
export const CACHE_CONFIG = {
  quotes: {
    list: { staleTime: 2 * 60 * 1000, cacheTime: 10 * 60 * 1000 },
    detail: { staleTime: 5 * 60 * 1000, cacheTime: 30 * 60 * 1000 },
  },
  settings: { staleTime: 10 * 60 * 1000, cacheTime: 60 * 60 * 1000 },
  sync: { staleTime: 1 * 60 * 1000, cacheTime: 5 * 60 * 1000 },
}
```

### Step 4: Skeleton 컴포넌트 구현

**components/skeleton/quote-list-skeleton.tsx:**
```typescript
// 견적서 카드 형태의 Skeleton 3-6개 표시
// 카드 헤더, 금액, 날짜 영역 Skeleton
```

**components/skeleton/quote-detail-skeleton.tsx:**
```typescript
// 견적서 헤더 Skeleton
// 클라이언트 정보 Skeleton
// 품목 테이블 Skeleton (3-5행)
// 합계 영역 Skeleton
```

---

## 수락 기준

1. **번들 사이즈**
   - [x] PDF 컴포넌트가 서버에서만 로드됨 (API Route)
   - [x] optimizePackageImports로 tree-shaking 최적화 적용

2. **캐싱**
   - [x] 견적서 목록: staleTime 2분, gcTime 10분 설정
   - [x] 견적서 상세: staleTime 5분, gcTime 30분 설정
   - [x] 쿼리 키 팩토리로 일관된 캐시 관리

3. **로딩 UX**
   - [x] 모든 주요 페이지에서 Skeleton UI 표시
   - [x] Next.js loading.tsx 파일로 자동 로딩 처리

4. **측정 지표**
   - [ ] Lighthouse Performance 점수 90점 이상
   - [ ] LCP (Largest Contentful Paint) 2.5초 이내
   - [ ] FCP (First Contentful Paint) 1.8초 이내

---

## 테스트 체크리스트

### 번들 분석 ✅
- [x] `npm run analyze` 스크립트 추가
- [x] PDF 라이브러리가 API Route(서버)에서만 사용됨 확인

### 캐싱 테스트 ✅
- [x] staleTime, gcTime 설정 완료
- [x] queryKeys 팩토리로 일관된 쿼리 키 관리
- [ ] Network 탭에서 캐시 동작 확인 (수동 테스트 필요)

### Skeleton UI 테스트 ✅
- [x] QuoteListSkeleton, QuoteDetailSkeleton, SettingsSkeleton 구현
- [x] loading.tsx 파일로 Next.js 자동 로딩 처리
- [ ] 느린 3G 환경에서 Skeleton 표시 확인 (수동 테스트 필요)

### 성능 측정 (배포 후 수행)
- [ ] Chrome DevTools Lighthouse 실행
- [ ] WebPageTest 또는 PageSpeed Insights 측정

---

## 수동 테스트 가이드

### Lighthouse 성능 측정 방법
```bash
# 1. 프로덕션 빌드 실행
npm run build
npm run start

# 2. Chrome DevTools 열기 (F12)
# 3. Lighthouse 탭 선택
# 4. "Analyze page load" 클릭
# 5. Performance 점수 확인 (목표: 90점 이상)
```

### 캐시 동작 확인 방법
1. Chrome DevTools → Network 탭 열기
2. `/quotes` 페이지 방문
3. 다른 페이지 이동 후 `/quotes` 재방문
4. API 요청 없이 캐시에서 로드되는지 확인 (staleTime 2분 내)

### Skeleton UI 확인 방법
1. Chrome DevTools → Network 탭 → Throttling → "Slow 3G" 선택
2. `/quotes` 페이지 새로고침
3. 로딩 중 Skeleton UI가 표시되는지 확인
4. 실제 데이터로 자연스럽게 전환되는지 확인

---

## 관련 파일

**현재 파일 (수정 대상):**
- `hooks/use-quotes.ts` - 캐싱 전략
- `hooks/use-quote.ts` - 캐싱 전략
- `hooks/use-pdf.ts` - 동적 로딩
- `next.config.ts` - 번들 설정
- `providers/query-provider.tsx` - 기본 캐싱 설정

**참조 파일:**
- `lib/pdf/quote-document.tsx` - PDF 템플릿
- `components/ui/skeleton.tsx` - 기본 Skeleton
- `components/common/loading-spinner.tsx` - 로딩 스피너

---

## 진행 상황

### Step 1: 번들 분석 및 설정 ✅ 완료
- [x] @next/bundle-analyzer 설치
- [x] next.config.ts 번들 분석 설정
- [x] optimizePackageImports 적용 (lucide-react, Radix UI, date-fns)
- [x] 현재 번들 사이즈 측정: **1.4MB JS** (클라이언트 청크 합계)
- [x] PDF 렌더링은 이미 서버 API에서만 수행됨 (클라이언트 번들 미포함)

### Step 2: PDF 동적 로딩 ✅ 불필요
- [x] 확인 결과: PDF 라이브러리(@react-pdf/renderer)는 API Route에서만 사용
- [x] 클라이언트 번들에 포함되지 않음 (서버 전용)
- [x] 추가 동적 로딩 불필요

### Step 3: React Query 캐싱 최적화 ✅ 완료
- [x] lib/query/cache-config.ts 생성 (캐싱 설정 + 쿼리 키 팩토리)
- [x] hooks/use-quotes.ts 캐싱 적용 (staleTime: 2분, gcTime: 10분)
- [x] hooks/use-quote.ts 캐싱 적용 (staleTime: 5분, gcTime: 30분)
- [x] hooks/use-sync.ts 캐싱 적용 (staleTime: 1분, gcTime: 5분)

### Step 4: Skeleton UI 구현 ✅ 완료
- [x] components/skeleton/quote-list-skeleton.tsx
- [x] components/skeleton/quote-detail-skeleton.tsx
- [x] components/skeleton/settings-skeleton.tsx
- [x] components/skeleton/index.ts (exports)

### Step 5: 페이지별 loading.tsx ✅ 완료
- [x] (dashboard)/quotes/loading.tsx
- [x] (dashboard)/quotes/[id]/loading.tsx
- [x] (dashboard)/settings/loading.tsx

### Step 6: 성능 측정 및 검증
- [ ] Lighthouse 점수 측정
- [ ] 캐싱 동작 검증
- [ ] 최종 번들 사이즈 비교

---

## 참고 자료

- [Next.js Bundle Analyzer](https://nextjs.org/docs/app/building-your-application/optimizing/bundle-analyzer)
- [React Query Caching](https://tanstack.com/query/latest/docs/react/guides/caching)
- [Next.js Loading UI](https://nextjs.org/docs/app/building-your-application/routing/loading-ui-and-streaming)
- [Web Vitals](https://web.dev/vitals/)
