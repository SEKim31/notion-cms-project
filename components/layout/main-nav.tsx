"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { mainNav } from "@/config/navigation"

// 데스크탑 메인 네비게이션
export function MainNav() {
  const pathname = usePathname()

  return (
    <nav className="hidden items-center gap-6 md:flex">
      {mainNav.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            "text-sm font-medium transition-colors hover:text-foreground/80",
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
  )
}
