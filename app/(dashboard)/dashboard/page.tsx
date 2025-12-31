import { redirect } from "next/navigation"

// 대시보드 기본 페이지 - 견적서 목록으로 리다이렉트
export default function DashboardPage() {
  redirect("/quotes")
}
