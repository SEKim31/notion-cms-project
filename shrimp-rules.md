# Development Guidelines

## 프로젝트 개요

| 항목 | 값 |
|------|-----|
| 프로젝트명 | 노션 견적서 뷰어 MVP |
| 프레임워크 | Next.js 16 (App Router) + React 19 |
| 언어 | TypeScript 5.x |
| 스타일링 | TailwindCSS v4 + shadcn/ui (new-york) |
| 상태 관리 | @tanstack/react-query, nuqs, react-hook-form |
| 백엔드 | Supabase (Auth + PostgreSQL) |
| 외부 연동 | Notion API (@notionhq/client) |

---

## 프로젝트 구조

### 디렉토리 구조

```
app/
├── (marketing)/     # 마케팅 페이지 (홈, 이용약관, 개인정보처리방침)
├── (auth)/          # 인증 페이지 (로그인, 회원가입)
├── (dashboard)/     # 대시보드 (견적서 목록, 상세, 설정)
├── quote/share/[shareId]/  # 공유 견적서 (공개)
└── globals.css      # 전역 스타일 및 CSS 변수

components/
├── ui/              # shadcn/ui 컴포넌트 (수정 금지)
├── layout/          # 레이아웃 컴포넌트
├── common/          # 공통 유틸리티 컴포넌트
└── features/        # 기능별 컴포넌트

lib/
├── utils.ts         # cn() 등 유틸리티 함수
└── validations/     # Zod 검증 스키마

providers/           # Context Provider 컴포넌트
hooks/               # 커스텀 훅
types/               # TypeScript 타입 정의
```

### Route Group 배치 규칙

| 페이지 유형 | 위치 | 예시 |
|------------|------|------|
| 마케팅/랜딩 | `app/(marketing)/` | 홈, 이용약관, 개인정보 |
| 인증 관련 | `app/(auth)/` | 로그인, 회원가입 |
| 로그인 필요 | `app/(dashboard)/` | 견적서 목록, 상세, 설정 |
| 공개 페이지 | `app/quote/share/` | 공유 견적서 |

---

## 코드 표준

### 언어 규칙

- **주석**: 한국어로 작성
- **커밋 메시지**: 한국어로 작성
- **문서**: 한국어로 작성
- **변수/함수명**: 영어 사용 (camelCase)
- **컴포넌트명**: 영어 사용 (PascalCase)

### 포맷팅

- **들여쓰기**: 2칸 (스페이스)
- **문자열**: 쌍따옴표 (`"string"`)
- **세미콜론**: 생략하지 않음

### Import 규칙

```tsx
// ✅ 올바른 예시: Path Alias 사용
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { User } from "@/types"

// ❌ 잘못된 예시: 상대 경로 사용 금지
import { Button } from "../../../components/ui/button"
```

---

## 기능 구현 표준

### 클라이언트 컴포넌트

```tsx
// ✅ 파일 최상단에 명시
"use client"

import { useState } from "react"
// ...
```

### 조건부 클래스 병합

```tsx
import { cn } from "@/lib/utils"

// ✅ cn() 유틸리티 사용
<div className={cn("base-class", condition && "conditional-class")} />

// ❌ 문자열 직접 조합 금지
<div className={`base-class ${condition ? "conditional-class" : ""}`} />
```

### 폼 구현 패턴

```tsx
// 1. lib/validations/에 Zod 스키마 정의
// 2. react-hook-form + @hookform/resolvers 사용
// 3. shadcn Form 컴포넌트 활용

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormField, FormItem } from "@/components/ui/form"
import { loginSchema, type LoginFormData } from "@/lib/validations/auth"

const form = useForm<LoginFormData>({
  resolver: zodResolver(loginSchema),
})
```

### API 호출 패턴

```tsx
// ✅ @tanstack/react-query 사용
import { useQuery, useMutation } from "@tanstack/react-query"

// ❌ useState + useEffect 조합 금지
```

### URL 상태 관리

```tsx
// ✅ nuqs 라이브러리 사용
import { useQueryState } from "nuqs"

// ❌ URLSearchParams 직접 조작 금지
```

---

## 컴포넌트 규칙

### shadcn/ui 컴포넌트

- **위치**: `components/ui/`
- **추가 방법**: `npx shadcn@latest add <component>` 명령어만 사용
- **수정**: **직접 수정 금지** (필요시 래퍼 컴포넌트 생성)

```bash
# ✅ 올바른 추가 방법
npx shadcn@latest add table
npx shadcn@latest add toast

# ❌ 직접 파일 생성 금지
```

### 컴포넌트 배치

| 유형 | 위치 | index.ts 필요 |
|------|------|--------------|
| UI 기본 | `components/ui/` | 불필요 (shadcn 관리) |
| 레이아웃 | `components/layout/` | **필수** |
| 공통 유틸리티 | `components/common/` | **필수** |
| 기능별 | `components/features/{feature}/` | **필수** |

### index.ts 패턴

```tsx
// components/common/index.ts
export { Logo } from "./logo"
export { ThemeToggle } from "./theme-toggle"
export { LoadingSpinner } from "./loading-spinner"
```

---

## Provider 규칙

