"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Logo } from "@/components/common"
import { mainNav } from "@/config/navigation"
import { cn } from "@/lib/utils"

// 모바일 네비게이션 (Sheet 기반)
export function MobileNav() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">메뉴 열기</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px] sm:w-[350px]">
        <SheetHeader>
          <SheetTitle>
            <Logo variant="default" />
          </SheetTitle>
        </SheetHeader>
        <nav className="mt-8 flex flex-col gap-4">
          {mainNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className={cn(
                "text-lg font-medium transition-colors hover:text-foreground/80",
                pathname === item.href
                  ? "text-foreground"
                  : "text-foreground/60",
                item.disabled && "pointer-events-none opacity-50"
              )}
            >
              {item.title}
            </Link>
          ))}
        </nav>
        <div className="mt-8 flex flex-col gap-2">
          <Button asChild variant="outline" onClick={() => setOpen(false)}>
            <Link href="/login">로그인</Link>
          </Button>
          <Button asChild onClick={() => setOpen(false)}>
            <Link href="/register">시작하기</Link>
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}
