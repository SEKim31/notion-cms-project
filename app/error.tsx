"use client"

import { useEffect } from "react"
import { AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

// 에러 페이지
export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // 에러 로깅 (Sentry 등 연동 가능)
    console.error(error)
  }, [error])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-destructive/10">
        <AlertTriangle className="h-10 w-10 text-destructive" />
      </div>
      <h1 className="mt-6 text-2xl font-bold">문제가 발생했습니다</h1>
      <p className="mt-2 text-muted-foreground">
        예기치 않은 오류가 발생했습니다.
      </p>
      {error.digest && (
        <p className="mt-1 text-xs text-muted-foreground">
          오류 코드: {error.digest}
        </p>
      )}
      <div className="mt-6 flex gap-2">
        <Button onClick={reset}>다시 시도</Button>
        <Button variant="outline" onClick={() => (window.location.href = "/")}>
          홈으로
        </Button>
      </div>
    </div>
  )
}
