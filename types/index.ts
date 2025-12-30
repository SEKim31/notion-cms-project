// 공통 타입 정의

// 페이지 파라미터 타입
export interface PageParams {
  params: Promise<{ [key: string]: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

// API 응답 타입
export interface ApiResponse<T> {
  data: T
  success: boolean
  message?: string
}

// 페이지네이션 타입
export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

// 사용자 타입 (예시)
export interface User {
  id: string
  email: string
  name: string
  image?: string
  createdAt: Date
}
