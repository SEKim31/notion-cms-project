import type { Metadata } from "next"
import { Users, Target, Heart } from "lucide-react"

export const metadata: Metadata = {
  title: "소개",
  description: "스타터킷 팀과 미션을 소개합니다.",
}

// 회사 가치
const values = [
  {
    icon: Target,
    title: "개발자 경험",
    description:
      "개발자가 더 빠르고 즐겁게 작업할 수 있는 도구를 만듭니다.",
  },
  {
    icon: Users,
    title: "커뮤니티",
    description:
      "오픈 소스를 통해 개발자 커뮤니티와 함께 성장합니다.",
  },
  {
    icon: Heart,
    title: "품질",
    description:
      "모든 코드에 테스트와 문서화를 포함하여 품질을 보장합니다.",
  },
]

// 소개 페이지
export default function AboutPage() {
  return (
    <div className="container py-24 sm:py-32">
      {/* 헤더 */}
      <div className="mx-auto max-w-3xl text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          소개
        </h1>
        <p className="mt-6 text-lg text-muted-foreground">
          우리는 개발자들이 더 빠르게 아이디어를 현실로 만들 수 있도록
          돕습니다. 검증된 기술 스택과 모범 사례를 바탕으로 스타터킷을
          제공합니다.
        </p>
      </div>

      {/* 미션 */}
      <div className="mx-auto mt-16 max-w-3xl">
        <h2 className="text-2xl font-bold">우리의 미션</h2>
        <p className="mt-4 text-muted-foreground">
          웹 개발의 진입 장벽을 낮추고, 개발자들이 핵심 비즈니스 로직에
          집중할 수 있도록 하는 것이 우리의 미션입니다. 반복적인 설정
          작업을 줄이고, 업계 표준을 따르는 코드를 제공하여 개발 생산성을
          높입니다.
        </p>
      </div>

      {/* 가치 */}
      <div className="mt-24">
        <h2 className="text-center text-2xl font-bold">우리의 가치</h2>
        <div className="mt-12 grid gap-8 sm:grid-cols-3">
          {values.map((value) => (
            <div
              key={value.title}
              className="flex flex-col items-center text-center"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <value.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mt-4 text-lg font-semibold">{value.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {value.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
