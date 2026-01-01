// 폼 데이터 타입 정의
// react-hook-form + Zod와 함께 사용

// 기존 인증 폼 타입 re-export
export type { LoginFormData, RegisterFormData } from "@/lib/validations/auth"

/**
 * 노션 연동 설정 폼 데이터
 */
export interface SettingsFormData {
  notionApiKey: string
  notionDatabaseId: string
}

/**
 * 프로필 설정 폼 데이터
 */
export interface ProfileFormData {
  companyName: string
  email: string
}

/**
 * 비밀번호 변경 폼 데이터
 */
export interface ChangePasswordFormData {
  currentPassword: string
  newPassword: string
  confirmNewPassword: string
}

/**
 * 견적서 검색 폼 데이터
 */
export interface QuoteSearchFormData {
  search?: string
  status?: string
  dateFrom?: string
  dateTo?: string
}

/**
 * 폼 필드 에러 타입
 */
export interface FormFieldError {
  field: string
  message: string
}

/**
 * 폼 제출 상태 타입
 */
export interface FormSubmitState {
  isSubmitting: boolean
  isSuccess: boolean
  isError: boolean
  errorMessage?: string
}
