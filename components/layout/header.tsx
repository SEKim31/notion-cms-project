import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Logo, ThemeToggle } from "@/components/common"
import { MainNav } from "./main-nav"
import { MobileNav } from "./mobile-nav"
import { cn } from "@/lib/utils"

interface HeaderProps {
  sticky?: boolean
  transparent?: boolean
  className?: string
}

// 마케팅 페이지 헤더
export function Header({
  sticky = true,
  transparent = false,
  className,
}: HeaderProps) {
  return (
    <header
      className={cn(
        "z-50 w-full border-b",
        sticky && "sticky top-0",
        transparent
          ? "border-transparent bg-transparent"
          : "border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
        className
      )}
    >
      <div className="container flex h-16 items-center justify-between">
        {/* 좌측: 로고 + 네비게이션 */}
        <div className="flex items-center gap-6">
          <MobileNav />
          <Logo />
          <MainNav />
        </div>

        {/* 우측: 테마 토글 + 로그인/회원가입 */}
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <div className="hidden items-center gap-2 sm:flex">
            <Button variant="ghost" asChild>
              <Link href="/login">로그인</Link>
            </Button>
            <Button asChild>
              <Link href="/register">시작하기</Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
