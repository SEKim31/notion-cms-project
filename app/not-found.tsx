import Link from "next/link"
import { FileQuestion } from "lucide-react"
import { Button } from "@/components/ui/button"

// 404 페이지
export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
        <FileQuestion className="h-10 w-10 text-muted-foreground" />
      </div>
      <h1 className="mt-6 text-4xl font-bold">404</h1>
      <p className="mt-2 text-lg text-muted-foreground">
        페이지를 찾을 수 없습니다
      </p>
      <p className="mt-1 text-sm text-muted-foreground">
        요청하신 페이지가 존재하지 않거나 이동되었습니다.
      </p>
      <Button asChild className="mt-6">
        <Link href="/">홈으로 돌아가기</Link>
      </Button>
    </div>
  )
}
