import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg"
  fullScreen?: boolean
  className?: string
}

// 사이즈별 스타일
const sizeStyles = {
  sm: "h-4 w-4",
  md: "h-6 w-6",
  lg: "h-8 w-8",
}

// 로딩 스피너 컴포넌트
export function LoadingSpinner({
  size = "md",
  fullScreen = false,
  className,
}: LoadingSpinnerProps) {
  const spinner = (
    <Loader2
      className={cn("animate-spin text-muted-foreground", sizeStyles[size], className)}
    />
  )

  if (fullScreen) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        {spinner}
      </div>
    )
  }

  return spinner
}
