import Link from "next/link"
import { Logo } from "@/components/common"

interface AuthLayoutProps {
  children: React.ReactNode
}

// 인증 페이지 레이아웃
// 중앙 정렬된 카드 형태
export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      {/* 상단 로고 */}
      <header className="container flex h-16 items-center">
        <Logo />
      </header>

      {/* 중앙 컨텐츠 */}
      <main className="flex flex-1 items-center justify-center p-4">
        <div className="w-full max-w-md">{children}</div>
      </main>

      {/* 하단 링크 */}
      <footer className="container flex h-16 items-center justify-center">
        <p className="text-sm text-muted-foreground">
          <Link href="/" className="hover:underline">
            홈으로 돌아가기
          </Link>
        </p>
      </footer>
    </div>
  )
}
