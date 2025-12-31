import Link from "next/link"
import { ArrowRight, FileText, Link2, Download } from "lucide-react"
import { Button } from "@/components/ui/button"

// 견적서 뷰어 주요 기능
const features = [
  {
    icon: FileText,
    title: "노션 연동",
    description: "노션에서 작성한 견적서를 자동으로 동기화합니다.",
  },
  {
    icon: Link2,
    title: "공유 링크",
    description: "클라이언트가 접근할 수 있는 고유 공유 링크를 생성합니다.",
  },
  {
    icon: Download,
    title: "PDF 다운로드",
    description: "견적서를 PDF 파일로 변환하여 다운로드할 수 있습니다.",
  },
]

// 랜딩 페이지
export default function HomePage() {
  return (
    <>
      {/* 히어로 섹션 */}
      <section className="container py-24 sm:py-32">
        <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            노션 견적서를
            <br />
            <span className="text-primary">웹에서 간편하게</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
            노션에서 작성한 견적서를 클라이언트와 쉽게 공유하고 PDF로 다운로드할 수 있습니다.
            별도의 견적서 작성 도구 없이 노션만으로 전문적인 견적서 발행이 가능합니다.
          </p>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <Button size="lg" asChild>
              <Link href="/register">
                무료로 시작하기
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/login">로그인</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* 기능 섹션 */}
      <section className="container py-24 sm:py-32">
        <div className="mx-auto max-w-5xl">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              주요 기능
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              견적서 관리에 필요한 핵심 기능을 제공합니다.
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
              노션 계정만 있으면 바로 견적서를 발행할 수 있습니다.
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
