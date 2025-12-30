import type { Metadata } from "next"
import {
  Zap,
  Shield,
  Palette,
  Smartphone,
  Code2,
  Search,
  Lock,
  LayoutDashboard,
} from "lucide-react"

export const metadata: Metadata = {
  title: "기능",
  description: "스타터킷의 주요 기능을 살펴보세요.",
}

// 기능 목록
const features = [
  {
    icon: Zap,
    title: "빠른 개발 속도",
    description:
      "사전 구성된 컴포넌트와 레이아웃으로 개발 시간을 크게 단축할 수 있습니다.",
  },
  {
    icon: Shield,
    title: "타입 안전성",
    description:
      "TypeScript와 Zod를 활용하여 런타임 에러를 최소화하고 안전한 코드를 작성할 수 있습니다.",
  },
  {
    icon: Palette,
    title: "다크 모드",
    description:
      "next-themes를 활용한 다크 모드가 기본 지원됩니다. 시스템 테마 자동 감지도 가능합니다.",
  },
  {
    icon: Smartphone,
    title: "반응형 디자인",
    description:
      "모든 컴포넌트가 모바일 퍼스트로 설계되어 다양한 화면 크기에 최적화됩니다.",
  },
  {
    icon: Code2,
    title: "깔끔한 코드",
    description:
      "ESLint와 TypeScript strict 모드로 일관된 코드 품질을 유지합니다.",
  },
  {
    icon: Search,
    title: "SEO 최적화",
    description:
      "Next.js Metadata API를 활용하여 검색 엔진 최적화가 기본 설정되어 있습니다.",
  },
  {
    icon: Lock,
    title: "인증 레이아웃",
    description:
      "로그인, 회원가입 페이지를 위한 인증 레이아웃이 미리 구성되어 있습니다.",
  },
  {
    icon: LayoutDashboard,
    title: "대시보드 레이아웃",
    description:
      "사이드바 기반의 대시보드 레이아웃으로 관리자 페이지를 빠르게 구축할 수 있습니다.",
  },
]

// 기능 페이지
export default function FeaturesPage() {
  return (
    <div className="container py-24 sm:py-32">
      {/* 헤더 */}
      <div className="mx-auto max-w-3xl text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          기능
        </h1>
        <p className="mt-6 text-lg text-muted-foreground">
          스타터킷에 포함된 주요 기능들을 확인하세요. 검증된 기술 스택과
          모범 사례를 기반으로 구축되었습니다.
        </p>
      </div>

      {/* 기능 그리드 */}
      <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {features.map((feature) => (
          <div
            key={feature.title}
            className="rounded-lg border bg-card p-6 shadow-sm transition-shadow hover:shadow-md"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <feature.icon className="h-5 w-5 text-primary" />
            </div>
            <h3 className="mt-4 font-semibold">{feature.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
