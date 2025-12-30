import { Fragment } from "react"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { ThemeToggle } from "@/components/common"
import { UserNav } from "./user-nav"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

interface DashboardHeaderProps {
  breadcrumbs?: { title: string; href?: string }[]
}

// 대시보드 헤더 컴포넌트
export function DashboardHeader({ breadcrumbs }: DashboardHeaderProps) {
  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mr-2 h-4" />

      {/* 브레드크럼 */}
      {breadcrumbs && breadcrumbs.length > 0 && (
        <Breadcrumb>
          <BreadcrumbList>
            {breadcrumbs.map((item, index) => (
              <Fragment key={item.title}>
                <BreadcrumbItem>
                  {index < breadcrumbs.length - 1 ? (
                    <BreadcrumbLink href={item.href || "#"}>
                      {item.title}
                    </BreadcrumbLink>
                  ) : (
                    <BreadcrumbPage>{item.title}</BreadcrumbPage>
                  )}
                </BreadcrumbItem>
                {index < breadcrumbs.length - 1 && <BreadcrumbSeparator />}
              </Fragment>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
      )}

      {/* 우측 액션 */}
      <div className="ml-auto flex items-center gap-2">
        <ThemeToggle />
        <UserNav />
      </div>
    </header>
  )
}
