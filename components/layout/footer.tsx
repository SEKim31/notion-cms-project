import Link from "next/link"
import { Github, Twitter } from "lucide-react"
import { Logo, ThemeToggle } from "@/components/common"
import { footerNav } from "@/config/navigation"
import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"

interface FooterProps {
  className?: string
}

// 마케팅 페이지 푸터
export function Footer({ className }: FooterProps) {
  return (
    <footer className={cn("border-t bg-background", className)}>
      <div className="container py-12">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* 로고 및 설명 */}
          <div className="space-y-4">
            <Logo />
            <p className="text-sm text-muted-foreground">
              {siteConfig.description}
            </p>
            <div className="flex items-center gap-2">
              <Link
                href={siteConfig.links.github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground"
              >
                <Github className="h-5 w-5" />
                <span className="sr-only">GitHub</span>
              </Link>
              <Link
                href={siteConfig.links.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground"
              >
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </Link>
            </div>
          </div>

          {/* 제품 링크 */}
          <div>
            <h3 className="mb-4 text-sm font-semibold">제품</h3>
            <ul className="space-y-3">
              {footerNav.product.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      "text-sm text-muted-foreground hover:text-foreground",
                      item.disabled && "pointer-events-none opacity-50"
                    )}
                  >
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* 회사 링크 */}
          <div>
            <h3 className="mb-4 text-sm font-semibold">회사</h3>
            <ul className="space-y-3">
              {footerNav.company.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      "text-sm text-muted-foreground hover:text-foreground",
                      item.disabled && "pointer-events-none opacity-50"
                    )}
                  >
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* 법적 링크 */}
          <div>
            <h3 className="mb-4 text-sm font-semibold">법적 고지</h3>
            <ul className="space-y-3">
              {footerNav.legal.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      "text-sm text-muted-foreground hover:text-foreground",
                      item.disabled && "pointer-events-none opacity-50"
                    )}
                  >
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* 하단 저작권 */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t pt-8 sm:flex-row">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} {siteConfig.name}. All rights
            reserved.
          </p>
          <ThemeToggle />
        </div>
      </div>
    </footer>
  )
}
