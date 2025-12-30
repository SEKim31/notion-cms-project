import type { Metadata } from "next"
import Link from "next/link"
import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

export const metadata: Metadata = {
  title: "가격",
  description: "스타터킷 가격 정책을 확인하세요.",
}

// 가격 플랜
const plans = [
  {
    name: "무료",
    description: "개인 프로젝트에 적합합니다.",
    price: "₩0",
    period: "영구 무료",
    features: [
      "모든 기본 컴포넌트",
      "다크 모드 지원",
      "반응형 레이아웃",
      "커뮤니티 지원",
    ],
    cta: "무료로 시작",
    href: "/register",
    popular: false,
  },
  {
    name: "프로",
    description: "전문 개발자와 팀에 적합합니다.",
    price: "₩29,000",
    period: "/ 월",
    features: [
      "무료 플랜의 모든 기능",
      "프리미엄 컴포넌트",
      "우선 지원",
      "소스 코드 액세스",
      "상업적 라이선스",
    ],
    cta: "프로 시작",
    href: "/register?plan=pro",
    popular: true,
  },
  {
    name: "엔터프라이즈",
    description: "대규모 조직에 적합합니다.",
    price: "맞춤",
    period: "",
    features: [
      "프로 플랜의 모든 기능",
      "전용 지원",
      "SLA 보장",
      "맞춤 개발",
      "온보딩 교육",
    ],
    cta: "문의하기",
    href: "/contact",
    popular: false,
  },
]

// 가격 페이지
export default function PricingPage() {
  return (
    <div className="container py-24 sm:py-32">
      {/* 헤더 */}
      <div className="mx-auto max-w-3xl text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          간단하고 투명한 가격
        </h1>
        <p className="mt-6 text-lg text-muted-foreground">
          프로젝트 규모에 맞는 플랜을 선택하세요. 언제든지 업그레이드하거나
          다운그레이드할 수 있습니다.
        </p>
      </div>

      {/* 가격 카드 */}
      <div className="mt-16 grid gap-8 lg:grid-cols-3">
        {plans.map((plan) => (
          <Card
            key={plan.name}
            className={cn(
              "relative flex flex-col",
              plan.popular && "border-primary shadow-lg"
            )}
          >
            {plan.popular && (
              <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">
                가장 인기
              </Badge>
            )}
            <CardHeader>
              <CardTitle>{plan.name}</CardTitle>
              <CardDescription>{plan.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <div className="mb-6">
                <span className="text-4xl font-bold">{plan.price}</span>
                <span className="text-muted-foreground">{plan.period}</span>
              </div>
              <ul className="space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full"
                variant={plan.popular ? "default" : "outline"}
                asChild
              >
                <Link href={plan.href}>{plan.cta}</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* FAQ */}
      <div className="mx-auto mt-24 max-w-3xl">
        <h2 className="text-center text-2xl font-bold">
          자주 묻는 질문
        </h2>
        <div className="mt-8 space-y-6">
          <div>
            <h3 className="font-semibold">무료 플랜의 제한은 무엇인가요?</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              무료 플랜은 개인 프로젝트에 제한 없이 사용할 수 있습니다.
              상업적 용도로 사용하려면 프로 플랜 이상이 필요합니다.
            </p>
          </div>
          <div>
            <h3 className="font-semibold">언제든지 취소할 수 있나요?</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              네, 언제든지 취소할 수 있습니다. 취소 시 다음 결제일까지
              서비스를 이용할 수 있습니다.
            </p>
          </div>
          <div>
            <h3 className="font-semibold">환불 정책은 어떻게 되나요?</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              결제 후 14일 이내에 환불을 요청하시면 전액 환불해 드립니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
