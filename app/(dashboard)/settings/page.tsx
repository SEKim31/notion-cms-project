import type { Metadata } from "next"

import { DashboardHeader } from "@/components/layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

export const metadata: Metadata = {
  title: "설정",
  description: "계정 설정을 관리하세요.",
}

// 설정 페이지
export default function SettingsPage() {
  return (
    <>
      <DashboardHeader
        breadcrumbs={[
          { title: "대시보드", href: "/dashboard" },
          { title: "설정" },
        ]}
      />
      <main className="flex-1 space-y-6 p-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">설정</h2>
          <p className="text-muted-foreground">
            계정 설정 및 환경 설정을 관리합니다.
          </p>
        </div>

        <Separator />

        {/* 프로필 설정 */}
        <Card>
          <CardHeader>
            <CardTitle>프로필</CardTitle>
            <CardDescription>프로필 정보를 업데이트하세요.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="name">이름</Label>
              <Input id="name" placeholder="홍길동" defaultValue="홍길동" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">이메일</Label>
              <Input
                id="email"
                type="email"
                placeholder="hong@example.com"
                defaultValue="hong@example.com"
              />
            </div>
            <Button>저장</Button>
          </CardContent>
        </Card>

        {/* 비밀번호 변경 */}
        <Card>
          <CardHeader>
            <CardTitle>비밀번호</CardTitle>
            <CardDescription>비밀번호를 변경합니다.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="current-password">현재 비밀번호</Label>
              <Input id="current-password" type="password" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="new-password">새 비밀번호</Label>
              <Input id="new-password" type="password" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="confirm-password">비밀번호 확인</Label>
              <Input id="confirm-password" type="password" />
            </div>
            <Button>비밀번호 변경</Button>
          </CardContent>
        </Card>

        {/* 위험 영역 */}
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive">위험 영역</CardTitle>
            <CardDescription>
              계정을 삭제하면 모든 데이터가 영구적으로 삭제됩니다.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="destructive">계정 삭제</Button>
          </CardContent>
        </Card>
      </main>
    </>
  )
}
