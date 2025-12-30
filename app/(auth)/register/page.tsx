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
import { RegisterForm } from "@/components/features/auth"

export const metadata: Metadata = {
  title: "회원가입",
  description: "새 계정을 만드세요.",
}

// 회원가입 페이지
export default function RegisterPage() {
  return (
    <Card>
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl">회원가입</CardTitle>
        <CardDescription>
          아래 정보를 입력하여 새 계정을 만드세요.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <RegisterForm />
      </CardContent>
      <CardFooter className="flex flex-col gap-4">
        <div className="text-center text-sm text-muted-foreground">
          이미 계정이 있으신가요?{" "}
          <Link
            href="/login"
            className="font-medium text-primary hover:underline"
          >
            로그인
          </Link>
        </div>
      </CardFooter>
    </Card>
  )
}
