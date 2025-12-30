import Link from "next/link"
import { cn } from "@/lib/utils"
import { siteConfig } from "@/config/site"

interface LogoProps {
  variant?: "default" | "icon-only"
  size?: "sm" | "md" | "lg"
  className?: string
  href?: string
}

// 사이즈별 스타일
const sizeStyles = {
  sm: "h-6 text-lg",
  md: "h-8 text-xl",
  lg: "h-10 text-2xl",
}

// 로고 컴포넌트
// 사이트 로고를 표시하고 홈으로 링크
export function Logo({
  variant = "default",
  size = "md",
  className,
  href = "/",
}: LogoProps) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-2 font-bold transition-opacity hover:opacity-80",
        sizeStyles[size],
        className
      )}
    >
      {/* 로고 아이콘 (SVG 또는 이미지로 교체 가능) */}
      <div className="flex h-full aspect-square items-center justify-center rounded-lg bg-primary text-primary-foreground">
        <span className="text-sm font-bold">S</span>
      </div>
      {variant === "default" && (
        <span className="hidden sm:inline-block">{siteConfig.name}</span>
      )}
    </Link>
  )
}
