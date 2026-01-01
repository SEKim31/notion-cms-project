"use client"

import { useContext } from "react"
import { AuthContext } from "@/providers/auth-provider"

/**
 * 인증 상태 및 함수를 사용하기 위한 훅
 *
 * @example
 * ```tsx
 * const { user, login, logout, isAuthenticated } = useAuth()
 *
 * // 로그인
 * await login("user@example.com", "password")
 *
 * // 로그아웃
 * await logout()
 *
 * // 사용자 정보 확인
 * if (isAuthenticated) {
 *   console.log(user.email)
 * }
 * ```
 */
export function useAuth() {
  const context = useContext(AuthContext)

  if (context === undefined) {
    throw new Error("useAuth는 AuthProvider 내부에서만 사용할 수 있습니다.")
  }

  return context
}
