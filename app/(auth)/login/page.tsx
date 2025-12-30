import type { Metadata } from "next"
import Link from "next/link"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { LoginForm } from "@/components/features/auth"

export const metadata: Metadata = {
  title: "로그인",
  description: "계정에 로그인하세요.",
}

// 로그인 페이지
export default function LoginPage() {
  return (
    <Card>
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl">로그인</CardTitle>
        <CardDescription>
          이메일과 비밀번호를 입력하여 로그인하세요.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <LoginForm />
      </CardContent>
      <CardFooter className="flex flex-col gap-4">
        <div className="text-center text-sm text-muted-foreground">
          계정이 없으신가요?{" "}
          <Link
            href="/register"
            className="font-medium text-primary hover:underline"
          >
            회원가입
          </Link>
        </div>
      </CardFooter>
    </Card>
  )
}
