import Link from "next/link"
import { ArrowRight, Zap, Shield, Palette } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

// 히어로 섹션 기능 목록
const features = [
  {
    icon: Zap,
    title: "빠른 개발",
    description: "사전 구성된 컴포넌트로 개발 시간을 단축하세요.",
  },
  {
    icon: Shield,
    title: "타입 안전",
    description: "TypeScript와 Zod로 안전한 코드를 작성하세요.",
  },
  {
    icon: Palette,
    title: "다크 모드",
    description: "시스템 테마를 자동 감지하고 수동 전환도 지원합니다.",
  },
]

// 랜딩 페이지
export default function HomePage() {
  return (
    <>
      {/* 히어로 섹션 */}
      <section className="container py-24 sm:py-32">
        <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
          <Badge variant="secondary" className="mb-4">
            v1.0 출시
          </Badge>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            모던 웹 개발을
            <br />
            <span className="text-primary">더 빠르게</span> 시작하세요
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
            Next.js, TypeScript, Tailwind CSS, shadcn/ui로 구성된 스타터킷으로
            프로젝트를 빠르게 시작하세요. 검증된 기술 스택과 최적화된 설정이
            포함되어 있습니다.
          </p>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <Button size="lg" asChild>
              <Link href="/register">
                무료로 시작하기
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/features">기능 살펴보기</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* 기능 섹션 */}
      <section className="container py-24 sm:py-32">
        <div className="mx-auto max-w-5xl">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              왜 이 스타터킷인가요?
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              개발에 집중할 수 있도록 필요한 모든 것을 미리 준비했습니다.
            </p>
          </div>
          <div className="grid gap-8 sm:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="flex flex-col items-center rounded-lg border p-6 text-center"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mt-4 text-lg font-semibold">{feature.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA 섹션 */}
      <section className="border-t bg-muted/50">
        <div className="container py-24 sm:py-32">
          <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              지금 바로 시작하세요
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              몇 분 안에 프로젝트를 설정하고 개발을 시작할 수 있습니다.
            </p>
            <Button size="lg" className="mt-8" asChild>
              <Link href="/register">
                무료로 시작하기
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  )
}