### Provider 순서 (변경 금지)

```tsx
// providers/index.tsx
<ThemeProvider>
  <QueryProvider>
    <NuqsProvider>
      {children}
    </NuqsProvider>
  </QueryProvider>
</ThemeProvider>
```

### 새 Provider 추가 시

1. `providers/{name}-provider.tsx` 생성
2. `providers/index.tsx`에서 적절한 위치에 래핑

---

## 스타일링 규칙

### CSS 변수

- **정의 위치**: `app/globals.css`
- **색상 시스템**: oklch 색상 사용
- **다크모드**: `.dark` 클래스로 구분

```css
/* ✅ CSS 변수 사용 */
:root {
  --primary: oklch(0.205 0 0);
}
.dark {
  --primary: oklch(0.922 0 0);
}
```

### 색상 사용

```tsx
// ✅ 시맨틱 색상 클래스 사용
<div className="bg-background text-foreground" />
<button className="bg-primary text-primary-foreground" />

// ❌ 하드코딩된 색상 금지
<div className="bg-white text-black" />
<div className="bg-[#ffffff]" />
```

---

## 타입 정의

### 공통 타입

- **위치**: `types/index.ts`
- **API 응답**: `ApiResponse<T>` 사용
- **페이지네이션**: `PaginatedResponse<T>` 사용

### 새 타입 추가 규칙

```tsx
// types/index.ts에 추가
export interface Quote {
  id: string
  quoteNumber: string
  clientName: string
  // ...
}
```

---

## 검증 스키마

### Zod 스키마 위치

- **디렉토리**: `lib/validations/`
- **명명 규칙**: `{feature}.ts` (예: auth.ts, quote.ts)

### 스키마 패턴

```tsx
// lib/validations/auth.ts
import { z } from "zod"

export const loginSchema = z.object({
  email: z.string().email("올바른 이메일 형식이 아닙니다."),
  password: z.string().min(8, "비밀번호는 8자 이상이어야 합니다."),
})

export type LoginFormData = z.infer<typeof loginSchema>
```

---

## 파일 동시 수정 규칙

### 새 컴포넌트 추가 시

| 작업 | 수정 파일 |
|------|----------|
| 공통 컴포넌트 | `components/common/{name}.tsx` + `components/common/index.ts` |
| 레이아웃 컴포넌트 | `components/layout/{name}.tsx` + `components/layout/index.ts` |
| 기능 컴포넌트 | `components/features/{feature}/{name}.tsx` + `index.ts` |

### Provider 추가 시

| 작업 | 수정 파일 |
|------|----------|
| 새 Provider | `providers/{name}-provider.tsx` + `providers/index.tsx` |

### 타입/검증 추가 시

| 작업 | 수정 파일 |
|------|----------|
| 새 타입 | `types/index.ts` (또는 `types/{domain}.ts` + `types/index.ts`) |
| 새 검증 스키마 | `lib/validations/{feature}.ts` |

---

## AI 의사결정 기준

### 컴포넌트 선택

```
새 UI 요소 필요?
├── shadcn/ui에 존재? → npx shadcn@latest add 사용
├── 레이아웃 관련? → components/layout/에 생성
├── 여러 곳에서 재사용? → components/common/에 생성
└── 특정 기능 전용? → components/features/{feature}/에 생성
```

### 상태 관리 선택

```
상태 유형?
├── 서버 데이터? → @tanstack/react-query
├── URL 쿼리 파라미터? → nuqs
├── 폼 상태? → react-hook-form
├── 테마? → next-themes (이미 설정됨)
└── 로컬 UI 상태? → useState
```

### 스타일 수정

```
스타일 변경 필요?
├── 전역 색상 변경? → app/globals.css CSS 변수 수정
├── 컴포넌트 조건부 스타일? → cn() 유틸리티 사용
└── shadcn 컴포넌트 스타일? → 래퍼 컴포넌트 생성
```

---

## 금지 사항

### 절대 금지

- ❌ `components/ui/` 파일 직접 수정
- ❌ 상대 경로 import 사용 (`../` 대신 `@/` 사용)
- ❌ Provider 래핑 순서 변경
- ❌ 영어 주석/커밋 메시지 사용
- ❌ CSS 하드코딩 색상 사용

### 권장하지 않음

- ⚠️ useState + useEffect로 서버 데이터 관리 (react-query 사용)
- ⚠️ 문자열 템플릿으로 className 조합 (cn() 사용)
- ⚠️ 인라인 스타일 사용 (Tailwind 클래스 사용)
- ⚠️ any 타입 사용 (적절한 타입 정의)

---

## 참조 문서

| 문서 | 경로 | 설명 |
|------|------|------|
| PRD | `docs/PRD.md` | 제품 요구사항 정의 |
| 로드맵 | `docs/ROADMAP.md` | 개발 단계 및 태스크 |
| 프로젝트 가이드 | `CLAUDE.md` | Claude Code 가이드라인 |

---

## 개발 명령어

```bash
npm run dev      # 개발 서버 (localhost:3000)
npm run build    # 프로덕션 빌드
npm run lint     # ESLint 검사
npx shadcn@latest add <component>  # UI 컴포넌트 추가
```
