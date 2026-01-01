// 인증 관련 타입 정의

/**
 * 사용자 정보 타입
 */
export interface User {
  id: string
  email: string
  companyName: string
  hasNotionConfig: boolean
  createdAt?: string
  updatedAt?: string
}

/**
 * 인증 컨텍스트 타입
 */
export interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  register: (data: RegisterData) => Promise<void>
  logout: () => Promise<void>
  refreshUser: () => Promise<void>
}

/**
 * 회원가입 데이터 타입
 */
export interface RegisterData {
  email: string
  password: string
  companyName: string
  name: string
}

/**
 * API 응답 타입
 */
export interface AuthResponse {
  message?: string
  error?: string
  user?: User
  details?: unknown
}
