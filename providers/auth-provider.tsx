"use client"

import {
  createContext,
  useCallback,
  useEffect,
  useState,
  type ReactNode,
} from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import type { AuthContextType, User, RegisterData } from "@/types/auth"

// AuthContext 생성
const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

/**
 * 인증 상태를 관리하는 Provider
 */
export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  /**
   * 현재 로그인된 사용자 정보 조회
   */
  const refreshUser = useCallback(async () => {
    try {
      const response = await fetch("/api/auth/me", {
        method: "GET",
        credentials: "include",
      })

      if (response.ok) {
        const data = await response.json()
        setUser(data.user)
      } else {
        setUser(null)
      }
    } catch (error) {
      console.error("사용자 정보 조회 에러:", error)
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }, [])

  /**
   * 로그인
   */
  const login = useCallback(
    async (email: string, password: string) => {
      try {
        const response = await fetch("/api/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
          credentials: "include",
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || "로그인에 실패했습니다.")
        }

        // 사용자 정보 업데이트
        await refreshUser()

        toast.success("로그인 성공", {
          description: "환영합니다!",
        })

        // 대시보드로 리다이렉트
        router.push("/quotes")
        router.refresh()
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "로그인에 실패했습니다."
        toast.error("로그인 실패", {
          description: errorMessage,
        })
        throw error
      }
    },
    [refreshUser, router]
  )

  /**
   * 회원가입
   */
  const register = useCallback(
    async (data: RegisterData) => {
      try {
        const response = await fetch("/api/auth/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
          credentials: "include",
        })

        const result = await response.json()

        if (!response.ok) {
          throw new Error(result.error || "회원가입에 실패했습니다.")
        }

        toast.success("회원가입 성공", {
          description: "계정이 생성되었습니다. 로그인해주세요.",
        })

        // 로그인 페이지로 리다이렉트
        router.push("/login")
        router.refresh()
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "회원가입에 실패했습니다."
        toast.error("회원가입 실패", {
          description: errorMessage,
        })
        throw error
      }
    },
    [router]
  )

  /**
   * 로그아웃
   */
  const logout = useCallback(async () => {
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      })

      if (!response.ok) {
        throw new Error("로그아웃에 실패했습니다.")
      }

      setUser(null)

      toast.success("로그아웃되었습니다.")

      // 홈으로 리다이렉트
      router.push("/")
      router.refresh()
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "로그아웃에 실패했습니다."
      toast.error("로그아웃 실패", {
        description: errorMessage,
      })
      throw error
    }
  }, [router])

  // 컴포넌트 마운트 시 사용자 정보 조회
  useEffect(() => {
    refreshUser()
  }, [refreshUser])

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    refreshUser,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export { AuthContext }
