import Link from "next/link"
import { ArrowRight, FileText, Link2, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

// 견적서 뷰어 주요 기능
const features = [
  {
    icon: FileText,
    title: "노션 연동",
    description: "노션에서 작성한 견적서를 자동으로 동기화합니다. 실시간으로 데이터를 가져와 항상 최신 상태를 유지합니다.",
    highlight: "자동 동기화",
  },
  {
    icon: Link2,
    title: "공유 링크",
    description: "클라이언트가 접근할 수 있는 고유 공유 링크를 생성합니다. 별도 로그인 없이 견적서를 확인할 수 있습니다.",
    highlight: "원클릭 공유",
  },
  {
    icon: Download,
    title: "PDF 다운로드",
    description: "견적서를 전문적인 PDF 파일로 변환하여 다운로드할 수 있습니다. 인쇄 및 보관에 최적화되어 있습니다.",
    highlight: "전문 PDF",
  },
]

// 랜딩 페이지
export default function HomePage() {
  return (
    <>
      {/* 히어로 섹션 */}
      <section className="relative overflow-hidden">
        {/* 배경 그라데이션 효과 */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/10" />
          <div className="absolute left-1/2 top-0 -z-10 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute right-0 top-1/4 -z-10 h-[400px] w-[400px] rounded-full bg-accent/20 blur-3xl" />
        </div>

        <div className="container py-24 sm:py-32 lg:py-40">
          <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
              노션 견적서를
              <br />
              <span className="bg-gradient-to-r from-primary via-primary/80 to-primary bg-clip-text text-transparent">
                웹에서 간편하게
              </span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg text-muted-foreground sm:text-xl">
              노션에서 작성한 견적서를 클라이언트와 쉽게 공유하고 PDF로 다운로드할 수 있습니다.
              별도의 견적서 작성 도구 없이 노션만으로 전문적인 견적서 발행이 가능합니다.
            </p>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Button size="lg" className="rounded-full px-8 text-base" asChild>
                <Link href="/register">
                  무료로 시작하기
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="rounded-full px-8 text-base" asChild>
                <Link href="/login">로그인</Link>
              </Button>
            </div>

            {/* 소셜 프루프 */}
            <div className="mt-12 flex items-center gap-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-foreground">100+</span>
                <span>사업자 이용중</span>
              </div>
              <div className="h-4 w-px bg-border" />
              <div className="flex items-center gap-2">
                <span className="font-semibold text-foreground">1,000+</span>
                <span>견적서 발행</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 기능 섹션 */}
      <section className="container py-24 sm:py-32">
        <div className="mx-auto max-w-5xl">
          <div className="mb-16 text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              강력한 기능으로
              <br />
              <span className="text-muted-foreground">견적서 관리를 간편하게</span>
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              견적서 관리에 필요한 핵심 기능을 모두 제공합니다.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <Card
                key={feature.title}
                className="group relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-1"
              >
                {/* 호버 시 그라데이션 배경 */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />

                <CardHeader className="relative">
                  <div className="mb-2 flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 transition-colors group-hover:bg-primary/20">
                      <feature.icon className="h-6 w-6 text-primary" />
                    </div>
                    <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
                      {feature.highlight}
                    </span>
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>

                <CardContent className="relative">
                  <CardDescription className="text-base leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA 섹션 */}
      <section className="relative overflow-hidden border-t">
        {/* 배경 효과 */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-t from-muted/80 via-muted/50 to-transparent" />
          <div className="absolute bottom-0 left-1/4 -z-10 h-[300px] w-[300px] rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute bottom-0 right-1/4 -z-10 h-[300px] w-[300px] rounded-full bg-accent/10 blur-3xl" />
        </div>

        <div className="container py-24 sm:py-32">
          <div className="mx-auto max-w-3xl">
            <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-2xl">
              {/* 장식 요소 */}
              <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
              <div className="absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-white/10 blur-2xl" />

              <CardContent className="relative flex flex-col items-center py-12 text-center sm:py-16">
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                  지금 바로 시작하세요
                </h2>
                <p className="mt-4 max-w-xl text-lg text-primary-foreground/80">
                  노션 계정만 있으면 바로 견적서를 발행할 수 있습니다.
                  무료로 시작하고 필요에 따라 확장하세요.
                </p>

                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <Button
                    size="lg"
                    variant="secondary"
                    className="rounded-full px-8 text-base font-semibold"
                    asChild
                  >
                    <Link href="/register">
                      무료로 시작하기
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button
                    size="lg"
                    variant="ghost"
                    className="rounded-full px-8 text-base text-primary-foreground hover:bg-white/10 hover:text-primary-foreground"
                    asChild
                  >
                    <Link href="/login">로그인</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </>
  )
}
