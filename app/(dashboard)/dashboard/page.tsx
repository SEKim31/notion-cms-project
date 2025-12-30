import type { Metadata } from "next"
import { Activity, CreditCard, DollarSign, Users } from "lucide-react"

import { DashboardHeader } from "@/components/layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export const metadata: Metadata = {
  title: "대시보드",
  description: "대시보드 개요",
}

// 통계 카드 데이터
const stats = [
  {
    title: "총 수익",
    value: "₩45,231,890",
    change: "+20.1%",
    icon: DollarSign,
  },
  {
    title: "구독자",
    value: "+2,350",
    change: "+180.1%",
    icon: Users,
  },
  {
    title: "판매",
    value: "+12,234",
    change: "+19%",
    icon: CreditCard,
  },
  {
    title: "활성 사용자",
    value: "+573",
    change: "+201",
    icon: Activity,
  },
]

// 대시보드 페이지
export default function DashboardPage() {
  return (
    <>
      <DashboardHeader
        breadcrumbs={[
          { title: "대시보드", href: "/dashboard" },
          { title: "개요" },
        ]}
      />
      <main className="flex-1 space-y-4 p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">대시보드</h2>
        </div>

        {/* 통계 카드 */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  지난 달 대비 {stat.change}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* 추가 콘텐츠 영역 */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>개요</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex h-[200px] items-center justify-center text-muted-foreground">
                차트가 여기에 표시됩니다
              </div>
            </CardContent>
          </Card>
          <Card className="col-span-3">
            <CardHeader>
              <CardTitle>최근 판매</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex h-[200px] items-center justify-center text-muted-foreground">
                최근 판매 목록이 여기에 표시됩니다
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  )
}
