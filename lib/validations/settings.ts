import { z } from "zod"

// 노션 API 키 형식 검증
// secret_ 또는 ntn_ 접두사로 시작
const notionApiKeyRegex = /^(secret_|ntn_).{20,}$/

// 데이터베이스 ID 형식 검증
// UUID 형식 (하이픈 포함/미포함)
const databaseIdRegex =
  /^[0-9a-f]{8}-?[0-9a-f]{4}-?[0-9a-f]{4}-?[0-9a-f]{4}-?[0-9a-f]{12}$/i

// 노션 설정 스키마
export const notionSettingsSchema = z.object({
  notionApiKey: z
    .string()
    .min(1, "노션 API 키를 입력해주세요.")
    .regex(
      notionApiKeyRegex,
      "올바른 노션 API 키 형식이 아닙니다. (secret_ 또는 ntn_ 로 시작)"
    ),
  notionDatabaseId: z
    .string()
    .min(1, "데이터베이스 ID를 입력해주세요.")
    .regex(
      databaseIdRegex,
      "올바른 데이터베이스 ID 형식이 아닙니다. (32자리 UUID)"
    ),
})

export type NotionSettingsFormData = z.infer<typeof notionSettingsSchema>

// 프로필 설정 스키마
export const profileSettingsSchema = z.object({
  name: z
    .string()
    .min(1, "이름을 입력해주세요.")
    .min(2, "이름은 2자 이상이어야 합니다."),
  email: z
    .string()
    .min(1, "이메일을 입력해주세요.")
    .email("올바른 이메일 형식이 아닙니다."),
})

export type ProfileSettingsFormData = z.infer<typeof profileSettingsSchema>

// 비밀번호 변경 스키마
export const passwordChangeSchema = z
  .object({
    currentPassword: z
      .string()
      .min(1, "현재 비밀번호를 입력해주세요."),
    newPassword: z
      .string()
      .min(1, "새 비밀번호를 입력해주세요.")
      .min(8, "비밀번호는 8자 이상이어야 합니다.")
      .regex(
        /^(?=.*[a-zA-Z])(?=.*[0-9])/,
        "비밀번호는 영문과 숫자를 포함해야 합니다."
      ),
    confirmPassword: z.string().min(1, "비밀번호 확인을 입력해주세요."),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "비밀번호가 일치하지 않습니다.",
    path: ["confirmPassword"],
  })

export type PasswordChangeFormData = z.infer<typeof passwordChangeSchema>
