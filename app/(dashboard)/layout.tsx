import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/layout"
import { cookies } from "next/headers"

interface DashboardLayoutProps {
  children: React.ReactNode
}

// 대시보드 레이아웃
// 사이드바 + 콘텐츠 영역
export default async function DashboardLayout({
  children,
}: DashboardLayoutProps) {
  const cookieStore = await cookies()
  const defaultOpen = cookieStore.get("sidebar_state")?.value !== "false"

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <AppSidebar />
      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  )
}
