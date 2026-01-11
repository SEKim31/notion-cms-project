import { z } from "zod"

// 이메일 발송 폼 스키마
export const sendEmailSchema = z.object({
  to: z
    .string()
    .min(1, "이메일을 입력해주세요.")
    .email("올바른 이메일 형식이 아닙니다."),
  subject: z
    .string()
    .min(1, "제목을 입력해주세요.")
    .max(100, "제목은 100자 이하로 입력해주세요."),
  message: z
    .string()
    .max(1000, "메시지는 1000자 이하로 입력해주세요.")
    .optional(),
})

export type SendEmailFormData = z.infer<typeof sendEmailSchema>
